"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "Account & Profile Support",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setStatusMessage(data.message);
        setFormData({
          name: "",
          email: "",
          inquiryType: "Account & Profile Support",
          message: ""
        });
      } else {
        setStatus("error");
        setStatusMessage(data.message || "Failed to submit.");
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage("An unexpected error occurred.");
    }
  };
  return (
    <div className="bg-[#fcf9f5] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-[#ae8563]/20">
        <h1 className="text-4xl font-bold text-[#171717] mb-4">Contact Our Team</h1>
        <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8">Whether you are an NGO looking to verify your digital profile or a user experiencing algorithmic constraints, our administrative team is available to assist.</p>

        {status === "success" && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium">
            {statusMessage}
          </div>
        )}
        {status === "error" && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#6b4b34] mb-2">Display Name</label>
              <input 
                required 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563]" 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#6b4b34] mb-2">Account Email</label>
              <input 
                required 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563]" 
                placeholder="john@example.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#6b4b34] mb-2">Inquiry Type</label>
            <select 
              required
              value={formData.inquiryType}
              onChange={e => setFormData({...formData, inquiryType: e.target.value})}
              className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563]"
            >
              <option>Account & Profile Support</option>
              <option>NGO Authorization Badge Request</option>
              <option>Feed Algorithm or Recommendations Issue</option>
              <option>Abuse Reporting (Content / Messages)</option>
              <option>General Feedback</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#6b4b34] mb-2">Detailed Message</label>
            <textarea 
              required
              rows={5} 
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563]" 
              placeholder="Describe the issue you are facing adjusting your interests, location pairing, or reporting inappropriate peer networking behavior..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full py-3 bg-[#ae8563] text-white font-bold rounded-lg hover:bg-[#8c6746] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Dispatching..." : "Dispatch Message securely"}
          </button>
        </form>
      </div>
    </div>
  );
}
