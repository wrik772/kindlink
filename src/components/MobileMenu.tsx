"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UnreadBadge from "@/components/UnreadBadge";
import SignOutButton from "@/components/SignOutButton";

interface MobileMenuProps {
  isLoggedIn: boolean;
}

export default function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  const getLinkClass = (path: string) => {
    return pathname === path ? "text-lg text-[#6b4b34] font-bold" : "text-lg text-[#ae8563] font-bold";
  };

  const isForgotPass = pathname === "/forgot-password";
  
  if (isForgotPass && !isLoggedIn) return null;

  return (
    <div className="sm:hidden flex items-center gap-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[#6b4b34] focus:outline-none"
        aria-label="Toggle Menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-[#ae8563]/20 shadow-lg p-5 flex flex-col gap-5 z-50">
          {isLoggedIn ? (
            <>
              <Link href="/home" onClick={() => setIsOpen(false)} className={getLinkClass("/home")}>Feed</Link>
              <Link href="/network" onClick={() => setIsOpen(false)} className={getLinkClass("/network")}>Network</Link>
              <Link href="/messages" onClick={() => setIsOpen(false)} className={`${getLinkClass("/messages")} flex items-center gap-2`}>
                Messages
                <div className="relative"><UnreadBadge /></div>
              </Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className={getLinkClass("/dashboard")}>Dashboard</Link>
              <div className="pt-4 border-t border-gray-100 flex justify-start">
                 <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)} className={getLinkClass("/login")}>Login</Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className={getLinkClass("/register")}>Create Account</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
