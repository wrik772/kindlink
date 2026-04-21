"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import ShareModal from "./ShareModal";
import { useRouter } from "next/navigation";

export default function PostCard({ post, currentUserId, isEditable }: { post: any; currentUserId: string, isEditable?: boolean }) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [hasLiked, setHasLiked] = useState(
    (post.likes || []).some((l: any) => (l._id || l).toString() === currentUserId)
  );
  const [recentLikerName, setRecentLikerName] = useState<string | null>(post.likes?.at(-1)?.name || null);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const allPhotos = post.mediaUrls?.length > 0 ? post.mediaUrls : (post.mediaUrl ? [post.mediaUrl] : []);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedMediaUrls, setEditedMediaUrls] = useState<string[]>(allPhotos);
  const [isSaving, setIsSaving] = useState(false);

  // Poll for real-time like updates
  useEffect(() => {
     const int = setInterval(() => {
        fetch(`/api/posts/${post._id}/stats`)
          .then(res => res.json())
          .then(data => {
              if (data.likes !== undefined) {
                 setLikesCount(data.likes);
                 setHasLiked(data.hasLiked);
                 setRecentLikerName(data.recentLikerName);
              }
          }).catch(() => null);
     }, 8000); // Polling every 8 seconds for real-time feel
     return () => clearInterval(int);
  }, [post._id]);

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
      if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to toggle like: ${res.status} - ${text}`);
      }
      const data = await res.json();
      setLikesCount(data.likes);
      setHasLiked(data.hasLiked);
      setRecentLikerName(data.recentLikerName);
    } catch (err) {
      console.error(err);
      // Revert optimistic update
      setHasLiked(previousHasLiked);
      setLikesCount(previousLikesCount);
    }
  };

  const handleEditSubmit = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent, mediaUrls: editedMediaUrls })
      });
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      }
    } catch(err) { console.error(err); } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if(!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch(err) { console.error(err); }
  };

  if (isEditing) {
     return (
        <div id={`post-${post._id}`} className="bg-white border border-[#ae8563] outline outline-4 outline-[#ae8563]/10 rounded-xl shadow-sm p-5 mb-4 relative z-10 transition-all">
           <p className="text-xs font-bold text-[#ae8563] uppercase tracking-wider mb-3">Editing Post</p>
           <textarea 
             value={editedContent}
             onChange={e => setEditedContent(e.target.value)}
             className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae8563]"
           />
           {editedMediaUrls.length > 0 && (
               <div className="flex gap-2 overflow-x-auto py-3">
                  {editedMediaUrls.map((url, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200 shrink-0 w-20 h-20">
                          <img src={url} alt="Edit preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setEditedMediaUrls(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                      </div>
                  ))}
               </div>
           )}
           <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <label className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-[#ae8563] flex gap-2 items-center text-sm font-bold">
                 <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (editedMediaUrls.length + files.length > 5) return alert("Maximum 5 photos.");
                    
                    setIsSaving(true); // Re-use isSaving as a loading lock
                    for (const file of files) {
                        if (file.size > 5 * 1024 * 1024) {
                            alert("Image too large. Skipping " + file.name);
                            continue;
                        }
                        try {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
                            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
                            if (res.ok) {
                                const data = await res.json();
                                setEditedMediaUrls(prev => [...prev, data.secure_url]);
                            }
                        } catch (err) { console.error(err); }
                    }
                    setIsSaving(false);
                    e.target.value = "";
                 }} />
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                 Add Photos
              </label>
              <div className="flex gap-2">
                  <button disabled={isSaving} onClick={() => {setIsEditing(false); setEditedContent(post.content); setEditedMediaUrls(allPhotos);}} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                  <button disabled={isSaving} onClick={handleEditSubmit} className="px-4 py-2 text-xs font-bold text-white bg-[#ae8563] hover:bg-[#8c6746] rounded-md transition-colors">{isSaving ? "Saving..." : "Save Changes"}</button>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div id={`post-${post._id}`} className="bg-white border border-[#ae8563]/20 rounded-xl shadow-sm overflow-hidden mb-4 scroll-mt-24">
      <div className="p-4 flex items-center gap-3">
        <Link href={`/user/${post.author?._id}`} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#6b4b34] border border-[#ae8563]/10 overflow-hidden shrink-0 hover:border-[#ae8563] transition-colors">
          {post.author?.avatar ? <img src={post.author.avatar} alt="avatar" className="w-full h-full object-cover" /> : post.author?.name?.charAt(0) || "?"}
        </Link>
        <div className="flex-1">
          <Link href={`/user/${post.author?._id}`} className="font-bold text-sm text-[#171717] hover:text-[#ae8563] transition-colors">
            {post.author?.name || "Unknown User"}
          </Link>
          <p suppressHydrationWarning className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} at {new Date(post.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        
        {isEditable && (
          <div className="flex items-center gap-2">
             <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-[#ae8563] hover:bg-[#ae8563]/10 rounded-full transition-colors" title="Edit Post">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </button>
             <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete Post">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>
          </div>
        )}
      </div>
      
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {allPhotos.length > 0 && (
        <div className="w-full bg-[#111111] border-y border-[#111111] overflow-hidden rounded-md mt-2">
             {allPhotos.length === 1 && (
                 <img onClick={() => setLightboxIndex(0)} src={allPhotos[0]} alt="Post media" className="w-full h-auto max-h-[600px] object-contain cursor-pointer mx-auto transition-transform duration-300 hover:scale-[1.01]" />
             )}
             {allPhotos.length === 2 && (
                 <div className="flex gap-[2px] h-64 sm:h-72 md:h-[400px]">
                     {allPhotos.map((url: string, i: number) => (
                          <div key={i} className="flex-1 overflow-hidden bg-black">
                             <img onClick={() => setLightboxIndex(i)} src={url} alt={`Post media ${i}`} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                          </div>
                     ))}
                 </div>
             )}
             {allPhotos.length >= 3 && (
                 <div className="flex gap-[2px] h-64 sm:h-72 md:h-[400px]">
                     <div className="w-[60%] h-full overflow-hidden bg-black shrink-0 relative">
                         <img onClick={() => setLightboxIndex(0)} src={allPhotos[0]} alt="Post media 0" className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500" />
                     </div>
                     <div className="w-[40%] flex flex-col gap-[2px] h-full shrink-0">
                         <div className="flex-1 overflow-hidden bg-black relative">
                             <img onClick={() => setLightboxIndex(1)} src={allPhotos[1]} alt="Post media 1" className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500" />
                         </div>
                         <div className="flex-1 relative cursor-pointer overflow-hidden bg-black group" onClick={() => setLightboxIndex(2)}>
                             <img src={allPhotos[2]} alt="Post media 2" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                             {allPhotos.length > 3 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                                    <span className="text-white text-3xl font-bold tracking-tight">+{allPhotos.length - 3}</span>
                                </div>
                             )}
                         </div>
                     </div>
                 </div>
             )}
        </div>
      )}

      {/* Instagram-style Likes Row */}
      {likesCount > 0 && (
          <div className="px-4 py-2 flex items-center gap-2 border-t border-gray-50/50">
             <div className="flex -space-x-2">
                 <div className="w-5 h-5 rounded-full bg-[#ae8563] border-2 border-white flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 10.333z" /></svg>
                 </div>
             </div>
             <p className="text-[13px] text-gray-600">
                Liked by <span className="font-bold text-[#171717]">{recentLikerName || "a supporter"}</span>
                {likesCount > 1 && <> and <span className="font-bold text-[#171717]">{likesCount - 1} others</span></>}
             </p>
          </div>
      )}

      <div className="px-2 py-2 border-t border-gray-50 flex gap-1 mx-2">
        <button
          onClick={handleLike}
          className={`group px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            hasLiked
              ? "text-[#ae8563] bg-[#ae8563]/10"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <svg className={`w-5 h-5 transition-transform ${hasLiked ? 'scale-110' : 'group-hover:scale-110'}`} fill={hasLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={hasLiked ? 0 : 2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" />
          </svg>
          Like
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
        <button 
          onClick={() => setShowShareModal(true)}
          className="px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
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
                <div key={comment._id} className="flex gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#6b4b34] text-xs flex-shrink-0 border border-[#ae8563]/10 overflow-hidden">
                    {comment.author?.avatar ? <img src={comment.author.avatar} alt="avatar" className="w-full h-full object-cover" /> : comment.author?.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white p-2.5 rounded-2xl rounded-tl-none border border-[#ae8563]/10 shadow-sm relative">
                        <p className="font-semibold text-xs text-[#171717]">
                        {comment.author?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-700 mt-0.5">{comment.content}</p>
                    </div>
                    {/* Comment Likes UI */}
                    <div className="flex items-center gap-3 mt-1 ml-2">
                         <button 
                            className={`text-[10px] font-bold transition-colors ${comment.likes?.includes(currentUserId) ? 'text-[#ae8563]' : 'text-gray-500 hover:text-gray-800'}`}
                            onClick={async () => {
                                try {
                                    const res = await fetch(`/api/comments/${comment._id}/like`, { method: "POST" });
                                    if (res.ok) {
                                        const data = await res.json();
                                        setComments(prev => prev.map(c => c._id === comment._id ? { ...c, likes: data.likes } : c));
                                    }
                                } catch (err) { console.error(err); }
                            }}
                         >
                             {comment.likes?.includes(currentUserId) ? 'Liked' : 'Like'}
                         </button>
                         {comment.likes?.length > 0 && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                                <svg className="w-2.5 h-2.5 text-[#ae8563]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 10.333z" /></svg>
                                {comment.likes.length}
                            </span>
                         )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
         <div 
           className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
           onClick={() => setLightboxIndex(null)}
         >
           <button 
             className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black/50 rounded-full p-3 transition-colors z-50"
             onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
           >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>

           <div className="flex items-center w-full max-w-6xl justify-between flex-1 relative h-full">
               <button 
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.max(0, lightboxIndex - 1)); }} 
                  disabled={lightboxIndex === 0} 
                  className="absolute left-0 z-50 text-white p-4 h-full disabled:opacity-0 hover:bg-black/20 transition-all text-6xl font-light"
               >
                   &lsaquo;
               </button>

               <div className="flex-1 h-full flex items-center justify-center p-8">
                   <img 
                     src={allPhotos[lightboxIndex]} 
                     alt="Post media fullscreen" 
                     className="max-w-full max-h-full object-contain rounded-lg shadow-2xl scale-animation"
                     onClick={(e) => e.stopPropagation()} 
                   />
               </div>

               <button 
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(Math.min(allPhotos.length - 1, lightboxIndex + 1)); }} 
                  disabled={lightboxIndex === allPhotos.length - 1} 
                  className="absolute right-0 z-50 text-white p-4 h-full disabled:opacity-0 hover:bg-black/20 transition-all text-6xl font-light"
               >
                   &rsaquo;
               </button>
           </div>
           
           <div className="flex justify-center gap-2 mt-4 absolute bottom-8 z-50">
               {allPhotos.map((_: string, i: number) => (
                   <button 
                     key={i} 
                     onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                     className={`h-2 rounded-full transition-all ${i === lightboxIndex ? 'w-8 bg-[#ae8563]' : 'w-2 bg-gray-400 hover:bg-gray-300'}`} 
                   />
               ))}
           </div>
         </div>
      )}

      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        postId={post._id}
        postContent={post.content}
      />
    </div>
  );
}
