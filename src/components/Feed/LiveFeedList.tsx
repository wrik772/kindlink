"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";

export default function LiveFeedList({ initialPosts, currentUserId, filterCity }: { initialPosts: any[], currentUserId: string, filterCity?: string }) {
  const [posts, setPosts] = useState<any[]>(initialPosts);

  const fetchLatestPosts = async () => {
    try {
      const url = filterCity ? `/api/posts?city=${encodeURIComponent(filterCity)}` : "/api/posts";
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const freshPosts = await res.json();
        setPosts(freshPosts);
      }
    } catch (err) {
      console.error("Failed to fetch fresh posts", err);
    }
  };

  useEffect(() => {
    fetchLatestPosts();
    // Poll every 10 seconds for real-time feed updates
    const interval = setInterval(fetchLatestPosts, 10000);
    return () => clearInterval(interval);
  }, [filterCity]);

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
