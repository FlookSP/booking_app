const Contact = () => {
    return (
        <section className="py-10 bg-white sm:py-16 lg:py-20">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-4xl font-bold leading-tight text-gray-800 sm:text-4xl text-center">ต้องการความช่วยเหลืออื่นเพิ่มเติม</div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-8 xl:gap-x-20  mt-12 lg:mt-24">
                    <div className="flex items-start">
                        <svg className="flex-shrink-0 w-10 h-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                        <div className="ml-6">
                            <p className="text-2xl font-semibold leading-tight text-black">โทรหาเรา</p>
                            <p className="mt-4 text-base text-gray-600">(02) 555-116</p>
                            <p className="mt-1 text-base text-gray-600">(02) 555-117</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="flex-shrink-0 w-10 h-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="ml-6">
                            <p className="text-2xl font-semibold leading-tight text-black">ส่งอีเมลถึงเรา</p>
                            <p className="mt-4 text-base text-gray-600">contact@thaivacationhub.com</p>
                            <p className="mt-1 text-base text-gray-600">support@thaivacationhub.com</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="flex-shrink-0 w-10 h-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="ml-6">
                            <p className="text-2xl font-semibold leading-tight text-black">ที่ตั้ง</p>
                            <p className="mt-4 text-base text-gray-600">เลขที่ 12345, ถนนสายไหม, แขวงสายไหม, เขตสายไหม กรุงเทพมหานคร 10220, ไทย</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Contact