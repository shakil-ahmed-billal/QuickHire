import type { Metadata } from "next";
import { Epilogue, Inter, Red_Hat_Display } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickHire - Find Your Dream Job",
  description: "Discover more than 5000+ jobs on QuickHire.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${epilogue.variable} ${redHatDisplay.variable} ${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
