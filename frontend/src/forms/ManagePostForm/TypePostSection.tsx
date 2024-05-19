import { useFormContext } from "react-hook-form";
import { CreatePostFormData } from "./ManagePostForm";
import { postCategories } from "../../config/post-options-config";

const TypePostSection = () => {
  // เรียกใช้งาน React Hook Form
  const {
    register, // ฟังก์ชันตรวจสอบเมื่อมีการกรอกข้อมูลในแบบฟอร์ม
    watch, // ช่วยให้สามารถอ้างถึง Input อื่น เพื่อตรวจสอบข้อมูลที่อยู่คนละช่อง Input ได้
    formState: { errors },
  } = useFormContext<CreatePostFormData>(); // กำหนดให้ useFormContext ทำงานกับข้อมูลประเภท CreatePostFormData

  const typeWatch = watch("category"); // เก็บข้อมูลประเภทของบทความที่ผู้ใช้งานเลือก

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">ประเภทบทความ</h2>
      {/* แสดงได้สูงสุด 5 ตัว */}
      <div className="grid grid-cols-5 gap-2 max-sm:grid-cols-3">
        {postCategories.map((type, index) => (
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
              {...register("category", { required: "ต้องระบุประเภทบทความ" })}
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.category && (
        <span className="text-red-500 text-sm font-bold">
          {errors.category.message}
        </span>
      )}
    </div>
  );
};

export default TypePostSection;
