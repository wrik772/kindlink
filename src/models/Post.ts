import mongoose, { Schema } from "mongoose";

export interface PostDocument extends mongoose.Document {
  author: mongoose.Types.ObjectId;
  content: string;
  mediaUrl?: string; // Legacy: URL to image/video
  mediaUrls?: string[]; // Array of image URLs
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<PostDocument>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    mediaUrl: { type: String },
    mediaUrls: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model<PostDocument>("Post", PostSchema);

export default Post;


