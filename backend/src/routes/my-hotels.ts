import express, { Request, Response } from "express";
import func from "../middleware/auth";
// สำหรับรองรับการจัดเก็บไฟล์หรือรูปภาพในฐานข้อมูล
import multer from "multer"; // รองรับการทำงานกับ multipart/form-data
import { GridFsStorage } from "multer-gridfs-storage"; // รองรับการจัดเก็บข้อมูลในฐานข้อมูล
import { HotelType } from "../shared/types";
import mongoose from "mongoose";
import Path from "path";
import { body } from "express-validator";
import Hotel from "../models/hotel";

// รองรับการทำ IP Filter กับบาง API Endpoint
import { IpFilter } from "express-ipfilter";

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
const hotelStorage = multer.memoryStorage();
// กำหนดให้ hotelUpload ใช้ hotelStorage เป็น Storage Engine
const hotelUpload = multer({
  storage: hotelStorage,
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

// สร้าง Post End Point "/api/my-hotels/file" รองรับการ Upload ไฟล์จำนวน 1 ไฟล์ในระบบฐานข้อมูล
// ใช้ multer เพื่อจัดการ API Request ที่เข้ามา โดย multer จะเรียกใช้งาน GridFsStorage ในการจัดเก็บไฟล์จาก form input ชื่อ "file"
// ลงใน MongoDB แบบ GridFS โดยเก็บข้อมูลที่เกี่ยวข้องไว้ใน Collection ชื่อ "uploads"
// ทั้งนี้ เมื่อ multer ทำงานเสร็จแล้วจะส่งผลลัพธ์ไปยัง req ซึ่งเราสามารถใช้ req.file ในการตรวจสอบว่าทำการจัดเก็บไฟล์ในฐานข้อมูลสำเร็จหรือไม่ต่อไป
router.post(
  "/file",
  func.verifyToken, // อนุญาตให้เฉพาะผู้ที่ล็อกอินแล้วเท่านั้นสามารถเพิ่มข้อมูลได้
  upload.single("file"),
  (req: Request, res: Response) => {
    // upload.single("file") จะเป็นฟังก์ชันที่ทำหน้าที่อับโหลดไฟล์
    // ถ้าอับโหลดไฟล์เดียว จะตรวจสอบด้วย req.file
    if (req.file) {
      // ทำการตรวจสอบชื่อไฟล์ที่ทำการอับโหลดสำเร็จ เพื่อใช้ประโยชน์ในภายหลัง
      res.status(201).json({
        fileName: req.file.filename,
      });
    } else {
      // แจ้งผู้ใช้งานว่ามีบางอย่างผิดพลาดในระหว่างการอับโหลดไฟล์
      res.status(400).json({ message: "ไม่สามารถอัพโหลดไฟล์ได้" });
    }
  }
);

// สร้าง Post End Point "/api/my-hotels/files" รองรับการ Upload ไฟล์จำนวนมากกว่า 1 ไฟล์
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

// สร้าง Get End Point "/api/my-hotels/files" รองรับการแสดงรายการไฟล์ทั้งหมดในระบบฐานข้อมูล
// ใช้ GridFS Stream ในการอ่านข้อมูลไฟล์ใน MongoDB ชื่อ Collection "uploads"
router.get(
  "/files",
  func.verifyToken, // อนุญาตให้เฉพาะผู้ที่ล็อกอินแล้วเท่านั้นสามารถเรียกดูข้อมูลได้
  (req: Request, res: Response) => {
    // ใช้ gfs ดึงข้อมูลทั้งหมดมาเป็น Array จากนั้นทำการส่งไปให้ Client
    gfs
      .find()
      .toArray()
      .then((files) => {
        // ตรวจสอบว่ามีไฟล์ในฐานข้อมูลหรือไม่
        if (!files || files.length === 0) {
          return res.status(404).json({
            message: "ไม่มีไฟล์ในฐานข้อมูล",
          });
        } else {
          // ส่งรายการไฟล์ทั้งหมดในฐานข้อมูล
          res.status(200).json(files);
        }
      });
  }
);

// สร้าง Get End Point "/api/my-hotels/file/:filename"
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

// สร้าง Delete End Point "/api/my-hotels/file/:filename" รองรับการลบไฟล์ในระบบฐานข้อมูลด้วยชื่อไฟล์
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

// สร้าง Post End Point "/api/my-hotels" รองรับการเพิ่มที่พักในระบบฐานข้อมูลแบบ Multipart/Form
// กำหนด Middleware ด้วย func.verifyToken ซึ่งจะทำการตรวจสอบ Token ของ API Request ที่เข้ามา
// นอกจากนี้กำหนด Middleware ด้วย body จาก express-validator ให้ตรวจสอบ API Request ที่เข้ามาแบบ multipart/form-data
router.post(
  "/",
  func.verifyToken, // อนุญาตให้เฉพาะผู้ที่ล็อกอินแล้วเท่านั้นสามารถเพิ่มข้อมูลที่พักได้
  // ตรวจสอบข้อมูลที่ส่งเข้ามาให้ครบถ้วนและมีรูปแบบที่เรากำหนด พร้อมแจ้งเตือนถ้าไม่ถูกต้อง
  [
    body("name").notEmpty().withMessage("ต้องระบุชื่อที่พัก"),
    body("city").notEmpty().withMessage("ต้องระบุชื่อเมืองซึ่งที่พักตั้งอยู่"),
    body("country")
      .notEmpty()
      .withMessage("ต้องระบุชื่อประเทศซึ่งที่พักตั้งอยู่"),
    body("description")
      .notEmpty()
      .withMessage("ต้องระบุคำอธิบายเกี่ยวกับที่พัก"),
    body("type").notEmpty().withMessage("ต้องระบุประเภทที่พัก"),
    body("pricePerNight")
      .notEmpty() // ต้องกรอกราคาที่พักต่อคืน
      .isNumeric() // ต้องเป็นตัวเลข เช่น 0 หรือ 500 เป็นต้น
      .withMessage("ต้องระบุราคาต่อคืนและต้องระบุเป็นตัวเลข"),
    body("starRating")
      .notEmpty() // ต้องกรอกระดับดาวที่พัก
      .isNumeric() // ต้องเป็นตัวเลข เช่น 1 - 5 เป็นต้น
      .withMessage("ต้องระบุระดับดาวที่พักเป็นตัวเลข"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("จำเป็นต้องระบุสิ่งอำนวยความสะดวกในที่พัก"),
  ],
  hotelUpload.array("imageFiles", 6), // รับข้อมูลไฟล์มาเก็บไว้ในหน่วยความจำ ชื่อต้องตรงกับชื่อฟีลข้อมูลที่ส่งไฟล์มา
  async (req: Request, res: Response) => {
    let imageUrls;
    try {
      // ไฟล์ที่อับโหลด
      const imageFiles = req.files as Express.Multer.File[];

      // ทำการอับโหลดรูปภาพก่อน แล้วจัดเก็บ filename ของรูปเหล่านั้น
      imageUrls = await uploadImages(imageFiles);
      // รับข้อมูลใน Multipart/Form มาเก็บไว้แบบ HotelType
      const newHotel: HotelType = req.body;
      newHotel.lastUpdated = new Date(); // เพิ่มข้อมูลเวลา
      newHotel.imageUrls = imageUrls.fileNames; // เพิ่มข้อมูลขื่อไฟล์
      newHotel.userId = req.userId; // ข้อมูล userId
      // ทำการสร้าง Hotel Model โดยกำหนดค่าที่ต้องการจัดเก็บเป็น HotelType ที่เราสร้างขึ้น
      const hotel = new Hotel(newHotel);

      // จัดเก็บข้อมูล Hotel ในฐานข้อมูล
      await hotel.save();
      // แจ้งผลว่าทำการบันทึกข้อมูลที่พักสำเร็จ
      res.status(201).json(hotel);
    } catch (error) {
      // แจ้งข้อความ Error ทางฝั่ง Server
      console.log(
        "เกิดข้อผิดพลาดใน Post End Point /api/my-hotels โดยมีไฟล์ที่อับโหลดแล้ว ได้แก่ ",
        imageUrls.fileNames
      );
      // ลบข้อมูลไฟล์ที่อับโหลดไปก่อนหน้านี้ แต่ไม่สามารถบันทึกข้อมูลที่พักได้ เช่น ข้อมูลบาง Field ไม่ถูกต้อง เป็นต้น
      if (!imageUrls || imageUrls.length !== 0) {
        // ทำการลบข้อมูลไฟล์ทีละไฟล์จนหมด
        imageUrls.fileNames.forEach(async (filename: string) => {
          // เรียกใช้งาน Delete End Point "/api/my-hotels/file/:filename"
          await fetch(`http://localhost:8080/api/my-hotels/file/${filename}`, {
            method: "DELETE",
          });
          // ถ้ามาถึงตรงนี้ แสดงว่าลบไฟล์สำเร็จ
          console.log("ไฟล์เสียที่ลบจากฐานข้อมูลได้สำเร็จ ได้แก่ ", filename);
        });
      }
      // ทำการแจ้งผู้ใช้งาน
      res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดใน Post End Point /api/my-hotels" });
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
  // เรียกใช้งาน Post End Point "/api/my-hotels/files"
  const response = await fetch("http://localhost:8080/api/my-hotels/files", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json()) // คืนค่าเป็นชื่อไฟล์ที่อับโหลดสำเร็จ
    .catch((error) =>
      console.error("เกิดข้อผิดพลาดใน uploadImages ได้แก่ ", error)
    );
  return response; // ส่งชื่อไฟล์กลับไป
}

// สร้าง Get End Point "/api/my-hotels" รองรับการแสดงรายการที่พัก
router.get("/", func.verifyToken, async (req: Request, res: Response) => {
  try {
    // เรียกดูข้อมูลที่พักของ userId ที่ล็อกอินเข้ามา
    const hotels = await Hotel.find({ userId: req.userId });
    // ส่งข้อมูลที่พักกลับไปให้ในรูป JSON
    res.json(hotels);
  }
  catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการเรียกดูข้อมูลที่พัก" });
  }

});

// สร้าง Get End Point "/api/my-hotels/:id" รองรับการแสดงรายละเอียดที่พักตามหมายเลข id ของที่พัก
router.get("/:id", func.verifyToken, async (req: Request, res: Response) => {
  // รับหมายเลข id ของที่พักจาก URL
  const id = req.params.id.toString();
  try {
    // เรียกดูข้อมูลที่พักตามหมายเลข id ของที่พักและถูกสร้างขึ้นมาด้วย userId ที่ล็อกอินเข้ามาเท่านั้น
    // โดย findOne จะคืนค่าเป็น Single Object ไม่ใช่ Array ไปให้ Frontend 
    const hotels = await Hotel.findOne({ _id: id, userId: req.userId });
    // ส่งข้อมูลที่พักกลับไปให้ในรูป JSON
    res.json(hotels);
  }
  catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการเรียกดูข้อมูลที่พัก" });
  }
});

// สร้าง Put End Point "/api/my-hotels/:id" รองรับการแก้ไขที่พักตามหมายเลข id ของที่พัก
router.put("/:id",
  func.verifyToken,
  hotelUpload.array("imageFiles", 6), // รับข้อมูลไฟล์มาเก็บไว้ในหน่วยความจำ ชื่อต้องตรงกับชื่อฟีลข้อมูลที่ส่งไฟล์มา
  async (req: Request, res: Response) => {
    try {
      // รับข้อมูลที่กรอกใหม่ในแบบฟอร์ม
      const updatedHotel: HotelType = req.body;
      // ระบุเวลาที่แก้ไขข้อมูลที่พัก
      updatedHotel.lastUpdated = new Date();

      // ทำการปรับปรุงข้อมูลที่พัก
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.userId,
        },
        // นำข้อมูลที่พักของเดิมในฐานข้อมูลมารวมกันกับของใหม่ที่กรอกเข้ามา
        updatedHotel,
        { new: true }
      );
      // ถ้าไม่พบข้อมูลที่พักตาม id และ userId ดังกล่าวให้แจ้งเตือนผู้ใช้
      if (!hotel) {
        return res.status(404).json({ message: "ไม่พบข้อมูลที่พัก" });
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

      hotel.imageUrls = [
        ...existingImageURL, // เก็บข้อมูลชื่อไฟล์รูปภาพที่อับโหลดมาใน hotel.imageUrls Array นี้ โดย ... จะทำการจัดการสมาชิกใน existingImageURL Array ให้โดยอัตโนมัติ
        ...(updatedHotel.imageUrls || []), // ใส่ข้อมูล URL รูปภาพเดิมที่มีอยู่แล้วหรือถ้าลบหมดก็เป็น Empty Array
      ];

      await hotel.save();
      // แจ้งผู้ใช้งานว่าปรับปรุงข้อมูลสำเร็จ
      res.status(201).json(hotel);

    }
    catch (error) {
      res.status(500).json({ message: "เกิดข้อผิดพลาดบางอย่าง" });
    }
  }
);

// สร้าง Delete End Point "/api/my-hotels/:id" รองรับการลบที่พักตามหมายเลข id ของที่พัก
router.delete(
  "/:id",
  func.verifyToken,
  async (req: Request, res: Response) => {
    // รับหมายเลข id ของที่พักจาก URL
    const id = req.params.id.toString();
    try {
      const hotels = await Hotel.findOne({ _id: id, userId: req.userId });

      // ลบรูปภาพก่อน
      if (hotels) {
        hotels.imageUrls.forEach(async (filename: string) => {
          // เรียกใช้งาน Delete End Point "/api/my-hotels/file/:filename"
          await fetch(`http://localhost:8080/api/my-hotels/file/${filename}`, {
            method: "DELETE",
          });
          // ถ้ามาถึงตรงนี้ แสดงว่าลบไฟล์สำเร็จ
          console.log("ไฟล์รูปที่ลบจากฐานข้อมูลได้สำเร็จ ได้แก่ ", filename);
        });
      }
      else {
        return res.status(404).json({ message: "ไม่พบข้อมูลที่พัก" });
      }
      // ลบข้อมูลที่พัก
      await Hotel.findByIdAndDelete(id);
      console.log("ลบที่พักจากฐานข้อมูลได้สำเร็จ")
      // ทำการแจ้งผู้ใช้งาน
      res
        .status(200)
        .json({ message: "ลบข้อมูลสำเร็จ" });

    }
    catch (error) {
      res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการลบข้อมูลที่พัก" });
    }
  }
);

export default router;
