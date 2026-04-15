"use client";

import SearchBar from "./SearchBar";
import CreatePost from "./CreatePost";
import LiveFeedList from "./LiveFeedList";

interface ClientFeedWrapperProps {
  initialPosts: any[];
  currentUserId: string;
  userInitial: string;
  userAvatar?: string;
  userCity: string;
  activeFilter: "global" | "local";
}

export default function ClientFeedWrapper({ 
  initialPosts, 
  currentUserId, 
  userInitial, 
  userAvatar,
  userCity,
  activeFilter
}: ClientFeedWrapperProps) {
  return (
    <div className="space-y-6">
      <SearchBar />
      
      <CreatePost userInitial={userInitial} userAvatar={userAvatar} />

      <LiveFeedList 
        initialPosts={initialPosts} 
        currentUserId={currentUserId} 
        filterCity={activeFilter === 'local' ? userCity : undefined} 
      />
    </div>
  );
}
