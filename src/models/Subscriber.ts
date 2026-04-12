import mongoose, { Schema } from "mongoose";

export interface SubscriberDocument extends mongoose.Document {
  email: string;
  subscribedAt: Date;
}

const SubscriberSchema = new Schema<SubscriberDocument>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  subscribedAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.models.Subscriber || mongoose.model<SubscriberDocument>("Subscriber", SubscriberSchema);
export default Subscriber;
