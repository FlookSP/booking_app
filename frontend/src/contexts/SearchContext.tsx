import React, { useContext, useState } from "react";
// สร้าง type ชื่อ SearchContext โดยภายในจะระบุประเภทของข้อความค้นหาที่พัก
// ในที่นี้เราจะระบุตาม Field ต่าง ๆ ที่อยู่ใน Search Bar Component ซึ่งเราจะสร้างขึ้นภายหลัง
type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId: string; // เก็บ hotelId ไว้เผื่อผู้ใช้งาน Click เข้าไปดูรายละเอียดเพิ่มเติม
    page: number; // เก็บหน้าไว้ เผื่อการย้อนกลับมาจากหน้าดูรายละเอียดแล้วจะยังคงเป็นหน้าปัจจุบัน
    // ฟังก์ชันเก็บค่าค้นหาที่ผู้ใช้งานกรอกไว้
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        page: number
    ) => void;
};

// สร้าง type SearchContextProviderProps เพื่ออธิบายว่า props ที่จะรับมาเป็น React.ReactNode
type SearchContextProviderProps = {
    children: React.ReactNode;
};

// สร้าง Context API ชื่อ SearchContext โดยอาศัย createContext Method พร้อมระบุประเภทของข้อมูลเป็น SearchContext และกำหนดค่า Default เป็น undefined 
const SearchContext = React.createContext<SearchContext | undefined>(undefined);

// กำหนดการทำงานของ SearchContext
export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
    // สร้างตัวแปรสำหรับเก็บข้อมูลตาม Field ต่าง ๆ ที่อยู่ใน Search Bar Component
    const [destination, setDestination] = useState<string>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage โดยถ้าไม่มีก็กำหนดค่าเป็น ""
        () => sessionStorage.getItem("destination") || ""
    );
    const [checkIn, setCheckIn] = useState<Date>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage ก่อน
        () => new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
    );
    const [checkOut, setCheckOut] = useState<Date>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage ก่อน
        () => new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
    );
    const [adultCount, setAdultCount] = useState<number>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage ก่อน
        () => parseInt(sessionStorage.getItem("adultCount") || "1")
    ); // กำหนดให้ขั้นต่ำผู้ใหญ่ 1 คนเข้าพัก
    const [childCount, setChildCount] = useState<number>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage ก่อน
        () => parseInt(sessionStorage.getItem("childCount") || "0")
    ); // เด็กไม่จำเป็นต้องเข้าพัก
    const [hotelId, setHotelId] = useState<string>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage ก่อน
        () => sessionStorage.getItem("hotelID") || ""
    );
    const [page, setPage] = useState<number>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage ก่อน
        () => parseInt(sessionStorage.getItem("page") || "1")
    );
    // สร้างฟังก์ชันบันทึกค่าค้นหาที่ผู้ใช้งานกรอกเข้ามา
    const saveSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        page: number,
        hotelId?: string, // กำหนดให้ hotelId เป็น Optional


    ) => {
        // ทำการอับเดตตัวแปรต่าง ๆ ด้วย set ฟังก์ชัน
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setAdultCount(adultCount);
        setChildCount(childCount);
        setPage(page);
        // ทำการบันทึกข้อมูลใน Session Storage ด้วยเพื่อให้เวลา Refresh Browser ข้อมูลจะไม่หายไป
        sessionStorage.setItem("destination", destination);
        sessionStorage.setItem("checkIn", checkIn.toISOString());
        sessionStorage.setItem("checkOut", checkOut.toISOString());
        sessionStorage.setItem("adultCount", adultCount.toString());
        sessionStorage.setItem("childCount", childCount.toString());
        if (hotelId) {
            setHotelId(hotelId);
            // ทำการบันทึกข้อมูลใน Session Storage ด้วยเพื่อให้เวลา Refresh Browser ข้อมูลจะไม่หายไป
            sessionStorage.setItem("hotelId", hotelId);
        }
        sessionStorage.setItem("page", page.toString());
    };

    return (
        // เราจะอาศัย Provider Component ในการส่งข้อมูลใน value ให้กับ Children Component ที่เกี่ยวข้อง 
        <SearchContext.Provider value={{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount,
            hotelId,
            page,
            saveSearchValues,
        }}>
            {children}
        </SearchContext.Provider>
    )
};

// ส่งออก Context API ชื่อ SearchContext นี้ในรูปของ useSearchContext
export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext;
};