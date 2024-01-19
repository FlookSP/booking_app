import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

// สร้าง Express Router
const router = express.Router();

// สร้าง Post End Point "/api/users/register"
// กำหนด Middleware ด้วย check จาก express-validator ให้ตรวจสอบ API Request ที่เข้ามา
router.post(
  "/register",
  [
    check("email", "ต้องระบุ Email ที่ไม่ซ้ำกับผู้ใช้งานคนอื่น").isEmail(),
    check(
      "password",
      "ต้องระบุ Password ที่มีความยาวไม่น้อยกว่า ๖ ตัว"
    ).isLength({
      min: 6,
    }),
    check("firstName", "ต้องระบุชื่อต้น").isString(),
    check("lastName", "ต้องระบุนามสกุล").isString(),
  ],
  async (req: Request, res: Response) => {
    // คอยจัดการกับ Error ที่เกิดจากการทำงานของ check
    const errors = validationResult(req);
    // ถ้ามี Error จาก API Request ที่เข้ามาและ check ตรวจเจอให้แจ้งข้อผิดพลาดแก่ผู้ใช้งาน
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      // ตรวจสอบว่ามี User ที่ใช้งาน email ดังกล่าวแล้วหรือยังก่อนการ Register
      let user = await User.findOne({
        email: req.body.email,
      });
      // ถ้ามี User ที่ใช้งาน email ดังกล่าวแล้ว ให้แจ้งสถานะ 400 และแจ้งข้อความเตือน
      if (user) {
        res.status(400).json({
          message:
            "อีเมลดังกล่าวถูกใช้งานแล้วโดยผู้ใช้งานคนอื่น โปรดระบุอีเมลอื่น",
        });
      } else {
        // บันทึกข้อมูลที่รับเข้ามาลงใน User Document
        if (typeof req.body.role !== 'undefined') {
          // กรณีที่ Register ด้วย Registration API
          user = new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
          });
        } else {
          // กรณีที่ Register ด้วย Registration Form
          user = new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: "user",
          });
        }

        await user.save();
        // ทำการสร้าง JWT Token
        const token = jwt.sign(
          { userId: user.id, userRole: user.role }, // ใส่ข้อมูล userId และ userRole
          process.env.JWT_SECRET_KEY as string,
          {
            expiresIn: "1d",
          }
        );
        // ทำการสร้าง Cookie
        res.cookie("auth_token", token, {
          httpOnly: true, // เฉพาะ Server เท่านั้นที่สามารถจัดการ Cookie นี้ได้
          secure: process.env.NODE_ENV === "produciton", // รับ-ส่งผ่านทาง HTTPS เท่านั้นถ้าเป็น "produciton"
          maxAge: 86400000, // 86400000 เท่ากับ 1 วัน
        });
        // แจ้งสถานะภาพว่าทำงานได้ตามปกติ
        return res
          .status(200)
          .send({ message: "ลงทะเบียนผู้ใช้งานเรียบร้อยแล้ว" });
      }
    } catch (error) {
      // ทำการแสดงข้อความนี้ที่ฝั่ง Server เท่านั้น
      console.log(error);
      // แจ้งเตือนผู้ใช้งานเป็ยข้อความผิดพลาดทั่ว ๆ ไป ป้องกันแฮกเกอร์ได้รับข้อมูล Sensitive ของ Server
      res.status(500).send({ message: "มีบางอย่างผิดพลาดในฝั่ง Server" });
    }
  }
);

export default router;
