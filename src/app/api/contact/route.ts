import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, inquiryType, message } = await req.json();

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Configure the transporter
    // For Gmail, you will need an App Password in your .env.local file
    // Example: EMAIL_USER=your_email@gmail.com
    //          EMAIL_PASS=your_16_char_app_password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'kindlink2026@gmail.com',
        pass: process.env.EMAIL_PASS, // Needs to be configured in .env.local
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER || 'kindlink2026@gmail.com'}>`, // Needs to be authenticated sender format
      replyTo: email,
      to: 'kindlink2026@gmail.com', // destination email
      subject: `New KindLink Enquiry: ${inquiryType}`,
      text: `Name: ${name}\nEmail: ${email}\nInquiry Type: ${inquiryType}\n\nMessage:\n${message}`,
      html: `
        <h3>New Enquiry from KindLink Contact Page</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    };

    // Before attempting to send, we check if the pass exists
    if (!process.env.EMAIL_PASS) {
      console.warn("EMAIL_PASS not configured in environment variables. Email will not be sent physically.");
      console.log("Mock Email payload:", mailOptions.text);
      return NextResponse.json({ message: "Message accepted (Mock mode)" }, { status: 200 });
    }

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json({ message: "Failed to send message." }, { status: 500 });
  }
}
