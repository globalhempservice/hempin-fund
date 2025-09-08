import './globals.css';

export const metadata = {
  title: 'Fund Hempin',
  description: 'Crowdfund the Hempin platform — a profile-centered hemp universe.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[color:var(--bg)] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
