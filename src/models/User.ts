import mongoose, { Schema } from "mongoose";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);

export default User;


