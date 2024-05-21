import express, { Request, Response } from "express";
import func from "../middleware/auth";
import multer from "multer";
import { body, param, validationResult } from "express-validator";
import { PostSearchResponse, PostType } from "../shared/types";
import Post from "../models/post";
import Path from "path";
// รองรับการทำ IP Filter กับบาง API Endpoint
import { IpFilter } from "express-ipfilter";
import { GridFsStorage } from "multer-gridfs-storage"; // รองรับการจัดเก็บข้อมูลในฐานข้อมูล
import mongoose from "mongoose";

const trustedIPs = ['::ffff:127.0.0.1', '::1', '127.0.0.1'];

// สร้าง Express Router
const router = express.Router();

// ทำการสร้างช่องทางการเชื่อมต่อกับ MongoDB โดยอาศัย URI ที่กำหนดใน MONGODB_CONNECTION_STRING
const conn = mongoose.createConnection(
    process.env.MONGODB_CONNECTION_STRING as string
);

// เริ่มต้นเชื่อมต่อกับ MongoDB และใช้งาน mongoose.mongo.GridFSBucket เพื่อรองรับการสตรีมไฟล์เข้าและออกจากฐานข้อมูล
let gfs: mongoose.mongo.GridFSBucket;
conn.once("open", () => {
    // กำหนด Collection ที่จัดเก็บข้อมูลชื่อ "uploads"
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
    });
});

// สร้าง Storage Engine ที่จะใช้ทำงานกับ multer โดยอาศัย GridFsStorage
// ทั้งนี้ GridFsStorage ใน multer-gridfs-storage จะทำการสร้าง mongodb connection ให้โดยอัตโนมัติ
const storage = new GridFsStorage({
    url: process.env.MONGODB_CONNECTION_STRING as string,
    file: (req, file) => {
        return new Promise((resolve) => {
            // เพื่อรองรับการจัดเก็บชื่อไฟล์เป็นภาษาไทยและภาษาอังกฤษ
            file.originalname = Buffer.from(file.originalname, "latin1").toString(
                "utf8"
            );
            const fileInfo = {
                filename: `${Date.now()}-${file.originalname}`, // ชื่อไฟล์ที่เราอับโหลด โดยใส่ timestamp เพื่อป้องกันชื่อไฟล์ซ้ำกัน
                bucketName: "uploads", // กำหนด Collection ที่จัดเก็บข้อมูลชื่อ "uploads"
            };
            resolve(fileInfo); // บันทึกข้อมูลในฐานข้อมูล
        });
    },
});

// ตัวแปร upload จะเก็บไฟล์ที่ถูกส่งมาจากฟอร์มโดยอาศัย multer
// และเรากำหนดค่า Config การทำงานของ multer เพิ่มเติม เช่น กำหนดประเภทและขนาดไฟล์สูงสุดไม่เกิน 20 MB เป็นต้น
const upload = multer({
    storage: storage, // กำหนดให้ใช้งาน Storage Engine ของ multer-gridfs-storage ในการจัดเก็บข้อมูลในฐานข้อมูล
    // การตรวจสอบไฟล์ที่อับโหลดเข้ามา
    fileFilter: (req, file, callback) => {
        // กำหนดประเภทไฟล์ที่สามารถอับโหลดได้
        const acceptableExtensions = [".png", ".jpg"];
        // ถ้าไม่ใช่ประเภทไฟล์ที่กำหนด
        if (!acceptableExtensions.includes(Path.extname(file.originalname))) {
            console.log(`ไม่อนุญาตให้อับโหลดไฟล์ประเภท ${file.mimetype}`);
            return callback(null, false); // คืนค่าเป็น false เพื่อบอกว่า multer รับไฟล์ไม่สำเร็จ
        }

        // กำหนด Upload File Size สูงสุดไม่เกิน 20 MB
        if (req.headers["content-length"] !== undefined) {
            const fileSize = parseInt(req.headers["content-length"]);
            if (fileSize > 20 * 1024 * 1024) {
                console.log("ขนาดของไฟล์ที่อนุญาตให้อับโหลดเกินกว่าที่กำหนดไว้");
                return callback(null, false); // คืนค่าเป็น false เพื่อบอกว่า multer รับไฟล์ไม่สำเร็จ
            }
        }
        // ถ้าผ่านเงื่อนไขก่อนหน้าทั้งหมดแล้ว
        callback(null, true); // คืนค่าเป็น true เพื่อบอกว่า multer รับไฟล์สำเร็จ
    },
});

// กำหนดให้ hotelStorage จัดเก็บข้อมูลไฟล์ที่ได้รับมาในหน่วยความจำแทนการบันทึกข้อมูลลงฐานข้อมูล
const postStorage = multer.memoryStorage();
// กำหนดให้ hotelUpload ใช้ hotelStorage เป็น Storage Engine
const postUpload = multer({
    storage: postStorage,
    // การตรวจสอบไฟล์ที่อับโหลดเข้ามา
    fileFilter: (req, file, callback) => {
        // กำหนด Upload File Size สูงสุดไม่เกิน 20 MB เพื่อป้องกันผู้ใช้งานอับโหลดไฟล์ขนาดใหญ่เกินกว่าหน่วยความจำของเครื่อง Server
        if (req.headers["content-length"] !== undefined) {
            const fileSize = parseInt(req.headers["content-length"]);
            if (fileSize > 20 * 1024 * 1024) {
                console.log("ขนาดของไฟล์ที่อนุญาตให้อับโหลดเกินกว่าที่กำหนดไว้");
                return callback(null, false); // คืนค่าเป็น false เพื่อบอกว่า multer รับไฟล์ไม่สำเร็จ
            }
        }
        // ถ้าผ่านเงื่อนไขก่อนหน้าทั้งหมดแล้ว
        callback(null, true); // คืนค่าเป็น true เพื่อบอกว่า multer รับไฟล์สำเร็จ
    },
});

// สร้าง Get End Point "/api/my-posts/search" รองรับการค้นหาข้อมูลบทความ
router.get("/search", async (req: Request, res: Response) => {
    try {
        // สร้าง Query สำหรับค้นหาที่พักใน MongoDB
        const query = constructSearchPostQuery(req.query);

        // กำหนดข้อมูลพื้นฐานของการแสดงผลรองรับการทำ Pagination 
        // ขนาด Page Size ของจำนวนข้อมูลที่ Backend จะคืนไปให้ Frontend ในแต่ละหน้า Page
        const pageSize = 5;
        // หมายเลขหน้า จะถูกส่งผ่านทาง req.query.page โดยค่าพื้น Default คือแสดงหน้าแรกสุด
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        // กำหนดช่วงการแสดงผลลัพธ์ของข้อมูลที่พักที่ค้นหา
        const skip = (pageNumber - 1) * pageSize;

        // ทำการค้นหาที่พักตามเงื่อนไขการ Search ต่าง ๆ ที่กำหนดข้างต้น
        const posts = await Post.find(query).skip(skip).limit(pageSize);

        // จำนวนข้อมูลผลลัพธ์ทั้งหมดที่เจอในฐานข้อมูล โดยค้นหาตาม query ด้วยถ้ามี
        const total = await Post.countDocuments(query);

        // ส่งข้อมูลกลับไปยัง Frontend
        const response: PostSearchResponse = {
            data: posts, // ข้อมูลบทความ
            pagination: {
                total, // จำนวนข้อมูลบทความที่่ค้นเจอทั้งหมด
                page: pageNumber, // อยู่หน้าที่เท่าไร
                pages: Math.ceil(total / pageSize), // จำนวนหน้าทั้งหมด
            },
        }

        res.json(response);

    }
    catch (error) {
        console.log("พบข้อผิดพลาดที่ Get End Point '/api/my-posts/search' ได้แก่ :", error);
        // แจ้งผู้ใช้งานเกี่ยวกับข้อผิดพลาด
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการค้นหาบทความ" });
    }
});

// ฟังก์ชันสำหรับสร้าง Query เพื่อค้นหาข้อมูลใน MongoDB
const constructSearchPostQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.userId) {
        constructedQuery = { userId: queryParams.userId };
    }

    if (queryParams.category) {
        constructedQuery.category = { $in: queryParams.category };
    }

    if (queryParams.description) {
        constructedQuery.$or = [ // ค้นหาจาก Field title หรือ content
            { title: new RegExp(queryParams.description, "i") },
            { content: new RegExp(queryParams.description, "i") },
        ];
    }
    console.log("searchPostParams: ", constructedQuery)
    return constructedQuery;
};

// สร้าง Post End Point "/api/my-posts/" รองรับการ Post บทความ
router.post(
    "/",
    func.verifyToken, // อนุญาตให้เฉพาะผู้ที่ล็อกอินแล้วเท่านั้นสามารถเพิ่มข้อมูลได้
    // ตรวจสอบข้อมูลที่ส่งเข้ามาให้ครบถ้วนและมีรูปแบบที่เรากำหนด พร้อมแจ้งเตือนถ้าไม่ถูกต้อง
    [
        body("title").notEmpty().withMessage("ต้องระบุชื่อบทความ"),
        body("category").notEmpty().withMessage("ต้องระบุประเภทของบทความ"),
        body("content").notEmpty().withMessage("ต้องระบุเนื้อหาของบทความ"),
    ],
    // รับข้อมูลไฟล์มาเก็บไว้ในหน่วยความจำ ชื่อต้องตรงกับชื่อฟีลข้อมูลที่ส่งไฟล์มา
    postUpload.array("imageFiles", 6),
    // ฟังก์ชันการทำงานของ API นี้
    async (req: Request, res: Response) => {
        let imageUrls;
        try {
            // ไฟล์ที่อับโหลด
            const imageFiles = req.files as Express.Multer.File[];

            // ทำการอับโหลดรูปภาพก่อน แล้วจัดเก็บ filename ของรูปเหล่านั้น
            imageUrls = await uploadImages(imageFiles);

            // รับข้อมูลใน Multipart/Form มาเก็บไว้แบบ PostType
            const newPost: PostType = req.body;
            newPost.createdAt = new Date(); // เพิ่มข้อมูลเวลา
            newPost.imageUrls = imageUrls.fileNames; // เพิ่มข้อมูลขื่อไฟล์
            newPost.userId = req.userId; // ข้อมูล userId req.userId
            newPost.slug = req.body.title
                .split(' ')
                .join('-');
            // ระบุเวลาที่สร้างข้อมูลที่พัก
            newPost.createdAt = new Date();
            newPost.updatedAt = new Date();

            // ทำการสร้าง Post Model โดยกำหนดค่าที่ต้องการจัดเก็บเป็น PostType ที่เราสร้างขึ้น
            const post = new Post(newPost);

            // จัดเก็บข้อมูล Post ในฐานข้อมูล
            await post.save();
            // แจ้งผลว่าทำการบันทึกข้อมูล Post พักสำเร็จ
            res.status(201).json(post);

        }
        catch (error) {
            // แจ้งข้อความ Error ทางฝั่ง Server
            console.log(
                "เกิดข้อผิดพลาดใน Post End Point /api/my-posts/ โดยมีไฟล์ที่อับโหลดแล้ว ได้แก่ ",
                imageUrls.fileNames
            );
            // ลบข้อมูลไฟล์ที่อับโหลดไปก่อนหน้านี้ แต่ไม่สามารถบันทึกข้อมูลที่พักได้ เช่น ข้อมูลบาง Field ไม่ถูกต้อง เป็นต้น
            if (!imageUrls || imageUrls.length !== 0) {
                // ทำการลบข้อมูลไฟล์ทีละไฟล์จนหมด
                imageUrls.fileNames.forEach(async (filename: string) => {
                    // เรียกใช้งาน Delete End Point "/api/my-posts/file/:filename"
                    await fetch(`http://localhost:8080/api/my-posts/file/${filename}`, {
                        method: "DELETE",
                    });
                    // ถ้ามาถึงตรงนี้ แสดงว่าลบไฟล์สำเร็จ
                    console.log("ไฟล์เสียที่ลบจากฐานข้อมูลได้สำเร็จ ได้แก่ ", filename);
                });
            }
            // ทำการแจ้งผู้ใช้งาน
            res
                .status(500)
                .json({ message: "เกิดข้อผิดพลาดใน Post End Point /api/my-posts/" });

        }
    }
);

// สร้าง Post End Point "/api/my-posts/files" รองรับการ Upload ไฟล์จำนวนมากกว่า 1 ไฟล์
// หลักการทำงานคือ จะทำการจัดเก็บเฉพาะไฟล์ที่ตรงตามเงื่อนไขเท่านั้น
// โดยจะคืนค่าเป็น Array ชื่อไฟล์ที่จัดเก็บสำเร็จ ซึ่งสามารถมีสมาชิกได้ 0 ตัวหรือมากกว่า
router.post(
    "/files",
    IpFilter(trustedIPs, { mode: 'allow' }), // อนุญาตให้เฉพาะ Request ที่มาจากหมายเลข IP ที่กำหนดเท่านั้นสามารเพิ่มข้อมูลได้
    upload.array("file"), // อนุญาตให้อับโหลดไฟล์ได้ไม่จำกัดจำนวนไฟล์
    (req: Request, res: Response) => {
        // upload.array("file") จะเป็นฟังก์ชันที่ทำหน้าที่อับโหลดไฟล์
        // ถ้าอับโหลดหลายไฟล์ จะตรวจสอบด้วย req.files
        if (req.files) {
            // ทำการตรวจสอบชื่อไฟล์ที่ทำการอับโหลดสำเร็จ เพื่อใช้ประโยชน์ในภายหลัง
            const files = req.files as Express.Multer.File[];
            const uploadNames = files.map((image) => {
                return image.filename;
            });
            res.status(201).json({
                fileNames: uploadNames,
            });
        } else {
            // แจ้งผู้ใช้งสานว่ามีบางอย่างผิดพลาดในระหว่างการอับโหลดไฟล์
            res.status(400).json({ message: "ไม่สามารถอัพโหลดไฟล์ได้" });
        }
    }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
    // สร้าง FormData สำหรับไว้ส่งข้อมูลไฟล์
    const formData = new FormData();
    // ทำการส่งไฟล์ข้อมูลทุกไฟล์
    imageFiles.forEach((file) => {
        // แปลง Express.Multer.File เป็น Blob เพื่อเตรียมส่งไปยัง Backend
        let blob = new Blob([file.buffer], { type: file.mimetype });
        formData.append(
            "file",
            blob,
            `image_${Date.now()}${Path.extname(file.originalname)}` // เนื่องจาก Multer Memory Storage ไม่ลองรับการตั้งค่าชื่อไฟล์เป็นภาษาไทย ดังนั้น เราจึงใช้วิธีการตั้งชื่อแบบสุ่มแทน
        );
    });
    // เรียกใช้งาน Post End Point "/api/my-posts/files"
    const response = await fetch("http://localhost:8080/api/my-posts/files", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json()) // คืนค่าเป็นชื่อไฟล์ที่อับโหลดสำเร็จ
        .catch((error) =>
            console.error("เกิดข้อผิดพลาดใน uploadImages ได้แก่ ", error)
        );
    return response; // ส่งชื่อไฟล์กลับไป
}

// สร้าง Delete End Point "/api/my-posts/file/:filename" รองรับการลบไฟล์ในระบบฐานข้อมูลด้วยชื่อไฟล์
router.delete(
    "/file/:filename",
    IpFilter(trustedIPs, { mode: 'allow' }), // อนุญาตให้เฉพาะไอพีที่กำหนดเท่านั้นสามารถเรียกดูข้อมูลได้
    (req: Request, res: Response) => {
        // ทำการค้นหาไฟล์โดยดูจากชื่อไฟล์
        gfs
            .find({ filename: req.params.filename })
            .toArray()
            .then((files) => {
                // ถ้าไม่เจอไฟล์ที่มีชื่อคล้ายกันเลย
                if (!files[0] || files.length === 0) {
                    return res.status(404).json({
                        message: `ไม่พบไฟล์ในฐานข้อมูลซึ่งมีชื่อ ${req.params.filename}`,
                    });
                } else {
                    const fileId = files[0]._id;
                    // ทำการลบไฟล์ที่มีหมายเลข _id ที่กำหนด
                    gfs.delete(new mongoose.Types.ObjectId(fileId)).then((error) => {
                        if (error !== undefined) {
                            // แสดงข้อความฝั่ง Server
                            console.log(error);
                            // แจ้งฝั่ง Client เป็นข้อความธรรมดา
                            return res
                                .status(404)
                                .json({ message: "ไม่สามารถทำการลบไฟล์ได้" });
                        } else {
                            return res.status(200).json({
                                message: `ทำการลบไฟล์หมายเลข ID ${fileId} ในระบบฐานข้อมูลแล้ว`,
                            });
                        }
                    });
                }
            });
    }
);

// สร้าง Get End Point "/api/my-posts/:id" รองรับการเรียกดูข้อมูลบทความตามหมายเลขไอดีของบทความ
router.get("/:id", func.verifyToken,
    // ตรวจสอบว่ามีการส่ง id มาให้หรือไม่ พร้อมแจ้งเตือนถ้าไม่มีการส่ง id
    [param("id").notEmpty().withMessage("จำเป็นต้องระบุรหัสของบทความ")],
    async (req: Request, res: Response) => {
        // ใช้ validationResult ของ express-validator ในการตรวจสอบความถูกต้องของ Request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // รับหมายเลขไอดีของบทความ
        const id = req.params.id.toString();
        try {
            // เรียกดูข้อมูลบทความตามหมายเลข id ของบทความและถูกสร้างขึ้นมาด้วย userId ที่ล็อกอินเข้ามาเท่านั้น
            // โดย findOne จะคืนค่าเป็น Single Object ไม่ใช่ Array ไปให้ Frontend 
            const posts = await Post.findOne({ _id: id, userId: req.userId });

            res.json(posts);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการค้นหาบทความ" });
        }
    }
);

// สร้าง Put End Point "/api/my-posts/:id" รองรับการแก้ไขบทความตามหมายเลข id ของบทความ
router.put("/:id",
    func.verifyToken,
    postUpload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            // รับข้อมูลที่กรอกใหม่ในแบบฟอร์ม
            const updatedPost: PostType = req.body;
            // ระบุเวลาที่แก้ไขข้อมูลที่พัก
            updatedPost.updatedAt = new Date();
            // ทำการปรับปรุงข้อมูลที่พัก
            const post = await Post.findOneAndUpdate(
                {
                    _id: req.params.id, // หมายเลข id ของ Post ที่จะปรับปรุงข้แมูล
                    userId: req.userId, // req.userId อนุญาตให้ปรับปรุงเฉพาะบทความที่เป็นคนเขียน
                },
                // นำข้อมูลที่พักของเดิมในฐานข้อมูลมารวมกันกับของใหม่ที่กรอกเข้ามา
                updatedPost,
                { new: true }
            );

            // ถ้าไม่พบข้อมูลที่พักตาม id และ userId ดังกล่าวให้แจ้งเตือนผู้ใช้
            if (!post) {
                return res.status(404).json({ message: "ไม่พบข้อมูลบทความ" });
            }

            // imageFiles คือ ไฟล์ที่ผู้ใช้งานอับโหลดเพิ่มเข้ามาใหม่ สำหรับ updatedHotel.imageUrls คือ ไฟล์รูปภาพของเดิมที่มีอยู่แล้ว
            const imageFiles = req.files as Express.Multer.File[];

            // ทำการอับโหลดรูปภาพก่อน แล้วจัดเก็บ filename ของรูปเหล่านั้น
            const imageUrls = await uploadImages(imageFiles);
            // แปลง Object รูปภาพที่อับโหลดเป็น Array ของชื่อรูปภาพ
            let existingImageURL: string[] = [];

            // ถ้ามีการอับโหลดไฟล์เข้ามาใหม่ด้วย
            if (imageFiles.length > 0) {
                // แปลง value เช่น ['1713134773249-image_1713134773223.jpg,1713134773273-image_1713134773224.jpg']
                const value = Object.values(imageUrls)
                // เป็น ['1713134773249-image_1713134773223.jpg','1713134773273-image_1713134773224.jpg']
                existingImageURL = String(value).split(',');
            }

            post.imageUrls = [
                ...existingImageURL, // เก็บข้อมูลชื่อไฟล์รูปภาพที่อับโหลดมาใน hotel.imageUrls Array นี้ โดย ... จะทำการจัดการสมาชิกใน existingImageURL Array ให้โดยอัตโนมัติ
                ...(updatedPost.imageUrls || []), // ใส่ข้อมูล URL รูปภาพเดิมที่มีอยู่แล้วหรือถ้าลบหมดก็เป็น Empty Array
            ];

            await post.save();
            // แจ้งผู้ใช้งานว่าปรับปรุงข้อมูลสำเร็จ
            res.status(201).json(post);

        }
        catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาดบางอย่าง" });
        }
    }
);

// สร้าง Delete End Point "/api/my-posts/:id" รองรับการลบบทความตามหมายเลข id ของบทความ
router.delete(
    "/:id",
    func.verifyToken,
    async (req: Request, res: Response) => {
        // รับหมายเลข id ของบทความจาก URL
        const id = req.params.id.toString();
        try {
            const post = await Post.findOne({ _id: id, userId: req.userId }); // req.userId อนุญาตให้ลบเฉพาะบทความที่เป็นคนเขียน
            // ลบรูปภาพก่อน
            if (post) {
                post.imageUrls.forEach(async (filename: string) => {
                    // เรียกใช้งาน Delete End Point "/api/my-posts/file/:filename"
                    await fetch(`http://localhost:8080/api/my-posts/file/${filename}`, {
                        method: "DELETE",
                    });
                    // ถ้ามาถึงตรงนี้ แสดงว่าลบไฟล์สำเร็จ
                    console.log("ไฟล์รูปที่ลบจากฐานข้อมูลได้สำเร็จ ได้แก่ ", filename);
                });
            }
            else {
                return res.status(404).json({ message: "ไม่พบข้อมูลบทความ" });
            }
            // ลบข้อมูลที่พัก
            await Post.findByIdAndDelete(id);

            // ทำการแจ้งผู้ใช้งาน
            res
                .status(200)
                .json({ message: "ลบข้อมูลบทความสำเร็จ" });

        }
        catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการลบข้อมูลบทความ" });
        }

    }
);

// สร้าง Get End Point "/api/my-posts/file/:filename"
// รองรับการดึงไฟล์เฉพาะตามชื่อไฟล์ เพื่อแสดงภาพโดยใช้ Grid FS
router.get(
    "/file/:filename",
    IpFilter(trustedIPs, { mode: 'allow' }), // อนุญาตให้เฉพาะ Request ที่มาจากหมายเลข IP ที่กำหนดเท่านั้นสามารถเรียกดูข้อมูลได้
    (req: Request, res: Response) => {
        // ทำการค้นหาไฟล์โดยดูจากชื่อไฟล์
        gfs
            .find({ filename: req.params.filename })
            .toArray()
            .then((files) => {
                // ถ้าไม่เจอไฟล์ที่มีชื่อคล้ายกันเลย
                if (!files[0] || files.length === 0) {
                    return res.status(404).json({
                        message: `ไม่พบไฟล์ในฐานข้อมูลซึ่งมีชื่อ ${req.params.filename}`,
                    });
                } else {
                    // สร้าง Download Stream ไปยังไฟล์ที่มีชื่อที่กำหนด แล้วส่งไปยัง Client เช่น Browser เป็นต้น ด้วย pipe
                    // จะทำให้ Client สามารถแสดงภาพได้
                    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
                }
            });
    }
);

// สร้าง Get End Point "/api/my-posts/slug/:slug" รองรับการเรียกดูข้อมูลบทความตาม slug
router.get("/slug/:slug",
    // ตรวจสอบว่ามีการส่ง slug มาให้หรือไม่ พร้อมแจ้งเตือนถ้าไม่มีการส่ง id
    [param("slug").notEmpty().withMessage("จำเป็นต้องระบุรหัส slug ของบทความ")],
    async (req: Request, res: Response) => {
        // ใช้ validationResult ของ express-validator ในการตรวจสอบความถูกต้องของ Request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // รับ slug ของบทความ
        const slug = req.params.slug.toString();
        try {
            // เรียกดูข้อมูลบทความตาม slug ของบทความ 
            const posts = await Post.findOne({ slug: slug });

            res.json(posts);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการค้นหาบทความ" });
        }
    }
);

// สร้าง Post End Point ชื่อ "/api/my-posts/:slug/increment-view-count"
router.post(
    "/:slug/increment-view-count",
    async (req: Request, res: Response) => {
        const slug = req.params.slug.toString();

        // เรียกดูข้อมูลบทความตาม slug ของบทความ 
        const post = await Post.findOne({ slug: slug });
        if (!post) {
            return res.status(400).json({ message: "ไม่พบบทความดังกล่าว" });
        }

        const currentView = post.view;
        const newView = currentView + 1;
        post.view = newView;
        await post.save();

        res.status(200).json({ message: "เพิ่มจำนวนเข้าชมบทความดังกล่าวเรียบร้อยแล้ว" });;
    }
);

export default router;
