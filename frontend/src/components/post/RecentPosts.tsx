import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import { BlogPostCard } from "../../components";
const RecentPosts = () => {
    const searchRecentPostParams = {
        recentPosts: "oneMonthPosts", // ขอบทความที่สร้างขึ้นมาใหม่ภายใน 1 เดือน
    };
    const { data: recentPosts, isLoading, error } = useQuery(["searchRecentPostParams", searchRecentPostParams], () =>
        apiClient.searchPosts(searchRecentPostParams)
    );

    // สำหรับการเลื่อนบทความที่เกี่ยวข้อง
    let defaultTransform = 0;
    const goNext = () => {
        defaultTransform = defaultTransform - 398;
        const sliderNext = document.getElementById("slider");
        if (sliderNext && Math.abs(defaultTransform) >= sliderNext.scrollWidth / 1)
            defaultTransform = 0;

        if (sliderNext) {
            sliderNext.style.transform = "translateX(" + defaultTransform + "px)";
        }
    };

    const goPrev = () => {
        const slider = document.getElementById("slider");
        if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
        else defaultTransform = defaultTransform + 398;
        if (slider) {
            slider.style.transform = "translateX(" + defaultTransform + "px)";
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
            <button aria-label="slide backward" className="absolute z-30 left-0 ml-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prev" onClick={goPrev}>
                <HiChevronLeft className="text-gray-800 h-5 w-6 bg-white" />
            </button>
            <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden ">
                <div
                    id="slider"
                    className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700">
                    {recentPosts?.data.map((post, index) => (
                        <BlogPostCard key={"recent:" + post._id + index} post={post} />

                    ))}

                </div>
            </div>
            {/* ปุ่มเลื่อนขวา */}
            <button aria-label="slide forward" className="absolute z-30 right-0 mr-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="next" onClick={goNext}>
                <HiChevronRight className="text-gray-800 h-5 w-6 bg-white" />
            </button>
        </div>
    )
}

export default RecentPosts