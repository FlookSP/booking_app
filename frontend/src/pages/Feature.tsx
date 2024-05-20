import { Link } from "react-router-dom"
import { post_one, post_two, post_three, gmail } from "../assets"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { BlogPostCard } from "../components";

const Feature = () => {
    // สำหรับบทความที่เกี่ยวข้อง
    const searchPostParams = {
        page: "",
        userId: "",
        description: "",
        category: "",
    };

    // จะเริ่มต้นทำการค้นหาข้อมูลเมื่อโหลด Page นี้ โดยส่ง searchParams ไปยัง searchPosts เพื่อค้นหาข้อมูล
    const { data: posts } = useQuery(["searchPosts", searchPostParams], () =>
        apiClient.searchPosts(searchPostParams)
    );

    // สำหรับการเลื่อนบทความที่เกี่ยวข้อง
    let defaultTransform = 0;

    const goNext = () => {
        defaultTransform = defaultTransform - 398;
        const slider = document.getElementById("slider");
        if (slider && Math.abs(defaultTransform) >= slider.scrollWidth / 1.7)
            defaultTransform = 0;

        if (slider) {
            slider.style.transform = "translateX(" + defaultTransform + "px)";
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

    const goNextPopular = () => {
        defaultTransform = defaultTransform - 398;
        const sliderPopular = document.getElementById("sliderPopular");
        if (sliderPopular && Math.abs(defaultTransform) >= sliderPopular.scrollWidth / 1.7)
            defaultTransform = 0;

        if (sliderPopular) {
            sliderPopular.style.transform = "translateX(" + defaultTransform + "px)";
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

    return (
        <div className="container mx-auto">
            {/* featured section */}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
                {/* main post */}
                <div className="mb-4 lg:mb-0  p-4 lg:p-0 w-full md:w-4/7 relative rounded block">
                    <img src="https://images.unsplash.com/photo-1427751840561-9852520f8ce8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60" className="rounded-md object-cover w-full h-64" />
                    <span className="text-blue-600 text-base block mt-4"> ข่าวสารและประกาศ </span>
                    <h1 className="text-gray-800 text-4xl font-bold mt-2 mb-2 leading-tight">
                        ค้นพบและเติบโตไปพร้อมกับผู้ใช้งานอื่น ๆ
                    </h1>
                    <p className="text-gray-600 mb-4">
                        เข้าร่วมฟอรัมอย่างเป็นทางการของเรา
                    </p>
                    <Link to="/forum" className="inline-flex items-center px-6 py-4 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full  hover:bg-yellow-400 focus:bg-yellow-400">
                        อ่านเพิ่มเติม
                    </Link>
                </div>

                {/* sub-main posts  */}
                <div className="w-full md:w-4/7">
                    {/*<!-- post 1 -->*/}
                    <div className="rounded w-full flex flex-col sm:flex-row mb-10">
                        <img src={post_three} className=" block md:hidden lg:block rounded-md h-64 md:h-32 m-4 md:m-0" />
                        <div className="bg-white rounded px-4 lg:mt-0 sm:mt-4 ">
                            <span className="text-blue-600 text-sm block"> แนะนำท่องเที่ยว </span>
                            <div className="md:mt-0 text-black font-semibold text-xl mb-2">
                                เที่ยวไทยไปไหนดี รวมลายแทงสถานที่ท่องเที่ยวในไทยยอดฮิต สนุกครบรส เที่ยวเพลินทุกภาค
                            </div>
                            <p className="block md:hidden p-2 pl-0 pt-1 text-base text-gray-600">
                                ที่เที่ยวประเทศไทย มีเยอะมาก ๆ มีให้เที่ยวแบบหลากสไตล์ ทั้งเที่ยวทะเล เที่ยวภูเขา เที่ยวน้ำตก เที่ยวป่า หรือแม้แต่เที่ยวในเมืองเก๋ๆ ก็มีหมด
                            </p>
                            <Link
                                to="/recommendation"
                                title=""
                                className="inline-flex items-center justify-center pb-0.5 -mt-1 lg:text-sm max-lg:font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
                            >
                                อ่านต่อ
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/*<!-- post 2 -->*/}

                    <div className="rounded w-full flex flex-col sm:flex-row mb-10 ">
                        <img src={post_two} className="block md:hidden lg:block rounded-md h-64 md:h-32 m-4 md:m-0 " />
                        <div className="bg-white rounded px-4 lg:mt-0 sm:mt-4 ">
                            <span className="text-blue-600  text-sm block"> โปรโมชัน </span>
                            <div className="md:mt-0 text-gray-800 font-semibold text-xl mb-2">
                                รวมโปรโมชั่นเด็ดจาก ThaiVacationHub.com
                            </div>
                            <p className="block md:hidden p-2 pl-0 pt-1 text-base text-gray-600">
                                คุณรู้รึเปล่า? ว่ามีวิธีง่าย ๆ ที่ทำให้คุณได้ท่องเที่ยวประเทศไทยในราคาคุ้มค่า ด้วยดีลพิเศษและโปรโมชั่นเด็ดจาก ThaiVacationHub.com
                            </p>
                            <Link
                                to="/promotion"
                                title=""
                                className="inline-flex items-center justify-center pb-0.5 -mt-1 lg:text-sm max-lg:font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
                            >
                                อ่านต่อ
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    {/*<!-- post 3 -->*/}
                    <div className="rounded w-full flex flex-col sm:flex-row mb-10 ">
                        <img src={post_one} className="block md:hidden lg:block rounded-md h-64 md:h-32 m-4 md:m-0 " />
                        <div className="bg-white rounded px-4 lg:mt-0 sm:mt-4 ">
                            <span className="text-blue-600 text-sm block"> ปลายทางยอดนิยม </span>
                            <div className="md:mt-0 text-gray-800 font-semibold text-xl mb-2">
                                เมืองท่องเที่ยวยอดนิยมในไทยที่นักท่องเที่ยวค้นหาข้อมูลผ่านออนไลน์มากที่สุด
                            </div>
                            <p className="block md:hidden p-2 pl-0 pt-1 text-base text-gray-600">
                                พิกัดเซิร์ฟสุดฮอตในเมืองไทย พร้อมอาหารจานเด็ดประจำถิ่น รวมถึงคำแนะนำอื่น ๆ ห้ามพลาด
                            </p>
                            <Link
                                to="/destination"
                                title=""
                                className="inline-flex items-center justify-center pb-0.5 -mt-1 lg:text-sm max-lg:font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
                            >
                                อ่านต่อ
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
            {/*<!-- end featured section -->*/}

            {/*<!-- recent posts -->*/}
            <div className="flex mt-16 mb-4 px-4 lg:px-0 items-center justify-between">
                <h2 className="font-bold text-3xl">โพสต์ล่าสุด</h2>
                <Link to="/recent-posts" className="bg-gray-200 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer">
                    ดูทั้งหมด
                </Link>
            </div>

            {/* ส่วนแสดงบทความที่เกี่ยวข้อง */}
            <div className='flex flex-col justify-center items-center mt-3 ' >
                {/* ปุ่มเลื่อนซ้าย */}
                <button aria-label="slide backward" className="absolute z-30 left-0 ml-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prev" onClick={goPrev}>
                    <HiChevronLeft className="text-gray-800 h-5 w-6" />
                </button>
                <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden ">
                    <div
                        id="slider"
                        className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700">
                        {posts && posts.data.map((post, index) => (<>
                            <BlogPostCard key={index} post={post} />
                        </>
                        ))}

                    </div>
                </div>
                {/* ปุ่มเลื่อนขวา */}
                <button aria-label="slide forward" className="absolute z-30 right-0 mr-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="next" onClick={goNext}>
                    <HiChevronRight className="text-gray-800 h-5 w-6" />
                </button>
            </div>

            {/*<!-- subscribe -->*/}
            <div className="rounded flex md:shadow mt-12">
                <img src={gmail} className="w-0 md:w-1/4 object-cover rounded-l" />
                <div className="px-4 py-2">
                    <h3 className="text-3xl text-gray-800 font-bold">สมัครรับจดหมายข่าว</h3>
                    <p className="text-xl text-gray-700">เราส่งข่าวสารและโพสต์ล่าสุด รวมถึงโปรโมชั่นเด็ดจากทาง ThaiVacationHub.com สัปดาห์ละครั้ง สดจากเตา!</p>
                    <form className="mt-4 mb-10">
                        <input type="email" className="rounded bg-gray-100 px-4 py-2 border focus:border-green-400" placeholder="example@youremail.com" required />
                        <button className="px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 text-gray-100">
                            สมัครรับจดหมายข่าว
                            <i className='bx bx-right-arrow-alt' ></i>
                        </button>
                        <p className="text-blue-900 font-semibold opacity-50 text-sm mt-1">เราสัญญาว่าไม่มีสแปม</p>
                    </form>
                </div>
            </div>
            {/*!-- ens subscribe section -->/}



      {/*!-- popular posts --*/}
            <div className="flex mt-16 mb-4 px-4 lg:px-0 items-center justify-between">
                <h2 className="font-bold text-3xl">โพสต์ยอดนิยม</h2>
                <Link to="/popular-posts" className="bg-gray-200 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer">
                    ดูทั้งหมด
                </Link>
            </div>
            {/* ส่วนแสดงบทความที่เกี่ยวข้อง */}
            <div className='flex flex-col justify-center items-center mt-3 ' >
                {/* ปุ่มเลื่อนซ้าย */}
                <button aria-label="slide backward" className="absolute z-30 left-0 ml-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prevPopular" onClick={goPrevPopular}>
                    <HiChevronLeft className="text-gray-800 h-5 w-6" />
                </button>
                <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden ">
                    <div
                        id="sliderPopular"
                        className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700">

                        {posts && posts.data.map((post, index) => (<>
                            <BlogPostCard key={index} post={post} />
                        </>
                        ))}
                    </div>
                </div>
                {/* ปุ่มเลื่อนขวา */}
                <button aria-label="slide forward" className="absolute z-30 right-0 mr-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="nextPopular" onClick={goNextPopular}>
                    <HiChevronRight className="text-gray-800 h-5 w-6" />
                </button>
            </div>
        </div>
    )
}

export default Feature