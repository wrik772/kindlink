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
    
    // For password reset, we verify that the account DOES exist
    const existing = await User.findOne({ email }).lean();
    if (!existing) {
      return NextResponse.json({ message: "No account found with this email." }, { status: 404 });
    }

    // Generate a fresh random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any old/stale OTPs for this email address to ensure the fresh one is used
    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: otpCode 
    });

    // Configure SMTP
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
      subject: "Password Reset Code: KindLink",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ae856320; border-radius: 16px; background-color: #ffffff;">
           <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #6b4b34; margin: 0; font-size: 24px;">Reset Your Password</h2>
           </div>
           <p style="color: #374151; font-size: 16px; line-height: 1.6;">You requested to reset your password for your KindLink account. Use the verification code below to proceed:</p>
           <div style="background-color: #fcf9f5; border: 1px solid #ae856340; padding: 24px; text-align: center; border-radius: 12px; margin: 24px 0;">
             <h1 style="color: #ae8563; margin: 0; font-size: 42px; letter-spacing: 10px; font-family: monospace;">${otpCode}</h1>
           </div>
           <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">This security code will expire in **5 minutes**. If you did not request this, please ensure your account is secure and ignore this message.</p>
           <div style="margin-top: 32px; border-top: 1px solid #f3f4f6; pt-20; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px;">KindLink - The Professional Network for Social Good</p>
           </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Forgot Password OTP Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
