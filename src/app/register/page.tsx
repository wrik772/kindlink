"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to register");
      }

      setSuccess("Account created! Redirecting to login...");
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section className="py-16 max-w-2xl mx-auto">
      <div className="rounded-xl border border-[var(--brand-sorrell)]/50 bg-[#fffaf4] p-6">
        <h1 className="text-2xl font-semibold mb-4">Create your KindLink account</h1>
        <div className="rounded-lg border border-[var(--brand-sorrell)]/50 bg-white p-5 max-w-md">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="w-full rounded-md border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
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
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-black text-white px-6 py-2 font-medium hover:bg-[#333] disabled:opacity-50"
            >
              {status === "submitting" ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}


