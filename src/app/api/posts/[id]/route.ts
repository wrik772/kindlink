import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const postId = (await params).id;
    const body = await req.json();

    await connectToDatabase();
    
    // Validate author
    const dbUser = await User.findOne({ email: session.user.email });
    const post = await Post.findById(postId);
    
    if (!post || !dbUser) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (post.author.toString() !== dbUser._id.toString()) {
        return NextResponse.json({ message: "Forbidden: You are not the author" }, { status: 403 });
    }

    if (body.content !== undefined) post.content = body.content;
    
    // Compute dropped photos and delete them natively from Cloudinary
    if (body.mediaUrls !== undefined && Array.isArray(body.mediaUrls)) {
        if (body.mediaUrls.length > 5) {
            return NextResponse.json({ message: "Maximum 5 photos allowed" }, { status: 400 });
        }
        
        // Find which urls were deleted in the edit
        const oldUrls = post.mediaUrls || [];
        const droppedUrls = oldUrls.filter((url: string) => !body.mediaUrls.includes(url));
        
        // Asynchronously destroy dropped photos in the background
        for (const url of droppedUrls) {
            deleteFromCloudinary(url);
        }

        post.mediaUrls = body.mediaUrls;
    }
    
    await post.save();
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const postId = (await params).id;

    await connectToDatabase();
    const dbUser = await User.findOne({ email: session.user.email });
    const post = await Post.findById(postId);
    
    if (!post || !dbUser) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (post.author.toString() !== dbUser._id.toString()) {
        return NextResponse.json({ message: "Forbidden: You are not the author" }, { status: 403 });
    }

    // Completely nuke all attached images from Cloudinary before wiping the Database entry
    if (post.mediaUrls && post.mediaUrls.length > 0) {
        for (const url of post.mediaUrls) {
           await deleteFromCloudinary(url);
        }
    } else if (post.mediaUrl) {
       await deleteFromCloudinary(post.mediaUrl);
    }

    await Post.findByIdAndDelete(postId);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
