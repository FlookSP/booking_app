import { Link } from "react-router-dom";
import { PostType } from "../../shared/types";

// ระบุ Props ของ Object ที่ Component นี้จะรับเข้ามา 
type Props = {
    post: PostType;
};

const BlogPostCard = ({ post }: Props) => {
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

    return (
        <div className="flex flex-col flex-shrink-0 items-start col-span-12 overflow-hidden shadow-sm rounded-xl md:col-span-6 lg:col-span-4 w-[300px] h-auto">
            {/* reloadDocument คือ บอกให้ Link ทำการ Refresh หน้านี้ เพื่ออับเดตข้อมูลให้ทันสมัย */}
            <Link reloadDocument to={`/post-detail/${post.slug}`} className="block transition duration-200 ease-out transform hover:scale-110">
                <img className="object-cover w-[300px] shadow-sm h-[300px]" src={urls[0]} />
            </Link>
            <div className="relative flex flex-col items-start px-6 bg-white border border-t-0 border-gray-200 py-7 rounded-b-2xl w-[300px]">
                <div className="bg-red-400 absolute top-0 -mt-3 flex items-center px-3 py-1.5 leading-none w-auto inline-block rounded-full text-xs font-medium uppercase text-white inline-block">
                    <span>{post.category}</span>
                </div>
                <h2 className="text-base text-gray-500 font-bold sm:text-lg md:text-xl line-clamp-1 ">
                    <Link reloadDocument to={`/post-detail/${post.slug}`}>{post.title}</Link>
                </h2>

            </div>
        </div>
    )
}

export default BlogPostCard