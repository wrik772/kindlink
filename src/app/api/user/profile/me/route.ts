import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json(null, { status: 401 });

    await connectToDatabase();
    const dbUser = await User.findOne({ email: session.user.email }).lean();
    return NextResponse.json(dbUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
