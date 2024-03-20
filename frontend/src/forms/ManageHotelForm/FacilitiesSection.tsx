import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const FacilitiesSection = () => {
  const {
    register,
    formState: {errors}
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">สิ่งอำนวยความสะดวก</h2>
      <div className="grid grid-cols-5 gap-3">
        {hotelFacilities.map((facilities, index)=>(
          <label key={index} className="flex text-sm text-gray-700 gap-1">
            <input             
            type="checkbox"
            value={facilities}
            {...register("facilities",{validate: (facilities)=>{
              if(facilities && facilities.length > 0){
                return true;
              }
              else{
                return "จำเป็นต้องระบุสิ่งอำนวยความสะดวกอย่างน้อยหนึ่งอย่าง"
              }
            }})}
            />
            {facilities}
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500 text-sm font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  )
}

export default FacilitiesSection