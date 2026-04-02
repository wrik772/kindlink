"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function MessagesInbox() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const initialPartnerId = searchParams.get("userId");
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(initialPartnerId);
  const [activePartnerData, setActivePartnerData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations
  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/messages').then(res => res.json()).then(data => {
         // data is the list of unique conversations
         if (data && Array.isArray(data)) {
            setConversations(data);
            
            if (initialPartnerId && !data.find((c:any) => c.partner._id === initialPartnerId)) {
                fetch(`/api/user/${initialPartnerId}`).then(res => res.json()).then(u => {
                    if (u) {
                        setActivePartnerData(u);
                    }
                });
            } else if (initialPartnerId) {
                const conv = data.find((c:any) => c.partner._id === initialPartnerId);
                if (conv) setActivePartnerData(conv.partner);
            }
         }
      });
    }
  }, [status, initialPartnerId]);

  // Load active conversation messages
  useEffect(() => {
     if (activePartnerId && status === "authenticated") {
        fetch(`/api/messages/${activePartnerId}`).then(res => res.json()).then(data => {
            if (Array.isArray(data)) {
                setMessages(data);
                const conv = conversations.find(c => c.partner._id === activePartnerId);
                if (conv) setActivePartnerData(conv.partner);
            }
        });
     }
  }, [activePartnerId, status]);

  const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newMessage.trim() || !activePartnerId) return;
      
      const res = await fetch('/api/messages', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ receiverId: activePartnerId, content: newMessage })
      });
      if(res.ok) {
          const sentMsg = await res.json();
          setMessages([...messages, sentMsg]);
          setNewMessage("");
          
          // Optionally update the conversation list snippet
          setConversations(prev => {
              const clone = [...prev];
              const convIdx = clone.findIndex(c => c.partner._id === activePartnerId);
              if (convIdx > -1) {
                  clone[convIdx].lastMessage = sentMsg;
              } else if (activePartnerData) {
                  clone.unshift({ partner: activePartnerData, lastMessage: sentMsg, unreadCount: 0 });
              }
              return clone;
          });
      }
  };

  return (
    <div className="py-6 h-[calc(100vh-80px)]">
       <div className="bg-white border border-[#ae8563]/20 rounded-2xl shadow-sm h-full flex overflow-hidden">
          {/* Left Sidebar: Conversations */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
             <div className="p-4 border-b border-gray-100 bg-white">
                 <h2 className="font-bold text-lg text-[#171717]">Inbox</h2>
             </div>
             <div className="flex-1 overflow-y-auto">
                 {conversations.length === 0 && !activePartnerId && (
                     <div className="p-8 text-center text-sm text-gray-500">
                        No messages yet. <br/>
                        <Link href="/network" className="text-[#ae8563] hover:underline mt-2 inline-block">Find people in your Network</Link>
                     </div>
                 )}
                 {conversations.map(conv => (
                     <button 
                       key={conv.partner._id}
                       onClick={() => setActivePartnerId(conv.partner._id)}
                       className={`w-full text-left p-4 border-b border-gray-100 flex items-center gap-3 hover:bg-white transition-colors ${activePartnerId === conv.partner._id ? 'bg-white border-l-4 border-l-[#ae8563]' : ''}`}
                     >
                         <div className="w-12 h-12 bg-[#fcf9f5] rounded-full border border-[#ae8563]/10 flex items-center justify-center font-bold text-[#ae8563] flex-shrink-0 overflow-hidden">
                             {conv.partner.avatar ? <img src={conv.partner.avatar} className="w-full h-full object-cover"/> : conv.partner.name.charAt(0)}
                         </div>
                         <div className="flex-1 overflow-hidden">
                             <h4 className="font-bold text-sm text-[#171717] truncate">{conv.partner.name}</h4>
                             <p className="text-xs text-gray-500 truncate">{conv.lastMessage.content}</p>
                         </div>
                         {conv.unreadCount > 0 && (
                             <div className="w-5 h-5 bg-[#ae8563] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                 {conv.unreadCount}
                             </div>
                         )}
                     </button>
                 ))}
             </div>
          </div>

          {/* Right Panel: Chat */}
          <div className="flex-1 flex flex-col bg-white">
             {activePartnerId ? (
                 <>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-[#fcf9f5] rounded-full border border-[#ae8563]/10 flex items-center justify-center font-bold text-[#ae8563] overflow-hidden">
                                 {activePartnerData?.avatar ? <img src={activePartnerData.avatar} className="w-full h-full object-cover"/> : activePartnerData?.name?.charAt(0) || "?"}
                             </div>
                             <div>
                               <h3 className="font-bold text-[#171717]">{activePartnerData?.name || "Loading..."}</h3>
                               <p className="text-[10px] text-gray-400 uppercase tracking-widest">KindLink Member</p>
                             </div>
                         </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fcf9f5]/30">
                        {messages.length === 0 ? (
                            <div className="text-center text-sm text-gray-400 py-20 flex flex-col items-center">
                                <div className="w-16 h-16 bg-white rounded-full border border-gray-100 flex items-center justify-center mb-4 text-2xl">👋</div>
                                Say hello to {activePartnerData?.name || "them"}!
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isMe = msg.sender?.email === session?.user?.email;
                                return (
                                    <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-5 py-2.5 text-sm ${isMe ? 'bg-[#ae8563] text-white rounded-br-none shadow-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input 
                              type="text" 
                              value={newMessage} 
                              onChange={e => setNewMessage(e.target.value)}
                              placeholder="Type your message..."
                              className="flex-1 px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ae8563]/20 focus:border-[#ae8563] text-sm transition-all"
                            />
                            <button type="submit" disabled={!newMessage.trim()} className="w-12 h-12 bg-[#ae8563] text-white rounded-full flex items-center justify-center hover:bg-[#967050] transition-colors disabled:opacity-50">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{transform: 'translateX(2px)'}}>
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                 </>
             ) : (
                 <div className="flex-1 flex items-center justify-center flex-col text-[#ae8563]/50">
                     <svg className="w-20 h-20 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                     <p className="font-semibold">Select a conversation to start messaging</p>
                 </div>
             )}
          </div>
       </div>
    </div>
  )
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="py-20 text-center text-[#ae8563]">Loading inbox...</div>}>
            <MessagesInbox />
        </Suspense>
    )
}
