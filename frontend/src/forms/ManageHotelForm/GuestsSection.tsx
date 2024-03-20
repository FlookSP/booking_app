import { HotelFormData } from "./ManageHotelForm";
import { useFormContext } from "react-hook-form";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">จำนวนผู้เข้าพัก</h2>
      <div className="grid grid-cols-2 p-6 gap-5 bg-gray-300">
        <label className="text-gray-700 text-sm font-semibold">
          ผู้ใหญ่ 
          <input
            type="number"
            min={1}
            {...register("adultCount", { required: "ต้องระบุจำนวนผู้ใหญ่ที่สามารถเข้าพัก" })}
            className="border- rounded w-full py-2 font-normal"
          />
          {errors.adultCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.adultCount?.message}
            </span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-semibold">
          เด็ก
          <input
            type="number"
            min={0}
            {...register("childCount", { required: "ต้องระบุจำนวนเด็กที่สามารถเข้าพัก" })}
            className="border rounded w-full py-2 px3 font-normal"
          />
          {errors.childCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.childCount?.message}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default GuestsSection;
