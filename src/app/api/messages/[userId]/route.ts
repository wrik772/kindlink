import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId: otherUserId } = await params;
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json(null, { status: 401 });

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });

    // Mark messages as read
    await Message.updateMany(
        { sender: otherUserId, receiver: currentUser._id, read: false },
        { $set: { read: true } }
    );

    const messages = await Message.find({
        $or: [
            { sender: currentUser._id, receiver: otherUserId },
            { sender: otherUserId, receiver: currentUser._id }
        ]
    }).sort({ createdAt: 1 }).populate('sender', 'name avatar email').lean();

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
