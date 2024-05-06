import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
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

  // ตัวแปรตรวจสอบการเปิด/ปิดเมนู บัญชีผู้ใช้
  const [dropdown, setDropdown] = useState(false);

  // เรียกข้อมูลผู้ใช้งานมาเก็บในตัวแปร data แล้วเปลี่ยนชื่อเป็น currentUser
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser, {
    retry: false,
  }
  );

  return (
    <> {/* sticky top-0 z-10 คือ กำหนดให้เมนู Header จะแสดงอยู่คงที่ด้านบนเมื่อเลื่อนหน้าจอ และแสดงอยู่เหนือ Component อื่น ๆ  */}
      <nav className="bg-white bg-opacity-90 sticky top-0 z-10 ">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <span className="text-2xl text-gray-800 font-bold tracking-tight">
              {isLoggiedIn ? (<><Link to="/dashboard">ThaiVacationHub.com</Link></>) : (<><Link to="/">ThaiVacationHub.com</Link></>)}
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
                to="/search" // ให้ไปยัง Route "/search"
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

            </div>

            {/* เมนูขวามือสุด ถ้ายังไม่มีการล็อกอิน */}
            {!isLoggiedIn && (
              //<!-- component -->
              <div className="max-lg:hidden flex justify-center">
                <div className="relative inline-block">
                  {/* Dropdown toggle button */}
                  <button
                    className="relative z-10 flex items-center p-2 text-sm text-white bg-blue-700 rounded-md border border-transparent hover:bg-blue-600 "
                    onClick={() => {
                      setDropdown((prev) => !prev);
                    }}

                  >
                    <span className="mx-1 text-base text-white transition-all duration-200 hover:text-opacity-80 ">บัญชีผู้ใช้</span>
                    <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="currentColor"></path>
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  <div className={`absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800 ${dropdown ? "" : "hidden"} `}>
                    <Link
                      to="/sign-in"
                      className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => {
                        setDropdown((prev) => !prev);
                      }}>
                      เข้าสู่ระบบ
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => {
                        setDropdown((prev) => !prev);
                      }}>
                      สมัครสมาชิก
                    </Link>

                    <hr className="border-gray-200 dark:border-gray-700 " />

                    <Link
                      to="/forget-password"
                      className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => {
                        setDropdown((prev) => !prev);
                      }}>
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* เมนูขวามือสุด ถ้ามีการล็อกอินแล้ว และสิทธิ์ user */}
            {isLoggiedIn && currentUser &&
              userInfo &&
              ["user"].some((element) =>
                userInfo.userRole.includes(element)
              ) && (
                //<!-- component -->
                <div className="max-lg:hidden justify-center">
                  <div className="relative inline-block">
                    {/*<!-- Dropdown toggle button -->*/}
                    <button
                      className="relative z-10 flex items-center p-2 text-sm text-white bg-blue-700 rounded-md border border-transparent hover:bg-blue-600 "
                      onClick={() => {
                        setDropdown((prev) => !prev);
                      }}
                    >
                      <span className="mx-1 text-base text-white transition-all duration-200 hover:text-opacity-80 ">สวัสดี, {currentUser.email.split('@')[0]}</span>
                      <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="currentColor"></path>
                      </svg>
                    </button>

                    {/*<!-- Dropdown menu -->*/}
                    <div className={`absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800 ${dropdown ? "" : "hidden"} `}>
                      <strong className="block p-2 text-xs font-medium uppercase text-gray-400"> จัดการบัญชีของคุณ </strong>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        แดชบอร์ด
                      </Link>
                      <Link
                        to="/my-profile"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        ข้อมูลส่วนตัว
                      </Link>

                      <Link
                        to="/reset-password"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        เปลี่ยนรหัสผ่าน
                      </Link>

                      <hr className="border-gray-200 dark:border-gray-700 " />
                      <label className="block p-2 text-xs font-medium uppercase text-gray-400"> จัดการเกี่ยวกับการจองที่พัก </label>

                      <Link
                        to="/my-booking"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        การจองของฉัน
                      </Link>

                      <hr className="border-gray-200 dark:border-gray-700 " />
                      <label className="block p-2 text-xs font-medium uppercase text-gray-400"> จัดการบทความ </label>

                      <Link
                        to="/my-post"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        บทความของฉัน
                      </Link>

                      <hr className="border-gray-200 dark:border-gray-700 " />

                      <Link
                        to="/sign-out"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                          handleClick(); // ทำการล็อกเอ้าท์
                        }}
                      >
                        ออกจากระบบ
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            {/* ถ้ามีการล็อกอินแล้ว และสิทธิ์ admin */}
            {isLoggiedIn && currentUser &&
              userInfo &&
              ["admin"].some((element) =>
                userInfo.userRole.includes(element)
              ) && (
                //<!-- component -->
                <div className="max-lg:hidden flex justify-center">
                  <div className="relative inline-block">
                    {/*<!-- Dropdown toggle button -->*/}
                    <button
                      className="relative z-10 flex items-center p-2 text-sm text-white bg-blue-700 rounded-md border border-transparent hover:bg-blue-600 "
                      onClick={() => {
                        setDropdown((prev) => !prev);
                      }}

                    >
                      <span className="mx-1 text-base text-white transition-all duration-200 hover:text-opacity-80 ">สวัสดี, {currentUser.email.split('@')[0]}</span>
                      <svg className="w-5 h-5 mx-1 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="currentColor"></path>
                      </svg>
                    </button>

                    {/*<!-- Dropdown menu -->*/}
                    <div className={`absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800 ${dropdown ? "" : "hidden"} `}>
                      <strong className="block p-2 text-xs font-medium uppercase text-gray-400"> จัดการบัญชีของคุณ </strong>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        แดชบอร์ด
                      </Link>
                      <Link
                        to="/my-profile"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        ข้อมูลส่วนตัว
                      </Link>

                      <Link
                        to="/reset-password"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        เปลี่ยนรหัสผ่าน
                      </Link>

                      <hr className="border-gray-200 dark:border-gray-700 " />
                      <strong className="block p-2 text-xs font-medium uppercase text-gray-400"> จัดการเกี่ยวกับการจองที่พัก </strong>
                      <Link
                        to="/my-booking"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        การจองของฉัน
                      </Link>

                      <Link
                        to="/my-hotel"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        ที่พักของฉัน
                      </Link>

                      <hr className="border-gray-200 dark:border-gray-700 " />
                      <label className="block p-2 text-xs font-medium uppercase text-gray-400"> จัดการบทความ </label>

                      <Link
                        to="/my-post"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                        }}>
                        บทความของฉัน
                      </Link>

                      <hr className="border-gray-200 dark:border-gray-700 " />

                      <Link
                        to="/sign-out"
                        className="block px-4 py-3 text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => {
                          setDropdown((prev) => !prev);
                          handleClick(); // ทำการล็อกเอ้าท์
                        }}
                      >
                        ออกจากระบบ
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            {/* กรณีเป็น Mobile Device */}
            <img
              className="lg:hidden bg-gray-300 inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-400 hover:bg-gray-400 w-[28px] h-[28px] object-contain"
              onClick={() => setToggle((prev) => !prev)}
              src={toggle ? close : menu}
            ></img>
            <div
              className={` flex flex-col
              lg:hidden bg-white fixed w-full h-full top-16 overflow-y-auto bottom-0 py-3 gap-y-3 pl-4 duration-500 z-10 ${toggle ? "left-0" : "left-[-100%]"
                }
                `}
            >
              <label className="text-base text-gray-500 uppercase dark:text-gray-500">เนื้อหาเว็บไซต์</label>

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
                to="/search"
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

              {isLoggiedIn && (<>
                <hr className="border-gray-200 dark:border-gray-700 " />
                <label className="text-base text-gray-500 uppercase dark:text-gray-500">จัดการบัญชีของคุณ</label>
                <Link
                  to="/dashboard"
                  className="text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => {
                    setToggle((prev) => !prev);
                  }}>
                  แดชบอร์ด
                </Link>
                <Link
                  to="/my-profile"
                  className="text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => {
                    setToggle((prev) => !prev);
                  }}>
                  ข้อมูลส่วนตัว
                </Link>

                <Link
                  to="/reset-password"
                  className="text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => {
                    setToggle((prev) => !prev);
                  }}>
                  เปลี่ยนรหัสผ่าน
                </Link>
              </>)}

              {isLoggiedIn &&
                userInfo &&
                ["user"].some((element) =>
                  userInfo.userRole.includes(element)
                ) && (
                  <>
                    <hr className="border-gray-200 dark:border-gray-700 " />
                    <label className="text-base text-gray-500 uppercase dark:text-gray-500">จัดการเกี่ยวกับการจองที่พัก</label>
                    <Link
                      to="/my-booking"
                      onClick={() => {
                        setToggle((prev) => !prev);
                      }}
                      className="text-base text-black transition-all duration-200 hover:text-opacity-80 "
                    >
                      {" "}
                      การจองของฉัน{" "}
                    </Link>

                    <hr className="border-gray-200 dark:border-gray-700 " />
                    <label className="text-base text-gray-500 uppercase dark:text-gray-500"> จัดการบทความ </label>

                    <Link
                      to="/my-post"
                      className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                      onClick={() => {
                        setToggle((prev) => !prev);
                      }}>
                      บทความของฉัน
                    </Link>
                  </>

                )}

              {isLoggiedIn &&
                userInfo &&
                ["admin"].some((element) =>
                  userInfo.userRole.includes(element)
                ) && (
                  <>
                    <hr className="border-gray-200 dark:border-gray-700 " />
                    <label className="text-base text-gray-500 uppercase dark:text-gray-500">จัดการเกี่ยวกับการจองที่พัก</label>
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
                    <hr className="border-gray-200 dark:border-gray-700 " />
                    <label className="text-base text-gray-500 uppercase dark:text-gray-500"> จัดการบทความ </label>

                    <Link
                      to="/my-post"
                      className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                      onClick={() => {
                        setToggle((prev) => !prev);
                      }}>
                      บทความของฉัน
                    </Link>
                  </>
                )}

              {/* ถ้ายังไม่มีการล็อกอิน */}
              {!isLoggiedIn && (
                <>
                  <hr className="border-gray-200 dark:border-gray-700 " />
                  <label className="text-base text-gray-500 uppercase dark:text-gray-500">บัญชีผู้ใช้</label>
                  <Link
                    to="/sign-in"
                    className="text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => {
                      setToggle((prev) => !prev);
                    }}>
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/register"
                    className="text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => {
                      setToggle((prev) => !prev);
                    }}>
                    สมัครสมาชิก
                  </Link>

                  <hr className="border-gray-200 dark:border-gray-700 " />

                  <Link
                    to="/forget-password"
                    className="text-base text-gray-800 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => {
                      setToggle((prev) => !prev);
                    }}>
                    ลืมรหัสผ่าน?
                  </Link>
                </>
              )}
              {isLoggiedIn && (
                <>
                  <hr className="border-gray-200 dark:border-gray-700 " />

                  <Link
                    to="/sign-out"
                    className="text-base text-black transition-all duration-200 hover:text-opacity-80"
                    onClick={() => {
                      setToggle((prev) => !prev);
                      handleClick(); // ทำการล็อกเอ้าท์
                    }}
                  >
                    ออกจากระบบ
                  </Link>

                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
