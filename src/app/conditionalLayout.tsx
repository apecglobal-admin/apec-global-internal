'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import FooterWrapper from './footerWrapper'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = pathname === '/login'

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <FooterWrapper />}
    </>
  )
}
