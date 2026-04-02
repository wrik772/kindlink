import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Image from "next/image";
import Link from "next/link";
import RecommendationPanel from "@/components/RecommendationPanel";
import CreatePost from "@/components/Feed/CreatePost";
import PostCard from "@/components/Feed/PostCard";
export const dynamic = "force-dynamic";

export default async function HomeFeedPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  await connectToDatabase();
  
  // Check if user has completed onboarding
  const dbUser = await User.findOne({ email: session.user.email }).lean() as any;
  if (!dbUser?.location || !dbUser?.interests || dbUser.interests.length === 0) {
    redirect("/onboarding");
  }

  // Fetch posts (placeholder for now, matching new schema)
  const rawPosts = await Post.find().populate('author', 'name avatar').sort({ createdAt: -1 }).lean() as any[];
  const posts = JSON.parse(JSON.stringify(rawPosts));

  return (
    <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Left Sidebar: Mini Profile */}
      <div className="hidden md:block col-span-1 md:col-span-4 lg:col-span-3 border border-[#ae8563]/20 bg-white rounded-xl shadow-sm h-fit overflow-hidden">
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

      {/* Middle Column: Feed */}
      <div className="col-span-1 md:col-span-8 lg:col-span-5 space-y-6">
        <CreatePost userInitial={dbUser.name.charAt(0)} userAvatar={dbUser.avatar} />

        {/* Post Feed */}
        <div className="space-y-4">
          {posts.map((post: any) => (
            <PostCard key={post._id.toString()} post={post} currentUserId={dbUser._id.toString()} />
          ))}
          {posts.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-[#ae8563]/30 rounded-xl bg-white">
                  No posts yet in your network. Be the first to share!
              </div>
          )}
        </div>
      </div>


      {/* Right Sidebar: Recommendations */}
      <div className="hidden lg:block col-span-4 space-y-4">
         <RecommendationPanel userLocation={dbUser.location} userInterests={dbUser.interests} />
      </div>

    </div>
  );
}


