import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext"
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // ใช้ css ของ datepicker ในการจัดรูปแบบการแสดง DatePicker
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  // ใช้งาน SearchContext
  const search = useSearchContext();
  // สร้างและกำหนดค่าตัวแปรต่าง ๆ ใน Search Component โดยดูว่ามีการกรอกค่ามาแล้วหรือยัง
  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  // ฟังก์ชันเมื่อผู้ใช้งานกดปุ่มค้นหา
  const handleSubmit = (event: FormEvent) => {
    // ป้องกันไม่ให้ Form ทำการ Submit เองเมื่อผู้ใช้งาน Click ที่อื่น ๆ ในฟอร์มซึ่งไม่ใช่ปุ่มค้นหา
    event.preventDefault();
    // ทำการบันทึกรายละเอียดที่ผู้ใช้งานต้องการค้นหากรอกในตัวแปร useState ต่าง ๆ ลงในฟังก์ชัน saveSearchValues
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount,
      search.page,
    );
    // เมื่อผู้ใช้งานกดปุ่มค้นหา ให้ไปยังหน้า Search Page ซึ่ง SearchBar Component จะส่งค่าค้นหาต่าง ๆ มาด้วย 
    navigate("/search");
  };

  // ฟังก์ชันเคลียร์ฟอร์มค้นหา
  const handleClick = () => {
    setDestination("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setAdultCount(1);
    setChildCount(0);
  };

  // กำหนดตัวแปรสำหรับรองรับการทำงานของ DatePicker
  const minDate = new Date(); // วันที่ก่อนหน้าวันปัจจุบันนี้จะไม่อนุญาตให้ผู้ใช้งานเลือก
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1); // อนุญาตให้จองที่พักได้ไม่เกิน 1 ปี

  return (
    <form
      onSubmit={handleSubmit}
      // Component ในฟอร์มนี้จะถูกแสดงภายในพื้นที่ที่เรากำหนด เช่น bg-blue-100 เป็นต้น
      className="flex flex-row max-lg:flex-col mb-4 p-6 bg-blue-100 rounded shadow-lg items-center justify-center gap-4"
    >
      <div className="flex flex-row items-center bg-white p-2 w-full rounded">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          placeholder="คุณกำลังจะไปไหน?" // ข้อความ Hint แนะนำผู้ใช้งาน
          className="text-md focus:outline-none"
          value={destination} // ที่ตั้งที่พัก
          onChange={(event) => setDestination(event.target.value)} // เมื่อ inut field นี้มีค่าเปลี่ยนแปลงไป จะทำการกำหนดค่าด้วย setDestination
        />
      </div>

      <div className="flex bg-white px-2 py-1 gap-2 w-full justify-start rounded">
        <label className="items-center flex">
          ผู้ใหญ่:
          <input
            className="w-fit p-1 focus:outline-none font-bold"
            type="number"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => setAdultCount(parseInt(event.target.value))}
          />
        </label>
        <label className="items-center flex">
          เด็ก:
          <input
            className="w-fit p-1 focus:outline-none font-bold "
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => setChildCount(parseInt(event.target.value))}
          />
        </label>
      </div>

      <div className="w-full">
        <DatePicker
          selected={checkIn} // กำหนดวันที่ผู้ใช้งานเลือกเป็น checkIn
          onChange={(date) => setCheckIn(date as Date)} // วันที่เลือกจะถูกเก็บในตัวแปร checkIn ด้วยฟังก์ชัน setCheckIn
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="วันที่เช็คอิน"
          className="min-w-full bg-white p-2 focus:outline-none rounded"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="w-full">
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="วันที่เช็คเอาท์"
          className="min-w-full bg-white p-2 focus:outline-none rounded"
          wrapperClassName="min-w-full"
        />
      </div>

      <div className="flex gap-1">
        <button className="w-auto bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 rounded">
          ค้นหา
        </button>
        <button className="w-auto bg-red-600 text-white h-full p-2 font-bold hover:bg-red-500 rounded" onClick={handleClick}>
          เคลียร์
        </button>
      </div>

    </form>
  )
}

export default SearchBar