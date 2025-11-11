import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from '../lib/provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import FooterWrapper from './footerWrapper';
import ConditionalLayout from './conditionalLayout';


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
