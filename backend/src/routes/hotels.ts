import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import func from "../middleware/auth";

// อ่านค่า Stripe API Key จากไฟล์ .env
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

// สร้าง Express Router
const router = express.Router();

// สร้าง Get End Point "/api/hotels/search" รองรับการค้นหาข้อมูลที่พัก
router.get("/search", async (req: Request, res: Response) => {
    try {
        // สร้าง Query สำหรับค้นหาที่พักใน MongoDB
        const query = constructSearchQuery(req.query);

        // จัดรูปแบบ Sort Option ให้พร้อมทำงานด้วย MongoDB
        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }

        // กำหนดข้อมูลพื้นฐานของการแสดงผลรองรับการทำ Pagination 
        // ขนาด Page Size ของจำนวนข้อมูลที่ Backend จะคืนไปให้ Frontend ในแต่ละหน้า Page
        const pageSize = 5;
        // หมายเลขหน้า จะถูกส่งผ่านทาง req.query.page โดยค่าพื้น Default คือแสดงหน้าแรกสุด
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        // กำหนดช่วงการแสดงผลลัพธ์ของข้อมูลที่พักที่ค้นหา
        const skip = (pageNumber - 1) * pageSize;
        // ทำการค้นหาที่พักตามเงื่อนไขการ Search ต่าง ๆ ที่กำหนดข้างต้น
        // ได้แก่ ข้ามผลลัพธ์เป็นจำนวน skip หลังจากนั้นแสดงผลลัพธ์เป็นจำนวน pageSize ไม่แสดงผลลัพธ์ทั้งหมด
        // ซึ่งจะทำให้การทำงานของ Backend ได้รับภาระน้อยลง ส่งผลต่อประสิทธิภาพการทำงานโดยรวมที่ดีขึ้น
        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);

        // จำนวนข้อมูลผลลัพธ์ทั้งหมดที่เจอในฐานข้อมูล โดยค้นหาตาม query ด้วยถ้ามี
        const total = await Hotel.countDocuments(query);
        // ส่งข้อมูลกลับไปยัง Frontend
        const response: HotelSearchResponse = {
            data: hotels, // ข้อมูลที่พัก
            pagination: {
                total, // จำนวนข้อมูลที่พักที่่ค้นเจอทั้งหมด
                page: pageNumber, // อยู่หน้าที่เท่าไร
                pages: Math.ceil(total / pageSize), // จำนวนหน้าทั้งหมด
            },
        }

        res.json(response);
    }
    catch (error) {
        console.log("พบข้อผิดพลาดที่ Get End Point '/api/hotels/search' ได้แก่ :", error);
        // แจ้งผู้ใช้งานเกี่ยวกับข้อผิดพลาด
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการค้นหาที่พัก" });
    }
});

// ฟังก์ชันสำหรับสร้าง Query เพื่อค้นหาข้อมูลใน MongoDB
const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};
    if (queryParams.destination) {
        constructedQuery.$or = [ // ค้นหาจาก Field city หรือ country
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount), // $gte คือ greater than or qual to หรือเอาที่พักซึ่งอนุญาตให้ผู้ใหญ่เข้าพักได้มากกว่าค่า adultCount ที่ส่งมา
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount), // $gte คือ greater than or qual to หรือเอาที่พักซึ่งอนุญาตให้เด็กเข้าพักได้มากกว่าค่า childCount ที่ส่งมา
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities) //  $all คือ ต้องมี facilities ทั้งหมดตามที่ส่งมา 
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types) // $in คือ ต้องมีอย่างน้อย 1 type ที่ผู้ใช้งานเลือก
                ? queryParams.types
                : [queryParams.types], // ถ้าส่ง types มาตัวเดียว ตอน Filter ให้เปลี่ยนเป็น Array
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars) // เป็น Array ใช่หรือไม่
            ? queryParams.stars.map((star: string) => parseInt(star)) // เปลี่ยนเป็น array ของ number แทน
            : parseInt(queryParams.stars); // ถ้าส่ง start มาตัวเดียว ตอน Filter ให้เปลี่ยนเป็น number เลย

        constructedQuery.starRating = { $in: starRatings }; // $in คือ ต้องมีอย่างน้อยเท่ากับ starRatings ที่ผู้ใช้งานเลือก
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(), // $lte คือ less than or equal to หรือเอาที่พักที่ราคาต่อคืนน้อยกว่าหรือเท่ากับค่า maxPrice 
        };
    }

    // constructedQuery จะคืนค่าในรูปแบบประมาณ { adultCount: { '$gte': 1 }, childCount: { '$gte': 0 } }
    // ซึ่งเป็นรูปแบบที่ MongoDB นำไปทำงานต่อในการค้นหาได้
    return constructedQuery;
};

// สร้าง Get End Point "/api/hotels/:id" รองรับการค้นหาข้อมูลที่พักตามหมายเลขไอดี
router.get(
    "/:id",
    // ตรวจสอบว่ามีการส่ง id มาให้หรือไม่ พร้อมแจ้งเตือนถ้าไม่มีการส่ง id
    [param("id").notEmpty().withMessage("จำเป็นต้องระบุรหัสโรงแรม")],
    async (req: Request, res: Response) => {
        // ใช้ validationResult ของ express-validator ในการตรวจสอบความถูกต้องของ Request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // รับหมายเลขไอดีของที่พัก
        const id = req.params.id.toString();

        try {
            const hotel = await Hotel.findById(id);
            res.json(hotel);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "เกิดข้อผิดพลาดในระหว่างการค้นหาที่พัก" });
        }
    }
);

// สร้าง Post End Point ชื่อ "/api/hotels/:hotelId/bookings/payment-intent"
router.post(
    "/:hotelId/bookings/payment-intent",
    func.verifyToken,
    async (req: Request, res: Response) => {
        const { numberOfNights } = req.body; // รับจำนวนวันที่เข้าพักจาก Frontend
        const hotelId = req.params.hotelId;

        // ที่พักที่จะจอง
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(400).json({ message: "ไม่พบที่พักดังกล่าว" });
        }

        // คำนวณราคาที่พักทั้งหมดในการจองครั้งนี้ใหม่ ป้องกันการ hack ราคาที่ Frontend
        const totalCost = hotel.pricePerNight * numberOfNights;

        // สร้าง PaymentIntent ส่งไปให้ Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost * 100, // 500 บาท เป็น 50000 สตางค์ ตาม https://docs.stripe.com/currencies#zero-decimal
            currency: "thb", // จาก https://docs.stripe.com/currencies โดย MINIMUM CHARGE AMOUNT คือ 10 บาท
            metadata: { // เราสามารถจองอะไรในหัวข้อ metadata ก็ได้
                hotelId, // ไอดีที่พักที่จะจอง
                userId: req.userId, // ผู้ใช้งานที่จองที่พักนี้
            },
        });

        // รหัส Reference กับ PaymentIntent ที่สร้างขึ้นด้วย Stripe 
        // ผู้จองต้องใส่ client_secret ใน Frontend เพื่อให้ชำระเงินได้ถูก Invoice
        if (!paymentIntent.client_secret) {
            return res.status(500).json({ message: "เกิดข้อผิดพลาดในการชำระเงิน" });
        }

        // แจ้งผลการดำเนินการกับทาง Frontend
        const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret.toString(), // ส่งรหัส Reference กับ PaymentIntent ที่สร้างขึ้นกลับไปด้วย
            totalCost,
        };

        res.send(response);
    }
);

// สร้าง Post End Point ชื่อ "/api/hotels/:hotelId/bookings" สำหรับการจัดเก็บข้อมูลการจองที่พัก
router.post(
    "/:hotelId/bookings",
    func.verifyToken,
    async (req: Request, res: Response) => {
        try {
            const paymentIntentId = req.body.paymentIntentId;

            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId as string
            );

            if (!paymentIntent) {
                return res.status(400).json({ message: "ไม่พบ paymentIntent ในการชำระเงิน" });
            }

            if (
                paymentIntent.metadata.hotelId !== req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId
            ) {
                return res.status(400).json({ message: "paymentIntent ในการชำระเงินไม่ตรงกัน" });
            }

            if (paymentIntent.status !== "succeeded") {
                return res.status(400).json({
                    message: `paymentIntent ไม่สำเร็จ สถานะ: ${paymentIntent.status}`,
                });
            }

            const newBooking: BookingType = {
                ...req.body, // ใส่ข้อมูลใน req.body
                userId: req.userId, // เพิ่มข้อมูล userId
            };

            // ทำการอับเดตข้อมูลโดยเพิ่มข้อมูล bookings 
            const hotel = await Hotel.findOneAndUpdate(
                { _id: req.params.hotelId }, // หาที่พักที่มีไอดีดังกล่าว
                {
                    $push: { bookings: newBooking }, // ทำการ push ข้อมูล newBooking ไปเก็บใน Field bookings
                }
            );

            if (!hotel) {
                return res.status(400).json({ message: "ไม่พบที่พักที่ต้องการจอง" });
            }

            await hotel.save();
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "มีบางอย่างผิดพลาด" });
        }
    }
);

export default router;