import mongoose, { Schema } from "mongoose";

export type PostType = "donation" | "volunteer" | "in-kind";

export interface PostDocument extends mongoose.Document {
  orgName: string;
  type: PostType;
  message: string;
  createdAt: Date;
}

const PostSchema = new Schema<PostDocument>(
  {
    orgName: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["donation", "volunteer", "in-kind"],
      required: true,
    },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Post =
  (mongoose.models.Post as mongoose.Model<PostDocument>) ||
  mongoose.model<PostDocument>("Post", PostSchema);

export default Post;


