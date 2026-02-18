import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prasanthi Crafts | Handcrafted Artisan Products",
  description: "Discover unique handcrafted artisan products made with love. Premium quality crafts, home decor, and gifts from Prasanthi Crafts.",
  keywords: "handcrafted, artisan, crafts, home decor, gifts, Sri Lanka, handmade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
