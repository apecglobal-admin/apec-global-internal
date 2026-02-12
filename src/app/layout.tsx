import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from '../lib/provider';
import ConditionalLayout from './conditionalLayout';
import { ToastContainer } from 'react-toastify';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest:"/manifest.json",
  title: 'ERP APEC GLOBAL',
  description: 'APEC GLOBAL - Kiến tạo giá trị - Làm Chủ Tương Lai',
  generator: 'v0.app',
  icons: {
    icon: '/favi.png',
  },
  appleWebApp:{
    capable:true,
    statusBarStyle:"default",
    title:"NextApp"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={``}>
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
        <Providers>
            <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
