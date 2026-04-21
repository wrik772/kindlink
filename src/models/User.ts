import mongoose, { Schema } from "mongoose";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  location?: string;
  geometry?: {
    type: string;
    coordinates: number[];
  };
  phoneNumber?: string;
  interests: string[];
  isAdmin: boolean;
  friends: mongoose.Types.ObjectId[];
  friendRequests: { user: mongoose.Types.ObjectId; status: string }[];
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    location: { type: String },
    geometry: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
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

UserSchema.index({ geometry: "2dsphere" });

const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;


