import {
  BookingFormData,
  CommentFormData,
  ForgetPasswordFormData,
  HotelSearchResponse,
  HotelType,
  PaymentIntentResponse,
  PostSearchResponse,
  PostType,
  RegisterFormData,
  ResetPasswordFormData,
  SearchParams,
  SearchPostParams,
  SignInFormData,
  UserType
} from "./shared/types";

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
    // Bug รอแก้ไข ที่ Backend ไม่ส่ง Http Status 400 กรณีไม่เจอชื่อผู้ใช้งาน
    if (!(typeof body.message === 'string' || body.message instanceof String)) {
      throw new Error("ไม่พบชื่อผู้ใช้งาน");
    }
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

// ฟังก์ชันเรียกดูข้อมูลที่พัก สำหรับทำงานกับ "/api/my-hotels"
// สำหรับ : Promise<HotelType[]> หมายถึง กำหนดให้ฟังก์ชันนี้ทำงานกับข้อมูลประเภท HotelType ที่เหมือนกัน
export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "GET",
    credentials: "include", // กำหนดให้ใส่ Cookies ใน Request ที่ส่งไป Backend
  });

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการเรียกดูข้อมูลที่พัก");
  }

  return response.json();
};

// ฟังก์ชันเรียกข้อมูลที่พักตามหมายเลขไอดีของที่พัก สำหรับทำงานกับ Get End Point "/api/my-hotels/:id"
export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการเรียกดูข้อมูลที่พัก");
  }

  return response.json();
};

// ฟังก์ชันแก้ไขข้อมูลที่พักตามหมายเลขไอดีของที่พัก สำหรับทำงานกับ Put End Point "/api/my-hotels/:id"
export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการปรับปรุงข้อมูลที่พัก");
  }

  return response.json();
};

// ฟังก์ชันสำหรับลบรูปภาพ สำหรับทำงานกับ Delete End Point "/api/my-hotels/file/:filename"
export const deleteMyHotelImageByName = async (fileName: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/file/${fileName}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการลบรูปที่พัก");
  }

  return response.json();
};

interface MyObjectsInterface {
  [key: string]: string;
}

// ฟังก์ชันสำหรับลบข้อมูลที่พัก สำหรับทำงานกับ Delete End Point "/api/my-hotels/:id" 
export const deleteMyHotelById = async (hotelId: MyObjectsInterface) => {
  let value;
  Object.keys(hotelId).forEach((key) => {
    value = hotelId[key];
  });

  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${value}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการลบข้อมูลที่พัก");
  }

  return response.json();
};

// ฟังก์ชันค้นหาข้อมูลที่พัก สำหรับทำงานกับ Get End Point "/api/hotels/search"
export const searchHotels = async (
  searchParams: SearchParams // รับข้อมูลแบบ SearchParams
): Promise<HotelSearchResponse> => { // Response จะมีรูปแบบเป็น HotelSearchResponse
  // สร้างข้อมูลค้นหาโดยอาศัย URLSearchParams 
  const queryParams = new URLSearchParams();
  // ข้อมูลค้นหาชื่อ destination มีค่าเท่ากับ searchParams.destination ที่จะรับเข้ามา หรือ ""
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");
  // ข้อมูล Filter ต่าง ๆ 
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));
  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );
  queryParams.append("maxPrice", searchParams.maxPrice || "");
  // ข้อมูล Sort Option 
  queryParams.append("sortOption", searchParams.sortOption || "");

  // ส่งข้อมูลค้นหาไปยัง Backend API ที่เกี่ยวข้อง
  const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการค้นหาข้อมูลที่พัก");
  }

  // ถ้ามาถึงบรรทัดนี้แสดงว่าทำงานได้ตามปกติ
  return response.json();
};

// ฟังก์ชันค้นหาข้อมูลที่พักตามหมายเลขไอดี สำหรับทำงานกับ Get End Point "/api/hotels/:id"
export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการค้นหาข้อมูลที่พัก");
  }
  // ถ้ามาถึงบรรทัดนี้แสดงว่าทำงานได้ตามปกติ
  return response.json();
};

// ฟังก์ชันสำหรับเรียกดูข้อมูลผู้ใช้งานที่ล็อกอินเข้ามา สำหรับทำงานกับ Get End Point "/api/users/me"
export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
  }
  return response.json();
};

// ฟังก์ชันสำหรับทำงานกับ Post End Point ชื่อ "/api/hotels/:hotelId/bookings/payment-intent" 
export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในการสร้าง PaymentIntent ในการชำระเงิน");
  }

  return response.json();
};

// ฟังก์ชันสำหรับทำงานกับ Post End Point ชื่อ "/api/hotels/:hotelId/bookings" สำหรับการจัดเก็บข้อมูลการจองที่พัก
export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในการจองห้องพัก");
  }
};

// ฟังก์ชันสำหรับทำงานกับ Get End Point ชื่อ "/api/my-bookings" สำหรับเรียกดูข้อมูลการจองที่พัก
export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("ไม่สามารถดึงข้อมูลการจองได้");
  }

  return response.json();
};

// ฟังก์ชันสำหรับทำงานกับ Post End Point "/api/auth/forget-password" 
export const fogetPassword = async (formData: ForgetPasswordFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/forget-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // บอก Server ว่าข้อความใน body ที่ส่งมาจะอยู่ในรูปแบบ json
    },
    body: JSON.stringify(formData), // แปลง formData เป็น json
  });
  // นำข้อมูล body ที่รับจาก Server มาเก็บไว้ใน body
  const body = await response.json();
  // ถ้ามี Error จาก Server ให้แสดงให้ผู้ใช้งานทราบ
  if (!response.ok) {
    if (!(typeof body.message === 'string' || body.message instanceof String)) {
      throw new Error("ไม่พบชื่อบัญชีผู้ใช้งานดังกล่าว");
    }
    throw new Error(body.message);
  }
  return body;
};

// ฟังก์ชันสำหรับทำงานกับ Post End Point "/api/auth/reset-password/:token"
export const resetPassword = async (formData: ResetPasswordFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/reset-password/${formData.token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในการแก้ไขรหัสผ่าน");
  }
};

// ฟังก์ชันค้นหาข้อมูลบทความ สำหรับทำงานกับ Get End Point "/api/my-posts/search"
export const searchPosts = async (
  searchParams?: SearchPostParams // รับข้อมูลแบบ SearchPostParams
): Promise<PostSearchResponse> => { // Response จะมีรูปแบบเป็น PostSearchResponse

  // สร้างข้อมูลค้นหาโดยอาศัย URLSearchParams 
  const queryParams = new URLSearchParams();
  // ข้อมูลค้นหามีค่าเท่ากับ searchParams ที่จะรับเข้ามา หรือ ""
  queryParams.append("description", searchParams?.description || "");
  queryParams.append("category", searchParams?.category || "");
  queryParams.append("userId", searchParams?.userId || "");
  queryParams.append("page", searchParams?.page || "");
  queryParams.append("sortOption", searchParams?.sortOption || "");
  queryParams.append("recentPosts", searchParams?.recentPosts || "");

  // ส่งข้อมูลค้นหาไปยัง Backend API ที่เกี่ยวข้อง
  const response = await fetch(`${API_BASE_URL}/api/my-posts/search?${queryParams}`, {
    method: "GET",
    credentials: "include", // กำหนดให้ใส่ Cookies ใน Request ที่ส่งไป Backend
  });

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการค้นหาข้อมูลบทความ");
  }

  // ถ้ามาถึงบรรทัดนี้แสดงว่าทำงานได้ตามปกติ
  return response.json();
};

// ฟังก์ชันเรียกดูข้อมูลที่พัก สำหรับทำงานกับ "/api/my-posts/:id"
// สำหรับ : Promise<PostType[]> หมายถึง กำหนดให้ฟังก์ชันนี้ทำงานกับข้อมูลประเภท PostType ที่เหมือนกัน
export const fetchMyPosts = async (userId: string): Promise<PostType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-posts/${userId}`, {
    method: "GET",
    credentials: "include", // กำหนดให้ใส่ Cookies ใน Request ที่ส่งไป Backend
  });

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการเรียกดูข้อมูลบทความทั้งหมดของผู้โพส");
  }

  return response.json();
};

// ฟังก์ชันสำหรับลบข้อมูลบทความ สำหรับทำงานกับ Delete End Point "/api/my-posts/:id" 
export const deleteMyPostById = async (postId: MyObjectsInterface) => {
  let value;
  Object.keys(postId).forEach((key) => {
    value = postId[key];
  });

  const response = await fetch(
    `${API_BASE_URL}/api/my-posts/${value}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการลบข้อมูลบทความ");
  }

  return response.json();
};

// ฟังก์ชันสำหรับลบรูปภาพ สำหรับทำงานกับ Delete End Point "/api/my-posts/file/:filename"
export const deleteMyPostImageByName = async (fileName: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-posts/file/${fileName}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการลบรูปในบทความ");
  }

  return response.json();
};

// ฟังก์ชันเพิ่มข้อมูลบทความ สำหรับทำงานกับ "/api/my-posts/"
export const addPost = async (postFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-posts`, {
    method: "POST",
    credentials: "include", // กำหนดให้ใส่ Cookies ใน Request ที่ส่งไป Backend
    body: postFormData,
  });

  if (!response.ok) {
    throw new Error("ไม่สามารถเพิ่มข้อมูลบทความได้");
  }

  return response.json();
};

// ฟังก์ชันเรียกข้อมูลบทความตามหมายเลขไอดี สำหรับทำงานกับ Get End Point "/api/my-posts/:id"
export const fetchMyPostById = async (postId: string): Promise<PostType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-posts/${postId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการเรียกดูข้อมูลบทความ");
  }

  return response.json();
};

// ฟังก์ชันแก้ไขข้อมูลบทความตามหมายเลขไอดี สำหรับทำงานกับ Put End Point "/api/my-posts/:id"
export const updateMyPostById = async (postFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-posts/${postFormData.get("postId")}`,
    {
      method: "PUT",
      body: postFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการปรับปรุงข้อมูลบทความ");
  }

  return response.json();
};

// ฟังก์ชันเรียกข้อมูลบทความตามหมายเลขไอดี สำหรับทำงานกับ Get End Point "/api/my-posts/:slug"
export const fetchMyPostBySlug = async (slug: string): Promise<PostType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-posts/slug/${slug}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการเรียกดูข้อมูลบทความ");
  }

  return response.json();
};

// ฟังก์ชันสำหรับเรียกดูข้อมูลผู้เขียนบทความ สำหรับทำงานกับ Get End Point "/api/users/author"
export const fetchAuthor = async (id: string): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/author/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
  }
  return response.json();
};

// ฟังก์ชันสำหรับทำงานกับ Post End Point ชื่อ "/api/my-comments/:slug" สำหรับการแสดงความคิดเห็นในบทความ
export const createComment = async (formData: CommentFormData) => {

  const response = await fetch(
    `${API_BASE_URL}/api/my-comments/${formData.slug}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในการจองห้องพัก");
  }
};

// ฟังก์ชันเพิ่มจำนวนการเข้าชมบทความตาม slug สำหรับทำงานกับ POST End Point "/api/my-posts/:slug/increment-view-count"
export const incrementMyPostViewBySlug = async (slug: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-posts/${slug}/increment-view-count`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการปรับปรุงจำนวนการเข้าชมบทความ");
  }

  return response.json();
};

// ฟังก์ชันกดไลค์บทความตาม slug สำหรับทำงานกับ POST End Point "/api/my-posts/:slug/like-post"
export const likePostBySlug = async (slug: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-posts/${slug}/like-post`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในระหว่างการปรับปรุงจำนวนการเข้าชมบทความ");
  }

  return response.json();
};

// ฟังก์ชันสำหรับลบความคิดเห็น สำหรับทำงานกับ Delete End Point "/api/my-posts/delete-comment" 
export const deleteMyComment = async (data: MyObjectsInterface) => {
  const response = await fetch(`${API_BASE_URL}/api/my-posts/delete-comment`, {
    method: "POST",
    credentials: "include", // กำหนดให้ใส่ Cookies ใน Request ที่ส่งไป Backend
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // ส่ง postId และ commentId ไปให้ Backend
  });

  if (!response.ok) {
    throw new Error("ไม่สามารถลบความคิดเห็นในบทความได้");
  }

  return response.json();

};

// ฟังก์ชันสำหรับทำงานกับ Put End Point ชื่อ "/api/my-comments/edit-comment" สำหรับการแสดงความคิดเห็นในบทความ
export const editComment = async (formData: CommentFormData) => {

  const response = await fetch(
    `${API_BASE_URL}/api/my-comments/edit-comment`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("เกิดข้อผิดพลาดในการจองห้องพัก");
  }
};