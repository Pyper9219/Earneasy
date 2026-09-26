import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EarnEasy — Refer & Earn",
  description:
    "Join EarnEasy and earn up to KES 400 per paying member in your 3-level referral network.",
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
      </head>
      <body className="antialiased text-slate-900 bg-white">{children}</body>
    </html>
  );
}