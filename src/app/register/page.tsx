"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onStep1Submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setStep(2);
      setSuccess("Verification code sent! Please check your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setStatus("idle");
    }
  };

  const onStep2Submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      setSuccess("Account instantly verified & created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-row-reverse">
      {/* Visual Right Side */}
      <div className="hidden lg:flex flex-1 relative bg-[var(--brand-cashmere)] overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20 bg-[url('/pattern.png')] bg-repeat" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--brand-muesli)]/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-[#ae8563]/20 text-[#6b4b34] text-sm font-semibold backdrop-blur-sm">
             Join the Movement
          </div>
          <h2 className="text-4xl font-bold leading-tight text-[#171717]">Build a profile that actually matters.</h2>
          <p className="text-lg text-[#171717]/80">Connect with local NGOs, showcase your volunteer work, and inspire others to create a ripple effect of kindness.</p>
        </div>
      </div>

      {/* Form Left Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#171717] mb-2">Create an Account</h1>
              <p className="text-gray-500">Join KindLink and start sharing your impact today.</p>
            </div>
            
            {step === 1 ? (
            <form onSubmit={onStep1Submit} className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    autoComplete="name"
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#fcf9f5] px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#ae8563] focus:bg-white focus:ring-4 focus:ring-[#ae8563]/10"
                  />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    autoComplete="email"
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#fcf9f5] px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#ae8563] focus:bg-white focus:ring-4 focus:ring-[#ae8563]/10"
                  />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      autoComplete="new-password"
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
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
                className="w-full rounded-xl btn-primary py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-[#ae8563]/20"
              >
                {status === "submitting" ? "Securing channel..." : "Continue"}
              </button>
            </form>
            ) : (
             <form onSubmit={onStep2Submit} className="space-y-5 animate-fade-in mt-6">
                <div className="bg-[#fcf9f5] border border-[#ae8563]/20 p-4 rounded-xl text-center mb-4">
                   <p className="text-sm font-semibold text-[#6b4b34]">Enter the 6-digit code</p>
                   <p className="text-xs text-gray-500 mt-1">We sent an email to <span className="font-bold text-[#ae8563]">{form.email}</span></p>
                </div>
                
                <div className="space-y-2">
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={form.otp}
                    onChange={(e) => handleChange("otp", e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono outline-none transition-all placeholder:text-gray-300 focus:border-[#ae8563] focus:bg-white focus:ring-4 focus:ring-[#ae8563]/10"
                  />
                </div>

                {error && <div className="p-3 text-center text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
                {success && <div className="p-3 text-center text-sm text-green-600 bg-green-50 rounded-lg border border-green-100">{success}</div>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(null); setSuccess(null); }}
                    className="flex-1 rounded-xl bg-gray-100 text-gray-700 py-3.5 font-semibold text-sm hover:bg-gray-200 transition-all font-mono"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={status === "submitting" || form.otp.length !== 6}
                    className="flex-[2] rounded-xl btn-primary py-3.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-[#ae8563]/20"
                  >
                    {status === "submitting" ? "Verifying..." : "Verify & Create Account"}
                  </button>
                </div>
             </form>
            )}

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link className="font-semibold text-[#ae8563] hover:text-[var(--brand-muesli)] transition-colors" href="/login">
                Sign in
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
}


