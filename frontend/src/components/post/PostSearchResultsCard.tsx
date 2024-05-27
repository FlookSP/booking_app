import { Link } from "react-router-dom";
import { PostType } from "../../shared/types";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";

type Props = {
    post: PostType;
};

const PostSearchResultsCard = ({ post }: Props) => {
    // ทำการอ่านที่อยู่ URL จากไฟล์ .env ใน Vite ด้วย import.meta
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
    // สร้าง URL สำหรับแสดงรูปภาพที่พัก
    const urls: string[] = [];
    if (post.imageUrls) {
        // Loop ข้อมูลแบบ FileList ด้วย Array.from แปลงเป็น Array ก่อน
        Array.from(post.imageUrls).forEach((name) => {
            urls.push(`${API_BASE_URL}/api/my-posts/file/${name}`);
        });
    }

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

    // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showModal
    const { showModal } = useAppContext();

    // เมื่อผู้ใช้งานลบที่พัก
    const handleDelete = (id: string) => {
        const postId = { postId: id };
        showModal({
            title: "ยืนยันการลบข้อมูลบทความ",
            message: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การดำเนินการนี้ไม่สามารถกู้คืนได้",
            type: "WARNING",
            id: postId,
            func: apiClient.deleteMyPostById,
        });

    };

    return (
        // lg:grid-cols-[2fr_3fr] คือ ถ้าเป็นหน้าจอขนาดใหญ่ ให้แสดงรูป และ รายละเอียดที่พัก ในแถวเดียวกัน (2 columns) 
        // โดยใช้พื้นที่แสดงรูป 2 ส่วน และใช้พื้นที่แสดงรายละเอียดที่พัก 3 ส่วน 
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] border border-slate-300 rounded-lg p-8 gap-8 mb-3">
            <div >
                <img
                    src={urls[0]} // แสดงเฉพาะรูปแรก
                    className="object-cover w-full h-40 col-span-1 bg-center"
                />
            </div>
            <div className="grid grid-cols-1">
                <div className="text-indigo-500 font-semibold text-base capitalize">
                    {post.category}
                </div>
                <div>
                    <Link
                        to={`/edit-post/${post._id}`}
                        className="text-2xl font-bold cursor-pointer"
                    >
                        {/* line-clamp คือ ตัดทอนข้อความและเพิ่มจุดไข่ปลา (...) ต่อท้ายตามขนาดความกว้างของพื้นที่โดยอัตโนมัติ ส่วน-1 คือ แสดง 1 บรรทัดแล้วตัด */}
                        <div className="line-clamp-1 text-2xl font-bold">{post.title}</div>
                    </Link>
                </div>
                <div className="text-xs font-light pb-3">
                    <p>ปรับปรุงล่าสุดเมื่อ {toThaiDateString(new Date(post.updatedAt))}</p>
                </div>
                <div>
                    {/* leading-6 คือ กำหนดระยะห่างระหว่างบรรทัดให้มากกว่าค่าปกติเล็กน้อย */}
                    <div className="leading-6 line-clamp-2 text-based">{post.content}</div>
                </div>
                <div className="flex gap-4 items-center border-t border-slate-400 mt-3"></div>
                <div className="flex flex-rows gap-3">
                    {/* จำนวนคนชมบทความ */}
                    <span className="flex gap-1 items-center text-sm group relative">
                        <div className="absolute bottom-[calc(100%+0.5rem)] left-[50%] -translate-x-[50%] hidden group-hover:block w-auto">
                            <div className="bottom-full right-0 rounded bg-black px-4 py-1 text-xs text-white whitespace-nowrap">
                                จำนวนการเข้าอ่านบทความ
                                <svg className="absolute left-0 top-full h-2 w-full text-black" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-blue-500 w-4 h-4 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        {post.view}
                    </span>
                    {/* จำนวนกดถูกใจ */}
                    <span className="flex gap-1 items-center text-sm group relative">
                        <div className="absolute bottom-[calc(100%+0.5rem)] left-[50%] -translate-x-[50%] hidden group-hover:block w-auto">
                            <div className="bottom-full right-0 rounded bg-black px-4 py-1 text-xs text-white whitespace-nowrap">
                                จำนวนการกดถูกใจ
                                <svg className="absolute left-0 top-full h-2 w-full text-black" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-red-500 w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        {post.like.length}
                    </span>
                    {/* จำนวน comment, group relative เพื่อการแสดง Tooltip */}
                    <span className="flex gap-1 items-center text-sm group relative">
                        <div className="absolute bottom-[calc(100%+0.5rem)] left-[50%] -translate-x-[50%] hidden group-hover:block w-auto">
                            <div className="bottom-full right-0 rounded bg-black px-4 py-1 text-xs text-white whitespace-nowrap">
                                จำนวนการแสดงความคิดเห็น
                                <svg className="absolute left-0 top-full h-2 w-full text-black" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-yellow-500 w-4 h-4 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        {post.comments.length}
                    </span>

                </div>
                <span className="flex justify-end gap-1">
                    <Link
                        to={"/my-post"}
                        onClick={() => { handleDelete(post._id); }}
                        className="px-5 py-2.5 text-base transition-all duration-200 hover:bg-red-500 hover:text-white focus:text-black focus:bg-yellow-300 font-semibold text-white bg-red-700 rounded w-fit mr-3"
                    >

                        ลบบทความ
                    </Link>
                    <Link
                        to={`/edit-post/${post._id}`}
                        className="bg-blue-600 text-white h-full p-2 font-bold max-w-fit hover:bg-blue-500 rounded"
                    >
                        รายละเอียดบทความ
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default PostSearchResultsCard