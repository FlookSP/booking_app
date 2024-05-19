import { useFormContext } from "react-hook-form";
import { CreatePostFormData } from "./ManagePostForm";

const DetailsPostSection = () => {
  // เรียกใช้งาน React Hook Form ในที่นี้ ได้แก่ formMethods
  const {
    register,
    formState: { errors },
  } = useFormContext<CreatePostFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">เพิ่มบทความ</h1>
      <h2 className="text-2xl font-bold mb-3">รายละเอียดของบทความ</h2>
      {/* ส่วนรับข้อมูลชื่อบทความ */}
      <label className="text-gray-900 text-sm font-bold flex-1">
        ชื่อบทความ
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("title", { required: "ต้องระบุชื่อบทความ" })}
        ></input>
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
      </label>

      {/* ส่วนรายละเอียดเนื้อหาบทความ */}
      <label className="text-gray-900 text-sm font-bold flex-1">
        รายละเอียดบทความ
        <textarea
          rows={10} // แสดงความกว้างของ textarea เป็น 10 แถว
          className="border rounded w-full py-1 px-2 font-normal"
          id="content"
          {...register("content", { required: "ต้องระบุรายละเอียดเพิ่มเติมเกี่ยวกับบทความ" })}
        ></textarea>
        {errors.content && (
          <span className="text-red-500">{errors.content.message}</span>
        )}
      </label>

    </div>

  );
};

export default DetailsPostSection;
