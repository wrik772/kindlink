import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

// POST: Send Friend Request TO [userId]
export async function POST(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const targetUserId = (await params).userId;
    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (currentUser._id.toString() === targetUserId) {
        return NextResponse.json({ message: "Cannot send request to yourself" }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return NextResponse.json({ message: "Target user not found" }, { status: 404 });

    // Check if already friends
    if (currentUser.friends.includes(targetUserId)) {
        return NextResponse.json({ message: "Already friends" }, { status: 400 });
    }

    // Check if request already sent
    const alreadySent = targetUser.friendRequests.some((req: any) => req.user.toString() === currentUser._id.toString());
    if (alreadySent) {
        return NextResponse.json({ message: "Request already sent" }, { status: 400 });
    }

    // Check if target user already sent US a request (auto-accept in that case)
    const pendingFromTarget = currentUser.friendRequests.findIndex((req: any) => req.user.toString() === targetUserId);
    if (pendingFromTarget > -1) {
        // Auto accept
        currentUser.friendRequests.splice(pendingFromTarget, 1);
        currentUser.friends.push(targetUserId);
        targetUser.friends.push(currentUser._id);
        await currentUser.save();
        await targetUser.save();
        return NextResponse.json({ message: "Friend request accepted" });
    }

    // Send request
    targetUser.friendRequests.push({ user: currentUser._id, status: 'pending' });
    await targetUser.save();

    return NextResponse.json({ message: "Friend request sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT: Accept Friend Request FROM [userId]
export async function PUT(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const senderUserId = (await params).userId;
    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    const senderUser = await User.findById(senderUserId);

    if (!currentUser || !senderUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Find the pending request
    const requestIndex = currentUser.friendRequests.findIndex((r: any) => r.user.toString() === senderUserId);
    if (requestIndex === -1) {
        return NextResponse.json({ message: "No pending request found" }, { status: 400 });
    }

    // Remove from requests, add to friends
    currentUser.friendRequests.splice(requestIndex, 1);
    
    if (!currentUser.friends.includes(senderUserId)) currentUser.friends.push(senderUserId);
    if (!senderUser.friends.includes(currentUser._id)) senderUser.friends.push(currentUser._id);

    await currentUser.save();
    await senderUser.save();

    return NextResponse.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Reject Request or Remove Friend [userId]
export async function DELETE(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const targetUserId = (await params).userId;
    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // 1. Check if it's a pending request to reject
    const requestIndex = currentUser.friendRequests.findIndex((r: any) => r.user.toString() === targetUserId);
    if (requestIndex > -1) {
        currentUser.friendRequests.splice(requestIndex, 1);
        await currentUser.save();
        return NextResponse.json({ message: "Friend request rejected" });
    }

    // 2. Check if cancelling a sent request
    const sentRequestIndex = targetUser.friendRequests.findIndex((r: any) => r.user.toString() === currentUser._id.toString());
    if (sentRequestIndex > -1) {
        targetUser.friendRequests.splice(sentRequestIndex, 1);
        await targetUser.save();
        return NextResponse.json({ message: "Friend request cancelled" });
    }

    // 3. Remove friend
    const friendIndex = currentUser.friends.findIndex((id: any) => id.toString() === targetUserId);
    if (friendIndex > -1) {
        currentUser.friends.splice(friendIndex, 1);
        const theirFriendIndex = targetUser.friends.findIndex((id: any) => id.toString() === currentUser._id.toString());
        if (theirFriendIndex > -1) targetUser.friends.splice(theirFriendIndex, 1);

        await currentUser.save();
        await targetUser.save();
        return NextResponse.json({ message: "Friend removed" });
    }

    return NextResponse.json({ message: "Nothing to remove" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
