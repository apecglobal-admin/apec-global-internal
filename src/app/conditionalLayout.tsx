'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import { ToastContainer } from 'react-toastify'
import Footer from '@/components/footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = pathname === '/login' 
  const profifle = pathname === "/profile"



  return (
    <>
      {!hideLayout && <Header />}
      <ToastContainer 
          position="top-right"   // Vị trí hiển thị toast
          autoClose={3000}       // 3 giây tự động ẩn
          hideProgressBar={false}
          newestOnTop={true}     // Toast mới ở trên cùng
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="!text-lg !px-6 !py-4 !min-w-[400px] !rounded-lg"   // chỉnh kích thước toast
          className="!text-base font-medium"  
      />
      {children}
      {!hideLayout && !profifle && <Footer />}
    </>
  )
}
