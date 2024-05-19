import { HotelType } from "../shared/types";

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