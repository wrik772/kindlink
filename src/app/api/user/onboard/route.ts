import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { geocodeLocation } from "@/lib/geocoder";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { location, interests } = await req.json();

    if (!location || !interests || interests.length === 0) {
      return NextResponse.json({ message: "Location and interests are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Geocode the location
    const coords = await geocodeLocation(location);
    const updateData: any = { location, interests };
    
    if (coords) {
      updateData.geometry = {
        type: 'Point',
        coordinates: coords
      };
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Preferences saved successfully", user: updatedUser }, { status: 200 });

  } catch (error) {
    console.error("Error in onboarding API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
