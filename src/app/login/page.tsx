"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setStatus("idle");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full">
      {/* Visual Left Side */}
      <div className="hidden lg:flex flex-1 relative bg-[var(--brand-muesli)] overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20 bg-[url('/pattern.png')] bg-repeat" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--brand-sorrell)]/20 rounded-full blur-3xl -mr-10 -mb-10"></div>
        
        <div className="relative z-10 max-w-lg text-white space-y-6">
          <h2 className="text-4xl font-bold leading-tight">Welcome back to the community.</h2>
          <p className="text-lg text-white/80">Every login brings you one step closer to making a real-world impact. See what your network is doing today.</p>
          <div className="pt-8 flex -space-x-3 opacity-90">
             <div className="w-12 h-12 rounded-full bg-[#f7efe5] border-2 border-[var(--brand-muesli)] flex items-center justify-center font-bold text-[#ae8563] text-sm">NL</div>
             <div className="w-12 h-12 rounded-full bg-[#e5c39c] border-2 border-[var(--brand-muesli)] flex items-center justify-center font-bold text-white text-sm">RK</div>
             <div className="w-12 h-12 rounded-full bg-[var(--brand-sorrell)] border-2 border-[var(--brand-muesli)] flex items-center justify-center font-bold text-white text-sm">SJ</div>
          </div>
        </div>
      </div>

      {/* Form Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#171717] mb-2">Sign In</h1>
              <p className="text-gray-500">Welcome back! Please enter your details.</p>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#fcf9f5] px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#ae8563] focus:bg-white focus:ring-4 focus:ring-[#ae8563]/10"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link href="/forgot-password" title="Recover your account" className="text-sm font-medium text-[#ae8563] hover:text-[var(--brand-muesli)]">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#fcf9f5] px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#ae8563] focus:bg-white focus:ring-4 focus:ring-[#ae8563]/10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
              
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-xl bg-[#171717] text-white py-3.5 font-semibold text-sm hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5"
              >
                {status === "submitting" ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link className="font-semibold text-[#ae8563] hover:text-[var(--brand-muesli)] transition-colors" href="/register">
                Sign up
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <section className="py-16 max-w-2xl mx-auto">
        <div className="rounded-xl border border-[var(--brand-sorrell)]/50 bg-[#fffaf4] p-6">
          <h1 className="text-2xl font-semibold mb-4">Login to KindLink</h1>
          <div className="rounded-lg border border-[var(--brand-sorrell)]/50 bg-white p-5 max-w-md">
            <p className="text-sm text-foreground/70">Loading...</p>
          </div>
        </div>
      </section>
    }>
      <LoginForm />
    </Suspense>
  );
}


