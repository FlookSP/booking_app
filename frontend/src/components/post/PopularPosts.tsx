import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import { BlogPostCard } from "../../components";

const PopularPosts = () => {
    // สำหรับบทความที่เกี่ยวข้อง
    const searchPopularPostParams = {
        sortOption: "popularPostDesc",
    };

    // จะเริ่มต้นทำการค้นหาข้อมูลเมื่อโหลด Page นี้ โดยส่ง searchParams ไปยัง searchPosts เพื่อค้นหาข้อมูล
    const { data: popularPosts, isLoading, error } = useQuery(["searchPopularPostParams", searchPopularPostParams], () =>
        apiClient.searchPosts(searchPopularPostParams)
    );

    // สำหรับการเลื่อนบทความที่เกี่ยวข้อง
    let defaultTransform = 0;

    const goNextPopular = () => {
        defaultTransform = defaultTransform - 398;
        const sliderNextPopular = document.getElementById("sliderPopular");
        if (sliderNextPopular && Math.abs(defaultTransform) >= sliderNextPopular.scrollWidth / 1)
            defaultTransform = 0;

        if (sliderNextPopular) {
            sliderNextPopular.style.transform = "translateX(" + defaultTransform + "px)";
        }
    };

    const goPrevPopular = () => {
        const sliderPopular = document.getElementById("sliderPopular");
        if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
        else defaultTransform = defaultTransform + 398;
        if (sliderPopular) {
            sliderPopular.style.transform = "translateX(" + defaultTransform + "px)";
        }
    };

    if (isLoading) {
        return <p>กำลังโหลด...</p>;
    }

    if (error) {
        return <p>เกิดข้อผิดพลาด</p>;
    }

    return (

        <div className='flex flex-col justify-center items-center mt-3 ' >
            {/* ปุ่มเลื่อนซ้าย */}
            <button aria-label="slide backward" className="absolute z-30 left-0 ml-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prevPopular" onClick={goPrevPopular}>
                <HiChevronLeft className="text-gray-800 h-5 w-6 bg-white" />
            </button>
            <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden ">
                <div
                    id="sliderPopular"
                    className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700">
                    {popularPosts?.data.map((post, index) => (
                        <BlogPostCard key={"popular:" + post._id + index} post={post} />

                    ))}
                </div>
            </div>
            {/* ปุ่มเลื่อนขวา */}
            <button aria-label="slide forward" className="absolute z-30 right-0 mr-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="nextPopular" onClick={goNextPopular}>
                <HiChevronRight className="text-gray-800 h-5 w-6 bg-white" />
            </button>
        </div>
    )
}

export default PopularPosts