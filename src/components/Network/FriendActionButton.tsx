"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  actionType: "send" | "accept" | "reject" | "remove";
  label: string;
  className?: string;
}

export default function FriendActionButton({ userId, actionType, label, className }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async () => {
    setLoading(true);
    try {
      let method = "POST";
      if (actionType === "accept") method = "PUT";
      if (actionType === "reject" || actionType === "remove") method = "DELETE";

      const res = await fetch(`/api/user/${userId}/request`, {
        method,
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        router.refresh();
      } else {
         console.error(await res.text());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAction} 
      disabled={loading}
      className={className || "px-4 py-2 bg-[#ae8563] text-white text-sm font-bold rounded-lg hover:bg-[#8c6746] transition-colors disabled:opacity-50 w-full"}
    >
      {loading ? "..." : label}
    </button>
  );
}
