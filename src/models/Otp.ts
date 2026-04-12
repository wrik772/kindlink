import mongoose, { Schema } from "mongoose";

export interface OtpDocument extends mongoose.Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema = new Schema<OtpDocument>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-deletes from MongoDB after 5 minutes (300s)
  }
);

const Otp = mongoose.models.Otp || mongoose.model<OtpDocument>("Otp", OtpSchema);
export default Otp;
