import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import func from "../middleware/auth";

// สร้าง Express Router
const router = express.Router();

// สร้าง Post End Point "/api/auth/login"
// กำหนด Middleware ด้วย check จาก express-validator ให้ตรวจสอบ API Request ที่เข้ามา
router.post(
  "/login",
  [
    check("email", "ต้องระบุ Email ที่ไม่ซ้ำกับผู้ใช้งานคนอื่น").isEmail(),
    check(
      "password",
      "ต้องระบุ Password ที่มีความยาวไม่น้อยกว่า ๖ ตัว"
    ).isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    // คอยจัดการกับ Error ที่เกิดจากการทำงานของ check
    const errors = validationResult(req);
    // ถ้ามี Error จาก API Request ที่เข้ามาและ check ตรวจเจอให้แจ้งข้อผิดพลาดแก่ผู้ใช้งาน
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
    }

    // นำข้อมูลจาก Request Body มาเก็บในตัวแปรชื่อ email, password
    const { email, password } = req.body;

    try {
      // ทำการค้นหา email จาก MongoDB
      const user = await User.findOne({ email });
      // ถ้าไม่เจอ user ที่ใช้งาน email ดังกล่าว ให้แจ้งเตือน
      if (!user) {
        return res.status(400).json({ message: "ข้อมูลล็อกอินไม่ถูกต้อง" });
      } else {
        // ถ้าจอ user ที่ใช้งาน email ดังกล่าว ให้ตรวจสอบ Password
        const isMatch = await bcrypt.compare(password, user.password);
        // ถ้า password ไม่ตรงกัน
        if (!isMatch) {
          return res.status(400).json({ message: "ข้อมูลล็อกอินไม่ถูกต้อง" });
        } else {
          // ถ้า password ตรงกัน
          // ทำการสร้าง JWT Token
          const token = jwt.sign(
            { userId: user.id, userRole: user.role }, // ส่ง userId และ userRole ไปให้ frontend เพื่อใช้งานต่อไป
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
          // แจ้งสถานะภาพว่าทำงานได้ตามปกติและส่ง _id กลับไป
          // หลังจากล็อกอินเราจะสามารถใช้ _id เพื่อการ Query ข้อมูลต่าง ๆ ที่เกี่ยวข้องกับผู้ใช้งานได้ต่อไป
          res.status(200).json({ userId: user._id, userRole: user.role });
        }
      }
    } catch (error) {
      // ทำการแสดงข้อความนี้ที่ฝั่ง Server เท่านั้น
      console.log(error);
      // แจ้งเตือนผู้ใช้งานเป็ยข้อความผิดพลาดทั่ว ๆ ไป ป้องกันแฮกเกอร์ได้รับข้อมูล Sensitive ของ Server
      res.status(500).json({ message: "มีบางอย่างผิดพลาดในฝั่ง Server" });
    }
  }
);

// สร้าง Get End Point "/api/auth/validate-token" เพื่อตรวจสอบ Token ที่ frontend ส่งเข้ามา
// กำหนด Middleware ด้วยการสร้างฟังก์ชัน verifyToken ซึ่งจะทำการตรวจสอบ Token
// Arrow Function จะรับ Request, Response จาก Express
router.get("/validate-token", func.verifyToken, (req: Request, res: Response) => {
  // ถ้า Token ถูกต้อง ให้แจ้ง Status 200 และส่ง userId และ userRole เพื่อให้ผู้ใช้งานนำไปใช้ประโยชน์ต่อไป
  res.status(200).send({ userId: req.userId, userRole: req.userRole });
});

// สร้าง Post End Point "/api/auth/logout"
router.post("/logout", (req: Request, res: Response) => {
    // Clear ค่า Cookies ในระบบ
  res.cookie("auth_token", "", {
    // การตั้งค่าวันที่หมดอายุของคุกกี้เป็นเวลาในอดีต คือ January 1, 1970 in UTC ซึ่งหมายความว่าบอกให้เบราว์เซอร์ลบคุกกี้ออกไป
    expires: new Date(0), 
  });
  res.send(); // ส่งข้อมูลไปยัง frontend
});

// จะสามารถเรียกใช้งาน auth ได้
export default router;
