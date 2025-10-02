// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Hemp’in Fund",
  description: "Crowdfunding for the Hemp’in ecosystem",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  themeColor: '#f9a8d4',
  openGraph: {
    images: '/icon.svg',
  },
  twitter: {
    card: 'summary_large_image',
    images: '/icon.svg',
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