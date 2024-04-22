import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

// รหัส Publishable key
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// สร้าง type ชื่อ ToastMessage โดยภายในจะระบุประเภทข้อความและประเภทของกล่องข้อความ
type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
};
// สร้าง type ชื่อ userRole โดยภายในจะระบุประเภทข้อมูลที่จะได้รับจาก backend
type userInfo = {
    userId: string;
    userRole: string;
};

// สร้าง type ชื่อ AppContext โดยภายในจะระบุฟังก์ชันที่จำเป็นต่อการแสดงกล่องข้อความ
// โดยหมายความว่าถ้ามีการเรียกใช้งานฟังก์ชัน showToast แล้ว จะต้องมีการระบุค่าประเภท
// message และ type ให้กับฟังก์ชันดังกล่าวด้วย 
// นอกจากนี้ยังระบุตัวแปรที่ใช้ตรวจสอบสถานะการล็อกอินและรายละเอียดผู้ใช้งาน
// รวมถึง รหัส Publishable key ในการติดต่อกับ Stripe
type AppContext = {
    // ฟังก์ชัน showToast ที่แสดงกล่องข้อความจะไม่ส่งคืนค่าใด ๆ
    // ฟังก์ชัน showToast รับค่าประเภท ToastMessage
    showToast: (toastMessage: ToastMessage) => void;
    // Log In State สำหรับตรวจสอบว่ามีการล็อกอินเข้ามาแล้วหรือยัง
    isLoggiedIn: boolean;
    // ตัวแปรแบบ Global State สำหรับตรวจสอบรายละเอียดผู้ใช้งาน
    userInfo: userInfo,
    // รหัส Publishable key ในการติดต่อกับ Stripe
    stripePromise: Promise<Stripe | null>;
};

// การสร้าง Global State ด้วย Context API คือ การที่เราสามารถส่งข้อมูลไปยัง Component 
// โดยไม่จำเป็นต้องส่งในลักษณะของการส่งจาก Parent Component ไปยัง Child Component ได้ 
// เหมาะกับกรณีที่ Parent Component และ Child Component มีโครงสร้างลึกและซับซ้อน 
// หรือการส่งข้อมูลที่จำเป็นต้องใช้งานโดย Component จำนวนมาก
// สร้าง Global State ชื่อ AppContext แบบ AppContext type หรือ undefined 
// รวมถึงกำหนดค่า Default เป็น undefined เพื่อรองรับการโหลด App ทำงานในตอนแรก
const AppContext = React.createContext<AppContext | undefined>(undefined);

// ทำการโหลด STRIPE_PUB_KEY
const stripePromise = loadStripe(STRIPE_PUB_KEY);

// สร้าง AppContextProvider เพื่อทำหน้าที่เชื่อมระหว่าง Global State ชื่อ AppContext กับ React
// ทำให้ React สามารถเรียกใช้งานสิ่งที่อยู่ใน AppContext ได้
export const AppContextProvider = ({
    children, // AppContextProvider รับค่าเป็น children
}: {
    children: React.ReactNode, // โดยที่ children เป็นค่าประเภท ReactNode
}) => {
    // useState คือ Hook Function ที่ใช้ในการประกาศ State และอาศัย Event ที่เกิดขึ้น เพื่อเรียกใช้งานฟังก์ชันที่ทำหน้าที่ปรับปรุง State 
    // กำหนดตัวแปรชื่อ toast และฟังก์ชันในการปรับปรุงตัวแปร toast ชื่อ setToast 
    // โดยตัวแปร toast เป็นตัวแปร ToastMessage หรือ undefined และกำหนดค่าเริ่มต้นเป็น undefined
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    // ตรวจสอบว่าล็อกอินแล้วหรือยัง โดยอาศัย react-query 
    // useQuery จะเรียกใช้งาน apiClient.validateToken และเรียกใช้งานเพียง 1 ครั้งด้วย retry: false
    // แล้วเก็บผลลัพธ์การติดต่อกับ backend ว่ามี Error หรือไม่ใน isError 
    // และเก็บข้อมูลที่ตอบกลับจาก backend ได้แก่ userId และ userRole ใน data
    const { isError, data } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });

    return ( // ทำการเรียกใช้งานฟังก์ชัน showToast และส่ง Global State อื่น ๆ พร้อมกับแสดง children ไปด้วย 
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                // กำหนดค่าตัวแปร toast ด้วยข้อความ toastMessage
                setToast(toastMessage);
            },
            // กำหนดค่าตัวแปร isLoggiedIn ตามผลลัพธ์จากการทำงานด้วย apiClient.validateToken
            isLoggiedIn: !isError,
            // กำหนดค่าตัวแปร userInfo ตามผลลัพธ์จากการทำงานด้วย apiClient.validateRole
            userInfo: data,
            // กำหนดค่าตัวแปร stripePromise
            stripePromise,
        }}>{/* ให้แสดง Toast component เมื่อตัวแปร toast ไม่ใช่ undefined */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(undefined)} // กำหนดให้ตัวแปร toast เป็น undefined จะทำให้ซ่อนกล่องข้อความนี้
                />
            )}
            {/* ทำการ Render children เพื่อแสดงผลการทำงานในโปรแกรม */}
            {children}
        </AppContext.Provider>
    )
};

// ทำการ export Global State เพื่อให้เรียกใช้งานในโปรแกรมได้โดยง่าย
export const useAppContext = () => {
    // กำหนดให้ใช้งาน Global State ชื่อ AppContext โดยอาศัย Hook ชื่อ useContext
    const context = useContext(AppContext);
    return context as AppContext;
};