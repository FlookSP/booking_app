import express, { Request, Response } from "express";
import func from "../middleware/auth";
import Post from "../models/post";
import { param, validationResult } from "express-validator";
import { CommentType } from "../shared/types";

// สร้าง Express Router
const router = express.Router();

// สร้าง Post End Point ชื่อ "/api/my-comments/:slug"
router.post(
    "/:slug",
    func.verifyToken,
    // ตรวจสอบว่ามีการส่ง slug มาให้หรือไม่ พร้อมแจ้งเตือนถ้าไม่มีการส่ง slug
    [param("slug").notEmpty().withMessage("จำเป็นต้องระบุรหัส slug ของบทความ")],
    async (req: Request, res: Response) => {
        // ใช้ validationResult ของ express-validator ในการตรวจสอบความถูกต้องของ Request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const slug = req.params.slug.toString();

        try {
            const post = await Post.findOne({ slug: slug });
            // ทำการสร้างข้อมูลอื่น ๆ ของ CommentType ที่จำเป็นให้ครบ    
            const newComment: CommentType = req.body;
            newComment.createdAt = new Date(); // เพิ่มข้อมูลเวลา
            newComment.updatedAt = new Date(); // เพิ่มข้อมูลเวลา

            // ทำการอับเดตข้อมูลโดยเพิ่มข้อมูล newComment
            const newPost = await Post.findOneAndUpdate(
                { _id: post?.id }, // หา Comment ที่มีไอดีดังกล่าว
                {
                    $push: { comments: newComment }, // ทำการ push ข้อมูล newComment ไปเก็บใน Field comments
                }
            );


            res.json(newPost);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการเพิ่มข้อมูล Comment" });
        }

    }
);

export default router;