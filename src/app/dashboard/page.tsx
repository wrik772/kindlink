import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { redirect } from "next/navigation";
import PostCard from "@/components/Feed/PostCard";
import PhoneNumberEditor from "@/components/Dashboard/PhoneNumberEditor";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  await connectToDatabase();
  const dbUser = await User.findOne({ email: session.user.email }).lean() as any;
  if (!dbUser) redirect("/login");

  const rawPosts = await Post.find({ author: dbUser._id })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .lean() as any[];
  
  const posts = JSON.parse(JSON.stringify(rawPosts));

  // Determine Impact metrics
  const totalPosts = posts.length;
  const totalLikesReceived = posts.reduce((sum: number, post: any) => sum + (post.likes?.length || 0), 0);

  // Gamification: Calculate Badges
  const badges = [];
  if (totalPosts >= 1) badges.push({ name: "Impact Starter", icon: "🌱", color: "text-green-600 bg-green-50 border-green-200" });
  if (totalPosts >= 5) badges.push({ name: "Community Voice", icon: "🗣️", color: "text-blue-600 bg-blue-50 border-blue-200" });
  if (totalLikesReceived >= 10) badges.push({ name: "Spark of Kindness", icon: "✨", color: "text-yellow-600 bg-yellow-50 border-yellow-200" });
  if (totalLikesReceived >= 50) badges.push({ name: "Golden Heart", icon: "💛", color: "text-[#ae8563] bg-[#fffaf4] border-[#ae8563]/30" });

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Metrics Sidebar */}
      <div className="col-span-1 space-y-6">
        <div className="bg-white border border-[#ae8563]/20 rounded-2xl p-8 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#ae8563]/20 to-[var(--brand-cashmere)]"></div>
          
          <a href="/dashboard/edit" className="absolute top-4 right-4 bg-white/50 hover:bg-white text-[#6b4b34] p-2 rounded-full shadow-sm transition-all z-20" title="Edit Profile">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </a>

          {dbUser.avatar ? (
            <div className="w-28 h-28 rounded-full border-[6px] border-white mx-auto overflow-hidden shadow-sm relative z-10 bg-white">
               <img src={dbUser.avatar} alt={dbUser.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-28 h-28 bg-white rounded-full border-[6px] border-white mx-auto overflow-hidden shadow-sm flex items-center justify-center text-5xl font-bold text-[#ae8563] relative z-10">
                {dbUser.name.charAt(0)}
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-[#171717] mt-4">{dbUser.name}</h1>
          <p className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider">{dbUser.location}</p>
          
          <div className="text-left mb-6">
             <PhoneNumberEditor initialPhone={dbUser.phoneNumber} />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="bg-[#fcf9f5] rounded-xl py-4">
              <p className="text-3xl font-black text-[#ae8563]">{totalPosts}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#6b4b34] font-bold mt-1">Impacts</p>
            </div>
            <div className="bg-[#fcf9f5] rounded-xl py-4">
              <p className="text-3xl font-black text-[#ae8563]">{totalLikesReceived}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#6b4b34] font-bold mt-1">Applause</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#ae8563]/20 rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold text-[#171717] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
             <svg className="w-5 h-5 text-[#ae8563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
             My Impact Badges
           </h3>
           <div className="flex flex-wrap gap-2">
              {badges.length === 0 ? (
                 <p className="text-xs text-gray-500 italic">Complete actions to earn badges!</p>
              ) : (
                badges.map((badge) => (
                    <div key={badge.name} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${badge.color}`}>
                        <span>{badge.icon}</span>
                        <span>{badge.name}</span>
                    </div>
                ))
              )}
          </div>
        </div>

        <div className="bg-white border border-[#ae8563]/20 rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold text-[#171717] border-b border-gray-100 pb-3 mb-4">Causes I Support</h3>
           <div className="flex flex-wrap gap-2">
              {dbUser.interests.map((interest: string) => (
                  <span key={interest} className="text-xs font-bold bg-[#ae8563]/10 text-[#8c6746] px-3 py-1.5 rounded-md border border-[#ae8563]/20">
                      {interest}
                  </span>
              ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="col-span-1 lg:col-span-2 space-y-5">
         <h2 className="text-2xl font-bold text-[#171717] mb-6 flex items-center gap-2">
             <svg className="w-6 h-6 text-[#ae8563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
             My Activity Archive
         </h2>
         {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm border-2 border-dashed border-[#ae8563]/20 rounded-2xl bg-white/50">
                You haven't posted any impact updates yet. 
                <br/><br/>
                <a href="/home" className="text-[#ae8563] font-bold hover:underline">Go to feed to create one</a>
            </div>
         ) : (
            posts.map((post: any) => (
              <PostCard key={post._id} post={post} currentUserId={dbUser._id.toString()} isEditable={true} />
            ))
         )}
      </div>
    </div>
  );
}
