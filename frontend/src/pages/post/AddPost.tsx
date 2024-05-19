import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";
import { useMutation } from "react-query";
import ManagePostForm from "../../forms/ManagePostForm/ManagePostForm";

const AddPost = () => {
    // ใช้งาน useNavigate ในการไปยังหน้า "/my-post"
    const navigate = useNavigate();
    // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showToast
    const { showToast } = useAppContext();

    // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์ม ManagePostForm นี้
    // useMutation จะใช้งานฟังก์ชัน addPost ในไฟล์ api-client.ts
    // โดยเราจะระบุการทำงานในกรณีที่เรียกใช้งานฟังก์ชันสำเร็จ/ไม่สำเร็จ
    const { mutate, isLoading } = useMutation(apiClient.addPost, {
        onSuccess: () => {
            showToast({ message: "บันทึกข้อมูลบทความสำเร็จ!", type: "SUCCESS" });
            navigate("/my-post"); // ไปยังหน้า "/my-post" เพื่อดูรายการบทความที่เพิ่มเข้ามา
        },
        onError: () => {
            showToast({ message: "บันทึกข้อมูลบทความไม่สำเร็จ", type: "ERROR" });
        }
    });

    // เรากำหนดฟังก์ชันชื่อ handleSave ใน Add Post Form 
    // ให้ทำการเรียกใช้งาน mutate ซึ่งเรากำหนดให้ส่งข้อมูลไปยัง API Backend ด้วย apiClient.addPost
    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData); // ส่งข้อมูล hotelFormData ไปทำงานในฟังก์ชัน addHotel
    };

    return (
        <ManagePostForm onSave={handleSave} isLoading={isLoading} />
    )
}

export default AddPost