import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'GONS Market',
    template: '%s | GONS Market',
  },
  description: 'GONS 마켓입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-800 text-white max-w-screen-md mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
