// UserType จะให้รายละเอียดเกี่ยวกับผู้ใช้
export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: [string]; // เก็บ Role แบบ Tuple ที่เก็บ Single String เช่น บางคนสามารถเป็น User และ Admin เป็นต้น 
};
// BookingType จะให้รายละเอียดเกี่ยวกับการจองที่พัก
export type BookingType = {
  _id: string;
  userId: string; // หมายเลขไอดีของผู้ใช้งานที่จองที่พัก
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number; // จำนวนผู้ใหญ่ที่เข้าพัก
  childCount: number; // จำนวนเด็กที่เข้าพัก
  checkIn: Date; // วันที่เข้าพัก
  checkOut: Date; // วันที่ออกจากที่พัก
  totalCost: number; // ราคาค่าที่พักที่จอง
};

// HotelType จะให้รายละเอียดเกี่ยวกับที่พัก
export type HotelType = {
  _id: string;
  userId: string; // หมายเลขไอดีของผู้ใช้งานที่ให้รายละเอียดที่พัก
  name: string; // ชื่อที่พัก
  city: string; // เมืองที่ตั้งของที่พัก
  country: string; // ประเทศที่ตั้งของที่พัก
  description: string; // รายละเอียดของที่พัก
  type: string; // ประเภทของที่พัก เช่น Hotels, Apartments, Resorts, Villas เป็นต้น
  adultCount: number; // จำนวนผู้ใหญ่ที่สามารถรับได้
  childCount: number; // จำนวนเด็กที่สามารถรับได้
  facilities: string[]; // สิ่งอำนวยความสะดวกในที่พักมีได้หลายรายการแบบ Array String
  pricePerNight: number; // ราคาของที่พัก
  starRating: number; // Rating ของที่พัก สามารถนำมาใช้พัฒนาเป็น Feature แนะนำที่พักหรือการ Filter ที่พักได้ 
  imageUrls: string[]; // รูปที่พักแบบ Array String
  lastUpdated: Date; // วันที่ปรับปรุงข้อมูล
  bookings: BookingType[]; // รายการจองที่พักที่มีการจองแบบ Array String
};

// HotelSearchResponse จะให้รายละเอียดเกี่ยวกับ Hotel Search Response
export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

// PaymentIntentResponse ให้รายละเอียดเกี่ยวกับ PaymentIntent
export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};

// PostType จะให้รายละเอียดเกี่ยวกับที่พัก
export type PostType = {
  _id: string;
  userId: string; // หมายเลขไอดีของผู้ใช้งาน
  content: string; // บทความ
  title: string; // ชื่อบทความต้องไม่ซ้ำกัน
  imageUrls: string[]; // รูปในบทความ
  category: string; // ประเภทบทความ
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  like: string[]; // หมายเลขไอดีของผู้ที่ถูกใจบทความ
  view: number; // จำนวนผู้เข้าชมบทความนี้
  comments: CommentType[]; // รายการ comment แบบ Array String
};

// PostSearchResponse จะให้รายละเอียดเกี่ยวกับ Post Search Response
export type PostSearchResponse = {
  data: PostType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

// รายละเอียดของ Comment
export type CommentType = {
  content: string;
  userId: string; // หมายเลขไอดีของผู้ที่ทำการ comment
  like: string[]; // หมายเลขไอดีของผู้ที่ถูกใจ comment
  numberOfLikes: number; // จำนวนการกดถูกใจ comment
  createdAt: Date; // วันที่สร้าง comment
  updatedAt: Date; // วันที่ปรับปรุง comment
};