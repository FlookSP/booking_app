import { useFormContext } from "react-hook-form";
import * as apiClient from "../../api-client";
import { CreatePostFormData } from "./ManagePostForm";

const ImagePostSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreatePostFormData>();

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>, // รับ Button Click Event
    image: string // URL รูปภาพ
  ) => {
    event.preventDefault(); // ป้องกันไม่ให้ Submit Form เมื่อ Click ลบรูปภาพ
    // นำเฉพาะชื่อรูปภาพเท่านั้น เพื่อใช้ในการ setValue
    const urlName = `${API_BASE_URL}/api/my-posts/file/`
    const selectedImage = image.replace(urlName, '');

    // ลบรูปภาพที่จัดเก็บในฐานข้อมูล
    apiClient.deleteMyPostImageByName(selectedImage);

    // กำหนดค่า URL รูปภาพใหม่ โดยเอาข้อมูลรูปภาพที่ลบออกไป
    setValue(
      "imageUrls", // ค่า Field ที่เราต้องการกำหนดค่าใหม่
      existingImages.filter((url) => url !== selectedImage) // จะคืนค่าเป็น Array ของชื่อรูปภาพทั้งหมด ยกเว้นที่ Click ลบ 
    );
  };

  // เก็บข้อมูลไฟล์รูปภาพที่เคยเลือกมาก่อนหน้านี้
  const existingImages = watch("imageUrls");
  // ทำการอ่านที่อยู่ URL จากไฟล์ .env ใน Vite ด้วย import.meta
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  // สร้าง URL สำหรับแสดงรูปภาพที่พัก
  const urls: string[] = [];
  if (existingImages) {
    // Loop ข้อมูลแบบ FileList ด้วย Array.from แปลงเป็น Array ก่อน
    Array.from(existingImages).forEach((name) => {
      urls.push(`${API_BASE_URL}/api/my-posts/file/${name}`);
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">รูปภาพในบทความ</h2>
      <div className="flex-col border rounded p-4 gap-4">
        {/* ส่วนแสดงรูปภาพที่เคยอับโหลดไปแล้ว */}
        {urls && (
          <div className="grid grid-cols-6 gap-4">
            {urls.map((image, index) => (
              // สร้างปุ่ม Delete เมื่อนำ Mouse ไป Hover รูปภาพ โดย group คือ จัดการ Component ที่อยู่ภายในแบบกลุ่ม 
              <div key={index} className="relative group">
                {/* min-h-full คือ ให้แสดงรูปภาพสูงเต็มพื้นที่ Container, object-cover คือ แสดงรูปภาพให้อยู่ภายในพื้นที่ Container */}
                <img src={image} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, image)}
                  // absolute inset-0 คือ กำหนดให้แสดงปุ่มต่อจาก relative หรือก็คือเหนือรูปภาพ
                  className="flex absolute inset-0 items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
        {/* ส่วนแสดงที่ให้อับโหลดไฟล์ */}
        <input
          className="mt-4"
          type="file"
          multiple // อนุญาตให้อับโหลดได้มากกว่า 1 ไฟล์
          accept="image/*" // อนุญาตให้อับโหลดไฟล์ประเภทรูปภาพเท่านั้น
          {...register("imageFiles", {
            validate: (imageFiles) => {
              // รวมทั้งรูปที่มีอยู่แล้วและรูปที่จะอับโหลดใหม่
              const totalLength = imageFiles.length + (existingImages?.length || 0);
              if (totalLength === 0) {
                return "อับโหลดรูปภาพอย่างน้อยหนึ่งภาพ";
              } else if (totalLength > 6) {
                return "จำนวนภาพทั้งหมดต้องไม่เกิน 6 ภาพ";
              } else {
                return true;
              }
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagePostSection;
