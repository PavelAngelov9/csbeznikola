import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
import { Outfit, Geist_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap'
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'CS bez Nikola - Chat & Voice',
  description:
    'No Nikola allowed. Chat and voice with friends. Deploy free on Vercel.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
