import { FacilitiesFilter, HotelTypesFilter, Pagination, PriceFilter, SearchBar, SearchResultsCard, StarRatingFilter } from "../components"
import { useSearchContext } from "../contexts/SearchContext"
// ใช้ useQuery ในการเรียกดูข้อมูลจากทาง Backend API
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useState } from "react";

const Search = () => {
    // เรียกใช้งาน Context API ชื่อ SearchContext ที่เราสร้างขึ้นมา
    // SearchContext จะเก็บข้อมูลค้นหาที่ผู้ใช้งานระบุ
    const search = useSearchContext();

    // สร้างตัวแปรเก็บค่า Filter ต่าง ๆ ที่ผู้ใช้งานเลือก
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    // สร้างตัวแปรเก็บค่า Sort Option ที่ผู้ใช้งานเลือก
    const [sortOption, setSortOption] = useState<string>("");

    // ทำการสร้างข้อมูลค้นหาสำหรับเพื่อส่งไปยัง Backend APi
    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(), // แปลง Date เป็น String รูปแบบ ISO Format
        checkOut: search.checkOut.toISOString(), // แปลง Date เป็น String รูปแบบ ISO Format
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: search.page.toString(),
        // เพิ่มข้อมูล Filter
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        // เพิ่มข้อมูล Sort Option ที่ผู้ใช้งานเลืแอก
        sortOption,
    };

    // จะเริ่มต้นทำการค้นหาข้อมูลเมื่อโหลด Page นี้ โดยส่ง searchParams ไปยัง searchHotels เพื่อค้นหาข้อมูล
    const { data } = useQuery(["searchHotels", searchParams], () =>
        apiClient.searchHotels(searchParams)
    );

    // ฟังก์ชันทำงานกรณีที่เลือก Star Filter
    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value; // ค่าที่ผู้ใช้งานเลือกล่าสุด

        setSelectedStars((prevStars) =>
            event.target.checked
                ? [...prevStars, starRating] // ถ้ามีการเลือกของเดิมอยู่แล้ว และไม่ซ้ำ ให้นำไปเพิ่มกับของเดิม
                : prevStars.filter((star) => star !== starRating) // ถ้ามีการเลือกของเดิมอยู่แล้ว และซ้ำกัน ให้นำออกจากของเดิม
        );
    };

    // ฟังก์ชันทำงานกรณีที่เลือก Hotel Type Filter
    const handleHotelTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const hotelType = event.target.value;

        setSelectedHotelTypes((prevHotelTypes) =>
            event.target.checked
                ? [...prevHotelTypes, hotelType]
                : prevHotelTypes.filter((hotel) => hotel !== hotelType)
        );
    };

    // ฟังก์ชันทำงานกรณีที่เลือก Facility Filter
    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const facility = event.target.value;

        setSelectedFacilities((prevFacilities) =>
            event.target.checked
                ? [...prevFacilities, facility]
                : prevFacilities.filter((prevFacility) => prevFacility !== facility)
        );
    };

    return (
        <div className="container mx-auto">
            {/* Search Bar อยู่บนสุด */}
            <SearchBar />
            {/* Filter Bar อยู่ซ้ายมือ ส่วนด้านขวาเป็น SearchResultsCard แสดงรายการที่พักที่ค้นพบตามเงื่อนไข */}
            {/* lg:grid-cols-[250px_1fr] คือ ถ้าเป็นหน้าจอขนาดใหญ่ Filter Bar กว้าง 250 px สำหรับด้านขวาที่เหลือให้แสดง SearchResultsCard */}
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
                {/* ส่วน Filter Bar*/}
                <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky top-10">
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                            กรองโดย:
                        </h3>
                        <StarRatingFilter
                            selectedStars={selectedStars}
                            onChange={handleStarsChange}
                        />
                        <HotelTypesFilter
                            selectedHotelTypes={selectedHotelTypes}
                            onChange={handleHotelTypeChange}
                        />
                        <FacilitiesFilter
                            selectedFacilities={selectedFacilities}
                            onChange={handleFacilityChange}
                        />
                        <PriceFilter
                            selectedPrice={selectedPrice}
                            onChange={(value?: number) => setSelectedPrice(value)}
                        />
                    </div>
                </div>
                {/* ส่วน SearchResultsCard แสดงรายการที่พักที่ค้นพบตามเงื่อนไข*/}
                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        {/* ข้อความแจ้งผลการค้นหาที่พัก */}
                        <span className="text-xl font-bold">
                            {data?.pagination.total}  ที่พักที่ตรงกับความต้องการของคุณ
                            {search.destination ? ` ใน ${search.destination}` : ""}
                        </span>
                        {/* ส่วนแสดง Sort Option */}
                        {/* ส่วนแสดง Sort Option */}
                        <select
                            value={sortOption}
                            onChange={(event) => setSortOption(event.target.value)}
                            className="p-2 border rounded-md"
                        >
                            <option value="">เรียงลำดับตาม</option>
                            <option value="starRating">ระดับคะแนนที่พัก</option>
                            <option value="pricePerNightAsc">
                                ราคาที่พักต่อคืน (น้อยไปมาก)
                            </option>
                            <option value="pricePerNightDesc">
                                ราคาที่พักต่อคืน (มากไปน้อย)
                            </option>
                        </select>

                    </div>
                    {/* ส่วนแสดงรายละเอียดของที่พักที่พบ */}
                    <div>
                        {data?.data.map((hotel, index) => (
                            <SearchResultsCard key={index} hotel={hotel} />
                        ))}
                    </div>
                    {/* ส่วน Pagination ซึ่งจะเป็นการกำหนดค่าตัวแปร page ที่จะถูกส่งไปยัง Backend API */}
                    <div>
                        <Pagination
                            page={data?.pagination.page || 1} // หน้าปัจจุบัน
                            pages={data?.pagination.pages || 1} // จำนวนหน้าทั้งหมด
                            onPageChange={(page) => {
                                search.saveSearchValues(
                                    search.destination,
                                    search.checkIn,
                                    search.checkOut,
                                    search.adultCount,
                                    search.childCount,
                                    page // อับเดตหน้าที่อยู่ในปัจจุบันก่อนเข้าไปดูรายละเอียด
                                );
                                //setPage(page)
                            }} // เมื่อกดที่ปุ่ม จะเปลี่ยนค่าตัวแปร page ซึ่งมันจะถูกส่งไปยัง Backend โดยอัตโนมัต
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Search