// รองรับการทำ Routing ไปยัง Pages หรือ Components ต่าง ๆ
// ที่เราจะพัฒนาในภายหลัง
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import { SearchBar } from "../src/components";
import { Home, Register, NotFound, SignIn } from "./pages";
import { useAppContext } from "./contexts/AppContext";

const App = () => {
  const { isLoggiedIn, userInfo } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <SearchBar />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        {/* ต้องล็อกอินแล้ว ถึงจะไปยัง Route เหล่านี้ได้ */}
        {isLoggiedIn && (
          <>
            <Route
              path="/my-hotel"
              element={
                <Layout>
                  <div>นี่คือ My Hotels</div>
                </Layout>
              }
            />
            <Route
              path="/my-booking"
              element={
                <Layout>
                  <div>นี่คือ My Bookings</div>
                </Layout>
              }
            />
          </>          
        )}
        {/* ต้องล็อกอินแล้วและมีสิทธิ์เป็นผู้ดูแลระบบขึ้นไป ถึงจะไปยัง Route เหล่านี้ได้ */}
        {isLoggiedIn && (userInfo && [ 'admin', 'superadmin' ].some((element)=> userInfo.userRole.includes(element))) && (
        <>
          <Route
              path="/my-dashboard"
              element={
                <Layout>
                  <div>นี่คือ My Dashboard</div>
                </Layout>
              }
            />
        </>
        )}
        {/* Default Route ในกรณีที่ไม่มี Page ข้างบน */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
