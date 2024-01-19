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
      // เมื่อผู้ใช้งานทำการ Register ได้สำเร็จ โปรแกรมจะทำการไปยังหน้า Home Page
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
    // กำหนดสีพื้นหลังเป็นสีน้ำเงิน ตัวเลข 800 คือ ความเข้มของสี โดยตัวเลขยิ่งมากจะยิ่งเข้ม
    // py-6 คือ Padding Y ทั้งบนและล่าง 6px ส่งผลต่อขนาดของสีพื้นหลังจะยิ่งสูง
    <div className="bg-blue-800 py-6">
      {/* sm:px-16 px-6 คือ ถ้า Small Device ให้ Padding X จำนวน 6px แต่ถ้าไม่ใช่ ให้ Padding X จำนวน 16px */}
      <div className="flex justify-between sm:px-16 px-6">
        {/* text-2xl คือ ขนาดตัวอักษรใหญ่กว่า xl 2 เท่า, tracking-tight คือ ตัวอักษรจะอยู่ชิดกันกว่าปกติ */}
        <span className="text-2xl text-white font-bold tracking-tight">
          <Link to="/">ThaiVacationHub.com</Link>
        </span>
        {/* space-x-2 คือ กำหนดระยะห่างระหว่าง Child Element ในนี้เป็นระยะ 2px */}
        {/* sm:flex hidden หมายถึง เมื่อไม่ใช่ Mobile กำหนดให้ Navbar ให้แสดงข้อความเมนู */}
        <span className="sm:flex hidden space-x-2">
          {/* ถ้ามีการล็อกอินแล้วเป็นผู้ดูแลระบบขึ้นไป */}
          {isLoggiedIn &&
            userInfo &&
            ["admin", "superadmin"].some((element) =>
              userInfo.userRole.includes(element)
            ) && (
              <>
                <Link
                  to="/my-dashboard"
                  className="flex items-center text-white px-3 hover:text-gray-300"
                >
                  แดชบอร์ด
                </Link>
                <Link
                  to="/my-booking"
                  className="flex items-center text-white px-3 hover:text-gray-300"
                >
                  การจองของฉัน
                </Link>
                <Link
                  to="/my-hotel"
                  className="flex items-center text-white px-3 hover:text-gray-300"
                >
                  ที่พักของฉัน
                </Link>

                <button
                  onClick={handleClick} // เรียกใช้งานฟังก์ชัน handleClick
                  className="py-2 px-3 text-[14px] text-blue-700 bg-white outline-blue-700 hover:bg-gray-200 rounded"
                >
                  ออกจากระบบ
                </button>
              </>
            )}
          {/* ถ้ามีการล็อกอินแล้วเป็นผู้ใช้งานทั่วไป */}
          {isLoggiedIn &&
            !(
              userInfo &&
              ["admin", "superadmin"].some((element) =>
                userInfo.userRole.includes(element)
              )
            ) && (
              <>
                <Link
                  to="/my-booking"
                  className="flex items-center text-white px-3 hover:text-gray-300"
                >
                  การจองของฉัน
                </Link>
                <Link
                  to="/my-hotel"
                  className="flex items-center text-white px-3 hover:text-gray-300"
                >
                  ที่พักของฉัน
                </Link>

                <button
                  onClick={handleClick} // เรียกใช้งานฟังก์ชัน handleClick
                  className="py-2 px-3 text-[14px] text-blue-700 bg-white outline-blue-700 hover:bg-gray-200 rounded"
                >
                  ออกจากระบบ
                </button>
              </>
            )}
          {/* ถ้ายังไม่มีการล็อกอิน */}
          {!isLoggiedIn && (
            <Link
              to="/sign-in"
              className="py-2 px-3 text-[14px] text-blue-700 bg-white outline-blue-700 hover:bg-gray-200 rounded"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </span>
        {/* ถ้าเป็น Mobile ให้แสดงรายการ Navbar แบบ Hamberger Menu */}
        <div className="sm:hidden justify-end items-end">
          {/* ถ้าเปิดเมนูเมื่อเป็น Mobile ให้แสดงเมนู Close ด้วย และทำการอับเดต State ด้วย Prev*/}
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle((prev) => !prev)}
          />
          {/* ตรวจสอบ toggle ว่ามีการ เปิด/ปิด รายการเมนูหรือไม่ */}
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-blue-700 absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
          >
            <span className="list-none flex justify-end items-start flex-col">
              {/* ถ้ามีการล็อกอินแล้วเป็นผู้ดูแลระบบขึ้นไป */}
              {isLoggiedIn &&
                userInfo &&
                ["admin", "superadmin"].some((element) =>
                  userInfo.userRole.includes(element)
                ) && (
                  <>
                    <Link
                      to="/my-dashboard"
                      onClick={() => {
                        setToggle((prev) => !prev); // กำหนดให้ซ่อนเมนูย่อยหลังจากคลิ๊กเลือกแล้ว
                      }}
                      className="flex items-center text-white px-3 hover:text-gray-300"
                    >
                      แดชบอร์ด
                    </Link>
                    <Link
                      to="/my-booking"
                      onClick={() => {
                        setToggle((prev) => !prev); // กำหนดให้ซ่อนเมนูย่อยหลังจากคลิ๊กเลือกแล้ว
                      }}
                      className="flex items-center text-white px-3"
                    >
                      การจองของฉัน
                    </Link>
                    <Link
                      to="/my-hotel"
                      onClick={() => {
                        setToggle((prev) => !prev); // กำหนดให้ซ่อนเมนูย่อยหลังจากคลิ๊กเลือกแล้ว
                      }}
                      className="flex items-center text-white px-3"
                    >
                      ที่พักของฉัน
                    </Link>

                    <Link
                      to={"/"}
                      onClick={() => {
                        setToggle((prev) => !prev); // กำหนดให้ซ่อนเมนูย่อยหลังจากคลิ๊กเลือกแล้ว
                        handleClick(); // กำหนดให้เรียกใช้งานฟังก์ชัน handleClick
                      }}
                      className="flex items-center text-white px-3"
                    >
                      ออกจากระบบ
                    </Link>
                  </>
                )}
              {/* ถ้ามีการล็อกอินแล้วเป็นผู้ใช้งานทั่วไป */}
              {isLoggiedIn &&
                !(
                  userInfo &&
                  ["admin", "superadmin"].some((element) =>
                    userInfo.userRole.includes(element)
                  )
                ) && (
                  <>
                    <Link
                      to="/my-booking"
                      onClick={() => {
                        setToggle((prev) => !prev); // กำหนดให้ซ่อนเมนูย่อยหลังจากคลิ๊กเลือกแล้ว
                      }}
                      className="flex items-center text-white px-3"
                    >
                      การจองของฉัน
                    </Link>
                    <Link
                      to="/my-hotel"
                      onClick={() => {
                        setToggle((prev) => !prev); // กำหนดให้ซ่อนเมนูย่อยหลังจากคลิ๊กเลือกแล้ว
                      }}
                      className="flex items-center text-white px-3"
                    >
                      ที่พักของฉัน
                    </Link>

                    <Link
                      to={"/"}
                      onClick={() => {
                        setToggle((prev) => !prev); // กำหนดให้ซ่อนเมนูย่อยหลังจากคลิ๊กเลือกแล้ว
                        handleClick(); // กำหนดให้เรียกใช้งานฟังก์ชัน handleClick
                      }}
                      className="flex items-center text-white px-3"
                    >
                      ออกจากระบบ
                    </Link>
                  </>
                )}
              {/* ถ้ายังไม่มีการล็อกอิน */}
              {!isLoggiedIn && (
                <Link
                  to="/sign-in"
                  onClick={() => {
                    setToggle((prev) => !prev); // กำหนดให้ซ่อนเมนูย่อยหลังจากคลิ๊กเลือกแล้ว
                  }}
                  className="flex items-center text-white px-3"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
