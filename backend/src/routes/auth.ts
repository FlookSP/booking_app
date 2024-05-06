import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import func from "../middleware/auth";
import { Client, SendEmailV3_1 } from "node-mailjet";

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
      if (!user || user === null) {
        return res.status(400).json({ message: "ข้อมูลล็อกอินไม่ถูกต้อง" });
      } else {
        // ถ้าเจอ user ที่ใช้งาน email ดังกล่าว ให้ตรวจสอบ Password
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
          // แจ้งสถานะภาพว่าทำงานได้ตามปกติและส่ง _id และ role กลับไป
          // หลังจากล็อกอินเราจะสามารถใช้ _id และ role เพื่อการ Query ข้อมูลต่าง ๆ ที่เกี่ยวข้องกับผู้ใช้งานได้ต่อไป
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
router.get(
  "/validate-token",
  func.verifyToken,
  (req: Request, res: Response) => {
    // ถ้า Token ถูกต้อง ให้แจ้ง Status 200 และส่ง userId และ userRole เพื่อให้ผู้ใช้งานนำไปใช้ประโยชน์ต่อไป
    res.status(200).send({ userId: req.userId, userRole: req.userRole });
  }
);

// สร้าง Post End Point "/api/auth/logout"
router.post("/logout", (req: Request, res: Response) => {
  // Clear ค่า Cookies ในระบบ
  res.cookie("auth_token", "", {
    // การตั้งค่าวันที่หมดอายุของคุกกี้เป็นเวลาในอดีต คือ January 1, 1970 in UTC ซึ่งหมายความว่าบอกให้เบราว์เซอร์ลบคุกกี้ออกไป
    expires: new Date(0),
  });
  res.send(); // ส่งข้อมูลไปยัง frontend
});

// สร้าง Post End Point "/api/auth/forget-password" สำหรับจัดการกับอีเมลที่ผู้ใช้งานส่งเข้ามาเพื่อขอรหัสผ่านใหม่
// กำหนด Middleware ด้วย check จาก express-validator ให้ตรวจสอบ API Request ที่เข้ามา
router.post("/forget-password",
  [
    check("email", "ต้องระบุ Email ที่ผู้ใช้งานใช้ในการลงทะเบียนสมาชิกกับเว็บไซต์").isEmail(),
  ],
  async (req: Request, res: Response) => {
    // คอยจัดการกับ Error ที่เกิดจากการทำงานของ check
    const errors = validationResult(req);
    // ถ้ามี Error จาก API Request ที่เข้ามาและ check ตรวจเจอให้แจ้งข้อผิดพลาดแก่ผู้ใช้งาน
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
    }

    // นำข้อมูลจาก Request Body มาเก็บในตัวแปรชื่อ email
    const { email } = req.body;

    try {
      // ตรวจสอบว่ามีอีเมลของผู้ใช้มีอยู่ในฐานข้อมูลของเราหรือไม่
      const user = await User.findOne({ email });
      // ถ้าไม่เจอ user ที่ใช้งาน email ดังกล่าว ให้แจ้งเตือน
      if (!user || user === null) {
        return res.status(400).json({ message: "ข้อมูลอีเมลไม่ถูกต้อง" });
      } else {
        // สร้างโทเค็นที่เข้ารหัส userID พร้อมกับเวลาหมดอายุ สำหรับขอรหัสใหม่ในเวลาที่กำหนด
        const token = jwt.sign(
          { userId: user.id, userRole: user.role },
          process.env.JWT_SECRET_KEY as string,
          {
            expiresIn: "10m", // กำหนดให้โทเค็นสำหรับขอรหัสผ่านใหม่หมดเวลาใน 10 นาที
          }
        );
        // ส่งอีเมลไปยังที่อยู่อีเมลของผู้ใช้ที่มีลิงก์พร้อมโทเค็นที่สร้างขึ้น โดยลิงก์นี้จะนำพวกเขาไปยังหน้าที่พวกเขาสามารถรีเซ็ตรหัสผ่านได้
        const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const subject = "ลืมรหัสผ่านของคุณหรือไม่?";
        const text = "รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ";
        const html =
          `<p>ดูเหมือนว่าคุณจะลืมรหัสผ่าน หากคุณลืม โปรดคลิกลิงก์ด้านล่างเพื่อรีเซ็ต หากคุณไม่ได้ลืม ไม่ต้องสนใจอีเมลฉบับนี้ โปรดอัปเดตรหัสผ่านของคุณภายใน 10 นาที มิฉะนั้นคุณจะต้องทำขั้นตอนนี้ซ้ำ <a href=` +
          link +
          `>คลิกเพื่อรีเซ็ตรหัสผ่าน</a></p><br />`;

        await sendMail({
          to: email,
          subject,
          text,
          html,
        });

        // ถ้ามาถึงบรรทัดนี้แสดงว่าสามารถส่งอีเมลได้สำเร็จ ให้ทำการแจ้งสถานะภาพว่าทำงานได้ตามปกติ
        res.status(200).json({ message: "อีเมลถูกส่งไปเพื่อแสดงคำแนะนำในการเปลี่ยนรหัสผ่านของคุณ กรุณาตรวจสอบกล่องจดหมายของอีเมล์ที่คุณให้ไว้" });

      }
    }
    catch (error) {
      // ทำการแสดงข้อความนี้ที่ฝั่ง Server เท่านั้น
      console.log(error);
      // แจ้งเตือนผู้ใช้งานเป็ยข้อความผิดพลาดทั่ว ๆ ไป ป้องกันแฮกเกอร์ได้รับข้อมูล Sensitive ของ Server
      res.status(500).json({ message: "มีบางอย่างผิดพลาดในฝั่ง Server" });
    }

  }
);

// สร้าง MailType Type เพื่อช่วยในการตรวจสอบข้อมูลอีเมล
export type MailType = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

// ฟังก์ชันสำหรับส่งอีเมล
const sendMail = async ({
  to,
  subject,
  text,
  html,
}: MailType) => {
  // สร้าง Client สำหรับส่งอีเมลด้วย mailjet
  const mailjet = new Client({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY,
  });

  // สร้างข้อความ
  const email: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_NAME as string,
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        HTMLPart: html,
        TextPart: text,
      },
    ],
  };

  // ทำการส่งอีเมลด้วย mailjet
  await mailjet.post("send", {
    version: "v3.1",
  }).request(email);
};

// สร้าง Post End Point "/api/auth/reset-password/:token" สำหรับรองรับการตั้งรหัสผ่านใหม่แก่ผู้ใช้งาน
router.post("/reset-password/:token", async (req: Request, res: Response) => {
  try {
    // ตรวจสอบโทเค็นที่ผู้ใช้ส่งมา
    const token = req.params.token;
    // ตรวจสอบ token ด้วย JWT_SECRET_KEY
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    // หากโทเค็นไม่ถูกต้อง ให้แจ้งข้อผิดพลาด
    if (!decoded) {
      return res.status(401).send({ message: "โทเค็นไม่ถูกต้องหรือโทเค็นหมดอายุ" });
    }
    // ค้นหาผู้ใช้ด้วย ID จากโทเค็น
    const user = await User.findOne({ _id: (decoded as JwtPayload).userId });
    if (!user) {
      return res.status(401).send({ message: "ไม่พบผู้ใช้งาน" });
    } else {
      //อัปเดตรหัสผ่านของผู้ใช้
      user.password = req.body.password;
      await user.save();
      // แจ้งสถานะภาพว่าทำงานได้ตามปกติ
      return res
        .status(200)
        .send({ message: "อัปเดตรหัสผ่านแล้ว" });
    }
  }
  catch (error) {
    // ทำการแสดงข้อความนี้ที่ฝั่ง Server เท่านั้น
    console.log(error);
    // แจ้งเตือนผู้ใช้งานเป็ยข้อความผิดพลาดทั่ว ๆ ไป ป้องกันแฮกเกอร์ได้รับข้อมูล Sensitive ของ Server
    res.status(500).json({ message: "มีบางอย่างผิดพลาดในฝั่ง Server" });
  }

});


// จะสามารถเรียกใช้งาน auth ได้
export default router;
