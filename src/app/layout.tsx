// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HEMPIN FUND',
  description: 'Crowdfunding for the Hempin ecosystem',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-zinc-200 antialiased">{children}</body>
    </html>
  );
}