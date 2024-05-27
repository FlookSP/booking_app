import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import * as apiClient from "../../api-client";
import { Pagination, ViewPostSearchResultsCard } from "../../components";
import { useState } from "react";
import { usePostSearchContext } from "../../contexts/PostSearchContext";

const PostCategory = () => {
    // การรับ slug จาก URL จะอาศัย useParams แทนการใช้ Props 
    const { category: post_category } = useParams();

    // ใช้งาน PostSearchContext
    const postSearch = usePostSearchContext();

    const recommendation = "ที่เที่ยวประเทศไทย มีเยอะมาก ๆ มีให้เที่ยวแบบหลากสไตล์ ทั้งเที่ยวทะเล เที่ยวภูเขา เที่ยวน้ำตก เที่ยวป่า หรือแม้แต่เที่ยวในเมืองเก๋ๆ ก็มีหมด";
    const promotion = "คุณรู้รึเปล่า? ว่ามีวิธีง่าย ๆ ที่ทำให้คุณได้ท่องเที่ยวประเทศไทยในราคาคุ้มค่า ด้วยดีลพิเศษและโปรโมชั่นเด็ดจาก ThaiVacationHub.com";
    const destination = "พิกัดเซิร์ฟสุดฮอตในเมืองไทย พร้อมอาหารจานเด็ดประจำถิ่น รวมถึงคำแนะนำอื่น ๆ ห้ามพลาด";
    const news = "ค้นพบและเติบโตไปพร้อมกับผู้ใช้งานอื่น ๆ";
    const etc = "บทความอื่น ๆ จากเรา";

    let content;
    if (post_category === "แนะนำท่องเที่ยว") {
        content = recommendation;
    }
    else if (post_category === "โปรโมชัน") {
        content = promotion;
    }
    else if (post_category === "ปลายทางยอดนิยม") {
        content = destination;
    }
    else if (post_category === "ข่าวสารและประกาศ") {
        content = news;
    }
    else {
        content = etc;
    }

    // สร้างและกำหนดค่าตัวแปรต่าง ๆ ใน Search Component โดยดูว่ามีการกรอกค่ามาแล้วหรือยัง
    const [description, setDescription] = useState<string>("");

    // ทำการสร้างข้อมูลค้นหาสำหรับเพื่อส่งไปยัง Backend APi
    const searchPostParams = {
        page: postSearch.page.toString(),
        description: description,
        category: post_category,
    };

    // จะเริ่มต้นทำการค้นหาข้อมูลเมื่อโหลด Page นี้ โดยส่ง searchParams ไปยัง searchPosts เพื่อค้นหาข้อมูล    
    const { data } = useQuery(["searchPosts", searchPostParams], () =>
        apiClient.searchPosts(searchPostParams)
    );

    // ถ้าผลลัพธ์ทั้งหมดมีแค่หน้าเดียว
    if (data && data?.pagination.pages === 1) {
        postSearch.savePostSearchValues(
            description,
            post_category ? post_category : "",
            1, // อับเดตหน้าที่อยู่ในปัจจุบันเป็นหน้าแรกเมื่อเลือกประเภทบทความใหม่เสมอ 
            "" // ส่วน comment
        );
    }

    return (
        <section className="w-full px-4 py-6 mx-auto max-w-7xl ">
            <div className="mb-3 text-left md:text-center">
                <h2 className="mb-2 text-4xl font-extrabold leading-tight text-gray-900">{post_category}</h2>
                <p className="text-lg text-gray-500">{content}</p>
            </div>
            <div className="px-6 py-8 ">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-5">
                    {/* ส่วน ประเภทบทความ */}
                    <div className="flex flex-col lg:block">
                        <div className="w-full p-2.5">
                            <h1 className="text-xl font-bold text-gray-700 md:text-2xl mb-3">ประเภทบทความ</h1>
                            <div className="flex flex-col max-w-sm px-4 mx-auto bg-white border border-slate-300 rounded-lg py-3">
                                <ul>
                                    <li><Link to={`/post-category/แนะนำท่องเที่ยว`} className="mx-1 font-bold text-gray-700 hover:text-blue-600 hover:underline">-
                                        แนะนำท่องเที่ยว</Link></li>
                                    <li className="mt-2"><Link to={`/post-category/โปรโมชัน`}
                                        className="mx-1 font-bold text-gray-700 hover:text-blue-600 hover:underline">-
                                        โปรโมชัน</Link></li>
                                    <li className="mt-2"><Link to={`/post-category/ปลายทางยอดนิยม`}
                                        className="mx-1 font-bold text-gray-700 hover:text-blue-600 hover:underline">-
                                        ปลายทางยอดนิยม</Link></li>
                                    <li className="flex items-center mt-2"><Link to={`/post-category/ข่าวสารและประกาศ`}
                                        className="mx-1 font-bold text-gray-700 hover:text-blue-600 hover:underline">-
                                        ข่าวสารและประกาศ</Link></li>
                                    <li className="flex items-center mt-2"><Link to={`/post-category/อื่น ๆ`}
                                        className="mx-1 font-bold text-gray-700 hover:text-blue-600 hover:underline">- อื่น ๆ</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* ส่วน บทความ */}
                    <div className="w-full ">
                        <div className="flex items-center justify-between mb-3">
                            <h1 className="text-xl font-bold text-gray-700 md:text-2xl">บทความ</h1>

                            <div className="relative w-[300px] justify-end max-lg:w-[250px]">
                                <input
                                    className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                    placeholder="ชื่อบทความหรือเนื้อหา"
                                    name="content"
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

                        {/* ส่วนแสดงรายละเอียดของบทความที่พบ */}
                        <div>
                            {data?.data.map((post, index) => (
                                <ViewPostSearchResultsCard key={index} post={post} />
                            ))}
                        </div>

                        {/* ส่วน Pagination ซึ่งจะเป็นการกำหนดค่าตัวแปร page ที่จะถูกส่งไปยัง Backend API */}
                        <div>
                            {post_category &&
                                <Pagination
                                    page={data?.pagination.page || 1} // หน้าปัจจุบัน
                                    pages={data?.pagination.pages || 1} // จำนวนหน้าทั้งหมด
                                    onPageChange={(page) => {
                                        postSearch.savePostSearchValues(
                                            description,
                                            post_category,
                                            page, // อับเดตหน้าที่อยู่ในปัจจุบันก่อนเข้าไปดูรายละเอียด
                                            "" // ส่วน comment
                                        );
                                    }} // เมื่อกดที่ปุ่ม จะเปลี่ยนค่าตัวแปร page ซึ่งมันจะถูกส่งไปยัง Backend โดยอัตโนมัต
                                />}
                        </div>

                    </div>

                </div>
            </div>

        </section>

    )
}

export default PostCategory