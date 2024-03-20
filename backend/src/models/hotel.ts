import mongoose from "mongoose";
import { BookingType, HotelType } from "../shared/types";
// ใน Model ต้องมี Type เพื่อช่วยให้ Frontend สามารถตรวจสอบว่าใส่รายละเอียดครบหรือยัง
// นอกจากนี้ต้องมี Schema เพื่อกำหนดคุณสมบัติของ Document
// ทั้งนี้ใน Schema ไม่ต้องระบุ _id เพราะ mongoose.Schema จะใส่ให้โดยอัตโนมัติ
// สร้าง bookingSchema แบบ BookingType
const bookingSchema = new mongoose.Schema<BookingType>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    userId: { type: String, required: true },
    totalCost: { type: Number, required: true },
  });

// สร้าง hotelSchema แบบ HotelType
const hotelSchema = new mongoose.Schema<HotelType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }], // รายการสิ่งอำนวยความสะดวกแบบ Array String
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 }, // กำหนดให้มีค่าระหว่าง 1-5
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
  bookings: [bookingSchema],
});

// สร้าง Model ชื่อ Hotel โดยมี Type เป็น HotelType ที่จะทำงานกับ Document ชื่อ "Hotel" ด้วย Schema hotelSchema
const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);

export default Hotel;