import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from '../lib/provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ConditionalLayout from './conditionalLayout';
import { ToastContainer } from 'react-toastify';


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
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
          {/* <>
            <Header />

           {children}
            <FooterWrapper/>
          </> */}

          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
