import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";

const resetSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().length(6, "Code must be 6 digits"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = resetSchema.parse(body);

    await connectToDatabase();

    // Verify user exists first
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify OTP record exists
    const otpRecord = await Otp.findOne({ email: data.email });
    if (!otpRecord) {
      return NextResponse.json({ message: "OTP expired or not requested. Please request a new code." }, { status: 400 });
    }

    // Check OTP match
    if (otpRecord.otp !== data.otp) {
      return NextResponse.json({ message: "Incorrect verification code." }, { status: 401 });
    }

    // Hash the new password
    const hashed = await bcrypt.hash(data.password, 10);
    
    // Update the user
    user.password = hashed;
    await user.save();

    // Cleanup OTP record
    await Otp.deleteMany({ email: data.email });

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten() },
        { status: 400 }
      );
    }

    console.error("Forgot Password RESET Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
