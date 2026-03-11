"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Briefcase, LayoutDashboard, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="w-full px-6 md:px-[124px] py-4 bg-transparent relative z-[100]">
      <div className="flex justify-between items-center h-16">
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

          {/* Desktop Navigation Links */}
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
          </div>
        </div>

        {/* Desktop Auth/Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="text-brand-gray font-medium hover:text-primary transition-colors mr-4"
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  href="/dashboard/applications"
                  className="text-brand-gray font-medium hover:text-primary transition-colors mr-4"
                >
                  My Applications
                </Link>
              )}
              <span className="text-sm font-medium text-brand-dark border py-2 px-4 bg-white shadow-sm">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="px-6 py-3 text-red-500 font-bold hover:bg-red-50 transition-colors border border-red-200 bg-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 text-primary font-bold hover:bg-primary/5 transition-colors"
              >
                Login
              </Link>
              <div className="w-[1px] h-12 bg-gray-200 mx-2"></div>
              <Link
                href="/register"
                className="px-6 py-3 bg-primary text-white font-bold  hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-brand-dark hover:text-primary transition-colors"
        >
          {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 bg-white z-[90] md:hidden overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-6">
            <div className="flex flex-col gap-4 border-b pb-6">
              <Link 
                href="/jobs" 
                className="text-xl font-medium text-brand-dark hover:text-primary flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase className="h-5 w-5" /> Find Jobs
              </Link>
              <Link 
                href="/categories" 
                className="text-xl font-medium text-brand-dark hover:text-primary flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" /> Browse Categories
              </Link>
            </div>

            <div className="flex flex-col gap-4 border-b pb-6">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark">{user.name}</p>
                      <p className="text-sm text-brand-gray capitalize">{user.role.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  {user.role === 'ADMIN' ? (
                    <Link 
                      href="/admin" 
                      className="text-lg font-medium text-brand-dark hover:text-primary flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5" /> Admin Panel
                    </Link>
                  ) : (
                    <Link 
                      href="/dashboard/applications" 
                      className="text-lg font-medium text-brand-dark hover:text-primary flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FileText className="h-5 w-5" /> My Applications
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                    }}
                    className="text-lg font-medium text-red-500 hover:text-red-600 flex items-center gap-3 mt-4"
                  >
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full h-14 text-lg font-bold border-primary text-primary">Login</Button>
                  </Link>
                  <Link 
                    href="/register" 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full h-14 text-lg font-bold">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Helper to keep FileText import available if needed, but it was missing in the contents
import { FileText } from "lucide-react";
