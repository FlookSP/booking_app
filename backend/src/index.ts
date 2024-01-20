import express, {Request, Response} from 'express';
import cors from 'cors';
// อ่านไฟล์ .env ในโฟลเดอร์ backend
import "dotenv/config"
import mongoose from 'mongoose';
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from 'path';

// ทำการเชื่อมต่อกับ MongoDB โดยอาศัย URI ที่กำหนดใน MONGODB_CONNECTION_STRING
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
//.then(()=>console.log("เชื่อมต่อกับฐานข้อมูล:", process.env.MONGODB_CONNECTION_STRING));

// สร้าง Express App 
const app = express();
// กำหนดให้ Express App ใช้งาน cookieParser
app.use(cookieParser());
// กำหนดให้ Express App ทำงานกับ JSON Data จาก Rest API ได้โดยอัตโนมัติ
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// กำหนดให้ Express App ใช้มาตรการรักษาความปลอดภัยกับ Rest API ด้วย cors
app.use(cors({
    origin: process.env.FRONTEND_URL, // กำหนดให้รับการติดต่อจาก frontend url เท่านั้น
    credentials: true, // กำหนดให้ต้องมี HTTP Cookie ใน Request ที่เข้ามาด้วย
}));

// กำหนดที่จัดเก็บไฟล์ของโปรเจค frontend เพื่อให้สามารถ Run โปรเจคทั้งสองในเครื่อง Server เดียวกันได้
// โดยสรุปคือให้ Express ทำการให้บริการทั้ง Frontend และ Backend นั่นเอง
app.use(express.static(path.join(__dirname, "../../frontend/dist"))); 

// กำหนดการทำงานกับ Rest API ต่าง ๆ
// Log in API
app.use("/api/auth", authRoutes);
// ถ้ามี Request มาที่ "/api/users" endpoint ให้เรียกใช้งาน Routes ต่าง ๆ ที่กำหนดใน userRoutes
app.use("/api/users", userRoutes);

// เริ่มต้นทำงาน Express Server โดยกำหนดให้เฝ้าฟังที่พอร์ต 8080
app.listen(8080, ()=>{
    console.log("เซิร์ฟเวอร์ทำงานบน localhost:8080");
}); 