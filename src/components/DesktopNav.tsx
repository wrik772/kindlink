"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UnreadBadge from "@/components/UnreadBadge";
import SignOutButton from "@/components/SignOutButton";
import NotificationDrawer from "@/components/NotificationDrawer";

interface DesktopNavProps {
  isLoggedIn: boolean;
}

export default function DesktopNav({ isLoggedIn }: DesktopNavProps) {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    return pathname === path 
      ? "hidden sm:block text-[#6b4b34] font-bold transition-colors" 
      : "hidden sm:block text-[#ae8563] font-bold hover:text-[#6b4b34] transition-colors";
  };

  const showAuthButtons = pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password";

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      {isLoggedIn && (
        <>
          <Link href="/home" className={getLinkClass("/home")}>Feed</Link>
          <Link href="/network" className={getLinkClass("/network")}>Network</Link>
          <Link href="/messages" className={`${getLinkClass("/messages")} relative`}>
            Messages
            <UnreadBadge />
          </Link>
        </>
      )}

      <div className="flex items-center gap-3">
        {!isLoggedIn ? (
          showAuthButtons && (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-[#6b4b34] hover:text-[#ae8563] font-bold"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex rounded-full bg-[#ae8563] text-white px-5 py-2 hover:bg-[#967050] transition-colors font-bold shadow-sm"
              >
                Join Network
              </Link>
            </>
          )
        ) : (
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/dashboard"
              className={getLinkClass("/dashboard")}
            >
              Dashboard
            </Link>
            <NotificationDrawer />
            <SignOutButton />
          </div>
        )}
      </div>
    </nav>
  );
}
