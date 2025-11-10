'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/footer';

export default function FooterWrapper() {
  const pathname = usePathname();

  // Ẩn Footer ở /profile và các route con
  if (pathname.startsWith('/profile')) {
    return null;
  }

  return <Footer />;
}
