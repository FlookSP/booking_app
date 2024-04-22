import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";

// BookingType จะให้รายละเอียดเกี่ยวกับการจองที่พัก
export type BookingType = {
    _id: string;
    userId: string; // หมายเลขไอดีของผู้ใช้งานที่จองที่พัก
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number; // จำนวนผู้ใหญ่ที่เข้าพัก
    childCount: number; // จำนวนเด็กที่เข้าพัก
    checkIn: Date; // วันที่เข้าพัก
    checkOut: Date; // วันที่ออกจากที่พัก
    totalCost: number; // ราคาค่าที่พัก
};

// HotelType จะให้รายละเอียดเกี่ยวกับที่พัก
export type HotelType = {
    _id: string;
    userId: string; // หมายเลขไอดีของผู้ใช้งานที่ให้รายละเอียดที่พัก
    name: string; // ชื่อที่พัก
    city: string; // เมืองที่ตั้งของที่พัก
    country: string; // ประเทศที่ตั้งของที่พัก
    description: string; // รายละเอียดของที่พัก
    type: string; // ประเภทของที่พัก เช่น Hotels, Apartments, Resorts, Villas เป็นต้น
    adultCount: number; // จำนวนผู้ใหญ่ที่สามารถรับได้
    childCount: number; // จำนวนเด็กที่สามารถรับได้
    facilities: string[]; // สิ่งอำนวยความสะดวกในที่พักมีได้หลายรายการแบบ Array String
    pricePerNight: number; // ราคาของที่พัก
    starRating: number; // Rating ของที่พัก สามารถนำมาใช้พัฒนาเป็น Feature แนะนำที่พักหรือการ Filter ที่พักได้
    imageUrls: string[]; // รูปที่พักแบบ Array String
    lastUpdated: Date; // วันที่ปรับปรุงข้อมูล
    bookings: BookingType[]; // รายการจองที่พักที่มีการจองแบบ Array String
};

type Props = {
    hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
    // ทำการอ่านที่อยู่ URL จากไฟล์ .env ใน Vite ด้วย import.meta
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
    // สร้าง URL สำหรับแสดงรูปภาพที่พัก
    const urls: string[] = [];
    if (hotel.imageUrls) {
        // Loop ข้อมูลแบบ FileList ด้วย Array.from แปลงเป็น Array ก่อน
        Array.from(hotel.imageUrls).forEach((name) => {
            urls.push(`${API_BASE_URL}/api/my-hotels/file/${name}`);
        });
    }

    return (
        // lg:grid-cols-[2fr_3fr] คือ ถ้าเป็นหน้าจอขนาดใหญ่ ให้แสดงรูป และ รายละเอียดที่พัก ในแถวเดียวกัน (2 columns) 
        // โดยใช้พื้นที่แสดงรูป 2 ส่วน และใช้พื้นที่แสดงรายละเอียดที่พัก 3 ส่วน 
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8 mb-3">
            <div className="w-full h-[300px]">
                <img
                    src={urls[0]} // แสดงเฉพาะรูปแรก
                    className="w-full h-full object-cover object-center"
                />
            </div>
            {/* grid-rows-[1fr_2fr_1fr] คือ row ที่ 1 ใช้พื้นที่ 1 ส่วน, row ที่ 2 ใช้พื้นที่ 2 ส่วน, row ที่ 3 ใช้พื้นที่ 1 ส่วน  */}
            <div className="grid grid-rows-[1fr_2fr_1fr]">
                {/* row ที่ 1 ใช้พื้นที่ 1 ส่วน */}
                <div>
                    <div className="flex items-center">
                        <span className="flex">
                            {Array.from({ length: hotel.starRating }).map((items, index) => (
                                <AiFillStar key={index + '' + items} className="fill-yellow-400" />
                            ))}
                        </span>
                        <span className="ml-1 text-sm">{hotel.type}</span>
                    </div>
                    <Link
                        to={`/detail/${hotel._id}`}
                        className="text-2xl font-bold cursor-pointer"
                    >
                        {hotel.name}
                    </Link>
                </div>

                {/* row ที่ 2 ใช้พื้นที่ 2 ส่วน */}
                <div>
                    <div className="line-clamp-4">{hotel.description}</div>
                </div>

                {/* row ที่ 3 ใช้พื้นที่ 1 ส่วน  และในพื้นที่ส่วนนี้ ยังแบ่งเป็น 2 columns */}
                <div className="grid grid-cols-2 max-sm:grid-cols-1 items-end whitespace-nowrap">
                    <div className="flex flex-row gap-1 items-center">
                        {hotel.facilities.slice(0, 3).map((facility, index) => (
                            <span key={index} className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap bg-slate-300">
                                {facility}
                            </span>
                        ))}
                        <span className="text-sm">
                            {hotel.facilities.length > 3 &&
                                `+${hotel.facilities.length - 3} เพิ่มเติม`}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-bold">฿{hotel.pricePerNight} ราคาต่อคืน</span>
                        <Link
                            to={`/detail/${hotel._id}`}
                            className="bg-blue-600 text-white h-full p-2 font-bold max-w-fit hover:bg-blue-500 rounded"
                        >
                            รายละเอียดของที่พัก
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchResultsCard