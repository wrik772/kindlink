import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { auth } from "@/auth";

const postSchema = z.object({
  orgName: z.string().min(2).max(120),
  type: z.enum(["donation", "volunteer", "in-kind"]),
  message: z.string().min(5).max(500),
});

export async function GET() {
  await connectToDatabase();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = postSchema.parse(body);

    await connectToDatabase();

    const post = await Post.create(validated);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten() },
        { status: 400 }
      );
    }

    console.error("POST /api/posts error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


