// รองรับการทำ Routing ไปยัง Pages หรือ Components ต่าง ๆ
// ที่เราจะพัฒนาในภายหลัง
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import { Home, Register, NotFound, SignIn, Enroll, MyHotels, EditHotel, Search, Detail, Booking, MyBookings } from "./pages";
import { useAppContext } from "./contexts/AppContext";
import AddHotel from "./pages/AddHotel";

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
              <Search />
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
        <Route
          path="/enroll"
          element={
            <Layout>
              <Enroll />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        {/* ต้องล็อกอินแล้ว ถึงจะไปยัง Route เหล่านี้ได้ */}
        {isLoggiedIn && (
          <>
            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />
          </>
        )}
        {/* ต้องล็อกอินแล้วและมีสิทธิ์ที่กำหนด ถึงจะไปยัง Route เหล่านี้ได้ */}
        {isLoggiedIn &&
          userInfo &&
          ["superadmin"].some((element) =>
            userInfo.userRole.includes(element)
          ) && (
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
        {isLoggiedIn &&
          userInfo &&
          ["admin"].some((element) =>
            userInfo.userRole.includes(element)
          ) && (
            <>
              <Route
                path="/my-hotel"
                element={
                  <Layout>
                    <MyHotels />
                  </Layout>
                }
              />
              {/* เนื่องจากคู่ค้าอาจเป็นผู้จองที่พักได้เหมือนกัน */}
              <Route
                path="/my-booking"
                element={
                  <Layout>
                    <MyBookings />
                  </Layout>
                }
              />
            </>
          )}
        {isLoggiedIn &&
          userInfo &&
          ["user"].some((element) =>
            userInfo.userRole.includes(element)
          ) && (
            <>
              <Route
                path="/my-booking"
                element={
                  <Layout>
                    <MyBookings />
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
