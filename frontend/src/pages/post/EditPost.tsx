// เราจะใช้ useParams จาก react-router-dom ในการรับ postId 
import { useNavigate, useParams } from "react-router-dom";
// เรียกใช้งาน API ในการรับข้อมูลบทความ
import * as apiClient from "../../api-client";
// เราจะใช้ useQuery ในการดึงข้อมูลผ่านทาง API มาแสดงในแบบฟอร์ม
// และเราจะใช้ useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์ม ManagePostForm นี้ 
import { useMutation, useQuery } from "react-query";
// เราจะเรียกใช้งาน showToast ในการแสดงข้อความแจ้งสถานะการทำงาน
import { useAppContext } from "../../contexts/AppContext";
import ManagePostForm from "../../forms/ManagePostForm/ManagePostForm";

const EditPost = () => {
    // รับ postId ที่ส่งผ่านทาง Link URL
    const { postId } = useParams();
    // เรียกใช้งาน showToast Component
    const { showToast } = useAppContext();
    // ใช้งาน useNavigate ในการไปยังหน้า "/my-post"
    const navigate = useNavigate();
    // อ่านข้อมูลจาก API ที่กำหนด ด้วย useQuery
    const { data } = useQuery(
        "fetchMyPostById", // ตั้งชื่อ Query นี้ว่า fetchMyPostById
        () => apiClient.fetchMyPostById(postId || ""), // เรียกใช้งาน API นี้ โดยถ้าไม่มีข้อมูล postId ส่งมาด้วยให้ส่งค่า "" แทน
        {
            enabled: !!postId, // กำหนดว่าให้ตรวจสอบ postId ว่ามีค่าถูกส่งมาด้วยก่อนจึงจะสามารถทำงานใน fetchMyPostById ได้
        }
    );

    // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์ม ManagePostForm นี้
    // useMutation จะใช้งานฟังก์ชัน updateMyPostById ในไฟล์ api-client.ts
    // โดยเราจะระบุการทำงานในกรณีที่เรียกใช้งานฟังก์ชันสำเร็จ/ไม่สำเร็จ
    const { mutate, isLoading } = useMutation(apiClient.updateMyPostById, {
        onSuccess: () => {
            showToast({ message: "บันทึกข้อมูลบทความสำเร็จ!", type: "SUCCESS" });
            navigate("/my-post"); // ไปยังหน้า "/my-post" เพื่อดูรายการบทความที่แก้ไข
        },
        onError: () => {
            showToast({ message: "บันทึกข้อมูลบทความไม่สำเร็จ", type: "ERROR" });
        }
    });

    // เรากำหนดฟังก์ชันชื่อ handleSave ใน Add Hotel Form 
    // ให้ทำการเรียกใช้งาน mutate ซึ่งเรากำหนดให้ส่งข้อมูลไปยัง API Backend ด้วย apiClient.updateMyHotelById
    const handleSave = (postFormData: FormData) => {
        mutate(postFormData); // ส่งข้อมูล hotelFormData ไปทำงานในฟังก์ชัน updateMyHotelById
    };

    return (
        // ส่งข้อมูลที่พักด้วย data ไปยัง ManageHotelForm Component
        <ManagePostForm post={data} onSave={handleSave} isLoading={isLoading} />
    )

};

export default EditPost;