import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ใน Model ต้องมี Type เพื่อช่วยให้ Frontend สามารถตรวจสอบว่าใส่รายละเอียดครบหรือยัง
export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: [string]; // เก็บ Role แบบ String Array เช่น บางคนสามารถเป็น User และ Admin เป็นต้น 
};

// นอกจากนี้ต้องมี Schema เพื่อกำหนดคุณสมบัติของ Document 
// ทั้งนี้ใน Schema ไม่ต้องระบุ _id เพราะ mongoose.Schema จะใส่ให้โดยอัตโนมัติ
const userSchema = new mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    role: {type: [String], required: true}, // เก็บ Role แบบ String Array 
});

// สร้าง Middleware Function เพื่อทำการตรวจสอบก่อนที่จะทำการ "save" ว่ามีการแก้ไข Password ที่รับเข้ามาหรือไม่
// โดยถ้ามีการแก้ไข Password ที่แตกต่างไปจากของเดิมใน MongoDB ให้ทำการ Encrypt Password แล้วจัดเก็บ
// แต่ถ้าไม่มีการแก้ไข Password หรือ Password ที่รับเข้ามาไม่แตกต่างไปจากของเดิมใน MongoDB ก็ไม่ต้องทำการ Encrypt Password
// และไปทำงานอื่น ๆ ได้เลย โดยอาศัย next() function ที่มีอยู่แล้ว
userSchema.pre("save", async function (next) {
   // ถ้ามีการแก้ไข Password ที่แตกต่างไปจากของเดิมใน MongoDB
   if(this.isModified('password')){
    // ทำการเข้ารหัส Password ก่อนบันทึกลง MongoDB
    this.password = await bcrypt.hash(this.password,8);
   }
   // ทำงานอื่น ๆ ต่อไป
   next();
});

// สร้าง Model ชื่อ User โดยมี Type เป็น USerType ที่จะทำงานกับ Document ชื่อ "User" ด้วย Schema userSchema
const User = mongoose.model<UserType>("User", userSchema);

export default User;