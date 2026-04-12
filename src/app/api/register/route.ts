import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  otp: z.string().length(6, "Code must be 6 digits"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    await connectToDatabase();
    const existing = await User.findOne({ email: data.email }).lean();
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const otpRecord = await Otp.findOne({ email: data.email });
    if (!otpRecord) {
        return NextResponse.json({ message: "Your OTP session expired. Please request a new code." }, { status: 400 });
    }
    if (otpRecord.otp !== data.otp) {
        return NextResponse.json({ message: "Incorrect OTP code." }, { status: 401 });
    }

    const hashed = await bcrypt.hash(data.password, 10);
    await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
    });

    // Cleanup successful OTP sequence
    await Otp.deleteMany({ email: data.email });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten() },
        { status: 400 }
      );
    }

    console.error("POST /api/register error", error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.stack : String(error) },
      { status: 500 }
    );
  }
}


