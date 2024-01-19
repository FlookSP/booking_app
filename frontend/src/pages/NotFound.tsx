import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    // กำหนดให้ใช้พื้นที่ทั้งหมดที่มีด้วย h-screen w-screen และสีพื้นหลังเป็นสี gray ความเข้ม 200
    <div className="flex h-screen w-screen bg-gray-200 items-center">
      {/* container คือ เพิ่ม Padding ทั้งด้านซ้ายและขวา ทำให้ Componet ต่าง ๆ จะถูกแสดงบริเวณตรงกลาง  */}
      <div className="container flex justify-center px-5 text-gray-700">
        {/* กำหนดให้พื้นที่แสดง Component ต่าง ๆ ภายในนี้ใช้พื้นที่ความกว้างสูงสุดเท่ากับ 448px ด้วย max-w-md */}
        {/* จะทำให้ข้อความต่าง ๆ ถูกจัดขึ้นบรรทัดใหม่โดยได้ Effect ที่สวยงามตามที่เราต้องการ */}
        <div className="max-w-md">
          <div className="text-5xl font-dark font-bold">404</div>
          <p className="text-2xl md:text-3xl font-light leading-normal">
            ขออภัย เราไม่พบหน้านี้.{" "}
          </p>
          {/* กำหนดให้ Add margin bottom 32px ดังนั้น ปุ่มกดที่ตามหลังข้อความนี้จะถูกแสดงในระยะที่สวยงาม */}
          <p className="mb-8">
            แต่อย่ากังวล คุณสามารถค้นหาสิ่งอื่นๆ อีกมากมายได้ในหน้าแรกของเรา.
          </p>

          <span>
            <Link
              to="/"
              className="py-2 px-3 text-[14px] text-blue-700 bg-white outline-blue-700 hover:bg-gray-100 rounded"
            >
              หน้าหลัก
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
