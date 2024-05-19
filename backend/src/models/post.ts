import mongoose from "mongoose";
import { CommentType, PostType } from "../shared/types";
// เลือกเก็บ Comment แบบ Embedded ใน Post Document
const commentSchema = new mongoose.Schema<CommentType>({
    content: { type: String, required: true },
    userId: { type: String, required: true }, // หมายเลขไอดีของผู้ใช้งานที่ comment
    like: [{ type: String, required: false }], // เก็บหมายเลขไอดีของผู้ใช้งานที่กดชอบ comment
    numberOfLikes: { type: Number, default: 0 },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

// ใน Model ต้องมี Type เพื่อช่วยให้ Frontend สามารถตรวจสอบว่าใส่รายละเอียดครบหรือยัง
// นอกจากนี้ต้องมี Schema เพื่อกำหนดคุณสมบัติของ Document 
// ทั้งนี้ใน Schema ไม่ต้องระบุ _id เพราะ mongoose.Schema จะใส่ให้โดยอัตโนมัติ
const postSchema = new mongoose.Schema<PostType>({
    userId: { type: String, required: true }, // เจ้าของบทความ
    content: { type: String, required: true }, // บทความ
    title: { type: String, required: true, unique: true }, // ชื่อบทความต้องไม่ซ้ำกัน
    imageUrls: [{ type: String, required: false }], // รูปในบทความ
    category: { type: String, default: "uncategorized" }, // ประเภทบทความ
    slug: { type: String, required: true, unique: true }, // ลิ๊งค์บทความ
    like: [{ type: String, required: false }], // เก็บหมายเลขไอดีของผู้ใช้งานที่กดถูกใจบทความนี้
    view: { type: Number, required: false, default: 0 }, // เก็บจำนวนผู้เข้าชมบทความนี้
    comments: [commentSchema],
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
}
);

// สร้าง index บน postSchema เฉพาะ Field ที่กำหนด รองรับการค้นหาแบบ $text query
postSchema.index({ title: 'text', content: 'text' });

// สร้าง Model ชื่อ Post โดยมี Type เป็น PostType ที่จะทำงานกับ Document ชื่อ "Post" ด้วย Schema postSchema
const Post = mongoose.model<PostType>("Post", postSchema);

export default Post;