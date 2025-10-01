// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Hemp’in Fund",
  description: "Crowdfunding for the Hemp’in ecosystem",
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