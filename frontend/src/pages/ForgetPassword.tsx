import { Link } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
// เรียกใช้งานฟังก์ชันทั้งหมดในไฟล์ api-client.ts ด้วยชื่อ apiClient
import * as apiClient from "../api-client";

// เราต้องกำหนด Type ของ Input ต่าง ๆ ใน Log In Form
// เพื่อให้ useForm ใช้ในการตรวจสอบข้อมูลที่ผู้ใช้งานกรอกเข้ามา
export type ForgetPasswordFormData = {
    email: string;
};

const ForgetPassword = () => {
    // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showToast
    const { showToast } = useAppContext();

    // เราต้องกำหนดว่าจะใช้งานฟังก์ชันดังต่อไปนี้ใน useForm
    // สำหรับทำหน้าที่ตรวจสอบ Input ต่าง ๆ ใน ResetPassword Form
    const {
        register, // ฟังก์ชันตรวจสอบการกรอกข้อมูลในช่องต่าง ๆ
        handleSubmit, // ฟังก์ชันที่จะจัดการตรวจสอบฟอร์มเมื่อกดปุ่ม type "submit"
        formState: { errors }, // สำหรับจัดการข้อความ error ที่เกิดขึ้นจากการตรวจสอบ Input
    } = useForm<ForgetPasswordFormData>();

    // เรากำหนดฟังก์ชันชื่อ onSubmit ใน Forget Password Form
    // ให้ทำงานร่วมกับฟังก์ชัน handleSubmit ใน react-hook-form
    // เพื่อตรวจสอบข้อมูลที่กรอกในแบบฟอร์ม
    // โดยถ้า Submit Form สำเร็จ ให้ทำการนำข้อมูลใน Form รับเข้ามาโดยกำหนดชื่อว่า data
    const onSubmit = handleSubmit((data) => {
        console.log("data: ", data);
        // ทำการส่งข้อมูลในฟอร์มไปยังฟังก์ชัน mutate ซึ่งจะเป็นการเรียกใช้งานฟังก์ชัน useMutation
        // ซึ่งจะเรียกใช้งานฟังก์ชัน fogetPassword ในไฟล์ api-client.ts โดยเป็นการส่งข้อมูลไปยัง API Backend อีกทีหนึ่ง
        mutation.mutate(data);

    });

    // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์มนี้
    // useMutation จะใช้งานฟังก์ชัน signIn ในไฟล์ api-client.ts
    const mutation = useMutation(apiClient.fogetPassword, {
        // ถ้าเรียกใช้งาน API Backend ได้สำเร็จ
        onSuccess: async () => {
            // เรียกใช้งานฟังก์ชัน showToast ใน AppContext Global State
            showToast({
                message: "อีเมลถูกส่งถึงคุณแล้ว!",
                type: "SUCCESS",
            });
        },
        // ถ้ามีข้อผิดพลาดเกิดขึ้นให้แสดงข้อความา Error ที่เกิดขึ้น
        // ในฟังก์ชัน register เรากำหนดให้ทำการ throw new Error(responseBody.message)
        // จึงสามารถตรวจจับ responseBody.message ได้
        onError: (error: Error) => {
            // เรียกใช้งานฟังก์ชัน showToast ใน AppContext Global State
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    return (
        <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
            <h1 className="text-3xl font-medium">ตั้งค่ารหัสผ่านใหม่</h1>
            <p className="text-slate-700">ลืมรหัสผ่าน? ป้อนที่อยู่อีเมลของคุณด้านล่างเพื่อเริ่มกระบวนการตั้งค่ารหัสผ่านใหม่สำหรับบัญชีของคุณ</p>

            <form onSubmit={onSubmit} className="my-10">
                <div className="flex flex-col space-y-5">
                    <label htmlFor="email">
                        <p className="font-medium text-slate-700 pb-2">ที่อยู่อีเมล</p>
                        <input
                            type="email"
                            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                            placeholder="กรอกอีเมล์"
                            // กำหนดต้องกรอกข้อมูลในช่องนี้ และระบุข้อความแจ้งเตือน
                            {...register("email", {
                                required: "ต้องระบุข้อมูลในช่องนี้",
                            })}
                        />
                        {/* กำหนดให้แสดงข้อความแจ้งเตือนที่กำหนดเมื่อผู้ใช้งานไม่กรอกข้อมูลในช่องนี้ */}
                        {errors.email && (
                            <span className="text-red-500">{errors.email.message}</span>
                        )}
                    </label>

                    <button className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>

                        <span>ตั้งค่ารหัสผ่านใหม่</span>
                    </button>
                    <p className="text-center">ยังไม่ได้ลงทะเบียนใช่หรือไม่? <Link to="/register" className="text-indigo-600 font-medium inline-flex space-x-1 items-center"><span>สมัครใช้บริการ </span><span><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg></span></Link></p>
                </div>
            </form>
        </div>
    )
}

export default ForgetPassword