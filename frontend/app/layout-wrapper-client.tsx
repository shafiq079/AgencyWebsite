'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

export default function LayoutWrapperClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navigation />}
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      {!isAdminRoute && <Footer />}
    </>
  );
} 