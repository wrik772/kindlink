import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { redirect } from "next/navigation";
import PostCard from "@/components/Feed/PostCard";
import FriendActionButton from "@/components/Network/FriendActionButton";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const targetId = (await params).id;
  await connectToDatabase();

  const currentUser = await User.findOne({ email: session.user.email }).lean() as any;
  if (!currentUser) redirect("/login");

  if (targetId === currentUser._id.toString()) {
      redirect("/dashboard");
  }

  const profileUser = await User.findById(targetId).lean() as any;
  if (!profileUser) {
      return <div className="py-20 text-center text-gray-500">User not found.</div>;
  }

  const rawPosts = await Post.find({ author: targetId })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .lean() as any[];
  
  const posts = JSON.parse(JSON.stringify(rawPosts));

  // Determine Friend Status
  const isFriend = currentUser.friends?.some((id:any) => id.toString() === targetId);
  const sentRequest = profileUser.friendRequests?.some((r:any) => r.user.toString() === currentUser._id.toString());
  const receivedRequest = currentUser.friendRequests?.some((r:any) => r.user.toString() === targetId && r.status === 'pending');

  return (
    <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
      
      {/* Left Sidebar: Sticky Profile Card */}
      <div className="col-span-1 md:col-span-4 lg:col-span-3">
        <div className="sticky top-24 border border-[#ae8563]/20 bg-white rounded-xl shadow-sm h-fit overflow-hidden">
          <div className="h-20 bg-[#ae8563]/10 w-full" />
          <div className="px-5 pb-6 text-center relative -mt-10">
              <div className="w-20 h-20 bg-white rounded-full border-[4px] border-white mx-auto overflow-hidden shadow-sm flex items-center justify-center text-3xl font-bold text-[#6b4b34] bg-gray-100 mb-3">
                  {profileUser.avatar ? <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" /> : profileUser.name.charAt(0)}
              </div>
              <h2 className="font-bold text-xl text-[#171717]">{profileUser.name}</h2>
              <p className="text-sm text-gray-500 mb-5">{profileUser.location || "Global Citizen"}</p>
              
              {/* Metrics Section */}
              <div className="grid grid-cols-2 gap-2 mb-6 border-y border-gray-50 py-4">
                  <div className="text-center">
                      <p className="text-xl font-black text-[#ae8563]">{posts.length}</p>
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Impacts</p>
                  </div>
                  <div className="text-center border-l border-gray-100">
                      <p className="text-xl font-black text-[#ae8563]">
                          {posts.reduce((sum: number, p: any) => sum + (p.likes?.length || 0), 0)}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Applause</p>
                  </div>
              </div>

              <div className="w-full flex flex-col gap-2 mb-6">
                 {isFriend ? (
                     <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-200">✓ Friends</div>
                 ) : sentRequest ? (
                     <FriendActionButton userId={targetId} actionType="remove" label="Cancel Request" className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold border border-orange-200 hover:bg-orange-200 w-full" />
                 ) : receivedRequest ? (
                     <FriendActionButton userId={targetId} actionType="accept" label="Accept Request" className="px-4 py-2 bg-[#ae8563] text-white rounded-lg text-sm font-bold border border-[#ae8563] hover:bg-[#8c6746] w-full" />
                 ) : (
                     <FriendActionButton userId={targetId} actionType="send" label="Send Request" className="px-4 py-2 bg-[#ae8563]/10 text-[#ae8563] rounded-lg text-sm font-bold border border-[#ae8563]/20 hover:bg-[#ae8563] hover:text-white transition-colors w-full" />
                 )}
              </div>

              {/* Badges Section */}
              {(() => {
                const totalLikes = posts.reduce((sum: number, p: any) => sum + (p.likes?.length || 0), 0);
                const badges = [];
                if (posts.length >= 1) badges.push({ name: "Impact Starter", icon: "🌱", color: "text-green-600 bg-green-50 border-green-200" });
                if (posts.length >= 5) badges.push({ name: "Community Voice", icon: "🗣️", color: "text-blue-600 bg-blue-50 border-blue-200" });
                if (totalLikes >= 10) badges.push({ name: "Spark of Kindness", icon: "✨", color: "text-yellow-600 bg-yellow-50 border-yellow-200" });
                
                if (badges.length === 0) return null;

                return (
                  <div className="mb-6 text-left">
                    <p className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-wider">Achievements</p>
                    <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge) => (
                           <div key={badge.name} className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold ${badge.color}`} title={badge.name}>
                              <span>{badge.icon}</span>
                              <span>{badge.name}</span>
                           </div>
                        ))}
                    </div>
                  </div>
                );
              })()}

              <div className="border-t border-gray-100 pt-4 text-left">
                  <p className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-wider">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                      {profileUser.interests?.map((interest: string) => (
                          <span key={interest} className="text-[11px] bg-[#fffaf4] text-[#8c6746] px-2.5 py-1.5 rounded-full border border-[#ae8563]/10 font-medium">
                              {interest}
                          </span>
                      ))}
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Main Feed: Their Posts */}
      <div className="col-span-1 md:col-span-8 lg:col-span-9 space-y-6">
        <h2 className="text-2xl font-bold text-[#171717] px-2">{profileUser.name.split(' ')[0]}'s Impact</h2>
        
        <div className="space-y-4">
          {posts.map((post: any) => (
            <PostCard key={post._id.toString()} post={post} currentUserId={currentUser._id.toString()} />
          ))}
          {posts.length === 0 && (
              <div className="text-center py-16 text-gray-500 text-sm border border-dashed border-[#ae8563]/30 rounded-xl bg-white shadow-sm">
                  <div className="w-16 h-16 bg-[#fcf9f5] rounded-full mx-auto flex items-center justify-center text-2xl mb-4 text-[#ae8563]">📝</div>
                  {profileUser.name} hasn't posted any updates yet.
              </div>
          )}
        </div>
      </div>

    </div>
  );
}
