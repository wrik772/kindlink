"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ users: any[], organizations: any[], posts: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full mb-6 z-40" ref={dropdownRef}>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results) setShowDropdown(true); }}
          placeholder="Search for people, organizations, or posts..."
          className="w-full bg-white border border-[#ae8563]/20 text-[#171717] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ae8563]/30 shadow-sm transition-all"
        />
        {isSearching && (
           <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#ae8563] border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {showDropdown && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ae8563]/20 rounded-xl shadow-xl overflow-hidden max-h-[400px] overflow-y-auto">
           {results.users.length === 0 && results.organizations.length === 0 && results.posts.length === 0 && (
             <div className="p-4 text-center text-sm text-gray-500">No results found for "{query}"</div>
           )}

           {results.users.length > 0 && (
              <div className="py-2 border-b border-gray-100 last:border-b-0">
                  <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">People</p>
                  {results.users.map(user => (
                      <Link key={user._id} href={`/user/${user._id}`} onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-[#fcf9f5] transition-colors">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#ae8563] overflow-hidden text-xs shrink-0">
                              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : user.name.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                              <p className="text-sm font-bold text-[#171717] truncate">{user.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{user.location || "User"}</p>
                          </div>
                      </Link>
                  ))}
              </div>
           )}

           {results.organizations.length > 0 && (
              <div className="py-2 border-b border-gray-100 last:border-b-0">
                  <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Organizations</p>
                  {results.organizations.map(org => (
                      <Link key={org._id} href={`/network`} onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-[#fcf9f5] transition-colors">
                          <div className="w-8 h-8 rounded-full bg-[#ae8563]/10 flex items-center justify-center font-bold text-[#ae8563] overflow-hidden text-xs shrink-0">
                              {org.imageUrl ? <img src={org.imageUrl} className="w-full h-full object-cover"/> : org.name.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                              <p className="text-sm font-bold text-[#171717] truncate">{org.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{org.type}</p>
                          </div>
                      </Link>
                  ))}
              </div>
           )}

           {results.posts.length > 0 && (
              <div className="py-2 border-b border-gray-100 last:border-b-0">
                  <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Posts</p>
                  {results.posts.map(post => (
                      <button key={post._id} onClick={() => { setShowDropdown(false); router.push(`/user/${post.author?._id}#post-${post._id}`); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#fcf9f5] transition-colors text-left text-sm">
                          <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          <div className="overflow-hidden">
                              <span className="font-bold text-[#ae8563]">{post.author?.name || "Someone"}:</span>
                              <span className="text-gray-600 ml-1 line-clamp-1">{post.content}</span>
                          </div>
                      </button>
                  ))}
              </div>
           )}
        </div>
      )}
    </div>
  );
}
