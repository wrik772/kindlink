import mongoose from "mongoose";
import Organization from "./Organization";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

const organizations = [
  {
    name: "Paws for Cause Shelter",
    description: "A local shelter dedicated to rescuing and rehabilitating stray dogs and cats.",
    type: "Animals",
    location: "New Delhi",
    contactEmail: "hello@pawsforcause.org",
  },
  {
    name: "Future Bright Foundation",
    description: "Providing quality education and school supplies to underprivileged children.",
    type: "Education",
    location: "Mumbai",
    contactEmail: "contact@futurebright.org",
  },
  {
    name: "Green Earth Initiative",
    description: "Organizing tree plantation drives and environmental awareness campaigns.",
    type: "Environment",
    location: "Bangalore",
    contactEmail: "info@greenearth.org",
  },
  {
    name: "City Care Food Bank",
    description: "Distributing nutritious meals to the homeless and those in need.",
    type: "Hunger",
    location: "New Delhi",
    contactEmail: "help@citycare.org",
  },
  {
    name: "Relief India",
    description: "Providing rapid response and medical kits during natural disasters.",
    type: "Disaster Relief",
    location: "Mumbai",
    contactEmail: "emergency@reliefindia.org",
  },
];

async function seedOrganizations() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    await Organization.deleteMany({});
    console.log("Cleared existing organizations");

    await Organization.insertMany(organizations);
    console.log("Successfully seeded organizations");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding organizations:", error);
    process.exit(1);
  }
}

seedOrganizations();
