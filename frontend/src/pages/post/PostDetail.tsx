// เรียกใช้งาน API ในการรับข้อมูลบทความ
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../../api-client";
// เราจะใช้ useQuery ในการดึงข้อมูลผ่านทาง API มาแสดง
import { useMutation, useQuery } from "react-query";
import { HiThumbUp, HiOutlineChat, HiOutlineShare, HiChevronRight, HiChevronLeft } from 'react-icons/hi';
import { useEffect, useState } from "react";
import CommentForm from "../../forms/CommentForm/CommentForm";
import { BlogPostCard } from "../../components";
import { useAppContext } from "../../contexts/AppContext";
import { LineShareButton, LineIcon, EmailShareButton, EmailIcon } from "react-share";

const PostDetail = () => {
    // การรับ slug จาก URL จะอาศัย useParams แทนการใช้ Props 
    const { slug: post_slug } = useParams();

    // สำหรับตรวจสอบว่าล็อกอินก่อนกดถูกใจ
    const { isLoggiedIn } = useAppContext();

    // สำหรับการเปลี่ยนไปยัง Page อื่น ๆ
    const navigate = useNavigate();

    // เพื่อช่วยจำหน้าที่อยู่ในปัจจุบัน
    const location = useLocation();
    // ตัวแปรตรวจสอบการเปิด/ปิดปุ่มแชร์บทความ
    const [dropdown, setDropdown] = useState(false);

    // อ่านข้อมูลจาก API ที่กำหนด ด้วย useQuery
    const { data: post } = useQuery(
        "fetchMyPostBySlug", // ตั้งชื่อ Query นี้ว่า fetchMyPostBySlug
        () => apiClient.fetchMyPostBySlug(post_slug || ""), // เรียกใช้งาน API นี้ โดยถ้าไม่มีข้อมูล post_slug ส่งมาด้วยให้ส่งค่า "" แทน
        {
            enabled: !!post_slug, // กำหนดว่าให้ตรวจสอบ post_slug ว่ามีค่าถูกส่งมาด้วยก่อนจึงจะสามารถทำงานใน fetchMyPostBySlug ได้
        }
    );

    // สำหรับบทความที่เกี่ยวข้อง
    const searchPostParams = {
        category: post?.category,
    };

    // จะเริ่มต้นทำการค้นหาข้อมูลเมื่อโหลด Page นี้ โดยส่ง searchParams ไปยัง searchPosts เพื่อค้นหาข้อมูล
    const { data: posts } = useQuery(["searchPosts", searchPostParams], () =>
        apiClient.searchPosts(searchPostParams)
    );

    // ทำการอ่านที่อยู่ URL จากไฟล์ .env ใน Vite ด้วย import.meta
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
    // สร้าง URL สำหรับแสดงรูปภาพที่พัก
    const urls: string[] = [];
    if (post) {
        // Loop ข้อมูลแบบ FileList ด้วย Array.from แปลงเป็น Array ก่อน
        Array.from(post.imageUrls).forEach((name) => {
            urls.push(`${API_BASE_URL}/api/my-posts/file/${name}`);
        });
    }

    const toThaiDateString = (date: Date) => {
        const monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม.",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        const year = date.getFullYear() + 543;
        const month = monthNames[date.getMonth()];
        const numOfDay = date.getDate();

        const hour = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const second = date.getSeconds().toString().padStart(2, "0");

        return `${numOfDay} ${month} ${year} ` + `เวลา ` +
            `${hour}:${minutes}:${second} น.`;
    };

    // สำหรับการเลื่อนบทความที่เกี่ยวข้อง
    let defaultTransform = 0;

    const goNext = () => {
        defaultTransform = defaultTransform - 398;
        const slider = document.getElementById("slider");
        if (slider && Math.abs(defaultTransform) >= slider.scrollWidth / 1)
            defaultTransform = 0;

        if (slider) {
            slider.style.transform = "translateX(" + defaultTransform + "px)";
        }
    };

    const goPrev = () => {
        const slider = document.getElementById("slider");
        if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
        else defaultTransform = defaultTransform + 398;
        if (slider) {
            slider.style.transform = "translateX(" + defaultTransform + "px)";
        }
    };

    const { mutate } = useMutation(apiClient.likePostBySlug, {
        onSuccess: () => {
            navigate(0);
        },
        onError: () => {
            // เราเลือกที่จะไม่ทำอะไรถ้ากดไลค์ไม่สำเร็จ
        }
    });

    // สำหรับการไลค์ข้อความ
    const onLikePost = () => {
        post_slug && mutate(post_slug);
    };

    // สำหรับการล็อกอินก่อนไลค์ข้อความ
    const OnSignInClick = () => {
        navigate("/sign-in", { state: { from: location } });
    };

    // สำหรับไปยัง Comment Form เมื่อผู้ใช้งานกดที่ปุ่ม Comment
    const goToCommentForm = (id: string) => {
        const relevantDiv = document.getElementById(id);
        if (relevantDiv) {
            relevantDiv.scrollIntoView({ behavior: "smooth" });
        }
    };

    // สำหรับตรวจสอบชื่อ ทั้งนี้มี bug ใช้ useQuery ไม่สำเร็จ รอแก้ไข
    const [user, setUser] = useState('');

    useEffect(() => {
        async function fetUser() {
            try {
                const user = await apiClient.fetchAuthor(post?.userId || "");
                setUser(user.email);
            } catch (e) {
                console.log("เกิดข้อผิดพลาดในระหว่างการเรียกดูชื่อผู้ Comment");
            }
        }
        fetUser();
    }, [post?.userId]);

    // นับจำนวนเมื่อถูกเรียกใช้เพียง 1 ครั้ง
    useEffect(() => {
        async function incrementViewCount() {
            try {
                await apiClient.incrementMyPostViewBySlug(post_slug || "");

            } catch (e) {
                console.log("เกิดข้อผิดพลาดในระหว่างการปรับปรุงจำนวนการเข้าชมบทความ");
            }
        }
        incrementViewCount();
    }, []); // เรียกใช้งาน incrementMyPostViewBySlug แค่ 1 ครั้งด้วย []

    if (!post) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                ไม่พบบทความดังกล่าว
            </div>
        );
    }

    return (
        <div className='flex flex-col p-3 container mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center max-w-2xl mx-auto lg:text-4xl font-bold'>
                {post && post.title}
            </h1>
            <Link
                to={`/post-category/${post && post.category}`}
                className='self-center mt-5 text-xl font-light text-center border border-yellow-300 rounded-full p-3 w-fit bg-yellow-300 '
            >
                {post && post.category}
            </Link>

            <div className='flex flex-col p-3 mx-auto w-full text-sm'>

                <p><b>โดย</b> {"  "}{user}</p>

                <p><b>เผยแพร่เมื่อ</b> {toThaiDateString(new Date(post.updatedAt))} {"  "}
                    อ่าน {post && (post.content.length / 1000).toFixed(0)} นาที
                </p>

            </div>

            {/* ส่วนปุ่มกดต่าง ๆ */}
            <div className="flex flex-row justify-between border-t border-b border-slate-300 p-1 mt-3 mb-3 ">
                <div className="flex flex-rows gap-3 justify-start">
                    {/* จำนวนกดถูกใจ */}
                    <span className="flex gap-1 items-center text-sm group relative">
                        <button
                            title="กดถูกใจ"
                            onClick={
                                isLoggiedIn ? onLikePost : OnSignInClick
                            }
                        >
                            <HiThumbUp className="text-gray-500 h-5 w-6" />
                        </button>
                        {post.like.length}
                    </span>
                    {/* จำนวน comment, group relative เพื่อการแสดง Tooltip */}
                    <span className="flex gap-1 items-center text-sm group relative">
                        <button title="แสดงความคิดเห็น" onClick={() => { goToCommentForm("commentId") }}>
                            <HiOutlineChat className="text-gray-500 h-5 w-6" />
                        </button>
                        {post.comments.length}
                    </span>

                </div>
                {/* ปุ่มแชร์บทความ */}
                <div>
                    <div className="relative ml-24">
                        <button
                            className="relative flex bg-white border rounded-md p-2 opacity-50 hover:opacity-100 focus:outline-none focus:border-gray-400"
                            title="แชร์บทความนี้"
                            onClick={() => {
                                setDropdown((prev) => !prev);
                            }}
                        >
                            <HiOutlineShare className="text-gray-500 h-5 w-6" />
                        </button>
                        <div className={`absolute right-0 mt-0 w-48 bg-white rounded-sm overflow-hidden shadow-lg z-20 border border-gray-100 ${dropdown ? "" : "hidden"} `}>
                            <div title="แชร์บทความทางอีเมล" className="flex px-4 py-2 text-sm text-gray-800 border-b hover:bg-blue-100">
                                <EmailShareButton
                                    subject={`บทความเรื่อง ${post_slug}`}
                                    url={`https://booking-app-ry5k.onrender.com/post-detail/${post_slug}`}
                                    className="flex flex-row"
                                >
                                    <EmailIcon size={18} className="mr-4 " />
                                    <span className="text-gray-600">แชร์บทความทางอีเมล</span>
                                </EmailShareButton>
                            </div>
                            <div title="แชร์กับผู้ใช้งานโปรแกรมไลน์" className="flex px-4 py-2 text-sm text-gray-800 border-b hover:bg-blue-100">
                                <LineShareButton
                                    title={`บทความเรื่อง ${post_slug}`}
                                    url={`https://booking-app-ry5k.onrender.com/post-detail/${post_slug}`}
                                    className="flex flex-row"
                                >
                                    <LineIcon size={18} className="mr-4 " />
                                    <span className="text-gray-600">ไลน์แมสเซนเจอร์</span>
                                </LineShareButton>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ส่วนแสดงภาพหลักบทความ */}
            <img
                src={urls[0]}
                alt={post && post.title}
                className='mt-3 p-3 max-h-[600px] w-full object-cover'
            />

            {/* ส่วนเนื้อหาบทความ */}
            <div
                className='p-3 max-w-4xl mx-auto w-full post-content'
            //dangerouslySetInnerHTML={{ __html: post && post.content }}
            >{post && post.content}</div>

            {/* ส่วนแสดงรูปที่เหลือ */}
            <h5 className='text-3xl p-3 max-w-2xl mx-auto lg:text-3xl font-light'>
                รูปภาพทั้งหมด
            </h5>
            <div className="my-5 grid grid-cols-4 max-lg:grid-cols-1 gap-4">
                {urls.map((url, index) => (

                    <img
                        key={index}
                        src={url}
                        className='w-full h-64 object-cover'
                    />
                ))}
            </div>

            {/* แบบฟอร์มรับการแสดงความเห็น โดยกำหนดว่า commenting เป็น true */}
            {post_slug && <div id="commentId"><CommentForm slug={post_slug} commenting={true} /></div>}

            {/* ส่วนแสดงบทความที่เกี่ยวข้อง */}
            <div className='flex flex-col justify-center items-center mt-3' >
                <h1 className='text-3xl mt-5'>บทความแนะนำ</h1>
                {/* ปุ่มเลื่อนซ้าย */}
                <button aria-label="slide backward" className="absolute z-30 left-0 ml-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prev" onClick={goPrev}>
                    <HiChevronLeft className="text-gray-800 h-5 w-6 bg-white" />
                </button>
                <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden ">
                    <div
                        id="slider"
                        className="h-full w-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700">

                        {posts?.data.map((post, index) => (
                            <BlogPostCard key={index} post={post} />

                        ))}
                    </div>
                </div>
                {/* ปุ่มเลื่อนขวา */}
                <button aria-label="slide forward" className="absolute z-30 right-0 mr-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="next" onClick={goNext}>
                    <HiChevronRight className="text-gray-800 h-5 w-6 bg-white" />
                </button>
            </div>

            {/* ส่วนแสดง Comment */}
            <div className="px-10 py-16 mx-auto bg-gray-100 bg-white animation-fade animation-delay px-0 px-8 mx-auto sm:px-12 xl:px-5">
                <p className="mt-1 text-3xl text-left text-gray-800 sm:mx-6 sm:text-2xl md:text-3xl lg:text-3xl sm:text-center sm:mx-0">
                    ความเห็นทั้งหมดในโพสต์นี้
                </p>
                {(post.comments.length !== 0) ? (post.comments.map((comment, index) => (
                    // แบบฟอร์มแสดงรายการความคิดเห็นทั้งหมดในบทความนี้ โดยกำหนด commenting เ็น false เพื่อเลือกแสดงแบบไม่ให้แก้ไขได้
                    <CommentForm key={index} commented={comment} postId={post._id} commenting={false} slug={post_slug} />
                ))) :
                    (<>
                        <div className="flex items-center justify-center rounded-sm p-3 text-black-100 font-light">
                            ยังไม่มีการแสดงความคิดเห็น
                        </div>

                    </>)}

            </div>

        </div>
    )
}

export default PostDetail