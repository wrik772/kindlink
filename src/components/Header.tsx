import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="w-full border-b border-[#ae8563]/30 bg-white text-[#6b4b34]">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo height={10} width={45} />
          <span className="sr-only">KindLink</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/home" className="rounded-full border border-[var(--brand-muesli)] text-[var(--brand-muesli)] px-3 py-1.5 hover:bg-[#f7efe5]">
            Home
          </Link>
          <Link href="/login" className="rounded-full border border-[#d2ae88] text-white bg-[#ae8563] px-3 py-1.5 hover:opacity-90">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}


