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
    const hasLiked = post.likes.some((id: any) => id.toString() === userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id: any) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({ message: "Success", likes: post.likes.length, hasLiked: !hasLiked }, { status: 200 });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
