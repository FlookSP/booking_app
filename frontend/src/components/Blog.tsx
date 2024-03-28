import { Link } from "react-router-dom";
import { post_one, post_two, post_three } from "../assets";
const Blog = () => {
  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-between">
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl ">
              ล่าสุดจากบล็อก
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600 lg:mx-0 ">
              บล็อกท่องเที่ยวของเราจะพาคุณไปสำรวจประเทศไทย
              จนคุณรู้จักทุกซอกทุกมุมของประเทศแห่งนี้มากยิ่งขึ้น
              โดยการพาคุณไปค้นหาสถานที่ท่องเที่ยวต่าง ๆ อย่างครบวงจร
              ด้วยการนำเสนอคอนเทนต์โดนใจประจำเดือน และคอนเทนต์ที่ทุกคนควรอ่าน
            </p>
          </div>
        </div>

        <div className="grid max-w-md grid-cols-1 gap-6 mx-auto mt-8 lg:mt-16 lg:grid-cols-3 lg:max-w-full">
          <div className="overflow-hidden bg-white rounded shadow">
            <div className="p-5">
              <div className="relative">
                <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                  <img
                    className="object-cover w-full h-full"
                    src={post_one}
                    alt=""
                  />
                </Link>

                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                    {" "}
                    ไลฟ์สไตล์{" "}
                  </span>
                </div>
              </div>
              <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                {" "}
                โดย นายเอ, 27 มีนาคม 2567{" "}
              </span>
              <p className="mt-5 text-2xl font-semibold">
                <Link to="#" title="" className="text-black">
                  {" "}
                  10 ที่เที่ยวเชียงใหม่ ถ้าไม่ไปถือว่าพลาด!{" "}
                </Link>
              </p>
              <p className="mt-4 text-base text-gray-600">
                ลองตามไปดูกันว่า 10
                ที่เที่ยวเชียงใหม่ยอดฮิตที่เรานำมาฝากนี้เพื่อน ๆ
                เคยไปมาแล้วหรือยัง ถ้ายังบอกเลยว่าพลาดมาก ต้องไปตามเก็บให้ครบนะ
              </p>
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
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded shadow">
            <div className="p-5">
              <div className="relative">
                <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                  <img
                    className="object-cover w-full h-full"
                    src={post_two}
                    alt=""
                  />
                </Link>

                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                    {" "}
                    การตลาด{" "}
                  </span>
                </div>
              </div>
              <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                {" "}
                โดย นายบี, 27 มีนาคม 2567{" "}
              </span>
              <p className="mt-5 text-2xl font-semibold">
                <Link to="#" title="" className="text-black">
                  {" "}
                  เคล็ดลับยอดนิยมในการทำการตลาดโรงแรมของคุณให้เร็วขึ้นและดีขึ้น{" "}
                </Link>
              </p>
              <p className="mt-4 text-base text-gray-600">
                การตลาดเป็นสิ่งสำคัญที่ช่วยเพิ่มยอดขายให้กับธุรกิจ
                โดยเฉพาะในยุคปัจจุบันที่สื่อออนไลน์มีความสำคัญเป็นอย่างมาก
                ดังนั้นการตลาดที่ดีจึงเป็นสิ่งที่จำเป็น
              </p>
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
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded shadow">
            <div className="p-5">
              <div className="relative">
                <Link to="#" title="" className="block aspect-w-4 aspect-h-3">
                  <img
                    className="object-cover w-full h-full"
                    src={post_three}
                    alt=""
                  />
                </Link>

                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">
                    {" "}
                    เทศกาล{" "}
                  </span>
                </div>
              </div>
              <span className="block mt-6 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                {" "}
                โดย นายซี, 27 มีนาคม 2567{" "}
              </span>
              <p className="mt-5 text-2xl font-semibold">
                <Link to="#" title="" className="text-black">
                  {" "}
                  เสน่ห์ของเทศกาล และ ประเพณีอีสาน{" "}
                </Link>
              </p>
              <p className="mt-4 text-base text-gray-600">
                ภาคอีสานเป็นแหล่งอารยธรรมโบราณ
                มีวัฒนธรรมประเพณีและความเชื่อที่มีความหลากหลายแตกต่างกันไปในแต่ละท้องถิ่นและโดดเด่นจากภาคอื่น
                ๆ อย่างชัดเจน
              </p>
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
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
