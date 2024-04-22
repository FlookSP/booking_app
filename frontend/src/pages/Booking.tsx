import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useParams } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";
import { useEffect, useState } from "react";
import { BookingDetailsSummary } from "../components";
// เพื่อใช้งาน Stripe SDK ในการติดต่อกับ Stripe 
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
    // เรียกใช้งาน รหัส Publishable key ในการติดต่อกับ Stripe
    const { stripePromise } = useAppContext();

    // เรียกข้อมูลผู้ใช้งานมาเก็บในตัวแปร data แล้วเปลี่ยนชื่อเป็น currentUser
    const { data: currentUser } = useQuery(
        "fetchCurrentUser",
        apiClient.fetchCurrentUser
    );
    // รับข้อมูลหมายเลข hotelId จาก URL ที่ส่งมาด้วย
    const { hotelId } = useParams();
    // เพื่อรับข้อมูลที่ผู้จองกรอกในฟอร์มจองที่พัก
    const search = useSearchContext();
    // ตัวแปรเก็บค่าคำนวณจำนวนวันที่จอง
    const [numberOfNights, setNumberOfNights] = useState<number>(0);
    // กำหนดให้คำนวณจำนวนวันที่เข้าพักทันที เมื่อโหลดหน้านี้
    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights =
                Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
                (1000 * 60 * 60 * 24);

            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    // อ่านข้อมูลที่พัก
    const { data: hotel } = useQuery(
        "fetchHotelByID",
        () => apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId,
        }
    );

    // สร้างข้อมูล Payment Intent กับทาง Stripe และเก็บผลการดำเนินการ
    const { data: paymentIntentData } = useQuery(
        "createPaymentIntent",
        () =>
            apiClient.createPaymentIntent(
                hotelId as string,
                numberOfNights.toString()
            ),
        {
            enabled: !!hotelId && numberOfNights > 0, // จะทำงานใน "createPaymentIntent" ก็ต่อเมื่อมี hotelId และ numberOfNights > 0
        }
    );

    return <div className="grid md:grid-cols-[1fr_2fr] container mx-auto gap-4">
        {(hotel !== undefined) ?
            (
                <BookingDetailsSummary
                    checkIn={search.checkIn}
                    checkOut={search.checkOut}
                    adultCount={search.adultCount}
                    childCount={search.childCount}
                    numberOfNights={numberOfNights}
                    hotel={hotel}
                />
            )
            :
            (<>
                กำลังโหลด Booking Details Summary
            </>)}

        {/* ถ้ามีข้อมูลล็อกอินของผู้ใช้งานและสร้าง Payment Intent สำเร็จ */}
        {currentUser && paymentIntentData &&
            <Elements
                stripe={stripePromise}
                options={{
                    clientSecret: paymentIntentData.clientSecret,
                }}
            >
                <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
            </Elements>

        }

    </div>

};

export default Booking