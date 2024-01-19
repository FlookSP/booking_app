// เรียกใช้งานฟังก์ชันทั้งหมดในไฟล์ api-client.ts ด้วยชื่อ apiClient
import * as apiClient from "../api-client";
import { useForm } from "react-hook-form";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

// เราต้องกำหนด Type ของ Input ต่าง ๆ ใน Log In Form
// เพื่อให้ useForm ใช้ในการตรวจสอบข้อมูลที่ผู้ใช้งานกรอกเข้ามา
export type SignInFormData = {
  email: string;
  password: string;
  checked: boolean;
};

const SignIn = () => {
  // ใช้งาน useNavigate ในการไปยังหน้า Home Page
  const navigate = useNavigate();
  // ทำการเรียกใช้งาน AppContext Global State โดยเรียกใช้งานฟังก์ชัน showToast
  const { showToast } = useAppContext();
  // เพื่อเรียกใช้งาน invalidateQueries ในการปรับปรุง UI ให้ทันสมัย
  const queryClient = useQueryClient();

  // เราต้องกำหนดว่าจะใช้งานฟังก์ชันดังต่อไปนี้ใน useForm
  // สำหรับทำหน้าที่ตรวจสอบ Input ต่าง ๆ ใน Log In Form
  const {
    register, // ฟังก์ชันตรวจสอบการกรอกข้อมูลในช่องต่าง ๆ
    handleSubmit, // ฟังก์ชันที่จะจัดการตรวจสอบฟอร์มเมื่อกดปุ่ม type "submit"
    formState: { errors }, // สำหรับจัดการข้อความ error ที่เกิดขึ้นจากการตรวจสอบ Input
  } = useForm<SignInFormData>();

  // ใช้งานฟังก์ชัน useMutation ของ react-query ในการเปลี่ยนแปลง State การทำงานของฟอร์มนี้
  // useMutation จะใช้งานฟังก์ชัน signIn ในไฟล์ api-client.ts
  const mutation = useMutation(apiClient.signIn, {
    // ถ้าเรียกใช้งาน API Backend ได้สำเร็จ
    onSuccess: async () => {
      // เรียกใช้งานฟังก์ชัน showToast ใน AppContext Global State
      showToast({
        message: "เข้าสู่ระบบสำเร็จ!",
        type: "SUCCESS",
      });
      // ให้ทำเครื่องหมายข้อมูลที่มี Key เป็น "validateToken" และ "validateRole" ว่าล้าสมัยหรือเก่าแล้วด้วย invalidateQueries
      // และทาง frontend จะทำการตรวจสอบกับทาง backend อีกครั้ง 
      // ซึ่งผลที่ได้คือมันจะยังคงเป็น Token เดิม และบังคับให้มีการ Refresh UI ซึ่งจะทำให้แสดงเมนูใหม่ตามสิทธิ์ได้ถูกต้อง
      await queryClient.invalidateQueries("validateToken");
      // เมื่อผู้ใช้งานทำการ Log In ได้สำเร็จ โปรแกรมจะทำการไปยังหน้า Home Page
      navigate("/");
    },
    // ถ้ามีข้อผิดพลาดเกิดขึ้นให้แสดงข้อความา Error ที่เกิดขึ้น
    // ในฟังก์ชัน register เรากำหนดให้ทำการ throw new Error(responseBody.message)
    // จึงสามารถตรวจจับ responseBody.message ได้
    onError: (error: Error) => {
      // เรียกใช้งานฟังก์ชัน showToast ใน AppContext Global State
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  // เรากำหนดฟังก์ชันชื่อ onSubmit ใน Log In Form
  // ให้ทำงานร่วมกับฟังก์ชัน handleSubmit ใน react-hook-form
  // เพื่อตรวจสอบข้อมูลที่กรอกในแบบฟอร์ม
  // โดยถ้า Submit Form สำเร็จ ให้ทำการนำข้อมูลใน Form รับเข้ามาโดยกำหนดชื่อว่า data
  const onSubmit = handleSubmit((data) => {
    // ทำการส่งข้อมูลในฟอร์มไปยังฟังก์ชัน mutate ซึ่งจะเป็นการเรียกใช้งานฟังก์ชัน useMutation
    // ซึ่งจะเรียกใช้งานฟังก์ชัน signIn ในไฟล์ api-client.ts โดยเป็นการส่งข้อมูลไปยัง API Backend อีกทีหนึ่ง
    mutation.mutate(data);
  });

  return (
    // กำหนดการแสดงกรอบนอกสุด
    <div className="py-10">
      {/* กำหนดการแสดงกล่อง Log In แบบ flex โดยถ้าเป็นหน้าจอใหญ่ให้แสดงแบบ flex-row ที่ขนาดความกว้างขอกล่องลงทะเบียนมีขนาด 8/12 ของความกว้างหน้าจอ */}
      {/* mx-auto คือ กำหนดระยะ margin left และ right โดยอัตโนมัติตามขนาดหน้าจอ จะทำให้มันปรากฎตรงกลางพอดี ให้แสดงเงาขอบมนด้วย shadow-lg overflow-hidden */}
      <div className="flex md:flex-row flex-col md:w-8/12 w-10/12 rounded-xl mx-auto shadow-lg overflow-hidden">
        {/* ใช้ความกว้างพื้นที่กล่อง Log In เต็มที่ โดยถ้าเป็นหน้าจอใหญ่ให้แบ่งพื้นที่ครึ่งหนึ่งด้วย md:w-1/2 และแสดง Component ภายในนี้แบบ flex-col */}
        <div className="w-full flex-col md:w-1/2 py-16 px-12">
          <h2 className="text-3xl mb-4">เข้าสู่ระบบ</h2>
          <p className="mb-4">ลงชื่อเข้าใช้งานบัญชีของคุณเพื่อดำเนินการต่อ</p>
          {/* กำหนดให้เมื่อกดปุ่ม Submit แล้ว เรียกใช้งานฟังก์ชันชื่อ onSubmit */}
          <form onSubmit={onSubmit}>
            <div className="mt-5">
              <input
                type="eamil"
                placeholder="อีเมล"
                className="border border-gray-400 py-1 px-2 w-full"
                // กำหนดต้องกรอกข้อมูลในช่องนี้ และระบุข้อความแจ้งเตือน
                {...register("email", {
                  required: "ต้องระบุข้อมูลในช่องนี้",
                })}
              />
              {/* กำหนดให้แสดงข้อความแจ้งเตือนที่กำหนดเมื่อผู้ใช้งานไม่กรอกข้อมูลในช่องนี้ */}
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="mt-5">
              <input
                type="password"
                placeholder="รหัสผ่าน"
                className="border border-gray-400 py-1 px-2 w-full"
                // กำหนดต้องกรอกข้อมูลในช่องนี้ และกำหนดให้รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                {...register("password", {
                  required: "ต้องระบุข้อมูลในช่องนี้",
                  minLength: {
                    value: 6,
                    message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
                  },
                })}
              />
              {/* กำหนดให้แสดงข้อความแจ้งเตือนที่กำหนดเมื่อผู้ใช้งานไม่กรอกข้อมูลในช่องนี้ */}
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            <div className="mt-5">
              <input
                type="checkbox"
                className="border border-gray-400"
                // กำหนดต้องเลือกในช่องนี้ และระบุข้อความแจ้งเตือน
                {...register("checked", {
                  required: "ต้องเห็นด้วยกับข้อกำหนดและเงื่อนไขการใช้งาน",
                })}
              />
              <span>
                {" "}
                ฉันยอมรับ{" "}
                <a
                  href="/terms-and-services/"
                  className="text-blue-800 font-semibold"
                >
                  ข้อกำหนดและเงื่อนไขการใช้งาน
                </a>{" "}
                และ{" "}
                <a href="/privacy/" className="text-blue-800 font-semibold">
                  แถลงการณ์เกี่ยวกับความเป็นส่วนตัว
                </a>{" "}
                ของเรา
              </span>
              {/* กำหนดให้แสดงข้อความแจ้งเตือนที่กำหนดเมื่อผู้ใช้งานไม่กรอกข้อมูลในช่องนี้ */}
              {errors.checked && (
                <span className="text-red-500">{errors.checked.message}</span>
              )}
            </div>
            <div className="mt-5">
              <button
                type="submit"
                className="w-full bg-blue-800 py-3 text-center text-white hover:bg-blue-700 text-xl"
              >
                ดำเนินการเข้าสู่ระบบ
              </button>
            </div>
          </form>
          <div className="w-full flex md:flex-row flex-col pt-8">
            <p className="w-full font-normal text-center text-[16px] leading-[27px] text-black border-t-[1px] border-t-[#5d5d5d] pt-5">
              ยังไม่ได้ลงทะเบียนเป็นสมาชิก?{" "}
              <a href="/register/" className="text-blue-800 font-semibold">
                สร้างบัญชี
              </a>{" "}
            </p>
          </div>
        </div>

        {/* ใช้ความกว้างพื้นที่กล่อง Log In เต็มที่ โดยถ้าเป็นหน้าจอใหญ่ให้แบ่งพื้นที่ครึ่งหนึ่งด้วย md:w-1/2 และแสดง Component ภายในนี้แบบ flex-col */}
        {/* นอกจากนี้แสดงรูป Background Image ด้วย login และกำหนดให้รูปหยู่ตรงกลางพื้นที่นี้ด้วย bg-center */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 bg-center login">
          {/* แสดงข้อความต่าง ๆ ทางฝั่งแรกแบบ flex-col และจัดตรงกลาง รวมถึงมีการแสดงสีพื้นหลัง Background เป็นพื้นหลังสีดำเล็กน้อยเพื่อให้เห็นข้อความชัดเจนขึ้น */}
          <div className="flex flex-col items-center justify-center bg-[rgba(0,0,0,0.3)] ">
            <h1 className="text-white text-3xl mb-3">ยินดีต้อนรับ</h1>
            <div>
              <p className="text-white">
                เว็บไซต์จองที่พักแบบครบวงจรสำหรับวันหยุดพักผ่อนในฝันของคุณ{" "}
                <a
                  href="/how-it-works/"
                  className="text-blue-400 font-semibold"
                >
                  เรียนรู้เพิ่มเติม
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
