import mongoose, { Schema } from "mongoose";

export interface OrganizationDocument extends mongoose.Document {
  name: string;
  description: string;
  type: string; // e.g., "Animal Shelter", "Education NGO", "Disaster Relief"
  imageUrl?: string;
  location: string;
  geometry?: {
    type: string;
    coordinates: number[];
  };
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<OrganizationDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    imageUrl: { type: String },
    location: { type: String, required: true },
    geometry: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

OrganizationSchema.index({ geometry: "2dsphere" });

const Organization = mongoose.models.Organization || mongoose.model<OrganizationDocument>("Organization", OrganizationSchema);

export default Organization;
