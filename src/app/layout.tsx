import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "KindLink — Connect NGOs, Shelters, and Donors",
    template: "%s — KindLink",
  },
  description:
    "KindLink is a community-driven platform connecting NGOs, animal shelters, and local donors in real time.",

  openGraph: {
    title: "KindLink — Connect NGOs, Shelters, and Donors",
    description:
      "KindLink is a community-driven platform connecting NGOs, animal shelters, and local donors in real time.",
    images: [
      {
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "KindLink logo",
      },
    ],
  },
};

import { Providers } from "@/components/Providers";
import LiveToaster from "@/components/LiveToaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 flex-1">{children}</main>
          <Footer />
          <LiveToaster />
        </Providers>
      </body>
    </html>
  );
}
