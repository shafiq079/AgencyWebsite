// app/layout-wrapper.tsx

'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navigation />}
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      {!isAdminPage && <Footer />}
    </>
  );
}
