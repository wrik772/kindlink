"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-full bg-[#6b4b34] text-white px-6 py-2 text-sm font-bold shadow-sm hover:opacity-90 hover:shadow-md transition-all"
    >
      Sign out
    </button>
  );
}


