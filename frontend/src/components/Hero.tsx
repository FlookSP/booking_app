import { Link } from "react-router-dom";
import { team, woman } from "../assets";

const Hero = () => {
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
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

          <div className="relative grid grid-cols-2 gap-6 mt-10 md:mt-0">
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
    </section>
  );
};

export default Hero;
