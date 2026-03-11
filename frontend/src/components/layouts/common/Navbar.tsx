"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full px-8 md:px-[124px] py-4 flex justify-between items-center bg-transparent relative z-50">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary  flex items-center justify-center relative overflow-hidden">
            <div className="w-[18px] h-1.5 border-[3px] border-white rounded-[0.5px]"></div>
            <div className="absolute w-5 h-5 border-2 border-white  translate-y-1 -rotate-90"></div>
          </div>
          <span className="text-2xl font-bold font-red-hat text-brand-dark">
            QuickHire
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/jobs"
            className="text-brand-gray font-medium hover:text-primary transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/categories"
            className="text-brand-gray font-medium hover:text-primary transition-colors"
          >
            Browse Categories
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-brand-gray font-medium hover:text-primary transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium text-brand-dark hidden md:inline-block border py-2 px-4  bg-white shadow-sm">
              Hi, {user.name}
            </span>
            <button
              onClick={logout}
              className="px-6 py-3 text-red-500 font-bold hover:bg-red-50  transition-colors border border-red-200 bg-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-6 py-3 text-primary font-bold hover:bg-primary/5  transition-colors"
            >
              Login
            </Link>
            <div className="w-[1px] h-12 bg-gray-200 mx-2 hidden md:block"></div>
            <Link
              href="/register"
              className="px-6 py-3 bg-primary text-white font-bold  hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
