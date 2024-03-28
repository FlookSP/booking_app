import { curve_dot } from "../assets";

const Business = () => {
  return (
    <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            วิธีการทำงานของเรา
          </h2>
          <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
            วิธีใหม่ที่ทำให้การจองที่พักเป็นเรื่องง่าย{" "}
            <br className="sm:block hidden" /> เชื่อถือได้ และปลอดภัย
          </p>
        </div>

        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img className="w-full" src={curve_dot} alt="" />
          </div>

          <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12 ">
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 1 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                สร้างบัญชีผู้ใช้ฟรี
              </h3>
              <p className="mt-4 text-base text-gray-600">
                ก่อนจะเข้าไปใช้งานเว็บไซต์ได้ให้เราสมัครบัญชีผู้ใช้กันก่อนเพื่อรับสิทธิ์พิเศษจากทางเว็บไซต์
                โดยให้เรากรอกข้อมูลเล็กน้อย เช่น Email (ใช้สำหรับ Login
                และยืนยันตัวตน) และกำหนดรหัสผ่าน เป็นต้น
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 2 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                ค้นหาที่พักหรือลงทะเบียนที่พัก
              </h3>
              <p className="mt-4 text-base text-gray-600">
                หากคุณทำธุรกิจที่พักแล้วอยากเพิ่มช่องทางออนไลน์ในการจองที่พักของคุณ
                ให้ลงข้อมูลที่พักในฝั่งจัดการหลังบ้าน
                หรือหากคุณเป็นนักท่องเที่ยวให้ทำการค้นหาและจองที่พักผ่านทางเว็บไซต์ของเรา
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 3 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                เริ่มต้นทำงาน
              </h3>
              <p className="mt-4 text-base text-gray-600">
                รอรับรายได้จากการจองที่เข้ามาอย่างสม่ำเสมอหรือรับส่วนลดพิเศษจากการจองที่พักผ่านทางเว็บไซต์ของเรา
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
