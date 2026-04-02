import mongoose, { Schema } from "mongoose";

export interface CommentDocument extends mongoose.Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model<CommentDocument>("Comment", CommentSchema);

export default Comment;
