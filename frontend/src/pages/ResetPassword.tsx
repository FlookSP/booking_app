import { useForm } from "react-hook-form";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { ResetPasswordFormData } from "../shared/types";

const ResetPassword = () => {
    // การรับ token จาก URL จะอาศัย useParams แทนการใช้ Props 
    const { token } = useParams();

    // ใช้งาน useNavigate ในการไปยังหน้าที่กำหนด
    const navigate = useNavigate();

    // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showToast
    const { showToast } = useAppContext();

    // เราต้องกำหนดว่าจะใช้งานฟังก์ชันดังต่อไปนี้ใน useForm
    // สำหรับทำหน้าที่ตรวจสอบ Input ต่าง ๆ ใน Reset Password Form
    const {
        register, // ฟังก์ชันตรวจสอบการกรอกข้อมูลในช่องต่าง ๆ
        watch, // ช่วยให้สามารถอ้างถึง Input อื่น เพื่อตรวจสอบข้อมูลที่อยู่คนละช่อง Input ได้
        handleSubmit, // ฟังก์ชันที่จะจัดการตรวจสอบฟอร์มเมื่อกดปุ่ม type "submit"
        formState: { errors }, // สำหรับจัดการข้อความ error ที่เกิดขึ้นจากการตรวจสอบ Input
    } = useForm<ResetPasswordFormData>();

    // เรากำหนดฟังก์ชันชื่อ onSubmit ใน Register Form
    // ให้ทำงานร่วมกับฟังก์ชัน handleSubmit ใน react-hook-form
    // เพื่อตรวจสอบข้อมูลที่กรอกในแบบฟอร์ม
    const onSubmit = handleSubmit((data) => {
        // ทำการส่งข้อมูลในฟอร์มไปยังฟังก์ชัน mutate ซึ่งจะเป็นการเรียกใช้งานฟังก์ชัน useMutation
        // ซึ่งจะเรียกใช้งานฟังก์ชัน register ในไฟล์ api-client.ts โดยเป็นการส่งข้อมูลไปยัง API Backend อีกทีหนึ่ง
        mutation.mutate(data);
    });

    // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์มนี้
    // useMutation จะใช้งานฟังก์ชัน register ในไฟล์ api-client.ts
    const mutation = useMutation(apiClient.resetPassword, {
        // ถ้าเรียกใช้งาน API Backend ได้สำเร็จ
        onSuccess: async () => {
            // เรียกใช้งานฟังก์ชัน showToast ใน AppContext Global State
            showToast({
                message: "เปลี่ยนรหัสผ่านให้ผู้ใช้งานเรียบร้อยแล้ว",
                type: "SUCCESS",
            });

            // เมื่อผู้ใช้งานทำการ Register ได้สำเร็จ โปรแกรมจะทำการไปยังหน้าที่กำหนด
            navigate("/sign-in");
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
            <p className="text-slate-700">ป้อนรหัสผ่านใหม่สำหรับบัญชีของคุณ</p>

            <form onSubmit={onSubmit}>

                <div className="mt-5">
                    <input
                        type="password"
                        placeholder="รหัสผ่าน"
                        className="border border-gray-400 py-1 px-2 w-full"
                        // กำหนดต้องกรอกข้อมูลในช่องนี้ และกำหนดให้รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                        {...register("password", {
                            required: "ต้องระบุข้อมูลในช่องนี้",
                            minLength: {
                                value: 6,
                                message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
                            },
                        })}
                    />
                    {/* กำหนดให้แสดงข้อความแจ้งเตือนที่กำหนดเมื่อผู้ใช้งานไม่กรอกข้อมูลในช่องนี้ */}
                    {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
                </div>
                <div className="mt-5">
                    <input
                        type="password"
                        placeholder="ยืนยันรหัสผ่าน"
                        className="border border-gray-400 py-1 px-2 w-full"
                        // กำหนดต้องกรอกข้อมูลในช่องนี้ และกำหนดให้รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                        {...register("confirmPassword", {
                            // ทำการตรวจสอบเงื่อนไขด้วย validate function
                            validate: (val) => {
                                // ถ้าไม่ได้กรอกข้อมูลในช่องนี้
                                if (!val) {
                                    return "ต้องระบุข้อมูลในช่องนี้";
                                }
                                // ถ้ารหัสผ่านในช่อง Password และ Confirm Password ไม่ตรงกัน
                                else if (watch("password") !== val) {
                                    return "รหัสผ่านของคุณไม่ตรงกัน";
                                }
                            },
                        })}
                    />
                    {/* กำหนดให้แสดงข้อความแจ้งเตือนที่กำหนดเมื่อผู้ใช้งานไม่กรอกข้อมูลในช่องนี้ */}
                    {errors.confirmPassword && (
                        <span className="text-red-500">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                <div className="mt-5">
                    <button
                        type="submit"
                        className="w-full bg-blue-800 py-3 text-center text-white hover:bg-blue-700 text-xl"
                    >
                        ดำเนินการแก้ไขรหัสผ่าน
                    </button>
                </div>
                <div>
                    <input
                        {...register("token")} // กำหนดให้ส่ง hidden input field ชื่อ token ไปใน Form นี้ด้วย
                        type="hidden"
                        value={token}
                    /></div>
            </form>
        </div>
    )
}

export default ResetPassword