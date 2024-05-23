import { CommentType } from "../../shared/types";
import * as apiClient from "../../api-client";
import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";

// ระบุ Props ของ Object ที่ Component นี้จะรับเข้ามา 
type Props = {
    postId: string,
    comment: CommentType;
};

const BlogCommentCard = ({ postId, comment }: Props) => {

    // สำหรับตรวจสอบชื่อ ทั้งนี้มี bug ใช้ useQuery ไม่สำเร็จ รอแก้ไข
    const [user, setUser] = useState('');

    // สำหรับตรวจสอบว่าล็อกอินก่อนแก้ไขความคิดเห็น
    const { isLoggiedIn, userInfo, showToast } = useAppContext();

    useEffect(() => {
        async function fetUser() {
            try {
                const user = await apiClient.fetchAuthor(comment?.userId || "");
                setUser(user.email);
            } catch (e) {
                console.log("เกิดข้อผิดพลาดในระหว่างการอ่านชื่อผู้ Comment บทความ");
            }
        }
        fetUser();
    }, [comment?.userId]);

    // อนุญาตให้ผู้ที่แสดงความคิดเห็นสามารถแก้ไขหรือลบความคิดเห็นได้
    const handleDelete = async () => {
        const commentInPost = { postId: postId, commentId: comment._id };
        try {
            await apiClient.deleteMyComment(commentInPost);
            window.location.reload();
        }
        catch (e) {
            showToast({ message: "เกิดข้อผิดพลาดในระหว่างการลบความคิดเห็นในบทความ", type: "ERROR" });
        }
    };

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

    return (
        <div className="items-center px-3 py-6 mt-10 bg-white border border-gray-200 rounded-lg sm:py-8 sm:shadow overflow-hidden">
            <h3 className="text-3xl font-semibold text-blue-500 max-sm:text-lg md:text-xl"><b>โดย</b> {"  "}{user}</h3>
            <p className="text-sm font-semibold text-gray-300"><b>แสดงความคิดเห็นเมื่อ</b> {toThaiDateString(new Date(comment.updatedAt))}</p>
            <p className="mt-2 text-base text-gray-600 sm:text-lg md:text-normal mb-3">
                {comment.content}</p>
            {(isLoggiedIn && comment?.userId === userInfo?.userId) ?
                (<>
                    <span className="flex justify-end gap-1">
                        <button
                            onClick={handleDelete}
                            className="p-2 text-sm transition-all duration-200 hover:bg-red-500 hover:text-white focus:text-black focus:bg-yellow-300 font-semibold text-white bg-red-700 rounded w-fit mr-3"
                        >

                            ลบความคิดเห็น
                        </button>
                        <button
                            className="bg-blue-600 text-sm text-white h-full p-2 font-bold max-w-fit hover:bg-blue-500 rounded"
                        >
                            แก้ไขความคิดเห็น
                        </button>
                    </span>
                </>) :
                (<>
                </>)}
        </div>

    )
}

export default BlogCommentCard