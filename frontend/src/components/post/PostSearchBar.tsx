import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostSearchContext } from "../../contexts/PostSearchContext";

type Props = {
    onDescriptionChange: (search: string) => void;
    onCategoryChange: (category: string) => void;
};

const PostSearchBar = ({ onDescriptionChange, onCategoryChange }: Props) => {
    const navigate = useNavigate();
    // ใช้งาน PostSearchContext
    const postSearch = usePostSearchContext();
    // สร้างและกำหนดค่าตัวแปรต่าง ๆ ใน Search Component โดยดูว่ามีการกรอกค่ามาแล้วหรือยัง
    const [description, setDescription] = useState<string>(postSearch?.description);
    const [category, setCategory] = useState<string>(postSearch?.category);

    // ฟังก์ชันเมื่อผู้ใช้งานกดปุ่มค้นหา
    const handleSubmit = (event: FormEvent) => {
        // ป้องกันไม่ให้ Form ทำการ Submit เองเมื่อผู้ใช้งาน Click ที่อื่น ๆ ในฟอร์มซึ่งไม่ใช่ปุ่มค้นหา
        event.preventDefault();
        // ทำการบันทึกรายละเอียดที่ผู้ใช้งานต้องการค้นหา
        onDescriptionChange(description);
        onCategoryChange(category);

        // เมื่อผู้ใช้งานกดปุ่มค้นหา ให้ไปยังหน้า Home Post Page ซึ่ง PostSearchBar Component จะส่งค่าค้นหาต่าง ๆ มาด้วยผ่านทาง context api 
        navigate("/my-post");
    };

    return (
        <div>
            <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
                <div className="flex">
                    <select
                        className="p-2 border rounded-s-lg w-fit text-sm"
                        value={category}
                        onChange={(event) => {
                            setCategory(event.target.value);
                        }
                        }
                    >
                        <option value="">ทุกประเภทบทความ</option>
                        {["ปลายทางยอดนิยม", "โปรโมชัน", "แนะนำท่องเที่ยว", "ข่าวสารและประกาศ", "อื่น ๆ"].map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>


                    <div className="relative w-full">
                        <input
                            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                            placeholder="ชื่อบทความหรือเนื้อหา"
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                        <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form >
        </div >
    )
}

export default PostSearchBar