import { Link } from "react-router-dom";
import { eatting, smile } from "../assets";

const CTABusiness = () => {
  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid items-center md:grid-cols-2 gap-y-10 md:gap-x-20">
          <div className="pr-12 sm:pr-0">
            <div className="relative max-w-xs mb-12">
              <img className="object-bottom rounded-md" src={eatting} alt="" />

              <img
                className="absolute origin-bottom-right scale-75 rounded-md -bottom-12 -right-12"
                src={smile}
                alt=""
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              ร่วมขยายการเติบโตทางธุรกิจของคุณ{" "}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              เราจะช่วยให้คุณสามารถเข้าถึงลูกค้ากลุ่มเป้าหมายที่ชื่นชอบที่พักของคุณ
              ลงทะเบียนง่าย ๆ รวดเร็ว และไม่มีค่าใช้จ่าย
            </p>
            <Link
              to="/register"
              title=""
              className="inline-flex items-center justify-center px-8 py-3 mt-8 text-base font-semibold text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700"
              role="button"
            >
              {" "}
              ลงรายการที่พักตอนนี้ ฟรี!{" "}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABusiness;
