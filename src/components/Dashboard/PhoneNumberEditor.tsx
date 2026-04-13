"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PhoneNumberEditor({ initialPhone }: { initialPhone?: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(initialPhone || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        console.error("Failed to save phone number");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between mt-4 p-3 bg-[#fcf9f5] rounded-xl border border-[#ae8563]/10">
         <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Phone Number</p>
            <p className="text-sm font-medium text-[#171717]">{phone || "Not provided"}</p>
         </div>
         <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-[#ae8563] hover:underline px-3 py-1.5">Edit</button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-xl border border-[#ae8563]/20 shadow-sm relative z-50 w-full overflow-hidden">
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Edit Phone Number</p>
      <div className="flex flex-col gap-2 w-full">
         <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="+1 234 567 8900"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ae8563]"
         />
         <div className="flex gap-2 w-full">
             <button onClick={handleSave} disabled={loading} className="flex-1 py-2 bg-[#ae8563] text-white text-xs font-bold rounded-md disabled:opacity-50 hover:bg-[#8c6746] transition-colors">
                 {loading ? "..." : "Save"}
             </button>
             <button onClick={() => { setIsEditing(false); setPhone(initialPhone || ""); }} className="flex-1 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-200 transition-colors">
                 Cancel
             </button>
         </div>
      </div>
    </div>
  );
}
