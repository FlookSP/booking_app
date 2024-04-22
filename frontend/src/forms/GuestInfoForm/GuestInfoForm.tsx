import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

// ระบุ Props ของ Object ที่ Component นี้จะรับเข้ามา 
type Props = {
    hotelId: string;
    pricePerNight: number;
};

// รายละเอียดของตัวแปร่าง ๆ ใน GuestInfoForm
type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
    const search = useSearchContext(); // เรียกดูข้อมูลค้นหาที่ผู้ใช้งานระบุล่าสุดผ่าน Context API
    const { isLoggiedIn } = useAppContext(); // ตรวจสอบว่าล็อกอินหรือยัง
    const navigate = useNavigate(); // สำหรับการเปลี่ยนไปยัง Page อื่น ๆ
    const location = useLocation(); // เพื่อช่วยจำหน้าที่อยู่ในปัจจุบัน

    const {
        watch, // ตรวจสอบตัวแปรใน React Hook Form
        register, // เพิ่มตัวแปรใน React Hook Form
        handleSubmit, // จัดการกรณีผู้ใช้งานกดปุ่ม Submit
        setValue,
        formState: { errors }, // ตรวจสอบ Error จาก React Hook Form
    } = useForm<GuestInfoFormData>({ // ใช้งาน React Hook Form และกำหนด Type ที่ใช้งานด้วย
        defaultValues: { // กำหนดค่า Default ของตัวแปรในฟอร์มด้วย defaultValues  
            checkIn: search.checkIn, // ผู้ใช้งานจะได้เห็นค่าที่ตนเองใส่ในหน้าค้นหาที่พัก 
            checkOut: search.checkOut,
            adultCount: search.adultCount,
            childCount: search.childCount,
        },
    });

    // Monitor ค่าตัวแปร checkIn, checkOut ในฟอร์ม 
    // โดยถ้ามีการเปลี่ยนค่า ให้ทำการ update ค่าเหล่านี้ใน Component ที่เกี่ยวข้องด้วย
    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    // ฟังก์ชันรองรับการทำงานกรณีที่ผู้ใช้งานกดปุ่ม "เข้าสู่ระบบเพื่อจอง"
    const onSignInClick = (data: GuestInfoFormData) => {
        // เก็บค่าตัวแปรที่กรอกในแบบฟอร์ม
        search.saveSearchValues(
            "", // ตัวแปรที่เหลือกำหนดเป็น empty string
            data.checkIn,
            data.checkOut,
            data.adultCount,
            data.childCount,
            search.page,
        );
        // state: { from: location } คือ เซฟที่อยู่ URL นี้ 
        // เพื่อให้สามารถ Click ย้อนกลับมาจากหน้า Sign In แล้วมาที่หน้าเดิมนี้ได้ โดยที่ค่าในแบบฟอร์มยังคงเดิม
        // รวมถึงหน้า SignIn ยังสามารถตรวจสอบได้ว่ามีการล็อกอินจากทางหน้า GuestInfoForm
        // เนื่องจากเรามีการกำหนด state ด้วย "react-router-dom"
        navigate("/sign-in", { state: { from: location } });
    };

    // ฟังก์ชันรองรับการทำงานกรณีที่ผู้ใช้งานกดปุ่ม "จองตอนนี้"
    const onSubmit = (data: GuestInfoFormData) => {
        search.saveSearchValues(
            "",
            data.checkIn,
            data.checkOut,
            data.adultCount,
            data.childCount,
            search.page,
        );
        navigate(`/hotel/${hotelId}/booking`);
    };

    return (
        <div className="flex flex-col p-4 bg-blue-200 gap-4 rounded">
            <h3 className="text-md font-bold">฿{pricePerNight} ราคาต่อคืน</h3>
            <form
                onSubmit={
                    // เรียกใช้งานฟังก์ชันให้เหมาะสมตามสถานภาพการล็อกอิน
                    isLoggiedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
                }
            >
                <div className="grid grid-cols-1 gap-4 items-center ">
                    <div>
                        <DatePicker
                            required
                            selected={checkIn}
                            // เมื่อผู้ใช้งานเลือกวันแล้ว ให้อับเดตค่าตัวแปร checkIn ในแบบฟอร์มด้วยฟังก์ชัน setValue 
                            onChange={(date) => setValue("checkIn", date as Date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="min-w-full bg-white p-2 focus:outline-none rounded"
                            wrapperClassName="min-w-full"
                        />
                    </div>
                    <div>
                        <DatePicker
                            required
                            selected={checkOut}
                            // เมื่อผู้ใช้งานเลือกวันแล้ว ให้อับเดตค่าตัวแปร checkOut ในแบบฟอร์มด้วยฟังก์ชัน setValue 
                            onChange={(date) => setValue("checkOut", date as Date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText="Check-in Date"
                            className="min-w-full bg-white p-2 focus:outline-none rounded"
                            wrapperClassName="min-w-full"
                        />
                    </div>
                    <div className="flex bg-white px-2 py-1 gap-2 rounded">
                        <label className="items-center flex">
                            ผู้ใหญ่:
                            <input
                                className="w-fit p-1 focus:outline-none font-bold"
                                type="number"
                                min={1}
                                max={20}
                                {...register("adultCount", {
                                    required: "ต้องระบุข้อมูลในช่องนี้",
                                    min: {
                                        value: 1,
                                        message: "ต้องระบุผู้เข้าพักเป็นผู้ใหญ่อย่างน้อยหนึ่งคน",
                                    },
                                    valueAsNumber: true, // รับค่าในฟอร์มแบบ number
                                })}
                            />
                        </label>
                        <label className="items-center flex">
                            เด็ก:
                            <input
                                className="w-fit p-1 focus:outline-none font-bold"
                                type="number"
                                min={0}
                                max={20}
                                {...register("childCount", {
                                    valueAsNumber: true,
                                })}
                            />
                        </label>
                        {errors.adultCount && (
                            <span className="text-red-500 font-semibold text-sm">
                                {errors.adultCount.message}
                            </span>
                        )}
                    </div>
                    {/* เลือกแสดงปุ่มกดตามสถานะภาพการล็อกอิน */}
                    {isLoggiedIn ? (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500  w-fit rounded">
                            จองตอนนี้
                        </button>
                    ) : (
                        <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500  w-fit rounded">
                            เข้าสู่ระบบเพื่อจอง
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default GuestInfoForm;