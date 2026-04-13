"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";

export default function LiveFeedList({ initialPosts, currentUserId }: { initialPosts: any[], currentUserId: string }) {
  const [posts, setPosts] = useState<any[]>(initialPosts);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        if (res.ok) {
          const freshPosts = await res.json();
          // We safely replace the list cleanly enabling smooth transition
          setPosts(freshPosts);
        }
      } catch (err) {
        console.error("Failed to fetch fresh posts", err);
      }
    };

    // Poll every 10 seconds for real-time feed updates
    const interval = setInterval(fetchLatestPosts, 10000);
    return () => clearInterval(interval);
  }, []);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-[#ae8563]/30 rounded-xl bg-white shadow-sm transition-all duration-500">
          No posts yet in your network. Be the first to share!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
         <div key={post._id.toString()} className="animate-fade-in-up">
            <PostCard post={post} currentUserId={currentUserId} />
         </div>
      ))}
    </div>
  );
}
