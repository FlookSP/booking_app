import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useForm } from "react-hook-form";
import { CommentFormData } from "../../shared/types";
import { usePostSearchContext } from "../../contexts/PostSearchContext";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";

// ระบุ Props ของ Object ที่ Component นี้จะรับเข้ามา 
type Props = {
    userId?: string;
    slug: string;
};

const CommentForm = ({ slug }: Props) => {
    const comment = usePostSearchContext(); // เรียกดูข้อมูลค้นหาที่ผู้ใช้งานระบุล่าสุดผ่าน Context API
    // ตรวจสอบว่าล็อกอินหรือยัง
    const { isLoggiedIn, showToast, userInfo } = useAppContext();
    // สำหรับการเปลี่ยนไปยัง Page อื่น ๆ
    const navigate = useNavigate();
    // เพื่อช่วยจำหน้าที่อยู่ในปัจจุบัน
    const location = useLocation();

    const {
        register, // เพิ่มตัวแปรใน React Hook Form
        handleSubmit, // จัดการกรณีผู้ใช้งานกดปุ่ม Submit
        formState: { errors }, // ตรวจสอบ Error จาก React Hook Form
    } = useForm<CommentFormData>({ // ใช้งาน React Hook Form และกำหนด Type ที่ใช้งานด้วย
        defaultValues: { // กำหนดค่า Default ของตัวแปรในฟอร์มด้วย defaultValues  
            content: comment ? comment.comment : "", // ผู้ใช้งานจะได้เห็นค่าที่ตนเองใส่ไปก่อนการล็อกอิน
        },
    });

    // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์ม CommentForm นี้
    // useMutation จะใช้งานฟังก์ชัน createComment ในไฟล์ api-client.ts
    // โดยเราจะระบุการทำงานในกรณีที่เรียกใช้งานฟังก์ชันสำเร็จ/ไม่สำเร็จ
    const { mutate } = useMutation(apiClient.createComment, {
        onSuccess: () => {
            showToast({ message: "บันทึกความคิดเห็นสำเร็จ!", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "บันทึกความคิดเห็นไม่สำเร็จ", type: "ERROR" });
        }
    });


    // ฟังก์ชันรองรับการทำงานกรณีที่ผู้ใช้งานกดปุ่ม "แสดงความคิดเห็น"
    const onSubmit = (data: CommentFormData) => {
        // ส่งข้อมูลไปเก็บยัง Backend
        mutate(data); // ส่งข้อมูล data ไปทำงานในฟังก์ชัน createComment

        // เรียกหน้าเดิมเพื่อดู Comment ที่เพิ่มเข้ามา
        // refresh
        navigate(0);
    };

    // ฟังก์ชันรองรับการทำงานกรณีที่ผู้ใช้งานกดปุ่ม "เข้าสู่ระบบเพื่อจอง"
    const onSignInClick = (data: CommentFormData) => {
        // เก็บค่าตัวแปรที่กรอกในแบบฟอร์ม
        comment.savePostSearchValues(
            "", // ตัวแปรที่เหลือกำหนดเป็น empty string
            "",
            1,
            data.content // เก็บเฉพาะ Comment ที่กรอกไว้ก่อนล็อกอิน
        );
        // state: { from: location } คือ เซฟที่อยู่ URL นี้ 
        // เพื่อให้สามารถ Click ย้อนกลับมาจากหน้า Sign In แล้วมาที่หน้าเดิมนี้ได้ โดยที่ค่าในแบบฟอร์มยังคงเดิม
        // รวมถึงหน้า SignIn ยังสามารถตรวจสอบได้ว่ามีการล็อกอินจากทางหน้านี้
        // เนื่องจากเรามีการกำหนด state ด้วย "react-router-dom"
        navigate("/sign-in", { state: { from: location } });
    };

    return (
        <div className="w-full mt-3">
            <form
                className="relative h-auto p-8 py-10 overflow-hidden bg-blue-100 border-b-1 border-blue-100 rounded shadow-sm px-7"
                onSubmit={
                    // เรียกใช้งานฟังก์ชันให้เหมาะสมตามสถานภาพการล็อกอิน
                    isLoggiedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
                }
            >
                <h3 className="mb-6 text-2xl font-medium text-start">แสดงความคิดเห็น</h3>
                <textarea
                    id="content"
                    rows={5}
                    className="border rounded w-full py-1 px-2 font-normal"
                    placeholder="เขียนความคิดเห็นของคุณ..."
                    {...register("content", { required: "ต้องระบุรายละเอียดความคิดเห็นเกี่ยวกับบทความ" })}
                >
                </textarea>
                {errors.content && (
                    <span className="text-red-500">{errors.content.message}</span>
                )}
                <span className="flex justify-end">
                    {/* เลือกแสดงปุ่มกดตามสถานะภาพการล็อกอิน */}
                    {isLoggiedIn ? (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500  w-fit rounded">
                            แสดงความคิดเห็น
                        </button>
                    ) : (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500  w-fit rounded">
                            เข้าสู่ระบบเพื่อแสดงความคิดเห็น
                        </button>
                    )}
                </span>
                <input
                    {...register("userId")} // กำหนดให้ส่ง hidden input field ชื่อ userId ไปใน Form นี้ด้วย
                    type="hidden"
                    value={userInfo?.userId} // กำหนด userId 
                />
                <input
                    {...register("slug")} // กำหนดให้ส่ง hidden input field ชื่อ slug ไปใน Form นี้ด้วย
                    type="hidden"
                    value={slug} // กำหนด slug 
                />
            </form>
        </div>

    )
}

export default CommentForm