import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";

const AddHotel = () => {
  // ใช้งาน useNavigate ในการไปยังหน้า "/my-hotel"
  const navigate = useNavigate();
  // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showToast
  const { showToast } = useAppContext();

  // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์ม ManageHotelForm นี้
  // useMutation จะใช้งานฟังก์ชัน addHotel ในไฟล์ api-client.ts
  // โดยเราจะระบุการทำงานในกรณีที่เรียกใช้งานฟังก์ชันสำเร็จ/ไม่สำเร็จ
  const { mutate, isLoading } = useMutation(apiClient.addHotel, {
    onSuccess: () => {
      showToast({ message: "บันทึกข้อมูลที่พักสำเร็จ!", type: "SUCCESS" });
      navigate("/my-hotel"); // ไปยังหน้า "/my-hotel" เพื่อดูรายการที่พักที่เพิ่มเข้ามา
    },
    onError: () => {
      showToast({ message: "บันทึกข้อมูลที่พักไม่สำเร็จ", type: "ERROR" });
    }
  });

  // เรากำหนดฟังก์ชันชื่อ handleSave ใน Add Hotel Form 
  // ให้ทำการเรียกใช้งาน mutate ซึ่งเรากำหนดให้ส่งข้อมูลไปยัง API Backend ด้วย apiClient.addHotel
  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData); // ส่งข้อมูล hotelFormData ไปทำงานในฟังก์ชัน addHotel
  };


  return (
    <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
  )
}

export default AddHotel;