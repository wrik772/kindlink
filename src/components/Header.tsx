import Link from "next/link";
import Logo from "./Logo";
import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-[#ae8563]/20 shadow-sm transition-all">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo height={10} width={45} />
          <div className="text-2xl font-bold text-[#6b4b34] group-hover:text-[var(--brand-muesli)] transition-colors">
            KindLink
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/home"
            className="hidden sm:block text-[#6b4b34] hover:text-[var(--brand-muesli)] transition-colors"
          >
            Causes
          </Link>
          <Link
            href="/about"
            className="hidden sm:block text-[#6b4b34] hover:text-[var(--brand-muesli)] transition-colors"
          >
            About Us
          </Link>

          <div className="flex items-center gap-3">
            {!session?.user ? (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-[#6b4b34] hover:text-[var(--brand-muesli)] font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[var(--brand-muesli)] text-white px-5 py-2.5 hover:opacity-90 transition-opacity shadow-sm"
                >
                  Donate Now
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex text-[#6b4b34] hover:text-[var(--brand-muesli)] font-semibold"
                >
                  Dashboard
                </Link>
                <SignOutButton />
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}