import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
    const { data: hotels } = useQuery(
        "fetchMyBookings",
        apiClient.fetchMyBookings
    );

    if (!hotels || hotels.length === 0) {
        return <div className="space-y-5 mx-5 flex items-center justify-center border border-slate-300 rounded-sm p-3 bg-blue-100 text-black-100 font-semibold">
            ไม่พบข้อมูลการจองที่พัก
        </div>;
    }

    // ทำการอ่านที่อยู่ URL จากไฟล์ .env ใน Vite ด้วย import.meta
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
    // สร้าง URL สำหรับแสดงรูปภาพที่พัก

    hotels.map((hotel) => {
        if (hotel.imageUrls) {
            // Loop ข้อมูลแบบ FileList ด้วย Array.from แปลงเป็น Array ก่อน
            Array.from(hotel.imageUrls).forEach((name) => {
                hotel.imageUrls[0] = `${API_BASE_URL}/api/my-hotels/file/${name}`;
            });
        }
    })

    return (
        <div className="space-y-5 mx-5">
            <h1 className="text-3xl font-bold">การจองของฉัน</h1>
            {hotels.map((hotel) => (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
                    <div className="lg:w-full lg:h-[250px]">
                        <img
                            src={hotel.imageUrls[0]}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                        <div className="text-2xl font-bold">
                            {hotel.name}
                            <div className="text-xs font-normal">
                                {hotel.city}, {hotel.country}
                            </div>
                        </div>
                        {hotel.bookings.map((booking) => (
                            <div>
                                <div>
                                    <span className="font-bold mr-2">วันที่เข้าพัก: </span>
                                    <span>
                                        {new Date(booking.checkIn).toDateString()} -
                                        {new Date(booking.checkOut).toDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-bold mr-2">จำนวนผู้เข้าพัก:</span>
                                    <span>
                                        {booking.adultCount} ผู้ใหญ่, {booking.childCount} เด็ก
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyBookings;