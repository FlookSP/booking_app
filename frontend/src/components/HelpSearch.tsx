import { MdTravelExplore } from "react-icons/md"
import { girl_working_laptop } from "../assets"

const HelpSearch = () => {
    return (
        <section className="relative py-10 overflow-hidden bg-black sm:py-16 lg:py-24 xl:py-32">
            <div className="absolute inset-0">
                <img className="object-cover w-full h-full md:object-left md:scale-150 md:origin-top-left" src={girl_working_laptop} alt="" />
            </div>

            <div className="absolute inset-0 hidden bg-gradient-to-r md:block from-black to-transparent"></div>

            <div className="absolute inset-0 block bg-black/60 md:hidden"></div>

            <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center md:w-2/3 lg:w-1/2 xl:w-1/3 md:text-left">
                    <h2 className="text-4xl font-bold text-white sm:text-4xl lg:text-5xl">สวัสดี มีอะไรให้เราช่วยบ้าง?</h2>
                    <p className="mt-4 text-base text-gray-200 sm:text-xl">ค้นหาทุกสิ่งที่คุณต้องการเพื่อให้ได้ประโยชน์สูงสุดจากเรา</p>

                    <form action="#" className="mt-8 lg:mt-12">
                        <div className="flex flex-col items-center sm:flex-row sm:justify-center">
                            <div className="flex-1 w-full min-w-0 px-4 sm:px-0">
                                <div className="relative text-gray-400 focus-within:text-gray-600">
                                    <input
                                        placeholder="ค้นหาใน ThaiVacationHub.com"
                                        className="block w-full py-4 pl-10 pr-4 text-base text-black placeholder-gray-500 transition-all duration-200 border-gray-200 rounded-md sm:rounded-r-none caret-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="inline-flex items-center justify-center flex-shrink-0 w-auto px-4 py-4 mt-4 font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md sm:mt-0 sm:rounded-l-none sm:w-auto hover:bg-blue-700 focus:bg-blue-700">
                                <MdTravelExplore size={20} className="mr-2" />
                                เริ่มต้นค้นหา
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

    )
}

export default HelpSearch