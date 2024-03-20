import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
  // เรียกใช้งาน React Hook Form
  const {
    register, // ฟังก์ชันตรวจสอบเมื่อมีการกรอกข้อมูลในแบบฟอร์ม
    watch, // ช่วยให้สามารถอ้างถึง Input อื่น เพื่อตรวจสอบข้อมูลที่อยู่คนละช่อง Input ได้
    formState: { errors },
  } = useFormContext<HotelFormData>(); // กำหนดให้ useFormContext ทำงานกับข้อมูลประเภท HotelFormData

  const typeWatch = watch("type"); // เก็บข้อมูลประเภทของที่พักที่ผู้ใช้งานเลือก

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">ประเภทที่พัก</h2>
      {/* แสดงได้สูงสุด 5 ตัว */}
      <div className="grid grid-cols-5 gap-2">
        {hotelTypes.map((type, index) => (
          <label
            key={index}
            className={
              typeWatch === type // แสดงเป็นวงรีครอบข้อความแทน โดยถ้าเป็นประเภทที่พักซึ่งผู้ใช้งานเลือก ให้แสดงสีตามที่กำหนด
                ? "cursor-pointer bg-blue-600 text-white text-sm text-center rounded-full px-4 py-2 font-semibold"
                : "cursor-pointer bg-gray-300 text-sm text-center rounded-full px-4 py-2 font-semibold"
            }
          >
            <input
              type="radio"
              value={type}
              className="hidden" // ซ่อนปุ่ม radio แบบปกติ
              {...register("type", { required: "ต้องระบุประเภทที่พัก" })}
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default TypeSection;
