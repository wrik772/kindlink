import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const notifications = await Notification.find({ recipient: user._id })
    .populate("sender", "name avatar")
    .sort({ createdAt: -1 })
    .limit(50);

  return NextResponse.json(notifications);
}

export async function PATCH() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await Notification.updateMany(
    { recipient: user._id, isRead: false },
    { $set: { isRead: true } }
  );

  return NextResponse.json({ message: "Notifications marked as read" });
}
