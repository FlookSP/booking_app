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
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    numberOfNights: number;
    hotel: HotelType;
};

const BookingDetailsSummary = ({
    checkIn,
    checkOut,
    adultCount,
    childCount,
    numberOfNights,
    hotel,
}: Props) => {
    return (
        <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
            <h2 className="text-3xl font-bold">รายละเอียดการจองของคุณ</h2>
            <div className="border-b py-2 text-black text-sm font-bold">
                ที่ตั้ง:
                <div className="text-sm font-normal">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
            </div>
            <div className="flex justify-between text-black text-sm font-bold">
                <div>
                    เช็คอิน
                    <div className="text-sm font-normal"> {checkIn.toDateString()}</div>
                </div>
                <div>
                    เช็คเอาท์
                    <div className="text-sm font-normal"> {checkOut.toDateString()}</div>
                </div>
            </div>
            <div className="border-t border-b py-2 text-black text-sm font-bold">
                ระยะเวลาการเข้าพักทั้งหมด:
                <div className="text-sm font-normal">{numberOfNights} คืน</div>
            </div>

            <div className="text-black text-sm font-bold">
                ผู้เข้าพัก{" "}
                <div className="text-sm font-normal">
                    {adultCount} ผู้ใหญ่ & {childCount} เด็ก
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsSummary;