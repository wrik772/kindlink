"use client";

import { useState } from "react";
import Image from "next/image";

export default function PostCard({ post, currentUserId }: { post: any; currentUserId: string }) {
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [hasLiked, setHasLiked] = useState(
    post.likes?.includes(currentUserId)
  );

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!commentsLoaded && !showComments) {
      try {
        const res = await fetch(`/api/posts/${post._id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
          setCommentsLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment })
      });
      if (res.ok) {
        const addedComment = await res.json();
        setComments([...comments, addedComment]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async () => {
    // Optimistic UI updates
    const previousHasLiked = hasLiked;
    const previousLikesCount = likesCount;

    setHasLiked(!hasLiked);
    setLikesCount(hasLiked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await fetch(`/api/posts/${post._id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle like");
      const data = await res.json();
      setLikesCount(data.likes);
      setHasLiked(data.hasLiked);
    } catch (err) {
      console.error(err);
      // Revert optimistic update
      setHasLiked(previousHasLiked);
      setLikesCount(previousLikesCount);
    }
  };

  return (
    <div className="bg-white border border-[#ae8563]/20 rounded-xl shadow-sm overflow-hidden mb-4">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#6b4b34] border border-[#ae8563]/10 overflow-hidden shrink-0">
          {post.author?.avatar ? <img src={post.author.avatar} alt="avatar" className="w-full h-full object-cover" /> : post.author?.name?.charAt(0) || "?"}
        </div>
        <div>
          <p className="font-bold text-sm text-[#171717]">
            {post.author?.name || "Unknown User"}
          </p>
          <p suppressHydrationWarning className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
      </div>
      
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {post.mediaUrl && (
        <div className="w-full bg-[#fcf9f5] relative flex items-center justify-center border-y border-[#ae8563]/10 overflow-hidden max-h-[500px]">
          <img src={post.mediaUrl} alt="Post media" className="w-full h-auto object-contain cursor-pointer transition-transform hover:scale-[1.01]" />
        </div>
      )}

      <div className="px-2 py-3 border-t border-gray-50 flex gap-1 mx-2">
        <button
          onClick={handleLike}
          className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            hasLiked
              ? "text-[#ae8563] bg-[#ae8563]/10"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <svg className="w-5 h-5" fill={hasLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={hasLiked ? 0 : 2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" />
          </svg>
          Like {likesCount > 0 && <span className="text-xs ml-1">• {likesCount}</span>}
        </button>
        <button 
          onClick={toggleComments}
          className="px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comment
        </button>
      </div>

      {showComments && (
        <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#6b4b34] text-xs flex-shrink-0 border border-[#ae8563]/10">
               {/* placeholder for current user avatar */}
               <svg className="w-4 h-4 text-[#ae8563]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white border border-[#ae8563]/20 rounded-full px-4 text-sm outline-none focus:border-[#ae8563] focus:ring-1 focus:ring-[#ae8563]"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmittingComment}
              className="text-[#ae8563] font-semibold text-sm px-2 hover:text-[#8c6746] disabled:opacity-50"
            >
              Post
            </button>
          </form>

          <div className="space-y-3">
            {!commentsLoaded ? (
               <p className="text-xs text-center text-gray-400 py-2">Loading comments...</p>
            ) : comments.length === 0 ? (
               <p className="text-xs text-center text-gray-400 py-2">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment: any) => (
                <div key={comment._id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#6b4b34] text-xs flex-shrink-0 border border-[#ae8563]/10 overflow-hidden">
                    {comment.author?.avatar ? <img src={comment.author.avatar} alt="avatar" className="w-full h-full object-cover" /> : comment.author?.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 bg-white p-2.5 rounded-2xl rounded-tl-none border border-[#ae8563]/10 shadow-sm">
                    <p className="font-semibold text-xs text-[#171717]">
                      {comment.author?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
