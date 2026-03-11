import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Epilogue, Geist, Inter, Red_Hat_Display } from "next/font/google";
import Navbar from "@/components/layouts/common/Navbar";
import Footer from "@/components/layouts/common/Footer";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${epilogue.variable} ${redHatDisplay.variable} ${inter.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col font-epilogue">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
