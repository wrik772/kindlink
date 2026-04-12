import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import Otp from "@/models/Otp";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    await connectToDatabase();
    
    // Check if user already exists
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ message: "Account already exists under this email." }, { status: 409 });
    }

    // Generate a secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any old unused OTPs tied to this email to prevent spam/confusion
    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: otpCode 
    });

    // Fire actual email via NodeMailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"KindLink Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your KindLink Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
           <h2 style="color: #ae8563; text-align: center;">Welcome to KindLink!</h2>
           <p style="color: #374151; font-size: 16px;">We are thrilled to have you join the movement. Please use the verification code below to securely verify your email and complete your sign-up process:</p>
           <div style="background-color: #fcf9f5; border: 2px dashed #ae8563; padding: 15px; text-align: center; border-radius: 8px; margin: 25px 0;">
             <h1 style="color: #6b4b34; margin: 0; font-size: 36px; letter-spacing: 8px;">${otpCode}</h1>
           </div>
           <p style="color: #6b7280; font-size: 14px;">This code will self-destruct in exactly 5 minutes for security purposes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("OTP SMTP Error:", error);
    return NextResponse.json({ message: "Failed to send OTP email. Ensure EMAIL_USER is valid." }, { status: 500 });
  }
}
