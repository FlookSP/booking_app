import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
    // การรับ hotelId จาก URL จะอาศัย useParams แทนการใช้ Props 
    const { hotelId } = useParams();
    // ใช้ useQuery เพื่อเรียกข้อมูลที่พักจาก Backend API ที่กำหนด มาเก็บไว้ในตัวแปรชื่อ data  
    const { data } = useQuery(
        "fetchHotelById", // เราตั้งชื่อ useQuery นี้ว่า "fetchHotelById"
        () => apiClient.fetchHotelById(hotelId || ""), // เรียกใช้งานฟังก์ชัน fetchHotelById ใน apiClient
        {
            enabled: !!hotelId, // กำหนดว่าให้ตรวจสอบ hotelId ว่ามีค่าถูกส่งมาด้วยก่อนจึงจะสามารถทำงานใน fetchHotelById ได้
        }
    );

    if (!data) {
        return <></>;
    }

    // ทำการอ่านที่อยู่ URL จากไฟล์ .env ใน Vite ด้วย import.meta
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
    // สร้าง URL สำหรับแสดงรูปภาพที่พัก
    const urls: string[] = [];
    if (data.imageUrls) {
        // Loop ข้อมูลแบบ FileList ด้วย Array.from แปลงเป็น Array ก่อน
        Array.from(data.imageUrls).forEach((name) => {
            urls.push(`${API_BASE_URL}/api/my-hotels/file/${name}`);
        });
    }

    return (
        <div className="space-y-6 mx-12 relative">
            <div>
                <span className="flex">
                    {Array.from({ length: data.starRating }).map((items, index) => (
                        <AiFillStar key={index + '' + items} className="fill-yellow-400" />
                    ))}
                </span>
                <h1 className="text-3xl font-bold">{data.name}</h1>
            </div>
            {(urls.length < 4) ?
                (<> {(urls.length === 3) ?
                    (<>
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-1  ">
                            <div className="w-full h-[300px]">
                                <img
                                    src={urls[0]} // แสดงเฉพาะรูปแรก
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <div className="w-full grid grid-rows-[1fr_1fr]">
                                <div className="h-[150px]  max-sm:h-[300px]">
                                    <img
                                        src={urls[1]} // แสดงเฉพาะรูปแรก
                                        className="w-full h-full object-cover object-center pb-1"
                                    />
                                </div>
                                <div className="h-[150px]  max-sm:h-[300px]">
                                    <img
                                        src={urls[2]} // แสดงเฉพาะรูปแรก
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                            </div>

                        </div>
                    </>) :
                    (<>
                        <div className="flex flex-row max-sm:flex-col gap-4 ">
                            {urls.map((image, index) => (
                                <div key={index} className="h-[300px] w-full">
                                    <img
                                        src={image}
                                        alt={data.name}
                                        className="rounded-md w-full h-full object-cover object-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </>)}

                </>)
                :
                // ถ้ามีรูปตั้งแต่ 4 รูปขึ้นไป 
                (<>
                    {(urls.length === 4) ?
                        (<>
                            <div className="w-full grid grid-cols-1 lg:grid-rows-[1fr_150px]">
                                <div className="w-full h-[300px] pb-1">
                                    <img
                                        src={urls[0]} // แสดงเฉพาะรูปแรก
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                                <div className=" grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-1">
                                    <div className="h-[150px] w-full max-sm:h-[300px]">
                                        <img
                                            src={urls[1]} // แสดงเฉพาะรูปแรก
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="h-[150px] w-full max-sm:h-[300px]">
                                        <img
                                            src={urls[2]} // แสดงเฉพาะรูปแรก
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="h-[150px] w-full max-sm:h-[300px]">
                                        <img
                                            src={urls[3]} // แสดงเฉพาะรูปแรก
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>)
                        :
                        (<>
                            {(urls.length === 5) ?
                                (<>
                                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-1  ">
                                        <div className="w-full grid grid-rows-[1fr_1fr]">
                                            <div className="h-[225px] max-sm:h-[300px]">
                                                <img
                                                    src={urls[0]} // แสดงเฉพาะรูปแรก
                                                    className="w-full h-full object-cover object-center pb-1"
                                                />
                                            </div>
                                            <div className="h-[225px] max-sm:h-[300px]">
                                                <img
                                                    src={urls[1]} // แสดงเฉพาะรูปแรก
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full grid grid-rows-[1fr_1fr_1fr]">
                                            <div className="h-[150px] max-sm:h-[300px]">
                                                <img
                                                    src={urls[2]} // แสดงเฉพาะรูปแรก
                                                    className="w-full h-full object-cover object-center pb-1"
                                                />
                                            </div>
                                            <div className="h-[150px] max-sm:h-[300px]">
                                                <img
                                                    src={urls[3]} // แสดงเฉพาะรูปแรก
                                                    className="w-full h-full object-cover object-center pb-1"
                                                />
                                            </div>
                                            <div className="h-[150px] max-sm:h-[300px]">
                                                <img
                                                    src={urls[4]} // แสดงเฉพาะรูปแรก
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </>)
                                :
                                (<>
                                    <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 ">
                                        {urls.map((image, index) => (
                                            <div key={index} className="h-[300px] w-full">
                                                <img
                                                    src={image}
                                                    alt={data.name}
                                                    className="rounded-md w-full h-full object-cover object-center"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>)}

                        </>)}

                </>)}
            {/* flex flex-wrap space-x-0 md:flex-nowrap md:space-x-1 gap-2 คือ แสดงแบบ flex-row และขึ้นบรรทัดใหม่ตามขนาดพื้นที่ให้โดยอัตโนมัติ */}
            <div className="flex flex-wrap space-x-0 md:flex-nowrap md:space-x-1 gap-2">
                {data.facilities.map((facility, index) => (
                    <div key={index} className="text-center border border-slate-300 rounded p-3 w-fit bg-slate-300 text-sm font-bold">
                        {facility}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
                <div className="whitespace-pre-line">{data.description}</div>
                <div className="h-fit">
                    <GuestInfoForm
                        pricePerNight={data.pricePerNight}
                        hotelId={data._id}
                    />
                </div>
            </div>
        </div>
    );
};

export default Detail;