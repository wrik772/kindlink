import Link from "next/link";
import Logo from "./Logo";
import { auth } from "@/auth";
import MobileMenu from "@/components/MobileMenu";
import DesktopNav from "@/components/DesktopNav";

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
        <DesktopNav isLoggedIn={!!session?.user} />
        <MobileMenu isLoggedIn={!!session?.user} />
      </div>
    </header>
  );
}