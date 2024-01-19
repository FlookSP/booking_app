import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt, { JwtPayload } from "jsonwebtoken";

// ทำการ Add 'userId' Property ไปยัง Express Request
declare global {
  // ทำการ Add กับ Express namespace หรือก็คือ Express Package
  namespace Express {
    // ทำการ Add กับ Request Interface ของ Express
    interface Request {
      userId: string;
      userRole: string;
    }
  }
}

// Middleware Function ชื่อ verifyToken ทำหน้าที่ตรวจสอบ Token ที่รับเข้ามา
// verifyToken จะรับค่าจาก Express 3 ตัว ได้แก่ Request, Response และ NextFunction
// วัตถุประสงค์ของ verifyToken คือ การตรวจสอบว่าล็อกอินสำเร็จหรือไม่เท่านั้น
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // รับค่า token จาก Http Request ที่เข้ามา โดยดูจาก key ชื่อ auth_token โดยอาศัย cookie-parser package
  const token = req.cookies["auth_token"];
  // ถ้าไม่มี token ใน Http Request
  if (!token) {
    // ส่ง status 401 และข้อความแจ้งเตือน
    return res.status(401).json({ message: "ไม่ได้รับอนุญาต" });
  } else {
    // ตรวจสอบ token
    try {
      // ตรวจสอบ token ด้วย JWT_SECRET_KEY
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      // ทำการ Add ข้อมูล userId จาก token แล้วเก็บไว้ใน Request เพื่อให้สามารถส่งกลับไปยัง frontend ต่อไปได้
      req.userId = (decoded as JwtPayload).userId;
      // ทำการ Add ข้อมูล userRole จาก token แล้วเก็บไว้ใน Request เพื่อให้สามารถส่งกลับไปยัง frontend ต่อไปได้
      req.userRole = (decoded as JwtPayload).userRole;
      // บอกว่าจบการทำงานใน verifyToken นี้แล้ว ให้ Express กลับไปทำงานอื่น ๆ ต่อไป
      next();
    } catch (error) {
      // ถ้า token ไม่ถูกต้อง ส่ง status 401 และข้อความแจ้งเตือน
      return res.status(401).json({ message: "ไม่ได้รับอนุญาต" });
    }
  }
};

// เพื่อให้สามารถ export multiple function ด้วย export default ได้ในภายหลัง
const funcs = {
  verifyToken,
};

export default funcs;
