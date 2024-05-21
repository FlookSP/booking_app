// ใช้ useQuery ในการเรียกดูข้อมูลจากทาง Backend API
import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { Link } from "react-router-dom";
import { Pagination, PostSearchBar, PostSearchResultsCard } from "../../components";
import { useState } from "react";
import { usePostSearchContext } from "../../contexts/PostSearchContext";

const HomePostPage = () => {
    // ใช้งาน PostSearchContext
    const postSearch = usePostSearchContext();

    // เพื่อตรวจสอบหมายเลขไอดีของผู้ใช้งาน
    const { userInfo } = useAppContext();

    // สร้างและกำหนดค่าตัวแปรต่าง ๆ ใน Search Component โดยดูว่ามีการกรอกค่ามาแล้วหรือยัง
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");

    // ทำการสร้างข้อมูลค้นหาสำหรับเพื่อส่งไปยัง Backend APi
    const searchPostParams = {
        page: postSearch.page.toString(),
        userId: userInfo?.userId,
        description: description,
        category: category,
    };

    // จะเริ่มต้นทำการค้นหาข้อมูลเมื่อโหลด Page นี้ โดยส่ง searchParams ไปยัง searchPosts เพื่อค้นหาข้อมูล    
    const { data } = useQuery(["searchPosts", searchPostParams], () =>
        apiClient.searchPosts(searchPostParams)
    );

    return (
        // เพิ่มระยะซ้าย-ขวาแบบ container 
        <div className="container mx-auto">
            {/* แสดงชื่อแบบฟอร์มและปุ่มเพิ่มที่พักให้อยู่ในบรรทัดเดียวกัน */}
            <span className="flex justify-between mb-4">
                <h1 className="text-3xl font-bold">บทความของท่าน</h1>

                <Link to="/add-post" className="items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-blue-500 hover:text-white focus:text-black focus:bg-yellow-300 font-semibold text-white bg-blue-700 rounded w-fit">เพิ่มบทความ</Link>
            </span>
            <PostSearchBar onDescriptionChange={setDescription} onCategoryChange={setCategory} />
            {/* ส่วนแสดงรายการบทความ */}
            <div className="flex flex-col gap-8 container mx-auto mt-3">
                {/* ถ้ายังไม่ได้ใส่ข้อมูลบทความเลย */}
                {(data?.data.length === 0) ? (<>
                    <div className="flex items-center justify-center border border-slate-300 rounded-sm p-3 bg-blue-100 text-black-100 font-semibold">
                        ไม่พบบทความ
                    </div>
                </>)
                    // ถ้าใส่ข้อมูลบทความแล้ว
                    : (<>
                        {/* ส่วนแสดงรายละเอียดของที่พักที่พบ */}
                        <div>
                            {data?.data.map((post, index) => (
                                <PostSearchResultsCard key={index} post={post} />
                            ))}
                        </div>
                        {/* ส่วน Pagination ซึ่งจะเป็นการกำหนดค่าตัวแปร page ที่จะถูกส่งไปยัง Backend API */}
                        <div>
                            <Pagination
                                page={data?.pagination.page || 1} // หน้าปัจจุบัน
                                pages={data?.pagination.pages || 1} // จำนวนหน้าทั้งหมด
                                onPageChange={(page) => {
                                    postSearch.savePostSearchValues(
                                        description,
                                        category,
                                        page, // อับเดตหน้าที่อยู่ในปัจจุบันก่อนเข้าไปดูรายละเอียด
                                        "" // ส่วน comment
                                    );
                                }} // เมื่อกดที่ปุ่ม จะเปลี่ยนค่าตัวแปร page ซึ่งมันจะถูกส่งไปยัง Backend โดยอัตโนมัต
                            />
                        </div>
                    </>)
                }

            </div>
        </div>
    )
}

export default HomePostPage