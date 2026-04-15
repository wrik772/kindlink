import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, mediaUrl, mediaUrls } = body;

    if (!content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }
    
    if (mediaUrls && Array.isArray(mediaUrls) && mediaUrls.length > 5) {
       return NextResponse.json({ message: "Maximum 5 photos allowed" }, { status: 400 });
    }

    await connectToDatabase();
    
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newPost = await Post.create({
      author: dbUser._id,
      content,
      mediaUrl: mediaUrl || "",
      mediaUrls: mediaUrls || [],
      likes: [],
    });

    return NextResponse.json({ message: "Post created", post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get('city');

        await connectToDatabase();
        
        // If we have a city filter, we use an aggregation pipeline to filter by populated author's location
        if (city) {
            const posts = await Post.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                { $unwind: '$author' },
                {
                    $match: {
                        'author.location': { $regex: new RegExp(city, 'i') }
                    }
                },
                {
                    $project: {
                        'author.password': 0,
                        'author.email': 0,
                        'author.friendRequests': 0,
                        'author.friends': 0
                    }
                },
                { $sort: { createdAt: -1 } }
            ]);
            return NextResponse.json(posts);
        }

        // Default: fetch all posts
        const posts = await Post.find()
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .lean();
            
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
