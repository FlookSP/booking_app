// เราจะใช้ ManageHotelForm ในการแสดงข้อมูลที่พัก
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
// เราจะใช้ useParams จาก react-router-dom ในการรับ hotelId 
import { useParams } from "react-router-dom";
// เรียกใช้งาน API ในการรับข้อมูลที่พัก
import * as apiClient from "../api-client";
// เราจะใช้ useQuery ในการดึงข้อมูลผ่านทาง API มาแสดงในแบบฟอร์ม
// และเราจะใช้ useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์ม ManageHotelForm นี้ 
import { useMutation, useQuery } from "react-query";
// เราจะเรียกใช้งาน showToast ในการแสดงข้อความแจ้งสถานะการทำงาน
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
    // รับ hotelId ที่ส่งผ่านทาง Link URL
    const { hotelId } = useParams();
    // เรียกใช้งาน showToast Component
    const { showToast } = useAppContext();
    // อ่านข้อมูลจาก API ที่กำหนด ด้วย useQuery
    const { data } = useQuery(
        "fetchMyHotelById", // ตั้งชื่อ Query นี้ว่า fetchMyHotelById
        () => apiClient.fetchMyHotelById(hotelId || ""), // เรียกใช้งาน API นี้ โดยถ้าไม่มีข้อมูล hotelId ส่งมาด้วยให้ส่งค่า "" แทน
        {
            enabled: !!hotelId, // กำหนดว่าให้ตรวจสอบ hotelId ว่ามีค่าถูกส่งมาด้วยก่อนจึงจะสามารถทำงานใน fetchMyHotelById ได้
        }
    );

    // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์ม ManageHotelForm นี้
    // useMutation จะใช้งานฟังก์ชัน updateMyHotelById ในไฟล์ api-client.ts
    // โดยเราจะระบุการทำงานในกรณีที่เรียกใช้งานฟังก์ชันสำเร็จ/ไม่สำเร็จ
    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
            showToast({ message: "บันทึกข้อมูลที่พักสำเร็จ!", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "บันทึกข้อมูลที่พักไม่สำเร็จ", type: "ERROR" });
        }
    });

    // เรากำหนดฟังก์ชันชื่อ handleSave ใน Add Hotel Form 
    // ให้ทำการเรียกใช้งาน mutate ซึ่งเรากำหนดให้ส่งข้อมูลไปยัง API Backend ด้วย apiClient.updateMyHotelById
    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData); // ส่งข้อมูล hotelFormData ไปทำงานในฟังก์ชัน updateMyHotelById
    };

    return (
        // ส่งข้อมูลที่พักด้วย data ไปยัง ManageHotelForm Component
        <ManageHotelForm hotel={data} onSave={handleSave} isLoading={isLoading} />
    )

};

export default EditHotel;