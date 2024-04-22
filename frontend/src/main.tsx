import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppContextProvider } from "./contexts/AppContext.tsx";
import { SearchContextProvider } from "./contexts/SearchContext.tsx";
// ทำการ Query ไปยัง API Backend แค่เพียงครั้งเดียวในกรณีที่มี Error เกิดขึ้น
// เพราะค่า Default คือ จะลองส่งไปเรื่อย ๆ ไม่สิ้นสุด ซึ่งเป็นการดำเนินการที่สิ้นเปลืองทรัพยากร
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* กำหนดให้ใช้งาน defaultOptions ใน queryClient ที่เราสร้างขึ้นมาในโปรแกรม */}
    <QueryClientProvider client={queryClient}>
      {/* กำหนดให้ใช้งาน Context API ชื่อ AppContext ที่เราสร้างขึ้นมาโดยอาศัย AppContextProvider */}
      <AppContextProvider>
        {/* กำหนดให้ใช้งาน Context API ชื่อ SearchContext ที่เราสร้างขึ้นมาโดยอาศัย SearchContextProvider */}
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
