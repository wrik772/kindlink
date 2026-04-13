import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Organization from "@/models/Organization";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ users: [], organizations: [], posts: [] });
    }

    await connectToDatabase();
    
    // Case-insensitive regex with a strict Word Boundary (\b). 
    // This strictly prevents short words like "cat" from accidentally matching inside "eduCATion".
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedQuery}`, "i");

    // Search Users (name or internal interests)
    const users = await User.find({ 
        $or: [
           { name: { $regex: regex } },
           { interests: { $regex: regex } }
        ]
    }, 'name avatar location')
       .limit(5)
       .lean();

    // Search Organizations (name, type, or causes supported)
    const organizations = await Organization.find({
       $or: [
           { name: { $regex: regex } }, 
           { type: { $regex: regex } },
           { supportedCauses: { $regex: regex } }
       ]
    }, 'name imageUrl type')
       .limit(5)
       .lean();

    // Search Posts (limit 5)
    const posts = await Post.find({ content: { $regex: regex } })
       .populate('author', 'name avatar')
       .sort({ createdAt: -1 })
       .limit(5)
       .lean();

    return NextResponse.json({ users, organizations, posts });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
