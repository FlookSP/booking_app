import { Footer, Header } from "../components"

interface Props{
  children: React.ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* flex-1 หมายถึงจัดการแบบ Object เดียวกัน */}
      <div className="flex-1">{children}</div>
      <Footer />

    </div>
  )
}

export default Layout