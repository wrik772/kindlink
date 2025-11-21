"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const postTypes = [
  { label: "Donation", value: "donation" },
  { label: "Volunteer", value: "volunteer" },
  { label: "In-kind", value: "in-kind" },
];

export default function CreatePostForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    orgName: "",
    type: "donation",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create post");
      }

      setForm({ orgName: "", type: "donation", message: "" });
      router.push("/home");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="orgName" className="text-sm font-medium">
          Organization name
        </label>
        <input
          id="orgName"
          type="text"
          value={form.orgName}
          onChange={(e) => updateField("orgName", e.target.value)}
          required
          className="w-full rounded-md border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Need type
        </label>
        <select
          id="type"
          value={form.type}
          onChange={(e) => updateField("type", e.target.value)}
          className="w-full rounded-md border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        >
          {postTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Details
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          required
          rows={4}
          className="w-full rounded-md border border-black bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-[var(--brand-muesli)] text-white px-6 py-2 font-medium hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Posting..." : "Publish post"}
      </button>
    </form>
  );
}


