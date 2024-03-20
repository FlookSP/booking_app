import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const DetailsSection = () => {
  // เรียกใช้งาน React Hook Form ในที่นี้ ได้แก่ formMethods
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">เพิ่มที่พัก</h1>
      <h2 className="text-2xl font-bold mb-3">รายละเอียดของที่พัก</h2>
      {/* ส่วนรับข้อมูลชื่อที่พัก */}
      <label className="text-gray-900 text-sm font-bold flex-1">
        ชื่อที่พัก
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", { required: "ต้องระบุชื่อที่พัก" })}
        ></input>
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>

      {/* ส่วนรับข้อมูลชื่อเมืองและประเทศที่ตั้งของที่พัก */}
      <div className="flex flex-row gap-4">
        <label className="text-gray-900 text-sm font-bold flex-1">
          เมืองที่ตั้งของที่พัก
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("city", { required: "ต้องระบุเมืองที่ตั้งของที่พัก" })}
          ></input>
          {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
          )}
        </label>

        <label className="text-gray-900 text-sm font-bold flex-1">
          ประเทศที่ตั้งของที่พัก
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("country", { required: "ต้องระบุประเทศที่ตั้งของที่พัก" })}
          ></input>
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </label>
      </div>

      {/* ส่วนรายละเอียดเพิ่มเติมเกี่ยวกับที่พัก */}
      <label className="text-gray-900 text-sm font-bold flex-1">
        รายละเอียดเพิ่มเติมเกี่ยวกับที่พัก
        <textarea
          rows={10} // แสดงความกว้างของ textarea เป็น 10 แถว
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("description", { required: "ต้องระบุรายละเอียดเพิ่มเติมเกี่ยวกับที่พัก" })}
        ></textarea>
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>

      {/* ส่วนราคาที่พัก */}
      <label className="text-gray-900 text-sm font-bold flex-1 max-w-[50%]">
        ราคาต่อคืน
        <input
          type="number" // อนุญาตให้กรอกได้เฉพาะตัวเลขเท่านั้น
          min={1}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("pricePerNight", { required: "ต้องระบุราคาต่อคืน" })}
        ></input>
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>

      {/* ส่วนการให้คะแนนที่พักเป็นระดับดาว */}
      <label className="text-gray-900 text-sm font-bold flex-1 max-w-[50%]">
        การให้คะแนนที่พัก
        <select
          {...register("starRating", { required: "ต้องให้คะแนนดาวที่พัก" })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option value="" className="text-sm font-bold">
            ให้คะแนนดาว
          </option>
          {[1, 2, 3, 4, 5].map((num, index) => (
            <option key={index} value={num}>{num}</option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message}</span>
        )}
      </label>
    </div>
  );
};

export default DetailsSection;
