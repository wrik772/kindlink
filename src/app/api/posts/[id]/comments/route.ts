import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const comments = await Comment.find({ post: id })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
       return NextResponse.json({ message: "Content required" }, { status: 400 });
    }

    await connectToDatabase();
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure post exists
    const postExists = await Post.findById(id);
    if (!postExists) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const newComment = await Comment.create({
      post: id,
      author: dbUser._id,
      content,
    });

    const populatedComment = await newComment.populate('author', 'name avatar');

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
