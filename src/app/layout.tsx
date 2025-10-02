// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

const title = "Hemp’in Fund";
const description = "Crowdfunding for the Hemp’in ecosystem";

export const metadata: Metadata = {
  // use your live origin so OG image resolves absolutely
  metadataBase: new URL('https://fund.hempin.org'),

  title: {
    default: "Hemp’in Fund",
    template: "%s · Hemp’in Fund",
  },
  description:
    "Crowdfunding for the Hemp’in ecosystem — help launch digital modules, keep hemp in the spotlight, and onboard the community.",

  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
    shortcut: '/icon.svg',
  },

  openGraph: {
    type: 'website',
    url: '/',
    siteName: "Hemp’in Fund",
    title: "Hemp’in Fund — Crowdfunding the hemp ecosystem",
    description:
      "Crowdfunding for the Hemp’in ecosystem — help launch digital modules, keep hemp in the spotlight, and onboard the community.",
    images: [
      {
        url: '/og/hempin-fund-home.jpg', // <-- orb/nebula preview
        width: 1200,
        height: 630,
        alt: "Hemp’in Fund — orb image",
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: "Hemp’in Fund — Crowdfunding the hemp ecosystem",
    description:
      "Crowdfunding for the Hemp’in ecosystem — help launch digital modules, keep hemp in the spotlight, and onboard the community.",
    images: ['/og/hempin-fund-home.jpg'], // <-- same orb/nebula
  },

  // optional but nice
  themeColor: '#0b0f16',
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