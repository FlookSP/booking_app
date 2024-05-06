import { Link } from "react-router-dom";
import { team, woman } from "../assets";
import { useState } from "react";

const Hero = () => {

  // ตัวแปรเก็บค่าการเปิดวิดีโอ
  const [videoOpen, openVideo] = useState(false);


  return (
    <section className="bg-[#FCF8F1] bg-opacity-30 py-10 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p className=" text-xl font-semibold tracking-wider text-blue-600 uppercase">
              เว็บไซต์สำหรับการท่องเที่ยวในประเทศไทย
            </p>
            <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-8xl">
              ค้นหา จองที่พัก ง่าย รวดเร็วสุด ๆ
            </h1>
            <p className="mt-4 text-base text-black lg:mt-8 sm:text-xl">
              เว็บไซต์ของเราใช้วิธีการแบบใหม่ในการระบุที่พักซึ่งน่าจะตรงกับความต้องการของคุณมากที่สุด
            </p>

            <Link
              to="/register"
              title=""
              className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full lg:mt-16 hover:bg-yellow-400 focus:bg-yellow-400"
              role="button"
            >
              เริ่มต้นใช้งาน
              <svg
                className="w-6 h-6 ml-8 -mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>

            <p className="mt-5 text-gray-600">
              เป็นสมาชิกกับเราอยู่แล้ว?{" "}
              <Link
                to="/sign-in"
                title=""
                className="text-black transition-all duration-200 hover:underline"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-6 mt-10 md:mt-0 ">
            <div className="overflow-hidden aspect-w-3 aspect-h-4">
              <img
                className="object-cover object-top origin-top scale-150"
                src={team}
                alt=""
              />
            </div>

            <div className="relative">
              <div className="h-full overflow-hidden aspect-w-3 aspect-h-4">
                <img
                  className="object-cover scale-150 lg:origin-bottom-right"
                  src={woman}
                  alt=""
                />
              </div>

              <div className="absolute inset-0 grid w-full h-full place-items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-12 h-12 text-blue-600 bg-white rounded-full shadow-md lg:w-20 lg:h-20"
                  onClick={() => {
                    openVideo((prev) => !prev);
                  }}
                >
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* แสดงวิดีโอในส่วนนี้เมื่อผู้ใช้งาน Click ที่ปุ่ม Play ที่รูปภาพ */}
      {videoOpen && (<div className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black bg-opacity-70 display: none;">
        {/* แสดงปุ่ม กากบาท ที่มุมบนขวาสุด เพื่อให้ผู้ใช้งานสามารถเลือกที่จะปิดวิดีโอได้  */}
        <button className="absolute right-0 top-0 flex h-20 w-20 cursor-pointer items-center justify-center text-white hover:bg-black" onClick={() => {
          openVideo((prev) => !prev);
        }}>
          <svg viewBox="0 0 16 15" className="h-8 w-8 fill-current">
            <path d="M3.37258 1.27L8.23258 6.13L13.0726 1.29C13.1574 1.19972 13.2596 1.12749 13.373 1.07766C13.4864 1.02783 13.6087 1.00141 13.7326 1C13.9978 1 14.2522 1.10536 14.4397 1.29289C14.6272 1.48043 14.7326 1.73478 14.7326 2C14.7349 2.1226 14.7122 2.24439 14.6657 2.35788C14.6193 2.47138 14.5502 2.57419 14.4626 2.66L9.57258 7.5L14.4626 12.39C14.6274 12.5512 14.724 12.7696 14.7326 13C14.7326 13.2652 14.6272 13.5196 14.4397 13.7071C14.2522 13.8946 13.9978 14 13.7326 14C13.6051 14.0053 13.478 13.984 13.3592 13.9375C13.2404 13.8911 13.1326 13.8204 13.0426 13.73L8.23258 8.87L3.38258 13.72C3.29809 13.8073 3.19715 13.8769 3.08559 13.925C2.97402 13.9731 2.85405 13.9986 2.73258 14C2.46737 14 2.21301 13.8946 2.02548 13.7071C1.83794 13.5196 1.73258 13.2652 1.73258 13C1.73025 12.8774 1.753 12.7556 1.79943 12.6421C1.84586 12.5286 1.91499 12.4258 2.00258 12.34L6.89258 7.5L2.00258 2.61C1.83777 2.44876 1.74112 2.23041 1.73258 2C1.73258 1.73478 1.83794 1.48043 2.02548 1.29289C2.21301 1.10536 2.46737 1 2.73258 1C2.97258 1.003 3.20258 1.1 3.37258 1.27Z"></path>
          </svg>
        </button>
        {/* ส่วนแสดงวิดีโอ */}
        <div className="mx-auto w-full max-w-[550px] bg-white">
          <iframe id="video" className="h-[320px] w-full" src="https://www.youtube.com/embed/3vSxHROQ4Hs?si=rmjbrvO-BT2OIhmw" allowFullScreen referrerPolicy="strict-origin-when-cross-origin">
          </iframe>
        </div>
      </div>)}
    </section>
  );
};

export default Hero;