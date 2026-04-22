"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useState } from "react";

import packageInfo from "../../package.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Awesome! You're added to the list.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred.");
    }
    
    // Clear message dynamically
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 4000);
  };

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
            A dedicated social network for individuals, NGOs, and volunteers to seamlessly connect, network, and amplify real-world societal impact.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4 text-[#ae8563]">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/home" className="hover:text-[#ae8563] transition-colors">Feed</Link></li>
            <li><Link href="/login" className="hover:text-[#ae8563] transition-colors">Join Network</Link></li>
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
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 relative">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                disabled={status === "loading"}
                className="flex-1 rounded-md border border-[#d2ae88] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563] bg-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#ae8563] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#967050] transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Join"}
              </button>
            </div>
            {message && (
              <div className={`text-xs mt-1 absolute -bottom-5 ${status === "success" ? "text-green-600 font-medium" : "text-red-500"}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-12 pt-8 border-t border-[#ae8563]/10 text-center text-xs text-[#6b4b34]/60">
        <p>© {currentYear} KindLink. All rights reserved. Made with purpose. <span className="opacity-40 ml-2">v{packageInfo.version}</span></p>
      </div>
    </footer>
  );
}


