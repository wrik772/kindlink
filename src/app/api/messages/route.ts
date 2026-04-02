import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json(null, { status: 401 });

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email }).lean();
    
    // Find all distinct users the current user has messaged with
    const messages = await Message.find({
        $or: [{ sender: currentUser._id }, { receiver: currentUser._id }]
    }).sort({ createdAt: -1 }).populate('sender receiver', 'name avatar email').lean() as any[];

    // Group by conversation partner
    const conversationsMap = new Map();
    for(const msg of messages) {
       const partner = msg.sender._id.toString() === currentUser._id.toString() ? msg.receiver : msg.sender;
       const partnerId = partner._id.toString();
       if(!conversationsMap.has(partnerId)) {
           conversationsMap.set(partnerId, {
               partner,
               lastMessage: msg,
               unreadCount: msg.receiver._id.toString() === currentUser._id.toString() && !msg.read ? 1 : 0
           });
       } else {
           if(msg.receiver._id.toString() === currentUser._id.toString() && !msg.read) {
               conversationsMap.get(partnerId).unreadCount += 1;
           }
       }
    }

    return NextResponse.json(Array.from(conversationsMap.values()), { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json(null, { status: 401 });

    const { receiverId, content } = await req.json();

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });
    
    const message = await Message.create({
        sender: currentUser._id,
        receiver: receiverId,
        content
    });

    const populatedMessage = await message.populate('sender receiver', 'name avatar');
    return NextResponse.json(populatedMessage, { status: 201 });
  } catch(err) {
      return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
