import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import WalletConnectProvider from "@/providers/WalletConnectProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solana NFT Marketplace",
  description: "Solana NFT Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-primary-background `}
      >
        <WalletConnectProvider>
          <div className="sticky top-0 w-full backdrop-blur-3xl p-4 z-50 border-b-2 border-white/10 bg-navbar-background/60 ">
            <Navbar />
          </div>
          <div className="max-w-[1440px] mx-auto px-4 pb-4">{children}</div>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
