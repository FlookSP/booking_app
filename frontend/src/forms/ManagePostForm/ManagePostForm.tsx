import { FormProvider, useForm } from "react-hook-form";
import { PostType } from "../../shared/types";
import { useEffect } from "react";
import ImagesPostSection from "./ImagesPostSection";
import DetailsPostSection from "./DetailsPostSection";
import TypePostSection from "./TypePostSection";

// เรากำหนด Type ของฟอร์มไว้ในไฟล์เดียวกัน ข้อดี คือ การค้นหาเพื่อปรับปรุงแก้ไขในภายหลังทำได้ง่าย
export type CreatePostFormData = {
    userId: string; // หมายเลขไอดีของผู้ใช้งาน
    content: string; // บทความ
    title: string; // ชื่อบทความต้องไม่ซ้ำกัน
    imageUrls: string[]; // รูปในบทความ
    category: string; // ประเภทบทความ
    slug: string;
    imageFiles: FileList; // รายการไฟล์ที่ผู้ใช้เลือกในตอนอับโหลด (HTMLInputElement.files) จะเป็นอ็อบเจ็กต์แบบ FileList
};

// สร้าง Type สำหรับกำหนดว่า Argument ที่ CreatePostForm Component นี้สามารถรับค่ามาได้นั้น จะเป็นข้อมูลแบบ HotelType
type Props = {
    post?: PostType; // post เป็น Optional Props เพราะเราสามารถส่งค่าผ่านทาง PostSearchResultsCard.tsx หรือ HomePostPage.tsx
    onSave: (CreatePostFormData: FormData) => void;
    isLoading: boolean;
};

const ManagePostForm = ({ onSave, isLoading, post }: Props) => {
    // และเนื่องจากเราออกแบบให้ ManageHotelForm ประกอบไปด้วย Component ย่อย ๆ เพื่อรับข้อมูลในรูปแบบต่าง ๆ กัน
    // ดังนั้น เราจึงไม่ระบุฟังก์ชันที่เกี่ยวข้องใน { } เหมือนฟอร์ม Sign In ในตอนสร้างทีแรก แต่จะสร้างตัวแปรชื่อ formMethods แทน
    const formMethods = useForm<CreatePostFormData>();
    // แล้วค่อยกำหนดว่า formMethods ประกอบไปด้วยฟังก์ชันอะไรบ้าง
    const {
        handleSubmit, // ฟังก์ชันที่จะจัดการตรวจสอบฟอร์มเมื่อกดปุ่ม type "submit"
        reset, // ฟังก์ชันจาก React Hook Form สำหรับ Reset ข้อมูลในฟอร์ม
    } = formMethods;

    // ถ้ามีการส่งข้อมูลที่พักมาด้วยผ่านทาง post เช่น การเปิดบทความเพื่อแก้ไข เป็นต้น
    useEffect(() => {
        reset(post); // จัดการแสดงข้อมูลที่พักนั้นในแบบฟอร์มนี้ด้วย reset
    }, [post, reset]); // ทำงานใน useEffect นี้เมื่อมีการแก้ไขค่า post, reset

    // เรากำหนดฟังก์ชันชื่อ onSubmit ใน ManagePostForm
    // ให้ทำงานร่วมกับฟังก์ชัน handleSubmit ใน react-hook-form
    const onSubmit = handleSubmit((formDataJson: CreatePostFormData) => {
        const formData = new FormData();
        // ถ้ามีการส่งข้อมูลบทความมาให้
        if (post) {
            formData.append("postId", post._id); // เก็บ postId ไว้ใช้อ้างอิงภายหลัง
        }
        formData.append("title", formDataJson.title);
        formData.append("category", formDataJson.category);
        formData.append("content", formDataJson.content);

        // ปรับปรุง imageUrls ให้เป็นรายชื่อไฟล์ที่ผู้ใช้งานเลือกมาล่าสุด
        if (formDataJson.imageUrls) {
            formDataJson.imageUrls.forEach((url, index) => {
                formData.append(`imageUrls[${index}]`, url);
            });
        }
        // Loop ข้อมูลแบบ FileList ด้วย Array.from แปลงเป็น Array ก่อน
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append("imageFiles", imageFile);
        });
        // บันทึกข้อมูลในฐานข้อมูล
        onSave(formData);
    });

    return (
        // FormProvider จะส่งข้อมูลในแบบฟอร์มนี้ไปยัง formMethods
        <FormProvider {...formMethods}>
            <form
                className="flex flex-col gap-10 container mx-auto "
                onSubmit={onSubmit}
            >
                <DetailsPostSection />
                <TypePostSection />
                <ImagesPostSection />
                <span>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-blue-700 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500 rounded-sm"
                    >
                        {isLoading ? "กำลังบันทึกข้อมูล..." : "บันทึก"}
                    </button>
                </span>
            </form>

        </FormProvider>
    )
}

export default ManagePostForm