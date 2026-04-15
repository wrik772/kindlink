"use client";

import { useState, useEffect } from "react";
import ClientFeedWrapper from "@/components/Feed/ClientFeedWrapper";

interface HomeFeedLayoutProps {
  dbUser: any;
  posts: any[];
  city: string;
  initialFilter: "global" | "local";
  recommendationsPanel: React.ReactNode;
}

export default function HomeFeedLayout({ 
  dbUser, 
  posts, 
  city,
  initialFilter,
  recommendationsPanel
}: HomeFeedLayoutProps) {
  const [activeFilter, setActiveFilter] = useState<"global" | "local">(initialFilter);

  // Sync state to cookie on change
  useEffect(() => {
    document.cookie = `kindlink_feed_filter=${activeFilter}; path=/; max-age=31536000; SameSite=Lax`;
  }, [activeFilter]);

  return (
    <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Left Sidebar: Profile & Filter */}
      <div className="hidden md:block col-span-1 md:col-span-4 lg:col-span-3 space-y-4">
        
        {/* Profile Card */}
        <div className="border border-[#ae8563]/20 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-16 bg-[#ae8563]/10 w-full" />
          <div className="px-4 pb-4 pb-6 text-center relative -mt-8">
            <div className="w-16 h-16 bg-white rounded-full border-2 border-white mx-auto overflow-hidden shadow-sm flex items-center justify-center text-xl font-bold text-[#6b4b34] bg-gray-100 mb-3">
              {dbUser.avatar ? <img src={dbUser.avatar} alt={dbUser.name} className="w-full h-full object-cover" /> : dbUser.name.charAt(0)}
            </div>
            <h2 className="font-bold text-[#171717]">{dbUser.name}</h2>
            <p className="text-xs text-gray-500 mb-4">{dbUser.location}</p>
            
            <div className="border-t border-gray-100 pt-3 text-left">
              <p className="text-xs text-gray-500 mb-2 font-bold">Interests</p>
              <div className="flex flex-wrap gap-1">
                {dbUser.interests.map((interest: string) => (
                  <span key={interest} className="text-[10px] bg-[#fffaf4] text-[#8c6746] px-2 py-1 rounded-full border border-[#ae8563]/10">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feed Filter Toggle (Sidebar) */}
        <div className="bg-white border border-[#ae8563]/20 rounded-xl p-1 shadow-sm flex gap-1">
          <button 
            onClick={() => setActiveFilter("global")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all text-center ${activeFilter === 'global' ? 'bg-[#ae8563] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            Global
          </button>
          <button 
            onClick={() => setActiveFilter("local")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all text-center ${activeFilter === 'local' ? 'bg-[#ae8563] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            Nearby
          </button>
        </div>

      </div>

      {/* Middle Column: Feed */}
      <div className="col-span-1 md:col-span-8 lg:col-span-5 space-y-6">
        <ClientFeedWrapper 
          initialPosts={posts}
          currentUserId={dbUser._id.toString()}
          userInitial={dbUser.name.charAt(0)}
          userAvatar={dbUser.avatar}
          userCity={city}
          activeFilter={activeFilter}
        />
      </div>

      {/* Right Sidebar: Recommendations */}
      <div className="hidden lg:block col-span-4 space-y-4">
         {recommendationsPanel}
      </div>

    </div>
  );
}
