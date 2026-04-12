import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    await connectToDatabase();
    
    // Check if they are already actively subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "You are already subscribed!" }, { status: 409 });
    }

    // Save strictly to DB
    await Subscriber.create({ email });

    return NextResponse.json({ message: "Successfully added to the mailing list!" }, { status: 201 });

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
