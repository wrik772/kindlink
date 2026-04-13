"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost({ userInitial, userAvatar }: { userInitial: string, userAvatar?: string }) {
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    if (mediaUrls.length + files.length > 5) {
       alert("You can only upload a maximum of 5 photos per post.");
       return;
    }

    setIsUploading(true);
    for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
           alert(`Image ${file.name} is larger than 5MB. Processing skipped.`);
           continue;
        }
        
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
            
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });
            
            if (res.ok) {
                const data = await res.json();
                // Push the secure Cloudinary URL to state
                setMediaUrls(prev => [...prev, data.secure_url]);
            }
        } catch (err) {
            console.error("Cloudinary upload failed", err);
        }
    }
    
    setIsUploading(false);
    // Clear input so same file can be selected again if needed
    e.target.value = "";
  };
  
  const removePhoto = (index: number) => {
      setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mediaUrls }),
      });
      
      if (res.ok) {
        setContent("");
        setMediaUrls([]);
        router.refresh(); // Refresh the server component feed
      }
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#ae8563]/20 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex gap-3 items-start">
        <div className="w-10 h-10 rounded-full bg-[#f7efe5] flex items-center justify-center text-sm font-bold text-[#6b4b34] flex-shrink-0 border border-[#ae8563]/10 overflow-hidden">
            {userAvatar ? <img src={userAvatar} alt="avatar" className="w-full h-full object-cover" /> : userInitial}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your societal impact..."
          className="flex-1 min-h-[80px] bg-transparent border-none resize-none focus:ring-0 text-sm text-[#171717] placeholder:text-gray-400 p-2"
        />
      </div>
      
      {mediaUrls.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-2">
             {mediaUrls.map((url, i) => (
                 <div key={i} className="relative rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 w-32 h-32 bg-gray-50">
                     <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover block" />
                     <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                 </div>
             ))}
          </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <div className="flex gap-2 text-gray-500">
           <label className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer" title="Add Image">
             <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
             <svg className="w-5 h-5 text-[#ae8563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           </label>
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting || isUploading}
          className="bg-[#ae8563] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#8c6746] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting || isUploading ? "Processing..." : "Post"}
        </button>
      </div>
    </form>
  );
}
