import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import RecommendationPanel from "@/components/RecommendationPanel";
import HomeFeedLayout from "@/components/Home/HomeFeedLayout";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function HomeFeedPage() {
  const session = await auth();
  const cookieStore = await cookies();
  const initialFilter = cookieStore.get("kindlink_feed_filter")?.value as "global" | "local" || "global";

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  await connectToDatabase();
  
  // Check if user has completed onboarding
  const rawUser = await User.findOne({ email: session.user.email }).lean() as any;
  if (!rawUser?.location || !rawUser?.interests || rawUser.interests.length === 0) {
    redirect("/onboarding");
  }

  const dbUser = JSON.parse(JSON.stringify(rawUser));

  const rawPosts = await Post.find().populate('author', 'name avatar').sort({ createdAt: -1 }).lean() as any[];
  const posts = JSON.parse(JSON.stringify(rawPosts));

  // Determine city for "Nearby" filter
  const city = dbUser.location?.split(',')[1]?.trim() || "";

  return (
    <HomeFeedLayout 
      dbUser={dbUser}
      posts={posts}
      city={city}
      initialFilter={initialFilter}
      recommendationsPanel={
        <RecommendationPanel userLocation={dbUser.location} userInterests={dbUser.interests} />
      }
    />
  );
}
