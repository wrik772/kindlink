"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";


interface Notification {
  _id: string;
  type: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  post?: string;
  comment?: string;
  isRead: boolean;
  createdAt: string;
}

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
};

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const audioRef = useRef<HTMLAudioElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const newUnread = data.filter((n: Notification) => !n.isRead).length;
        if (newUnread > unreadCount && audioRef.current) {
          audioRef.current.play().catch(() => null);
        }
        setNotifications(data);
        setUnreadCount(newUnread);
      }
    } catch (err) { console.error(err); }
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications", { method: "PATCH" });
    } catch (err) { console.error(err); }
  };

  const getNotificationText = (notif: Notification) => {
    switch (notif.type) {
      case "like_post": return "liked your post";
      case "like_comment": return "liked your comment";
      case "comment": return "commented on your post";
      case "friend_request": return "sent you a friend request";
      case "message": return "sent you a new message";
      case "share": return "shared a post with you";
      default: return "interacted with you";
    }
  };

  const handleAction = async (notifId: string, userId: string, action: "accept" | "reject") => {
    try {
      const method = action === "accept" ? "PUT" : "DELETE";
      const res = await fetch(`/api/user/${userId}/request`, { method });
      if (res.ok) {
        // Optimistically remove or update the notification/request
        setNotifications(prev => prev.filter(n => n._id !== notifId));
        // You might want to refresh the notification list or show a success toast
      }
    } catch (err) { console.error(err); }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case "like_post":
      case "like_comment":
        return (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.106 1.106zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 10.333z" /></svg>
          </div>
        );
      case "comment":
        return (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" clipRule="evenodd" /></svg>
          </div>
        );
      case "friend_request":
        return (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" /></svg>
          </div>
        );
      case "share":
        return (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </div>
          );
      default: return null;
    }
  };

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  // Simple sectioning
  const now = new Date();
  const isNew = (dateStr: string) => {
    const d = new Date(dateStr);
    return (now.getTime() - d.getTime()) < 24 * 60 * 60 * 1000;
  };

  const newNotifications = filteredNotifications.filter(n => isNew(n.createdAt));
  const earlierNotifications = filteredNotifications.filter(n => !isNew(n.createdAt));

  return (
    <div className="relative" ref={dropdownRef}>
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />
      
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) markAsRead();
        }}
        className={`relative p-2 rounded-full transition-all duration-200 focus:outline-none ${isOpen ? 'bg-[#ae8563]/10 text-[#ae8563]' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed inset-x-4 top-[72px] sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[360px] bg-white rounded-xl shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] z-[100] border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3 relative">
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              <div ref={optionsRef}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(!showOptionsMenu); }}
                  className={`p-2 rounded-full transition-colors ${showOptionsMenu ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </button>

                {showOptionsMenu && (
                  <div className="absolute right-0 top-10 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-150">
                    <button 
                      onClick={() => { markAsRead(); setShowOptionsMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${activeTab === 'all' ? 'bg-[#ae8563]/10 text-[#ae8563]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab("unread")}
                className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${activeTab === 'unread' ? 'bg-[#ae8563]/10 text-[#ae8563]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Unread
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[480px] pb-2 custom-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                 </div>
                 <p className="text-gray-500 text-sm">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-1 px-2">
                {newNotifications.length > 0 && (
                  <>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-bold text-gray-900">New</span>
                      <button className="text-xs text-[#ae8563] font-semibold hover:underline">See all</button>
                    </div>
                    {newNotifications.map(renderNotifItem)}
                  </>
                )}
                
                {earlierNotifications.length > 0 && (
                  <>
                    <div className="px-3 py-4">
                      <span className="text-sm font-bold text-gray-900">Earlier</span>
                    </div>
                    {earlierNotifications.map(renderNotifItem)}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  function renderNotifItem(notif: Notification) {
    return (
      <div 
        key={notif._id} 
        className={`group p-2 rounded-lg hover:bg-gray-50 transition-all flex gap-3 relative cursor-pointer ${!notif.isRead ? 'after:content-[""] after:w-2.5 after:h-2.5 after:bg-red-500 after:rounded-full after:absolute after:right-4 after:top-1/2 after:-translate-y-1/2' : ''}`}
      >
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
            {notif.sender.avatar ? (
              <img src={notif.sender.avatar} alt={notif.sender.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#ae8563]/10 text-[#ae8563] font-bold text-lg">
                {notif.sender.name.charAt(0)}
              </div>
            )}
          </div>
          {getBadgeIcon(notif.type)}
        </div>
        
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-sm text-gray-900 leading-snug">
            <span className="font-bold">{notif.sender.name}</span> {getNotificationText(notif)}
          </p>
          <p className="text-xs text-blue-600 font-bold mt-1">
            {timeAgo(new Date(notif.createdAt))}
          </p>
          
          {notif.type === "friend_request" && (
            <div className="flex gap-2 mt-3 mb-1">
               <button 
                  onClick={(e) => { e.stopPropagation(); handleAction(notif._id, notif.sender._id, "accept"); }}
                  className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
               >
                 Confirm
               </button>
               <button 
                  onClick={(e) => { e.stopPropagation(); handleAction(notif._id, notif.sender._id, "reject"); }}
                  className="flex-1 py-1.5 bg-gray-200 text-gray-900 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors"
               >
                 Delete
               </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

