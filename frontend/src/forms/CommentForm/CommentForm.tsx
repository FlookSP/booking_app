import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useForm } from "react-hook-form";
import { CommentFormData, CommentType } from "../../shared/types";
import { usePostSearchContext } from "../../contexts/PostSearchContext";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useEffect, useState } from "react";

// ระบุ Props ของ Object ที่ Component นี้จะรับเข้ามา 
type Props = {
    userId?: string;
    slug?: string;
    commented?: CommentType;
    postId?: string,
    commenting: boolean,
};

const CommentForm = ({ slug, commented, commenting, postId }: Props) => {
    const comment = usePostSearchContext(); // เรียกดูข้อมูลค้นหาที่ผู้ใช้งานระบุล่าสุดผ่าน Context API
    // ตรวจสอบว่าล็อกอินหรือยัง
    const { isLoggiedIn, showToast, userInfo } = useAppContext();
    // สำหรับการเปลี่ยนไปยัง Page อื่น ๆ
    const navigate = useNavigate();
    // เพื่อช่วยจำหน้าที่อยู่ในปัจจุบัน
    const location = useLocation();
    // สำหรับตรวจสอบว่าเป็นการแสดงความคิดเห็นที่เคยกรอกอยู่แล้วใช่หรือไม่
    const [isCommenting, setIsCommenting] = useState<boolean>(commenting || false);

    // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showModal
    const { showModal } = useAppContext();

    // อนุญาตให้ผู้ที่แสดงความคิดเห็นสามารถแก้ไขหรือลบความคิดเห็นได้
    const handleDelete = async () => {
        let commentInPost;
        if (commented && postId) {
            commentInPost = { postId: postId, commentId: commented._id };
            showModal({
                title: "ยืนยันการลบข้อมูลความคิดเห็น",
                message: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลความคิดเห็นนี้? การดำเนินการนี้ไม่สามารถกู้คืนได้",
                type: "WARNING",
                id: commentInPost,
                func: apiClient.deleteMyComment,
            });
        }

    };

    // สำหรับตรวจสอบชื่อ ทั้งนี้มี bug ใช้ useQuery ไม่สำเร็จ รอแก้ไข
    const [user, setUser] = useState('');
    useEffect(() => {
        async function fetUser() {
            try {
                const user = await apiClient.fetchAuthor(commented?.userId || "");
                setUser(user.email);
            } catch (e) {
                console.log("เกิดข้อผิดพลาดในระหว่างการอ่านชื่อผู้ Comment บทความ");
            }
        }
        fetUser();
    }, [commented?.userId]);

    const toThaiDateString = (date: Date) => {
        const monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม.",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        const year = date.getFullYear() + 543;
        const month = monthNames[date.getMonth()];
        const numOfDay = date.getDate();

        const hour = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const second = date.getSeconds().toString().padStart(2, "0");

        return `${numOfDay} ${month} ${year} ` + `เวลา ` +
            `${hour}:${minutes}:${second} น.`;
    };

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
    const { mutate } = useMutation(commenting ? apiClient.createComment : apiClient.editComment, {
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

        // เรียกหน้าเดิมเพื่อดู Comment ที่เพิ่มเข้ามา refresh
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
            {isCommenting ? (
                <form
                    className="relative h-auto p-8 py-10 overflow-hidden bg-blue-100 border-b-1 border-blue-100 rounded shadow-sm px-7"
                    onSubmit={
                        // เรียกใช้งานฟังก์ชันให้เหมาะสมตามสถานภาพการล็อกอิน
                        isLoggiedIn ?
                            // เรียกใช้งานฟังก์ชันให้เหมาะสมตามรูปแบบ เช่น กรณแก้ไข Comment ที่มีอยู่แล้ว จะเรียก onEditComment 
                            handleSubmit(onSubmit) : handleSubmit(onSignInClick)
                    }
                >
                    <h3 className="mb-6 text-2xl font-medium text-start">แสดงความคิดเห็น</h3>
                    <textarea
                        id="content"
                        rows={5}
                        className="border rounded w-full py-1 px-2 font-normal"
                        placeholder={commented?.content}
                        {...register("content", { required: "ต้องระบุรายละเอียดความคิดเห็นเกี่ยวกับบทความ" })}
                    >
                    </textarea>
                    {errors.content && (
                        <span className="text-red-500">{errors.content.message}</span>
                    )}
                    <span className="flex justify-end">
                        {/* เลือกแสดงปุ่มกดตามสถานะภาพการล็อกอิน */}
                        {isLoggiedIn && userInfo && userInfo.userId ? (
                            <>
                                {/* แสดงปุ่ม "ยกเลิกการแสดงความคิดเห็น" นี้เฉพาะในแบบฟอร์มตรงส่วนแสดงรายการความคิดเห็นเท่านั้น */}
                                {!commenting &&
                                    <button
                                        onClick={() => { setIsCommenting(false); navigate(0); }}
                                        className="p-2 text-sm transition-all duration-200 hover:bg-red-500 hover:text-white focus:text-black focus:bg-yellow-300 font-bold text-white bg-red-700 rounded w-fit mr-3"
                                    >
                                        ยกเลิกการแสดงความคิดเห็น
                                    </button>}
                                <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500  w-fit rounded"
                                >
                                    แสดงความคิดเห็น
                                </button></>
                        ) : (
                            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500  w-fit rounded">
                                เข้าสู่ระบบเพื่อแสดงความคิดเห็น
                            </button>
                        )}
                    </span>
                    {userInfo && <input
                        {...register("userId")} // กำหนดให้ส่ง hidden input field ชื่อ userId ไปใน Form นี้ด้วย
                        type="hidden"
                        value={userInfo.userId} // กำหนด userId 
                    />}
                    <input
                        {...register("slug")} // กำหนดให้ส่ง hidden input field ชื่อ slug ไปใน Form นี้ด้วย
                        type="hidden"
                        value={slug} // กำหนด slug 
                    />
                    <input
                        {...register("postId")} // กำหนดให้ส่ง hidden input field ชื่อ slug ไปใน Form นี้ด้วย
                        type="hidden"
                        value={postId} // กำหนด slug 
                    />
                    {commented && <input
                        {...register("commentId")} // กำหนดให้ส่ง hidden input field ชื่อ slug ไปใน Form นี้ด้วย
                        type="hidden"
                        value={commented._id} // กำหนด slug 
                    />}
                </form>
            ) :
                // ใช้สำหรับแสดงความเห็นที่เคยแสดงไว้เท่านั้น
                (<>
                    <form
                        className="relative h-auto p-8 py-10 overflow-hidden bg-white border border-gray-200 rounded shadow-sm px-7"
                    >
                        <h3 className="mb-1 text-3xl font-semibold text-blue-500 max-sm:text-lg md:text-xl text-start"><b>โดย</b> {"  "}{user}</h3>
                        {commented && <p className="text-sm font-semibold text-gray-500 mb-1"><b>แสดงความคิดเห็นเมื่อ</b> {toThaiDateString(new Date(commented.updatedAt))}</p>}
                        <textarea
                            id="content"
                            rows={5}
                            className="border rounded w-full py-1 px-2 font-normal bg-gray"
                            placeholder={commented?.content}
                            disabled={!isCommenting}

                        >
                        </textarea>
                        {errors.content && (
                            <span className="text-red-500">{errors.content.message}</span>
                        )}
                        <span className="flex justify-end">
                            {/* เลือกแสดงปุ่มกดตามสถานะภาพการล็อกอิน */}
                            {isLoggiedIn && commented && userInfo && commented.userId === userInfo.userId ? (<>
                                <span className="flex justify-end gap-1">
                                    <Link
                                        onClick={() => { handleDelete(); }}
                                        className="p-2 text-sm transition-all duration-200 hover:bg-red-500 hover:text-white focus:text-black focus:bg-yellow-300 font-semibold text-white bg-red-700 rounded w-fit mr-3"
                                        to={"#"}                                    >
                                        ลบความคิดเห็น
                                    </Link>
                                    <Link
                                        onClick={() => { setIsCommenting(true) }}
                                        className="bg-blue-600 text-sm text-white h-full p-2 font-bold max-w-fit hover:bg-blue-500 rounded"
                                        to={"#"}
                                    >
                                        แก้ไขความคิดเห็น
                                    </Link>
                                </span>
                            </>) : (<></>)}
                        </span>
                    </form>
                </>)
            }
        </div>

    )
}

export default CommentForm