"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("verify");
        setStatus("idle");
      } else {
        setError(data.message || "Something went wrong.");
        setStatus("idle");
      }
    } catch (err) {
      setError("Failed to connect to server.");
      setStatus("idle");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setError(data.message || "Reset failed.");
        setStatus("idle");
      }
    } catch (err) {
      setError("Failed to connect to server.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f5] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl shadow-[#ae8563]/5 border border-[#ae8563]/10 text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-[#171717]">Password Updated!</h2>
          <p className="text-gray-500">Your security is our priority. You can now use your new password to access your community.</p>
          <Link
            href="/login"
            className="block w-full py-3.5 bg-[#ae8563] text-white rounded-xl font-bold hover:bg-[#8c6746] transition-all shadow-lg shadow-[#ae8563]/20"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f5] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl shadow-[#ae8563]/5 border border-[#ae8563]/10">
        <div className="flex justify-center mb-8">
          <Link href="/"><Logo height={12} width={55} /></Link>
        </div>

        <div className="space-y-2 mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#171717]">
            {step === "email" ? "Recover Account" : "Secure Account"}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === "email"
              ? "Tell us your email and we'll send a 6-digit recovery code."
              : `We've sent a code to ${email}. Verification required.`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#6b4b34] ml-1">Account Email</label>
              <input
                required
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#ae8563]/10 transition-all placeholder:text-gray-400"
              />
            </div>
            <button
              disabled={status === "loading"}
              type="submit"
              className="w-full py-4 bg-[#ae8563] text-white rounded-xl font-bold hover:bg-[#8c6746] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#ae8563]/10"
            >
              {status === "loading" ? "Identifying Account..." : "Request Recovery Code"}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#6b4b34] ml-1">Verification Code</label>
              <input
                required
                maxLength={6}
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-xl p-4 text-center text-2xl font-mono tracking-[10px] focus:outline-none focus:ring-4 focus:ring-[#ae8563]/10 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 ml-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-new-password"
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    className="w-full rounded-xl border border-gray-200 bg-[#fcf9f5] px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#ae8563] focus:bg-white focus:ring-4 focus:ring-[#ae8563]/10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              disabled={status === "loading"}
              type="submit"
              className="w-full py-4 bg-[#ae8563] text-white rounded-xl font-bold hover:bg-[#8c6746] transition-all shadow-lg shadow-[#ae8563]/20"
            >
              {status === "loading" ? "Securing Account..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-[#ae8563] font-bold hover:underline"
            >
              Re-enter Email
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <Link href="/login" className="text-sm font-bold text-[#ae8563] hover:text-[#8c6746] transition-colors">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
