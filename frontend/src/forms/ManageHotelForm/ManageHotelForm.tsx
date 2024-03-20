import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
// ต้องสร้าง Type สำหรับอธิบายคุณสมบัติของฟอร์ม ManageHotelForm ที่เราจะสร้างด้วย React Hook Form (useForm)
// ในที่นี้ตั้งชื่อ Type ว่า HotelFormData ส่วนใหญ่จะประกอบไปด้วยคุณสมบัติที่คล้ายกับ HotelType ในฝั่ง Backend
// เรากำหนด Type ของฟอร์มไว้ในไฟล์เดียวกัน ข้อดี คือ การค้นหาเพื่อปรับปรุงแก้ไขในภายหลังทำได้ง่าย
export type HotelFormData = {
  name: string; // ชื่อที่พักแบบ string
  city: string; // เมื่องที่ตั้งของที่พัก
  country: string; // ประเทศที่ตั้งของที่พัก
  description: string; // คำอธิบายสั้น ๆ เกี่ยวกับที่พัก
  type: string; // ประเภทของที่พัก เช่น Hotels, Apartments, Resorts, Villas เป็นต้น
  pricePerNight: number; // ราคาของที่พัก
  starRating: number; // Rating ของที่พัก สามารถนำมาใช้พัฒนาเป็น Feature แนะนำที่พักหรือการ Filter ที่พักได้
  facilities: string[]; // สิ่งอำนวยความสะดวกในที่พักมีได้หลายรายการแบบ Array String
  imageFiles: FileList; // รายการไฟล์ที่ผู้ใช้เลือกในตอนอับโหลด (HTMLInputElement.files) จะเป็นอ็อบเจ็กต์แบบ FileList
  imageUrls: string[]; // รูปที่พักแบบ Array String
  adultCount: number; // จำนวนผู้ใหญ่ที่สามารถรับได้
  childCount: number; // จำนวนเด็กที่สามารถรับได้
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
// สร้าง Type สำหรับกำหนดว่า Argument ที่ ManageHotelForm Component นี้สามารถรับค่ามาได้นั้น จะเป็นข้อมูลแบบ HotelType
type Props = {
  hotel?: HotelType;
  onSave: (HotelFormData: FormData) => void;
  isLoading: boolean;
};
// ManageHotelForm Component นี้สามารถรับค่าแบบ HotelType
const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  // เริ่มต้นสร้างฟอร์มด้วย React Hook Form โดยเราต้องกำหนดว่าจะใช้งานฟังก์ชันใดบ้างในการทำงานกับ useForm
  // เช่น ฟังก์ชันตรวจสอบการกรอกข้อมูล ฟังก์ชันที่จะจัดการตรวจสอบฟอร์มเมื่อกดปุ่ม type "submit" เป็นต้น
  // และเนื่องจากเราออกแบบให้ ManageHotelForm ประกอบไปด้วย Component ย่อย ๆ เพื่อรับข้อมูลในรูปแบบต่าง ๆ กัน
  // ดังนั้น เราจึงไม่ระบุฟังก์ชันที่เกี่ยวข้องใน { } เหมือนฟอร์ม Sign In ในตอนสร้างทีแรก แต่จะสร้างตัวแปรชื่อ formMethods แทน
  const formMethods = useForm<HotelFormData>();
  // แล้วค่อยกำหนดว่า formMethods ประกอบไปด้วยฟังก์ชันอะไรบ้าง
  const {
    handleSubmit, // ฟังก์ชันที่จะจัดการตรวจสอบฟอร์มเมื่อกดปุ่ม type "submit"
    reset, // ฟังก์ชันจาก React Hook Form สำหรับ Reset ข้อมูลในฟอร์ม
  } = formMethods;
  // เรากำหนดฟังก์ชันชื่อ onSubmit ใน ManageHotelForm
  // ให้ทำงานร่วมกับฟังก์ชัน handleSubmit ใน react-hook-form
  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {    
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());
    // Loop ข้อมูลแบบ Array ด้วย forEach
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }
    // Loop ข้อมูลแบบ FileList ด้วย Array.from แปลงเป็น Array ก่อน
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append("imageFiles", imageFile);
    });
    // บันทึกข้อมูลในฐานช้อมูล
    onSave(formData);
  });
  // กำหนดให้เรียกใช้งาน useEffect เมื่อมีการ Render Component นี้หรือเมื่อมีการเรียกใช้งานฟังก์ชัน reset
  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);
  // และต้องอาศัย FormProvider ในการจัดการกับ Component ย่อย ๆ ในฟอร์มนี้ โดยอาศัยฟังก์ชันต่าง ๆ ใน formMethods
  return (
    // FormProvider จะส่งข้อมูลในแบบฟอร์มนี้ไปยัง formMethods
    <FormProvider {...formMethods}>
      <form
        className="flex flex-col gap-10 mt-5 mb-5 ml-5 mr-5"
        onSubmit={onSubmit}
      >
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-700 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500 rounded-sm"
          >
            {isLoading ? "กำลังบันทึกข้อมูล..." : "บันทึก"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
