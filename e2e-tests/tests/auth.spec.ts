import { test, expect } from "@playwright/test";
// URL ของ Frontend ที่จะทดสอบ
const BASE_URL = "http://localhost:5173/";
// Test สำหรับทดสอบการ Log In ด้วยสิทะิ์ผู้ดูแลระบบ
test("ควรอนุญาตให้ผู้ใช้เข้าสู่ระบบ", async ({ page }) => {
  // ไปยัง URL ของ Frontend ที่จะทดสอบ
  await page.goto(BASE_URL);
  // ค้นหา link ในหน้าของ URL ที่มีชื่อว่า "เข้าสู่ระบบ" และทำการ Click ที่ link ดังกล่าว
  await page.getByRole("link", { name: "เข้าสู่ระบบ" }).click();
  // ตาม Flow การทำงานของเรา เมื่อ Click ที่ปุ่ม "เข้าสู่ระบบ" โปรแกรมจะแสดง Page ใหม่
  // ดังนั้น เราจะต้องตรวจสอบว่ามายัง Page ใหม่ที่เป็นหน้า Log In Form แล้วหรือยัง
  // โดยการตรวจสอบหา Heading ชื่อ "เข้าสู่ระบบ" (<h2></h2>)
  await expect(
    page.getByRole("heading", { name: "เข้าสู่ระบบ" })
  ).toBeVisible();
  // เมื่อมายังหน้า Log In Form แล้ว ให้ทำการใส่ชื่อผู้ใช้งานในช่อง Input ที่มี name="email"
  // โดยใส่ค่าเป็น smile83@hotmail.co.th
  await page.locator("[name=email]").fill("smile83@hotmail.co.th");
  // ทำการใส่รหัสผ่านในช่อง Input ที่มี name="password"
  // โดยใส่ค่าเป็น Flooky
  await page.locator("[name=password]").fill("Flooky");
  // ทำการเลือก Checkbox แรกในหน้านี้ ซึ่งมีอยู่เพียงอันเดียว
  await page.locator("input[type='checkbox']").first().check();
  // ค้นหาปุ่มกด ชื่อ "ดำเนินการเข้าสู่ระบบ" และกดที่ปุ่มดังกล่าว
  await page.getByRole("button", { name: "ดำเนินการเข้าสู่ระบบ" }).click();
  // หลังจากนี้ เราควรที่จะไปยัง Page ใหม่ที่แสดงรายการเมนูต่าง ๆ ตามสิทธิ์
  await expect(page.getByText("เข้าสู่ระบบสำเร็จ!")).toBeVisible();
  await expect(page.getByRole("link", { name: "แดชบอร์ด" })).toBeVisible();
  await expect(page.getByRole("link", { name: "การจองของฉัน" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ที่พักของฉัน" })).toBeVisible();
  await expect(page.getByRole("button", { name: "ออกจากระบบ" })).toBeVisible();
});

// Test สำหรับทดสอบการ Registration
test("ควรอนุญาตให้ Registration ผู้ใช้ในระบบ", async ({ page }) => {
  // ไปยัง URL ของ Frontend ที่จะทดสอบ
  await page.goto(BASE_URL);
  // ค้นหา link ในหน้าของ URL ที่มีชื่อว่า "เข้าสู่ระบบ" และทำการ Click ที่ link ดังกล่าว
  await page.getByRole("link", { name: "เข้าสู่ระบบ" }).click();
  // ตาม Flow การทำงานของเรา เมื่อ Click ที่ปุ่ม "เข้าสู่ระบบ" โปรแกรมจะแสดง Page ใหม่
  // ดังนั้น เราจะต้องตรวจสอบว่ามายัง Page ใหม่ที่เป็นหน้า Log In Form แล้วหรือยัง
  // โดยการตรวจสอบค้นหา link ในหน้าของ URL ที่มีชื่อว่า "สร้างบัญชี" และทำการ Click ที่ link ดังกล่าว
  await page.getByRole("link", { name: "สร้างบัญชี" }).click();
  // ตาม Flow การทำงานของเรา เมื่อ Click ที่ปุ่ม "สร้างบัญชี" โปรแกรมจะแสดง Page ใหม่
  // ดังนั้น เราจะต้องตรวจสอบว่ามายัง Page ใหม่ที่เป็นหน้า Registration แล้วหรือยัง
  await expect(
    page.getByRole("heading", { name: "สมัครใช้บริการ" })
  ).toBeVisible();
  // ถ้าอยู่ในหน้า Registration แล้ว ให้กรอกข้อมูลตามแบบฟอร์ม ดังนี้
  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill("test_email@test.com");
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");
  // ทำการเลือก Checkbox แรกในหน้านี้ ซึ่งมีอยู่เพียงอันเดียว
  await page.locator("input[type='checkbox']").first().check();
  // ค้นหาปุ่มกด ชื่อ "ดำเนินการลงทะเบียน" และกดที่ปุ่มดังกล่าว
  await page.getByRole("button", { name: "ดำเนินการลงทะเบียน" }).click();
  // หลังจากนี้ เราควรที่จะไปยัง Page ใหม่ที่แสดงรายการเมนูต่าง ๆ ตามสิทธิ์
  await expect(page.getByText("ลงทะเบียนผู้ใช้งานเรียบร้อย")).toBeVisible();
  await expect(page.getByRole("link", { name: "การจองของฉัน" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ที่พักของฉัน" })).toBeVisible();
  await expect(page.getByRole("button", { name: "ออกจากระบบ" })).toBeVisible();
});
