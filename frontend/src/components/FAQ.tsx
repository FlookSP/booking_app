import { Link } from "react-router-dom"
import { success, team_faq, work } from "../assets"

const FAQ = () => {
    return (
        <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl font-bold leading-tight text-gray-800 sm:text-4xl">คำแนะนำในการเริ่มต้นใช้งาน</h2>
                </div>

                <div className="grid grid-cols-1 mt-12 lg:mt-24 gap-y-12 md:grid-cols-3 gap-x-6">
                    <div className="md:px-4 lg:px-10">
                        <img className="-rotate-1" src={team_faq} alt="" />
                        <h3 className="mt-8 text-2xl font-semibold leading-tight text-black">เริ่มต้นใช้งานเว็บไซต์ของเรา</h3>
                        <p className="mt-4 text-base text-gray-600">ไม่ว่าคุณจะต้องการจองที่พักในฝัน หรือจัดการที่พักของคุณเองบน ThaiVacationHub.com ต่อไปนี้คือวิธีที่เราทำงานให้กับคุณ ทั้งในฐานะเจ้าของที่พักหรือแขก เริ่มจากพื้นฐานแล้วไปต่อจากตรงนั้น ยินดีต้อนรับสู่ชุมชน!</p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
                        >
                            อ่านต่อ
                            <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>

                    <div className="md:px-4 lg:px-10">
                        <img className="rotate-1" src={work} alt="" />
                        <h3 className="mt-8 text-2xl font-semibold leading-tight text-black">การจัดการบัญชีของคุณ</h3>
                        <p className="mt-4 text-base text-gray-600">คุณต้องการความช่วยเหลือในการเข้าสู่บัญชีของคุณหรือไม่? ต้องการอัปเดตโปรไฟล์ของคุณหรือแก้ไขบัญชีของคุณหรือไม่? ไม่มีปัญหา! ที่นี่คุณจะพบข้อมูลเกี่ยวกับวิธีการเข้าสู่ระบบบัญชีของคุณ การรีเซ็ตรหัสผ่าน หรือเปลี่ยนที่อยู่อีเมลของคุณ</p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
                        >
                            อ่านต่อ
                            <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>

                    <div className="md:px-4 lg:px-10">
                        <img className="-rotate-1" src={success} alt="" />
                        <h3 className="mt-8 text-2xl font-semibold leading-tight text-black">ช่วยเหลือเกี่ยวกับการจองที่พัก</h3>
                        <p className="mt-4 text-base text-gray-600">หากคุณต้องการยกเลิกการจอง อัปเดตการจอง หรือทำความเข้าใจวิธีการชำระเงิน คุณมาถูกที่แล้ว เราจะช่วยคุณจัดการกับการยกเลิกหรือการเปลี่ยนแปลงใด ๆ และอธิบายว่าจะเกิดอะไรขึ้นเมื่อมีการเปลี่ยนแปลง</p>
                        <Link
                            to="#"
                            title=""
                            className="inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
                        >
                            อ่านต่อ
                            <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>


    )
}

export default FAQ