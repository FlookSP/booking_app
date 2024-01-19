import { useEffect } from "react";

// กำหนดรายละเอียด Type ที่ Toast Component นี้จะรับเข้ามา
type ToastProps = {
  message: string; // ข้อความ.
  type: "SUCCESS" | "ERROR"; // ประเภทข้อความ ซึ่งเราจะแสดงตรงหัวกล่องด้วย
  onClose: () => void; // ฟังก์ชันปิดกล่องข้อความ ไม่คืนค่าใด ๆ
};

// สร้าง Toast Component
const Toast = ({ message, type, onClose }: ToastProps) => {
    // useEffect คือ Hook Function ที่ใช้ในการเรียกใช้งานฟังก์ชัน setTimeout เพื่อจับเวลา 5 วินาที ก่อนเรียกใช้งาน 
    // ก่อนเรียกใช้งานฟังก์ชัน onClose เพื่อปิดกล่องข้อความ Toast
    useEffect(()=>{
        const timer = setTimeout(()=>{
            onClose(); // เมื่อครบ 5 วินาที จะเรียกใช้งานฟังก์ชัน onClose
        }, 5000);
        return ()=>{
            clearTimeout(timer); // reset ตัวแปร timer เมื่อมีการปิดกล่องข้อความ
        };
    }, [onClose]); // กำหนดให้เรียกใช้งาน useEffect เมื่อมีการ Render Toast Component นี้หรือเมื่อมีการเรียกใช้งานฟังก์ชัน onClose

    // กำหนด Style สำหรับ Toast
    const styles = 
    type === "SUCCESS" ?
    // กำหนดตำแหน่งข้อความแบบ fixed และ Add spacing ด้าน top และ right จำนวนหนึ่ง 
    // และกำหนดให้แสดงอยู่เหนือ component อื่นด้วย z-50 และมีขนาดของกล่องเป็น max-w-md
      "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md" 
      : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md";
  return (
    // กำหนดรูปแบบกล่องข้อความ Toast
    <div className={styles}>
      {/* กำหนดรูปแบบการแสดงของ ข้อความ ต่าง ๆ */}
      <div className="flex flex-col justify-center items-start">
        <span className="text-2xl font-extrabold">{type}</span> 
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
