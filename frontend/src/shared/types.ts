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
    totalCost: number; // ราคาค่าที่พัก
};

// สร้าง SearchParams Type เพื่อช่วยในการตรวจสอบการทำงานของข้อมูลค้นหาหรือค่า Filter ที่จะรับเข้ามา
export type SearchParams = {
    // ข้อมูลค้นหาจาก SearchBar Component ที่จะส่งไป Backend
    // ? คือเป็น optional string
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    // ข้อมูลหน้าจาก Pagination
    page?: string;
    // ข้อมูลค่า Filter 
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
};

// HotelSearchResponse Type จะให้รายละเอียดเกี่ยวกับ Hotel Search Response ซึ่งต้องตรงกับฝั่ง Backend
export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
};

// สร้าง UserType Type เพื่อช่วยในการตรวจสอการเรียกดูข้อมูลผู้ใช้งานที่ล็อกอินเข้ามา
export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

// PaymentIntentResponse ให้รายละเอียดเกี่ยวกับ PaymentIntent
export type PaymentIntentResponse = {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
};

// รายละเอียดของตัวแปรต่าง ๆ ในฟอร์ม BookingFormData นี้
export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number;
};

// เราต้องกำหนด Type ของ Input ต่าง ๆ ใน Log In Form
// เพื่อให้ useForm ใช้ในการตรวจสอบข้อมูลที่ผู้ใช้งานกรอกเข้ามา
export type SignInFormData = {
    email: string;
    password: string;
    checked: boolean;
};

// เราต้องกำหนด Type ของ Input ต่าง ๆ ใน Log In Form
// เพื่อให้ useForm ใช้ในการตรวจสอบข้อมูลที่ผู้ใช้งานกรอกเข้ามา
export type ForgetPasswordFormData = {
    email: string;
};

// เราต้องกำหนด Type ของ Input ต่าง ๆ ใน Register Form
// เพื่อให้ useForm ใช้ในการตรวจสอบข้อมูลที่ผู้ใช้งานกรอกเข้ามา
export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    checked: boolean;
    role: string; // role สำหรับผู้ใช้งาน
};

// เราต้องกำหนด Type ของ Input ต่าง ๆ ใน Reset Password Form
// เพื่อใช้ในการตรวจสอบข้อมูลที่ผู้ใช้งานกรอกเข้ามา
export type ResetPasswordFormData = {
    password: string;
    confirmPassword: string;
    token: string;
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
    comments: CommentType[]; // รายการ comments แบบ Array String
};

// รายละเอียดของ Comment
export type CommentType = {
    _id: string;
    content: string;
    userId: string; // หมายเลขไอดีของผู้ที่ทำการ comment
    like: string[]; // หมายเลขไอดีของผู้ที่ถูกใจ comment
    numberOfLikes: number; // จำนวนการกดถูกใจ comment
    createdAt: Date; // วันที่สร้าง comment
    updatedAt: Date; // วันที่ปรับปรุง comment
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

// สร้าง SearchPostParams Type เพื่อช่วยในการตรวจสอบการทำงานของข้อมูลค้นหาหรือค่า Filter ที่จะรับเข้ามา
export type SearchPostParams = {
    // ข้อมูลค้นหาจาก SearchBar Component ที่จะส่งไป Backend
    // ? คือเป็น optional string
    id?: string;
    description?: string;
    userId?: string;
    category?: string;
    // ข้อมูลหน้าจาก Pagination
    page?: string;
};

// รายละเอียดของตัวแปรต่าง ๆ ใน CommentForm
export type CommentFormData = {
    content: string;
    userId: string;
    slug: string;
};