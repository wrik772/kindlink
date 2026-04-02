import mongoose, { Schema } from "mongoose";

export interface OrganizationDocument extends mongoose.Document {
  name: string;
  description: string;
  type: string; // e.g., "Animal Shelter", "Education NGO", "Disaster Relief"
  imageUrl?: string;
  location: string;
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
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

const Organization = mongoose.models.Organization || mongoose.model<OrganizationDocument>("Organization", OrganizationSchema);

export default Organization;
