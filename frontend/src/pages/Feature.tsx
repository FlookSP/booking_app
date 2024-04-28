import { Link } from "react-router-dom"
import { post_one, post_two, post_three, gmail } from "../assets"

const Feature = () => {
    return (
        <div className="container mx-auto">
            {/* featured section */}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
                {/* main post */}
                <div className="mb-4 lg:mb-0  p-4 lg:p-0 w-full md:w-4/7 relative rounded block">
                    <img src="https://images.unsplash.com/photo-1427751840561-9852520f8ce8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60" className="rounded-md object-cover w-full h-64" />
                    <span className="text-blue-600 text-base hidden md:block mt-4"> ข่าวสารและประกาศ </span>
                    <h1 className="text-gray-800 text-4xl font-bold mt-2 mb-2 leading-tight">
                        ค้นพบและเติบโตไปพร้อมกับผู้ใช้งานอื่น ๆ
                    </h1>
                    <p className="text-gray-600 mb-4">
                        เข้าร่วมฟอรัมอย่างเป็นทางการของเรา
                    </p>
                    <Link to="#" className="inline-flex items-center px-6 py-4 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full  hover:bg-yellow-400 focus:bg-yellow-400">
                        อ่านเพิ่มเติม
                    </Link>
                </div>

                {/* sub-main posts  */}
                <div className="w-full md:w-4/7">
                    {/*<!-- post 1 -->*/}
                    <div className="rounded w-full flex flex-col md:flex-row mb-10">
                        <img src={post_three} className=" block md:hidden lg:block rounded-md h-64 md:h-32 m-4 md:m-0" />
                        <div className="bg-white rounded px-4">
                            <span className="text-blue-600 text-sm hidden md:block"> แนะนำท่องเที่ยว </span>
                            <div className="md:mt-0 text-black font-semibold text-xl mb-2">
                                เที่ยวไทยไปไหนดี รวมลายแทงสถานที่ท่องเที่ยวในไทยยอดฮิต สนุกครบรส เที่ยวเพลินทุกภาค
                            </div>
                            <p className="block md:hidden p-2 pl-0 pt-1 text-sm text-gray-600">
                                ที่เที่ยวประเทศไทย มีเยอะมาก ๆ มีให้เที่ยวแบบหลากสไตล์ ทั้งเที่ยวทะเล เที่ยวภูเขา เที่ยวน้ำตก เที่ยวป่า หรือแม้แต่เที่ยวในเมืองเก๋ๆ ก็มีหมด
                            </p>
                            <Link
                                to="#"
                                title=""
                                className="inline-flex items-center justify-center pb-0.5 -mt-1 text-sm  text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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

                    <div className="rounded w-full flex flex-col md:flex-row mb-10 ">
                        <img src={post_two} className="block md:hidden lg:block rounded-md h-64 md:h-32 m-4 md:m-0 " />
                        <div className="bg-white rounded px-4">
                            <span className="text-blue-600  text-sm hidden md:block"> โปรโมชัน </span>
                            <div className="md:mt-0 text-gray-800 font-semibold text-xl mb-2">
                                รวมโปรโมชั่นเด็ดจาก ThaiVacationHub.com
                            </div>
                            <p className="block md:hidden p-2 pl-0 pt-1 text-sm text-gray-600">
                                คุณรู้รึเปล่า? ว่ามีวิธีง่าย ๆ ที่ทำให้คุณได้ท่องเที่ยวประเทศไทยในราคาคุ้มค่า ด้วยดีลพิเศษและโปรโมชั่นเด็ดจาก ThaiVacationHub.com
                            </p>
                            <Link
                                to="#"
                                title=""
                                className="inline-flex items-center justify-center pb-0.5 -mt-1 text-sm text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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
                    <div className="rounded w-full flex flex-col md:flex-row mb-10 ">
                        <img src={post_one} className="block md:hidden lg:block rounded-md h-64 md:h-32 m-4 md:m-0 " />
                        <div className="bg-white rounded px-4">
                            <span className="text-blue-600  text-sm hidden md:block"> ปลายทางยอดนิยม </span>
                            <div className="md:mt-0 text-gray-800 font-semibold text-xl mb-2">
                                เมืองท่องเที่ยวยอดนิยมในไทยที่นักท่องเที่ยวค้นหาข้อมูลผ่านออนไลน์มากที่สุด
                            </div>
                            <p className="block md:hidden p-2 pl-0 pt-1 text-sm text-gray-600">
                                พิกัดเซิร์ฟสุดฮอตในเมืองไทย พร้อมอาหารจานเด็ดประจำถิ่น รวมถึงคำแนะนำอื่น ๆ ห้ามพลาด
                            </p>
                            <Link
                                to="#"
                                title=""
                                className="inline-flex items-center justify-center pb-0.5 -mt-1 text-sm text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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
                <Link to="#" className="bg-gray-200 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer">
                    ดูทั้งหมด
                </Link>
            </div>

            <div className="grid max-w-md grid-cols-1 gap-6 mx-auto mt-8 lg:mt-16 lg:grid-cols-3 lg:max-w-full">
                <div className="overflow-hidden bg-white rounded shadow">
                    <div className="p-5">
                        <div className="relative">
                            <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                                <img
                                    className="object-cover w-full h-full"
                                    src={post_one}
                                    alt=""
                                />
                            </Link>

                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                                    {" "}
                                    ไลฟ์สไตล์{" "}
                                </span>
                            </div>
                        </div>
                        <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                            {" "}
                            โดย นายเอ, 27 มีนาคม 2567{" "}
                        </span>
                        <p className="mt-5 text-2xl font-semibold">
                            <Link to="#" title="" className="text-black">
                                {" "}
                                10 ที่เที่ยวเชียงใหม่ ถ้าไม่ไปถือว่าพลาด!{" "}
                            </Link>
                        </p>
                        <p className="mt-4 text-base text-gray-600">
                            ลองตามไปดูกันว่า 10
                            ที่เที่ยวเชียงใหม่ยอดฮิตที่เรานำมาฝากนี้เพื่อน ๆ
                            เคยไปมาแล้วหรือยัง ถ้ายังบอกเลยว่าพลาดมาก ต้องไปตามเก็บให้ครบนะ
                        </p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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

                <div className="overflow-hidden bg-white rounded shadow">
                    <div className="p-5">
                        <div className="relative">
                            <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                                <img
                                    className="object-cover w-full h-full"
                                    src={post_two}
                                    alt=""
                                />
                            </Link>

                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                                    {" "}
                                    การตลาด{" "}
                                </span>
                            </div>
                        </div>
                        <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                            {" "}
                            โดย นายบี, 27 มีนาคม 2567{" "}
                        </span>
                        <p className="mt-5 text-2xl font-semibold">
                            <Link to="#" title="" className="text-black">
                                {" "}
                                เคล็ดลับยอดนิยมในการทำการตลาดโรงแรมของคุณให้เร็วขึ้นและดีขึ้น{" "}
                            </Link>
                        </p>
                        <p className="mt-4 text-base text-gray-600">
                            การตลาดเป็นสิ่งสำคัญที่ช่วยเพิ่มยอดขายให้กับธุรกิจ
                            โดยเฉพาะในยุคปัจจุบันที่สื่อออนไลน์มีความสำคัญเป็นอย่างมาก
                            ดังนั้นการตลาดที่ดีจึงเป็นสิ่งที่จำเป็น
                        </p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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

                <div className="overflow-hidden bg-white rounded shadow">
                    <div className="p-5">
                        <div className="relative">
                            <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                                <img
                                    className="object-cover w-full h-full"
                                    src={post_three}
                                    alt=""
                                />
                            </Link>

                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                                    {" "}
                                    เทศกาล{" "}
                                </span>
                            </div>
                        </div>
                        <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                            {" "}
                            โดย นายซี, 27 มีนาคม 2567{" "}
                        </span>
                        <p className="mt-5 text-2xl font-semibold">
                            <Link to="#" title="" className="text-black">
                                {" "}
                                เสน่ห์ของเทศกาล และ ประเพณีอีสาน{" "}
                            </Link>
                        </p>
                        <p className="mt-4 text-base text-gray-600">
                            ภาคอีสานเป็นแหล่งอารยธรรมโบราณ
                            มีวัฒนธรรมประเพณีและความเชื่อที่มีความหลากหลายแตกต่างกันไปในแต่ละท้องถิ่นและโดดเด่นจากภาคอื่น
                            ๆ อย่างชัดเจน
                        </p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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
            {/*<!-- end recent posts -->*/}

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
                <Link to="#" className="bg-gray-200 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer">
                    ดูทั้งหมด
                </Link>
            </div>
            <div className="grid max-w-md grid-cols-1 gap-6 mx-auto mt-8 lg:mt-16 lg:grid-cols-3 lg:max-w-full">
                <div className="overflow-hidden bg-white rounded shadow">
                    <div className="p-5">
                        <div className="relative">
                            <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                                <img
                                    className="object-cover w-full h-full"
                                    src={post_one}
                                    alt=""
                                />
                            </Link>

                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                                    {" "}
                                    ไลฟ์สไตล์{" "}
                                </span>
                            </div>
                        </div>
                        <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                            {" "}
                            โดย นายเอ, 27 มีนาคม 2567{" "}
                        </span>
                        <p className="mt-5 text-2xl font-semibold">
                            <Link to="#" title="" className="text-black">
                                {" "}
                                10 ที่เที่ยวเชียงใหม่ ถ้าไม่ไปถือว่าพลาด!{" "}
                            </Link>
                        </p>
                        <p className="mt-4 text-base text-gray-600">
                            ลองตามไปดูกันว่า 10
                            ที่เที่ยวเชียงใหม่ยอดฮิตที่เรานำมาฝากนี้เพื่อน ๆ
                            เคยไปมาแล้วหรือยัง ถ้ายังบอกเลยว่าพลาดมาก ต้องไปตามเก็บให้ครบนะ
                        </p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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

                <div className="overflow-hidden bg-white rounded shadow">
                    <div className="p-5">
                        <div className="relative">
                            <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                                <img
                                    className="object-cover w-full h-full"
                                    src={post_two}
                                    alt=""
                                />
                            </Link>

                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                                    {" "}
                                    การตลาด{" "}
                                </span>
                            </div>
                        </div>
                        <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                            {" "}
                            โดย นายบี, 27 มีนาคม 2567{" "}
                        </span>
                        <p className="mt-5 text-2xl font-semibold">
                            <Link to="#" title="" className="text-black">
                                {" "}
                                เคล็ดลับยอดนิยมในการทำการตลาดโรงแรมของคุณให้เร็วขึ้นและดีขึ้น{" "}
                            </Link>
                        </p>
                        <p className="mt-4 text-base text-gray-600">
                            การตลาดเป็นสิ่งสำคัญที่ช่วยเพิ่มยอดขายให้กับธุรกิจ
                            โดยเฉพาะในยุคปัจจุบันที่สื่อออนไลน์มีความสำคัญเป็นอย่างมาก
                            ดังนั้นการตลาดที่ดีจึงเป็นสิ่งที่จำเป็น
                        </p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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

                <div className="overflow-hidden bg-white rounded shadow">
                    <div className="p-5">
                        <div className="relative">
                            <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                                <img
                                    className="object-cover w-full h-full"
                                    src={post_three}
                                    alt=""
                                />
                            </Link>

                            <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                                    {" "}
                                    เทศกาล{" "}
                                </span>
                            </div>
                        </div>
                        <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                            {" "}
                            โดย นายซี, 27 มีนาคม 2567{" "}
                        </span>
                        <p className="mt-5 text-2xl font-semibold">
                            <Link to="#" title="" className="text-black">
                                {" "}
                                เสน่ห์ของเทศกาล และ ประเพณีอีสาน{" "}
                            </Link>
                        </p>
                        <p className="mt-4 text-base text-gray-600">
                            ภาคอีสานเป็นแหล่งอารยธรรมโบราณ
                            มีวัฒนธรรมประเพณีและความเชื่อที่มีความหลากหลายแตกต่างกันไปในแต่ละท้องถิ่นและโดดเด่นจากภาคอื่น
                            ๆ อย่างชัดเจน
                        </p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
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
    )
}

export default Feature