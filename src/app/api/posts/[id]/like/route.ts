import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const userId = dbUser._id.toString();
    const currentLikes = post.likes || [];
    const hasLiked = currentLikes.some((likedId: any) => likedId.toString() === userId);

    if (hasLiked) {
      post.likes = currentLikes.filter((likedId: any) => likedId.toString() !== userId);
    } else {
      post.likes = [...currentLikes, userId];
      
      // Create notification
      if (post.author.toString() !== userId) {
        const Notification = (await import("@/models/Notification")).default;
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: "like_post",
          post: post._id
        });
      }
    }

    await post.save();
    
    // Refresh for recent liker name
    const updatedPost = await Post.findById(id).populate("likes", "name").lean() as any;
    const recentLikerName = updatedPost.likes?.length > 0 ? updatedPost.likes[updatedPost.likes.length - 1].name : null;

    return NextResponse.json({ 
      message: "Success", 
      likes: post.likes.length, 
      hasLiked: !hasLiked,
      recentLikerName
    }, { status: 200 });
  } catch (error: any) {
    console.error("Like error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
