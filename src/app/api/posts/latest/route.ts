import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

// Disable static caching for this route so it doesn't get locked at build time
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    // Only fetch the absolute latest post, projecting only needed data.
    const latestPost = await Post.findOne()
      .sort({ createdAt: -1 })
      .select("_id createdAt author content")
      .populate("author", "name email")
      .lean();

    return NextResponse.json(latestPost);
  } catch (error) {
    console.error("Latest post error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
