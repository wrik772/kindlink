import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { geocodeLocation } from "@/lib/geocoder";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, location, interests, avatar } = await req.json();

    await connectToDatabase();
    
    const updateData: any = {
      ...(name && { name }), 
      ...(location && { location }), 
      ...(interests && { interests }),
      ...(avatar !== undefined && { avatar })
    };

    if (location) {
      const coords = await geocodeLocation(location);
      if (coords) {
        updateData.geometry = {
          type: 'Point',
          coordinates: coords
        };
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
