import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

// ทำการอ่านไฟล์ .env ใน Vite ด้วย import.meta
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// ฟังก์ชัน register สำหรับทำงานกับ /api/users/register
// ฟังก์ชัน register รับค่าเป็น formData ประเภท RegisterFormData ที่เรากำหนดในไฟล์ Register.tsx
export const register = async (formData: RegisterFormData) => {
  // เก็บข้อมูลที่รับจาก Server ใน response
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST", // กำหนดให้ใช้งาน POST Method
    credentials: "include", // กำหนดให้ใส่ Cookies ใน Request ที่ส่งไป Backend หรือ Set Cookies ที่รับมาใน Browser
    headers: {
      "Content-Type": "application/json", // บอก Server ว่าข้อความใน body ที่ส่งมาจะอยู่ในรูปแบบ json
    },
    body: JSON.stringify(formData), // แปลง formData เป็น json
  });
  // นำข้อมูล body ที่รับจาก Server มาเก็บไว้ใน responseBody
  const responseBody = await response.json();
  // ถ้ามีข้อความ Error จาก Server ให้แสดงให้ผู้ใช้งานทราบ
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

// ฟังก์ชัน validateToken สำหรับทำงานกับ /api/auth/validate-token
export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include", // ทำการ Set Http Cookie ใน Request ที่จะส่งไปยัง backend ด้วย
  });
  // ถ้า backend ตอบ status ที่ไม่ใช่ status 200
  if (!response.ok) {
    throw new Error("Token ไม่ถูกต้อง");
  } else {
    return response.json();
  }
};

// ฟังก์ชัน signOut สำหรับทำงานกับ /api/auth/logout
export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include", // ทำการ Set Http Cookie ใน Request ที่จะส่งไปยัง backend ด้วย
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการออกจากระบบ");
  }
};

// ฟังก์ชัน signIn สำหรับทำงานกับ /api/auth/login
export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include", // กำหนดให้ใส่ Cookies ใน Request ที่ส่งไป Backend หรือ Set Cookies ที่รับมาใน Browser
    headers: {
      "Content-Type": "application/json", // บอก Server ว่าข้อความใน body ที่ส่งมาจะอยู่ในรูปแบบ json
    },
    body: JSON.stringify(formData), // แปลง formData เป็น json
  });
  // นำข้อมูล body ที่รับจาก Server มาเก็บไว้ใน body
  const body = await response.json();
  // ถ้ามี Error จาก Server ให้แสดงให้ผู้ใช้งานทราบ
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

// ฟังก์ชันเพิ่มข้อมูลที่พัก สำหรับทำงานกับ /api/my-hotels
export const addHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include", // กำหนดให้ใส่ Cookies ใน Request ที่ส่งไป Backend
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("ไม่สามารถเพิ่มข้อมูลที่พักได้");
  }

  return response.json();
};
