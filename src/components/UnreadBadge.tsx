"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function UnreadBadge() {
   const { data: session } = useSession();
   const [count, setCount] = useState(0);

   useEffect(() => {
      if(!session?.user) return;
      const checkUnread = () => {
          fetch('/api/messages/unread', {cache: 'no-store'})
            .then(r => r.json())
            .then(d => setCount(d.count))
            .catch(() => null);
      }
      
      checkUnread();
      const int = setInterval(checkUnread, 8000); // Poll every 8 seconds
      return () => clearInterval(int);
   }, [session?.user]);

   if(count === 0) return null;
   
   return (
       <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-fade-in-up">
           {count}
       </span>
   );
}
