import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).select('notificationSoundEnabled');
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      notificationSoundEnabled: user.notificationSoundEnabled ?? true 
    }, { status: 200 });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { notificationSoundEnabled } = await req.json();

    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { notificationSoundEnabled } },
      { new: true }
    ).select('notificationSoundEnabled');

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      notificationSoundEnabled: updatedUser.notificationSoundEnabled 
    }, { status: 200 });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
