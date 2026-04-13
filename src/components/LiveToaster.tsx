"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LiveToaster() {
  const { data: session } = useSession();
  const router = useRouter();
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: string; name: string; content: string } | null>(null);

  useEffect(() => {


    const checkLatestPost = async () => {
      if (!session?.user?.email) return; // Forbid if not logged in
      try {
        const res = await fetch("/api/posts/latest", { cache: 'no-store' });
        if (!res.ok) return;
        const post = await res.json();
        if (!post || !post._id) return;

        // Check local storage to ensure it's STRICTLY new across tabs/reloads
        const localStorageId = localStorage.getItem("kindlink_toast_latest");
        if (localStorageId === post._id) return; // We've explicitly seen this specific post already

        // Enforce chronological recency (e.g., if the post is over 5 minutes old, it's not a "Live" alert)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const postDate = new Date(post.createdAt);
        const isActuallyRecent = postDate > fiveMinutesAgo;

        setLastPostId((prevId) => {
          if (prevId === null || prevId === post._id) {
             // Init or same post
             localStorage.setItem("kindlink_toast_latest", post._id);
             return post._id;
          }
          
          if (prevId !== post._id && post.author?.email !== session?.user?.email) {
            // It's a brand new post compared to what we knew, BUT only toast if it's hot
            localStorage.setItem("kindlink_toast_latest", post._id);
            
            if (isActuallyRecent) {
                setToast({
                  id: post._id,
                  name: post.author?.name || "Someone",
                  content: post.content || "Shared a new update",
                });
                setTimeout(() => setToast(null), 6000);
            }
            
            return post._id;
          }
          return prevId;
        });
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    // Initial check and set interval: 15 seconds to stay safely within MongoDB Atlas free tier limits.
    checkLatestPost();
    const interval = setInterval(checkLatestPost, 15000);

    return () => clearInterval(interval);
  }, [session?.user?.email]);

  if (!session?.user?.email || !toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-500 hover:-translate-y-1">
      <div 
        onClick={() => {
           setToast(null);
           router.push(`/home#post-${toast.id}`);
           router.refresh();
        }}
        className="bg-white border-l-4 border-[#ae8563] shadow-2xl rounded-r-xl p-4 pr-6 cursor-pointer hover:bg-gray-50 flex flex-col gap-1 max-w-sm relative"
      >
        <button 
           onClick={(e) => { e.stopPropagation(); setToast(null); }}
           className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[#ae8563] font-bold text-xs tracking-wide uppercase">Live Network Update</p>
        </div>
        <p className="text-[#171717] font-semibold text-sm line-clamp-1">
          {toast.name} just posted!
        </p>
        <p className="text-gray-500 text-xs italic line-clamp-2">
          "{toast.content}"
        </p>
      </div>
    </div>
  );
}
