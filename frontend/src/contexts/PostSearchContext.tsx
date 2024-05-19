import React, { useContext, useState } from "react";
// สร้าง type ชื่อ SearchContext โดยภายในจะระบุข้อมูลเกี่ยวกับบทความ
// ในที่นี้เราจะระบุตาม Field ต่าง ๆ ที่อยู่ใน Search Bar Component ซึ่งเราจะสร้างขึ้นภายหลัง
type PostSearchContext = {
    description: string;
    category: string;
    page: number;
    comment: string;
    // ฟังก์ชันเก็บค่าค้นหาที่ผู้ใช้งานกรอกไว้
    savePostSearchValues: (
        description: string,
        category: string,
        page: number,
        comment: string,
    ) => void;
};

// สร้าง type SearchContextProviderProps เพื่ออธิบายว่า props ที่จะรับมาเป็น React.ReactNode
type PostSearchContextProviderProps = {
    children: React.ReactNode;
};

// สร้าง Context API ชื่อ SearchContext โดยอาศัย createContext Method พร้อมระบุประเภทของข้อมูลเป็น SearchContext และกำหนดค่า Default เป็น undefined 
const PostSearchContext = React.createContext<PostSearchContext | undefined>(undefined);

// กำหนดการทำงานของ SearchContext
export const PostSearchContextProvider = ({ children }: PostSearchContextProviderProps) => {
    // สร้างตัวแปรสำหรับเก็บข้อมูลตาม Field ต่าง ๆ ที่อยู่ใน Search Bar Component
    const [description, setDescription] = useState<string>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage โดยถ้าไม่มีก็กำหนดค่าเป็น ""
        () => sessionStorage.getItem("description") || ""
    );

    const [category, setCategory] = useState<string>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage โดยถ้าไม่มีก็กำหนดค่าเป็น ""
        () => sessionStorage.getItem("category") || ""
    );

    const [page, setPage] = useState<number>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage ก่อน
        () => parseInt(sessionStorage.getItem("page") || "1")
    );

    const [comment, setComment] = useState<string>(
        // ทำการกำหนดค่าโดยตรวจสอบว่ามีการกำหนดค่าใน Session Storage โดยถ้าไม่มีก็กำหนดค่าเป็น ""
        () => sessionStorage.getItem("comment") || ""
    );

    // สร้างฟังก์ชันบันทึกค่าค้นหาที่ผู้ใช้งานกรอกเข้ามา
    const savePostSearchValues = (
        description: string,
        category: string,
        page: number,
        comment: string,
    ) => {
        // ทำการอับเดตตัวแปรต่าง ๆ ด้วย set ฟังก์ชัน
        setDescription(description);
        setCategory(category);
        setPage(page);
        setComment(comment);
        // ทำการบันทึกข้อมูลใน Session Storage ด้วยเพื่อให้เวลา Refresh Browser ข้อมูลจะไม่หายไป
        sessionStorage.setItem("description", description);
        sessionStorage.setItem("category", category);
        sessionStorage.setItem("page", page.toString());
        sessionStorage.setItem("comment", comment);
    };

    return (
        // เราจะอาศัย Provider Component ในการส่งข้อมูลใน value ให้กับ Children Component ที่เกี่ยวข้อง 
        <PostSearchContext.Provider value={{
            description,
            category,
            page,
            comment,
            savePostSearchValues,
        }}>
            {children}
        </PostSearchContext.Provider>
    )
};

// ส่งออก Context API ชื่อ PostSearchContext นี้ในรูปของ usePostSearchContext
export const usePostSearchContext = () => {
    const context = useContext(PostSearchContext);
    return context as PostSearchContext;
};