import { RecentPosts } from "../components";

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

        <RecentPosts />
      </div>
    </section>
  );
};

export default Blog;
