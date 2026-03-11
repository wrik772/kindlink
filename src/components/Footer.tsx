import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#fcf9f5] border-t border-[#ae8563]/20 text-[#6b4b34] pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Logo height={8} width={36} />
            <span className="text-xl font-bold">KindLink</span>
          </div>
          <p className="text-sm text-[#6b4b34]/80 leading-relaxed">
            Connecting NGOs, shelters, and donors to create a world where every help reaches the right hand.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4 text-[#ae8563]">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-[#ae8563] transition-colors">About Us</Link></li>
            <li><Link href="/causes" className="hover:text-[#ae8563] transition-colors">Explore Causes</Link></li>
            <li><Link href="/partners" className="hover:text-[#ae8563] transition-colors">Our Partners</Link></li>
            <li><Link href="/impact" className="hover:text-[#ae8563] transition-colors">Impact Stories</Link></li>
          </ul>
        </div>

        {/* Legal & Contact */}
        <div>
          <h3 className="font-bold mb-4 text-[#ae8563]">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:text-[#ae8563] transition-colors">Help Center</Link></li>
            <li><Link href="/terms" className="hover:text-[#ae8563] transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-[#ae8563] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/contact" className="hover:text-[#ae8563] transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold mb-4 text-[#ae8563]">Stay Updated</h3>
          <p className="text-sm text-[#6b4b34]/80 mb-4">
            Subscribe to our newsletter for the latest updates and impact stories.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 rounded-md border border-[#d2ae88] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563] bg-white"
            />
            <button
              type="button"
              className="bg-[#ae8563] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#967050] transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-12 pt-8 border-t border-[#ae8563]/10 text-center text-xs text-[#6b4b34]/60">
        <p>© {currentYear} KindLink. All rights reserved. Made with purpose.</p>
      </div>
    </footer>
  );
}


