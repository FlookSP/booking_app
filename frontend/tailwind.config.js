/** @type {import('tailwindcss').Config} */
export default {
  // ไฟล์ที่เราจะใช้งาน Tailwind CSS ด้วย
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* Font ที่ใช้งานในโปรแกรม */
      fontFamily: {
        sans: ["Noto Sans Thai", "sans-serif"],
      },
      /* ขนาดหน้าจอที่ใช้งานในโปรแกรม */
      screens: {
        xs: "480px",
        ss: "620px",
        sm: "768px",
        md: "1060px",
        lg: "1200px",
        xl: "1700px",
      },
    },
  },
  plugins: [],
}

