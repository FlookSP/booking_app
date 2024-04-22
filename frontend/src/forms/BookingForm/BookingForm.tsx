import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useSearchContext } from "../../contexts/SearchContext";

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};
// รายละเอียดของการจอง
export type PaymentIntentResponse = {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
};

// ระบุรายละเอียด Props ที่ฟอร์มนี้จะรับเข้ามา
type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
};

// รายละเอียดของตัวแปรต่าง ๆ ในฟอร์ม BookingFormData นี้
export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
    // เรียกใช้งาน Stripe Library
    const stripe = useStripe();
    const elements = useElements();
    // อ่านค่า hotelId จากทาง URL ด้วย useParams
    const { hotelId } = useParams();

    // เรียกดูข้อมูลที่พักที่จะจอง
    const search = useSearchContext();

    const { showToast } = useAppContext();

    // ใช้งาน React Hook Form และกำหนด Type ที่ใช้งานด้วย
    const { handleSubmit, register } = useForm<BookingFormData>({
        // กำหนดค่าเริ่มต้น BookingFormData ซึ่งเป็นการดึงข้อมูลจากที่ต่าง ๆ เช่น currentUser เป็นต้น มาใส่ในฟอร์ม
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount: search.adultCount,
            childCount: search.childCount,
            checkIn: search.checkIn.toISOString(), // การส่ง Date ทาง API จะต้องแปลงเป็น ISO String ก่อน
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
            totalCost: paymentIntent.totalCost,
            paymentIntentId: paymentIntent.paymentIntentId,
        },
    });

    // ฟังก์ชันจองที่พักชื่อ bookRoom
    const { mutate: bookRoom, isLoading } = useMutation(
        apiClient.createRoomBooking,
        {
            onSuccess: () => {
                showToast({ message: "บันทึกการจองแล้ว!", type: "SUCCESS" });
            },
            onError: () => {
                showToast({ message: "เกิดข้อผิดพลาดในการบันทึกการจอง", type: "ERROR" });
            },
        }
    );

    // ฟังก์ชันทำงานกรณีเมื่อกดปุ่ม Submit
    const onSubmit = async (formData: BookingFormData) => {
        if (!stripe || !elements) {
            return;
        }

        // ทำการจ่ายเงินที่พักด้วยข้อมูลบัตรเครดิตที่ผู้ใช้งานกรอก
        const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as StripeCardElement,
            },
        });
        // ถ้าจ่ายเงินสำเร็จ ให้ทำการจองที่พัก
        if (result.paymentIntent?.status === "succeeded") {
            // ทำการส่งข้อมูล formData และ paymentIntent.id ในรูปของแบบฟอร์ม { }
            bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
        }

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
            <span className="text-3xl font-bold">ยืนยันรายละเอียดของคุณ</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-black text-sm font-bold flex-1">
                    ชื่อต้น
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled // ไม่อนุญาตให้แก้ไขค่าใน Input นี้
                        {...register("firstName")} // กำหนดว่า Input Field นี้ชื่อ "firstName"
                    />
                </label>
                <label className="text-black text-sm font-bold flex-1">
                    นามสกุล
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("lastName")}
                    />
                </label>
                <label className="text-black text-sm font-bold flex-1">
                    อีเมล
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("email")}
                    />
                </label>
            </div>

            <div className="space-y-2">
                <h2 className="text-black text-sm font-bold">สรุปราคาของคุณ</h2>

                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-sm">
                        ค่าใช้จ่ายทั้งหมด: ฿{paymentIntent.totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs">รวมภาษีและค่าธรรมเนียมต่าง ๆ</div>
                </div>
            </div>

            {/* เรียกใช้งาน CardElement จาก Stripe SDK เพื่อแสดงช่องกรอกรหัสบัตรเครดิตในการจ่ายเงิน */}
            <div className="space-y-2">
                <h3 className="font-semibold text-sm"> รายละเอียดการจ่ายเงิน</h3>
                <CardElement
                    id="payment-element"
                    className="border rounded-md p-2 text-sm"
                />
                <div className="text-xs">การจ่ายเงินออนไลน์ของคุณมีความปลอดภัย โดยทางเว็บไซต์ของเราจะไม่เก็บข้อมูลบัตรเครดิตของคุณ แต่จะส่งไปยัง Stripe โดยตรง</div>
            </div>

            <div className="flex justify-end">
                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-sm disabled:bg-gray-500 rounded"
                >
                    {isLoading ? "กำลังบันทึก..." : "ยืนยันการจอง"}
                </button>
            </div>

        </form>
    )
}

export default BookingForm