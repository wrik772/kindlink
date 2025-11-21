"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-full border border-black text-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
    >
      Sign out
    </button>
  );
}


