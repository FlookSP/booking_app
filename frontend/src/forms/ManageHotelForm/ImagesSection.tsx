import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    image: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImages.filter((url) => url !== image)
    );
  };

  // เก็บข้อมูลไฟล์รูปภาพที่เคยเลือกมาก่อนหน้านี้
  const existingImages = watch("imageUrls");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">รูปภาพที่พัก</h2>
      <div className="flex-col border rounded p-4 gap-4">
        {/* ส่วนแสดงรูปภาพที่เคยอับโหลดไปแล้ว */}
        {existingImages && (
          <div className="grid grid-cols-6 gap-4">
            {existingImages.map((image) => (
              <div className="relative group">
                <img src={image} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, image)}
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
          type="file"
          multiple // อนุญาตให้อับโหลดได้มากกว่า 1 ไฟล์
          accept="image/*" // อนุญาตให้อับโหลดไฟล์ประเภทรูปภาพเท่านั้น
          {...register("imageFiles", {
            validate: (imageFiles) => {
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

export default ImagesSection;
