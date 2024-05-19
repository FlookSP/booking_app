//import { useQuery } from "react-query";
import { CommentType } from "../../shared/types";
import * as apiClient from "../../api-client";
import { useEffect, useState } from "react";

// ระบุ Props ของ Object ที่ Component นี้จะรับเข้ามา 
type Props = {
    comment: CommentType;
};

const BlogCommentCard = ({ comment }: Props) => {

    /*const { data: user } = useQuery(
        "fetchAuthor", // ตั้งชื่อ Query นี้ว่า fetchAuthor
        () => apiClient.fetchAuthor(comment.userId), // เรียกใช้งาน API นี้ โดยถ้าไม่มีข้อมูล userId ส่งมาด้วยให้ส่งค่า "" แทน
        {
            enabled: !!comment, // กำหนดว่าให้ตรวจสอบ comment ว่ามีค่าถูกส่งมาด้วยก่อนจึงจะสามารถทำงานใน fetchAuthor ได้
        }
    );*/

    // สำหรับตรวจสอบชื่อ ทั้งนี้มี bug ใช้ useQuery ไม่สำเร็จ รอแก้ไข
    const [user, setUser] = useState('');

    useEffect(() => {
        async function fetUser() {
            try {
                const user = await apiClient.fetchAuthor(comment?.userId || "");
                setUser(user.email);
            } catch (e) {
                console.log(e);
            }
        }
        fetUser();
    }, [comment?.userId]);

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
        <div className="flex items-center w-full px-6 py-6 mx-auto mt-10 bg-white border border-gray-200 rounded-lg sm:px-8 md:px-12 sm:py-8 sm:shadow lg:w-5/6 ">

            <div className="w-[500px]"><h3 className="text-3xl font-semibold text-blue-500 sm:text-xl md:text-2xl"><b>โดย</b> {"  "}{user}</h3>
                <p className="text-sm font-semibold text-gray-300"><b>แสดงความคิดเห็นเมื่อ</b> {toThaiDateString(new Date(comment.updatedAt))}</p>
                <p className="mt-2 text-base text-gray-600 sm:text-lg md:text-normal">
                    {comment.content}</p>
            </div>

        </div>
    )
}

export default BlogCommentCard