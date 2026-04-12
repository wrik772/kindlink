import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ count: 0 });
    await connectToDatabase();
    
    const currentUser = await User.findOne({ email: session.user.email }).lean() as any;
    if (!currentUser) return NextResponse.json({ count: 0 });
    
    // Find how many distinct people have sent unread messages
    const distinctSenders = await Message.distinct("sender", { 
        receiver: currentUser._id, 
        read: false 
    });
    
    return NextResponse.json({ count: distinctSenders.length });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}
