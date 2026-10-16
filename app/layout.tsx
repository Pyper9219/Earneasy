import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EarnEasy — Refer & Earn with M-Pesa",
  description:
    "Join EarnEasy and earn up to KES 400 per paying member in your 3-level referral network. Activate for KES 450 and start earning today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#050b1a] text-slate-200" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
