"use client";

import { useState, useEffect } from "react";

interface Friend {
  _id: string;
  name: string;
  avatar?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postContent: string;
}

export default function ShareModal({ isOpen, onClose, postId, postContent }: ShareModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sharingWith, setSharingWith] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      // In this app, friends are fetched via the user profile or network API
      const res = await fetch("/api/user/friends"); // We'll need to ensure this route exists or update it
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (sharingWith.length === 0) return;
    setIsSending(true);
    try {
      // Send message to each selected friend
      const promises = sharingWith.map(friendId => 
        fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            receiverId: friendId, 
            content: `Check out this post: "${postContent.slice(0, 30)}..."`,
            sharedPostId: postId 
          })
        })
      );
      
      await Promise.all(promises);
      onClose();
      // Reset state
      setSharingWith([]);
    } catch (err) {
      console.error("Sharing failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#6b4b34]">Share Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search friends..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#ae8563]/20 rounded-full text-sm focus:outline-none focus:border-[#ae8563] focus:ring-1 focus:ring-[#ae8563]"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 mb-6 custom-scrollbar">
            {loading ? (
                <p className="text-center text-xs text-gray-400 py-4">Loading connections...</p>
            ) : filteredFriends.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-4">No connections found.</p>
            ) : (
              filteredFriends.map((friend) => (
                <label key={friend._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ae8563]/10 border border-[#ae8563]/10 flex items-center justify-center overflow-hidden font-bold text-[#ae8563]">
                        {friend.avatar ? <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" /> : friend.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-[#171717]">{friend.name}</span>
                   </div>
                   <input 
                     type="checkbox" 
                     className="w-5 h-5 rounded-full border-gray-300 text-[#ae8563] focus:ring-[#ae8563]"
                     checked={sharingWith.includes(friend._id)}
                     onChange={(e) => {
                       if (e.target.checked) setSharingWith(prev => [...prev, friend._id]);
                       else setSharingWith(prev => prev.filter(id => id !== friend._id));
                     }}
                   />
                </label>
              ))
            )}
          </div>

          <button
            disabled={sharingWith.length === 0 || isSending}
            onClick={handleShare}
            className="w-full py-3 bg-[#ae8563] text-white rounded-full font-bold shadow-lg hover:bg-[#8c6746] disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {isSending ? "Sending..." : `Send to ${sharingWith.length} ${sharingWith.length === 1 ? 'Person' : 'People'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
