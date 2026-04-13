import mongoose, { Schema } from "mongoose";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  location?: string;
  phoneNumber?: string;
  interests: string[];
  friends: mongoose.Types.ObjectId[];
  friendRequests: { user: mongoose.Types.ObjectId; status: string }[];
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    location: { type: String },
    phoneNumber: { type: String, trim: true },
    interests: [{ type: String }],
    avatar: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending'], default: 'pending' },
      }
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;


