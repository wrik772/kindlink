import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const comment = await Comment.findById(id).populate("author");
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const userId = user._id as any;
    const hasLiked = comment.likes.some((likedId: any) => likedId.toString() === userId.toString());

    if (hasLiked) {
      // Unlike
      comment.likes = comment.likes.filter((likedId: any) => likedId.toString() !== userId.toString());
    } else {
      // Like
      comment.likes.push(userId);
      
      // Create notification for the comment author
      if (comment.author._id.toString() !== userId.toString()) {
        await Notification.create({
          recipient: comment.author._id,
          sender: userId,
          type: "like_comment",
          comment: comment._id,
          post: comment.post,
        });
      }
    }

    await comment.save();
    return NextResponse.json({ likes: comment.likes });
  } catch (err) {
    console.error("Comment like error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
