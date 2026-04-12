import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    let userId = null;

    if (session?.user?.email) {
      await connectToDatabase();
      const dbUser = await User.findOne({ email: session.user.email }).lean() as any;
      if (dbUser) userId = dbUser._id.toString();
    } else {
      await connectToDatabase();
    }

    const post = await Post.findById(id).lean() as any;
    if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const currentLikes = post.likes || [];
    const hasLiked = userId ? currentLikes.some((likedId: any) => likedId.toString() === userId) : false;

    return NextResponse.json({ likes: currentLikes.length, hasLiked });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
