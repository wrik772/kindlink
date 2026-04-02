import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, location, interests, avatar } = await req.json();

    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { 
         ...(name && { name }), 
         ...(location && { location }), 
         ...(interests && { interests }),
         ...(avatar !== undefined && { avatar })
      }},
      { new: true }
    );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
