// เรียกใช้งานฟังก์ชันที่ติดต่อกับ Backend API
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiMoney, BiHotel, BiStar } from "react-icons/bi";

import { useAppContext } from "../contexts/AppContext";


const MyHotels = () => {
    // ใช้ useQuery เพื่อเรียกข้อมูลที่พักจาก Backend API ที่กำหนด มาเก็บไว้ในตัวแปรชื่อ data  
    const { data } = useQuery(
        "fetchMyHotels", // เราตั้งชื่อ useQuery นี้ว่า "fetchMyHotels"
        apiClient.fetchMyHotels, // เรียกใช้งานฟังก์ชัน fetchMyHotels ใน apiClient
        {
            onError: () => {
                // เราเลือกที่จะไม่แสดงข้อความแจ้งเตือนหรือทำงานอะไรเป็นพิเศษ ถ้าหากมี Error เกิดขึ้น
            }
        }
    );

    // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showModal
    const { showModal } = useAppContext();

    // เมื่อผู้ใช้งานลบที่พัก
    const handleDelete = (id: string) => {
        const hotelId = { hotelId: id };
        showModal({
            title: "ยืนยันการลบข้อมูลที่พัก",
            message: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การดำเนินการนี้ไม่สามารถกู้คืนได้",
            type: "WARNING",
            id: hotelId,
            func: apiClient.deleteMyHotelById,
        });

    };

    return (
        // เพิ่มระยะซ้าย-ขวาแบบ container 
        <div className="container mx-auto">
            {/* แสดงชื่อแบบฟอร์มและปุ่มเพิ่มที่พักให้อยู่ในบรรทัดเดียวกัน */}
            <span className="flex justify-between mb-4">
                <h1 className="text-3xl font-bold">ที่พักของท่าน</h1>
                <Link to="/add-hotel" className="items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-blue-500 hover:text-white focus:text-black focus:bg-yellow-300 font-semibold text-white bg-blue-700 rounded w-fit">เพิ่มที่พัก</Link>
            </span>
            {/* ส่วนแสดงรายการที่พัก */}
            <div className="flex flex-col gap-8 container mx-auto">
                {/* ถ้ายังไม่ได้ใส่ข้อมูลที่พักเลย */}
                {(data?.length === 0) ? (<>
                    <div className="flex items-center justify-center border border-slate-300 rounded-sm p-3 bg-blue-100 text-black-100 font-semibold">
                        ไม่พบข้อมูลที่พัก
                    </div>
                </>)
                    // ถ้าใส่ข้อมูลที่พักแล้ว
                    : (<>
                        {data?.map((hotel, index) => {
                            return <div key={index}>
                                <div className="flex flex-col justify-between border border-slate-300 rounded-sm p-3 gap-5" >
                                    <h2 className="text-2xl text-black font-bold">{hotel.name}</h2>
                                    <div className="whitespace-pre-line">{hotel.description}</div>
                                    {/* max-sm:flex-col คือ ถ้าเป็น Mobile ให้เปลี่ยนเป็นแสดงแบบ flex-col */}
                                    <div className="flex flex-row max-sm:flex-col gap-3">
                                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                            <BsMap className="mr-3" />
                                            {hotel.city}, {hotel.country}
                                        </div>
                                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                            <BsBuilding className="mr-3" />
                                            {hotel.type}
                                        </div>
                                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                            <BiMoney className="mr-3" />฿{hotel.pricePerNight} ราคาต่อคืน
                                        </div>
                                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                            <BiHotel className="mr-3" />
                                            {hotel.adultCount} ผู้ใหญ่, {hotel.childCount} เด็ก
                                        </div>
                                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                            <BiStar className="mr-3" />
                                            {hotel.starRating} คะแนนที่พัก
                                        </div>
                                    </div>
                                    <span className="flex justify-end">
                                        <Link
                                            to={"/my-hotel"}
                                            onClick={() => {
                                                handleDelete(hotel._id);
                                            }}
                                            className="px-5 py-2.5 text-base transition-all duration-200 hover:bg-red-500 hover:text-white focus:text-black focus:bg-yellow-300 font-semibold text-white bg-red-700 rounded w-fit mr-3"
                                        >

                                            ลบที่พัก
                                        </Link>
                                        <Link
                                            to={`/edit-hotel/${hotel._id}`} // ส่ง hotel._id ไปยัง URL /edit-hotel/:hotelId
                                            className="px-5 py-2.5 text-base transition-all duration-200 hover:bg-blue-500 hover:text-white focus:text-black focus:bg-yellow-300 font-semibold text-white bg-blue-700 rounded w-fit"
                                        >
                                            ดูรายละเอียดเพิ่มเติม
                                        </Link>
                                    </span>

                                </div>
                            </div>
                        })}
                    </>)}
            </div>

        </div >
    )
}

export default MyHotels