// รองรับการทำ Routing ไปยัง Pages หรือ Components ต่าง ๆ
// ที่เราจะพัฒนาในภายหลัง
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import { Home, Register, NotFound, SignIn, Enroll, MyHotels, EditHotel, Search, Detail, Booking, MyBookings, Help, Feature, About, ForgetPassword, ResetPassword, HomePostPage, AddPost, EditPost, AddHotel, PostDetail, PostCategory } from "./pages";
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
        <Route
          path="/help"
          element={
            <Layout>
              <Help />
            </Layout>
          }
        />
        <Route
          path="/feature"
          element={
            <Layout>
              <Feature />
            </Layout>
          }
        />
        <Route
          path="/company"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/forget-password"
          element={
            <Layout>
              <ForgetPassword />
            </Layout>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <Layout>
              <ResetPassword />
            </Layout>
          }
        />
        <Route
          path="/post-detail/:slug"
          element={
            <Layout>
              <PostDetail />
            </Layout>
          }
        />
        <Route
          path="/post-category/:category"
          element={
            <Layout>
              <PostCategory />
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
            <Route
              path="/my-post"
              element={
                <Layout>
                  <HomePostPage />
                </Layout>
              }
            />
            <Route
              path="/add-post"
              element={
                <Layout>
                  <AddPost />
                </Layout>
              }
            />
            <Route
              path="/edit-post/:postId"
              element={
                <Layout>
                  <EditPost />
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
