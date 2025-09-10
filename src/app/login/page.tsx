"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Placeholder: integrate real auth later
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <section className="py-16 max-w-2xl mx-auto">
      <div className="rounded-xl border border-[var(--brand-sorrell)]/50 bg-[#fffaf4] p-6">
        <h1 className="text-2xl font-semibold mb-4">Login to KindLink</h1>
        <div className="rounded-lg border border-[var(--brand-sorrell)]/50 bg-white p-5 max-w-md">
          <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
          />
        </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-foreground text-background py-2 font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Logging in…" : "Login"}
            </button>
            <p className="text-sm text-foreground/70">
              New here? <Link className="underline" href="#">Create account</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}


