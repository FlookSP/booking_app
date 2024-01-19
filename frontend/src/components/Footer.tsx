import { Link } from "react-router-dom";
import { footerLinks, socialMedia } from "../constants";

const Footer = () => {
  return (
    // กำหนดให้แสดงทั้งสองส่วนแบบ Column โดยถ้าเป็นหน้าจอปกติให้ Padding Y 10px แต่ถ้าเป็นหน้าจอขนาดเล็กให้ Padding Y 6px 
    <div className={`w-full flex flex-col bg-blue-800 `}>
      {/* ส่วนแรก ถ้าเป็น Large Device แสดงแบบ Row แต่ถ้าเป็น Small Device แสดงแบบ Column */}
      <div className={`flex md:flex-row flex-col px-16 sm:py-10 py-6`}>
        {/* แสดงย่อยแรกที่เป็นข้อความ */}
        <div className="text-2xl text-white font-bold tracking-tight">
          <Link to="/">ThaiVacationHub.com</Link>
          {/* แสดงย่อยแรกที่เป็นข้อความ กำหนดพื้นที่แสดงขนาด 312px */}
          <p className={`font-normal text-white text-[16px] leading-[30.8px] mt-4 mr-16 tracking-normal`}>
            วิธีใหม่ที่ทำให้การจองที่พักเป็นเรื่องง่าย <br className="sm:block hidden" />{" "} เชื่อถือได้ และปลอดภัย
          </p>
        </div>

        {/* แสดงย่อยแรกที่เป็นลิ๊งค์ต่าง ๆ ด้านขวา */}
        <div className="flex-1 flex flex-wrap justify-between md:mt-0 mt-3">
          {/* ทำการ Map footerLinks object array */}
          {footerLinks.map((footerlink) => (
            // กำหนดให้แสดงชุดข้อมูลทีละ title
            <div key={footerlink.title} className={`flex flex-col ss:my-0 my-4 min-w-[280px]`}>
              <h4 className="font-medium text-[18px] leading-[27px] text-white">
                {footerlink.title}
              </h4>
              <ul className="list-none mt-4">
                {/* แสดงข้อมูลที่เป็นลิ๊งค์ย่อยต่าง ๆ ในแต่ละ title */}
                {footerlink.links.map((link, index) => (
                  // กำหนดรูปแบบการแสดงของเมนูย่อย เช่น เมื่อมีการ Click เลือกเมนูย่อย ให้แสดงสีขาวปกติ เป็นต้น
                  <li
                    key={link.name}
                    className={`font-normal text-[16px] leading-[24px] text-white hover:text-blue-100 cursor-pointer ${index !== footerlink.links.length - 1 ? "mb-4" : "mb-0"
                      }`}
                  >
                    <Link to={link.link}>{link.name}</Link>

                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* ส่วนที่สอง ถ้าเป็น Large Device แสดงแบบ Row แต่ถ้าเป็น Small Device แสดงแบบ Column และแสดงเส้นขอบด้านบนขนาด 1px ด้วยสี #3F3E45*/}
      <div className="w-full flex justify-between items-center md:flex-row flex-col py-6 border-t-[1px] border-t-[#f2f2f2] px-16">
        <p className="font-normal text-center text-[18px] leading-[27px] text-white">
          ลิขสิทธิ์ Ⓒ 2024 ThaiVacationHub.com. สงวนลิขสิทธิ์.
        </p>

        <div className="flex flex-row md:mt-0 mt-6">
          {socialMedia.map((social, index) => (
            <img
              key={social.id}
              src={social.icon}
              alt={social.id}
              // กำหนดให้ Add Padding ขนาด 6 px ระหว่างไอคอนต่าง ๆ 
              // ยกเว้นเป็นไอคอนสุดท้ายไม่ต้อง Add Padding
              className={`w-[21px] h-[21px] object-contain cursor-pointer ${index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
                }`}
              onClick={() => window.open(social.link)}
            />
          ))}
        </div>
      </div>
    </div>

  )
}

export default Footer