import { socialMedia } from "../constants";

const Footer = () => {
  return (
    <section className="py-0 bg-[#FCF8F1] bg-opacity-30 sm:pt-5 lg:pt-10">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <hr className="mt-0 mb-5 border-gray-200" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            © ลิขสิทธิ์ 2024, สงวนลิขสิทธิ์โดย ThaiVacationHub.com
          </p>

          <div className="flex items-center mt-5 space-x-3 md:order-3 sm:mt-0 ">
          {socialMedia.map((social) => (
            <img
              key={social.id}
              src={social.icon}
              alt={social.id}
              // กำหนดให้ Add Padding ขนาด 6 px ระหว่างไอคอนต่าง ๆ 
              // ยกเว้นเป็นไอคอนสุดท้ายไม่ต้อง Add Padding
              className={`object-contain cursor-pointer transition-all duration-200 border border-gray-300 rounded-full w-5 h-5 bg-gray-500 focus:bg-orange-600 hover:text-white focus:text-white hover:bg-orange-600 hover:border-orange-600 focus:border-orange-600 mr-0"
                }`}
              onClick={() => window.open(social.link)}
            />
          ))}
        </div>

        </div>
      </div>
    </section>
  );
};

export default Footer;
