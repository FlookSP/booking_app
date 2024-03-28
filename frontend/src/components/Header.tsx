import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { close, menu } from "../assets";
import { useState } from "react";

const Header = () => {
  // ใช้งาน useNavigate ในการไปยังหน้า Home Page
  const navigate = useNavigate();
  // เรียกใช้งาน Global state ชื่อ AppContext เพื่อตรวจสอบสถานะภาพการล็อกอินในตัวแปรชื่อ isLoggiedIn
  // และตรวจสอบสิทธิ์ด้วยตัวแปร userInfo
  const { isLoggiedIn, userInfo } = useAppContext();

  const queryClient = useQueryClient();
  // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showToast
  const { showToast } = useAppContext();
  // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของโปรแกรมนี้
  // useMutation จะใช้งานฟังก์ชัน signOut ในไฟล์ api-client.ts
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      // หากทำการติดต่อกับ backend สำเร็จ ให้ทำเครื่องหมายข้อมูลที่มี Key เป็น "validateToken" ว่าล้าสมัยหรือเก่าแล้วด้วย invalidateQueries
      // จากนั้น react-query หลังจากที่ทำการปรับปรุงข้อมูล Token ที่มีใน Browser เป็นข้อมูล Token ใหม่ที่ได้รับจาก backend แล้ว
      // ซึ่งในที่นี้คือ การลบค่า Token เก่าออกไปนั่นเอง (apiClient.signOut) และมันจะทำการ Refresh UI เพื่อแสดงเมนูอย่างเหมาะสม
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "ออกจากระบบเรียบร้อยแล้ว", type: "SUCCESS" });
      // โปรแกรมจะทำการไปยังหน้า Home Page
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  // เรากำหนดฟังก์ชันชื่อ handleClick เพื่อทำงานเมื่อกดปุ่ม "ออกจากระบบ"
  const handleClick = () => {
    // ทำการเรียกใช้งานฟังก์ชัน mutate ซึ่งจะเป็นการเรียกใช้งานฟังก์ชันใน useMutation อีกทีหนึ่ง
    mutation.mutate();
  };
  // ตรวจสอบว่ามีการ เปิด/ปิด รายการเมนู Hamberger Menu หรือไม่ และกำหนดค่าเริ่มต้นเป็น
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <nav className="bg-[#FCF8F1] bg-opacity-30">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <span className="text-2xl text-gray-800 font-bold tracking-tight">
              <Link to="/">ThaiVacationHub.com</Link>
            </span>

            <div className=" hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
              <Link
                to="/company"
                title=""
                className="text-base text-black transition-all duration-200 hover:text-opacity-80"
              >
                {" "}
                เกี่ยวกับเรา{" "}
              </Link>

              <Link
                to="/service"
                title=""
                className="text-base text-black transition-all duration-200 hover:text-opacity-80"
              >
                {" "}
                บริการของเรา{" "}
              </Link>

              <Link
                to="/feature"
                title=""
                className="text-base text-black transition-all duration-200 hover:text-opacity-80"
              >
                {" "}
                สิ่งที่น่าสนใจ{" "}
              </Link>

              <Link
                to="/help"
                title=""
                className="text-base text-black transition-all duration-200 hover:text-opacity-80"
              >
                {" "}
                ความช่วยเหลือ{" "}
              </Link>

              {isLoggiedIn &&
                userInfo &&
                ["user"].some((element) =>
                  userInfo.userRole.includes(element)
                ) && (
                  <Link
                    to="/my-booking"
                    onClick={() => {
                      setToggle((prev) => !prev);
                    }} // เรียกใช้งานฟังก์ชัน handleClick
                    className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                  >
                    {" "}
                    การจองของฉัน{" "}
                  </Link>
                )}

              {isLoggiedIn &&
                userInfo &&
                ["admin"].some((element) =>
                  userInfo.userRole.includes(element)
                ) && (
                  <Link
                    to="/my-hotel"
                    onClick={() => {
                      setToggle((prev) => !prev);
                    }} // เรียกใช้งานฟังก์ชัน handleClick
                    className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                  >
                    {" "}
                    ที่พักของฉัน{" "}
                  </Link>
                )}
            </div>

            {/* ถ้ายังไม่มีการล็อกอิน */}
            {!isLoggiedIn && (
              <Link
                to="/sign-in"
                title=""
                className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-blue-700 rounded-full w-fit"
                role="button"
              >
                {" "}
                เข้าสู่ระบบ{" "}
              </Link>
            )}

            {isLoggiedIn && (
              <Link
                to="/sign-out"
                onClick={handleClick} // เรียกใช้งานฟังก์ชัน handleClick
                className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-blue-700 rounded-full w-fit"
                role="button"
              >
                {" "}
                ออกจากระบบ{" "}
              </Link>
            )}

            {/* Mobile nav */}
            <img
              className=" bg-gray-300 inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-400 hover:bg-gray-400 w-[28px] h-[28px] object-contain"
              onClick={() => setToggle((prev) => !prev)}
              src={toggle ? close : menu}
            ></img>
            <div
              className={` flex flex-col
                 md:hidden bg-white fixed w-full top-20 overflow-y-auto bottom-0 py-3 gap-y-3 pl-4 duration-500 z-10 ${
                   toggle ? "left-0" : "left-[-100%]"
                 }
                `}
            >
              <Link
                to="/company"
                title=""
                className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                onClick={() => setToggle((prev) => !prev)}
              >
                {" "}
                เกี่ยวกับเรา{" "}
              </Link>

              <Link
                to="/service"
                title=""
                className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                onClick={() => setToggle((prev) => !prev)}
              >
                {" "}
                บริการของเรา{" "}
              </Link>

              <Link
                to="/feature"
                title=""
                className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                onClick={() => setToggle((prev) => !prev)}
              >
                {" "}
                สิ่งที่น่าสนใจ{" "}
              </Link>

              <Link
                to="/help"
                title=""
                className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                onClick={() => setToggle((prev) => !prev)}
              >
                {" "}
                ความช่วยเหลือ{" "}
              </Link>

              {isLoggiedIn &&
                userInfo &&
                ["user"].some((element) =>
                  userInfo.userRole.includes(element)
                ) && (
                  <Link
                    to="/my-booking"
                    onClick={() => {
                      setToggle((prev) => !prev);
                    }} // เรียกใช้งานฟังก์ชัน handleClick
                    className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                  >
                    {" "}
                    การจองของฉัน{" "}
                  </Link>
                )}

              {isLoggiedIn &&
                userInfo &&
                ["admin"].some((element) =>
                  userInfo.userRole.includes(element)
                ) && (
                  <Link
                    to="/my-hotel"
                    onClick={() => {
                      setToggle((prev) => !prev);
                    }} // เรียกใช้งานฟังก์ชัน handleClick
                    className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                  >
                    {" "}
                    ที่พักของฉัน{" "}
                  </Link>
                )}

              {/* ถ้ายังไม่มีการล็อกอิน */}
              {!isLoggiedIn && (
                <Link
                  to="/sign-in"
                  title=""
                  className=" items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-blue-700 rounded-full w-fit"
                  role="button"
                  onClick={() => setToggle((prev) => !prev)}
                >
                  {" "}
                  เข้าสู่ระบบ{" "}
                </Link>
              )}
              {isLoggiedIn && (
                <Link
                  to="/sign-out"
                  onClick={() => {
                    setToggle((prev) => !prev);
                    handleClick();
                  }} // เรียกใช้งานฟังก์ชัน handleClick
                  className="items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-blue-700 rounded-full w-fit"
                  role="button"
                >
                  {" "}
                  ออกจากระบบ{" "}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
