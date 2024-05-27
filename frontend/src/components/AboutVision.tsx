const AboutVision = () => {
    return (
        <section className=" bg-white sm:py-16 " >

            <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mx-auto text-left md:max-w-lg lg:max-w-2xl md:text-center">
                    <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">

                        <span className="relative inline-block">
                            <span className="absolute inline-block w-full h-2 bg-yellow-300 bottom-1.5"></span>
                            <span className="relative"> แพลตฟอร์ม </span>
                        </span>
                        ที่ตอบโจทย์ความต้องการของผู้ใช้งานทุกคน
                    </h2>
                </div>

                <div className="grid grid-cols-1 mt-8 md:mt-20 gap-y-6 md:grid-cols-2 gap-x-10">
                    <div>
                        <img className="w-full mx-auto sm:max-w-xs" src="https://cdn.rareblocks.xyz/collection/celebration/images/team/2/business-man.jpg" alt="" />
                        <p className="text-center mt-8 text-lg font-semibold leading-tight text-black">อัญชัญ อธิน</p>
                        <p className="text-center mt-1 text-base leading-tight text-gray-600">ผู้ก่อตั้ง</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">วิสัยทัศน์ของ ThaiVacationHub.com™</h3>
                        <p className="mt-4 text-lg text-gray-700">ThaiVacationHub.com ก่อตั้งขึ้นเมื่อ พ.ศ.2567 ที่กรุงเทพมหานคร โดยมีเป้าหมาย คือ การสนับสนุนกิจกรรมการท่องเที่ยวให้สามารถดำเนินไปได้อย่างสะดวก รวดเร็ว และปลอดภัยมากยิ่งขึ้นด้วยเทคโนโลยีต่าง ๆ รวมถึงต้องการให้ผู้ใช้งานได้สัมผัสกับประสบการณ์การท่องเที่ยวที่ดีในประเทศไทย </p>

                        <h3 className="mt-8 text-lg font-semibold text-gray-900">แนวทางการทำงานของ ThaiVacationHub.com™</h3>
                        <p className="mt-4 text-lg text-gray-700">ThaiVacationHub.com ต้องการเชื่อมโยงนักท่องเที่ยวเข้ากับเจ้าของที่พักต่าง ๆ โดยอาศัยเทคโนโลยีที่ช่วยขจัดอุปสรรคในการจองที่พัก พร้อมข้อเสนอที่หลากหลาย และที่พักในรูปแบบต่าง ๆ ที่น่าสนใจ รวมถึงเทคโนโลยีอื่น ๆ เพื่อช่วยอำนวยความสะดวกแก่ผู้ใช้งานแพลตฟอร์มของเรา </p>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default AboutVision