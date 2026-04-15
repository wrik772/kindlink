"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocationSelector from "@/components/Onboarding/LocationSelector";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", location: "", avatar: "", interests: [] as string[] });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const availableInterests = [
    "Animals", "Education", "Environment", "Hunger", 
    "Disaster Relief", "Elderly Care", "Healthcare", "Women Empowerment"
  ];

  const handleLocationChange = useCallback((loc: string) => {
    setForm(prev => {
      if (prev.location === loc) return prev;
      return { ...prev, location: loc };
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
         alert("Please select an image smaller than 2MB.");
         return;
      }
      
      setIsUploadingAvatar(true);
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
          setForm({ ...form, avatar: data.secure_url });
        } else {
          alert("Failed to upload image to cloud.");
        }
      } catch (err) {
        console.error("Cloudinary upload failed", err);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") return router.push("/login");
    if (status === "authenticated" && session?.user?.email) {
      fetch('/api/user/profile/me').then(res => res.json()).then(data => {
        if(data) {
           setForm({ name: data.name || "", location: data.location || "", avatar: data.avatar || "", interests: data.interests || [] });
        }
        setIsFetching(false);
      }).catch(() => setIsFetching(false));
    }
  }, [status]);

  const toggleInterest = (interest: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="py-20 text-center text-[#ae8563]">Loading...</div>;

  return (
    <div className="py-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="w-10 h-10 bg-white border border-[#ae8563]/20 rounded-full flex items-center justify-center text-[#6b4b34] hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-[#171717]">Edit Profile</h1>
      </div>

      <div className="bg-white border border-[#ae8563]/20 rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#6b4b34] mb-2">Display Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ae8563]/20 focus:border-[#ae8563] transition-all" required />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#6b4b34] mb-3">Location</label>
            <div className="bg-[#fcf9f5] border border-[#ae8563]/10 p-4 rounded-xl mb-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Current: {form.location || "Not set"}</p>
              <LocationSelector onLocationChange={handleLocationChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#6b4b34] mb-2">Display Picture (Optional)</label>
            <div className="flex items-center gap-4">
               {form.avatar ? (
                  <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden flex-shrink-0">
                     <img src={form.avatar} alt="Preview" className="w-full h-full object-cover" />
                  </div>
               ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 border-dashed flex flex-col items-center justify-center text-xs text-gray-400 flex-shrink-0">
                     No img
                  </div>
               )}
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={handleImageUpload}
                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ae8563]/10 file:text-[#ae8563] hover:file:bg-[#ae8563]/20 transition-all cursor-pointer"
               />
            </div>
            <p className="text-xs text-gray-500 mt-2">Upload an image directly from your device (Max 2MB).</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#6b4b34] mb-3">Causes I Support</label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      form.interests.includes(interest)
                        ? "bg-[#ae8563] text-white border-[#ae8563]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#ae8563] hover:text-[#ae8563]"
                    }`}
                  >
                    {interest}
                  </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
             <Link href="/dashboard" className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">Cancel</Link>
             <button type="submit" disabled={isLoading || isUploadingAvatar} className="px-8 py-3 bg-[#ae8563] hover:bg-[#967050] text-white text-sm font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50">
               {isLoading ? "Saving..." : isUploadingAvatar ? "Uploading..." : "Save Changes"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
