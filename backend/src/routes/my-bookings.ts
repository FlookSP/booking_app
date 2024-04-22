import express, { Request, Response } from "express";
import func from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

// สร้าง Post End Point ชื่อ "/api/my-bookings" สำหรับให้บริการข้อมูลการจองที่พัก
router.get("/", func.verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: { $elemMatch: { userId: req.userId } },
        });

        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter(
                (booking) => booking.userId === req.userId
            );

            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings,
            };

            return hotelWithUserBookings;
        });

        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการจองได้" });
    }
});

export default router;