// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

const title = "Hemp’in Fund";
const description = "Crowdfunding for the Hemp’in ecosystem";

export const metadata: Metadata = {
  metadataBase: new URL('https://fund.hempin.org'),
  title,
  description,
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: "Hemp’in Fund",
    title,
    description,
    images: [
      { url: '/og/hempin-fund-home.jpg', width: 1200, height: 630, alt: "Hemp’in Fund" },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@', // (optional) your handle
    title,
    description,
    images: ['/og/hempin-fund-home.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* app-shell ensures content renders above starfield/backgrounds */}
      <body className="page app-shell antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}