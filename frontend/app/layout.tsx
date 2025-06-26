// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
import LayoutWrapper from './layout-wrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
});

export const metadata: Metadata = {
  title: 'Atelier — Creative Design Studio',
  description: 'Premium design studio crafting exceptional digital experiences with meticulous attention to detail and innovative storytelling.',
  keywords: 'design studio, creative agency, digital design, branding, web design',
  authors: [{ name: 'Atelier Studio' }],
  openGraph: {
    title: 'Atelier — Creative Design Studio',
    description: 'Premium design studio crafting exceptional digital experiences',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier — Creative Design Studio',
    description: 'Premium design studio crafting exceptional digital experiences',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
