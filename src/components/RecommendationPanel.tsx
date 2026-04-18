import { connectToDatabase } from "@/lib/mongodb";
import Organization from "@/models/Organization";

interface RecommendationPanelProps {
  userLocation: string;
  userInterests: string[];
  userGeometry?: { type: string, coordinates: number[] };
}

export default async function RecommendationPanel({ userLocation, userInterests, userGeometry }: RecommendationPanelProps) {
  await connectToDatabase();

  let orgs = [];

  if (userGeometry && userGeometry.coordinates && userGeometry.coordinates.length === 2) {
    // 10km radius geospatial search
    orgs = await Organization.find({
      geometry: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: userGeometry.coordinates },
          $maxDistance: 10000 // 10km in meters
        }
      },
      type: { $in: userInterests }
    }).limit(5).lean() as any[];
  } else {
    // Fallback if user hasn't been migrated yet
    const userCity = userLocation?.split(',')[1]?.trim() || userLocation;
    orgs = await Organization.find({
      location: { $regex: new RegExp(userCity, "i") },
      type: { $in: userInterests }
    }).limit(5).lean() as any[];
  }

  if (!orgs || orgs.length === 0) {
    return (
      <div className="bg-white border border-[#ae8563]/20 rounded-xl p-4 shadow-sm text-center">
        <p className="text-sm text-gray-500">No organizations found near you yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#ae8563]/20 rounded-xl p-4 shadow-sm">
      <h3 className="font-bold text-sm mb-4 pl-1 text-[#171717]">Organizations for you</h3>
      <div className="space-y-4">
        {orgs.map((org) => (
          <div key={org._id.toString()} className="flex gap-4 items-start group bg-[#fcf9f5]/50 p-3 rounded-xl border border-transparent hover:border-[#ae8563]/20 transition-all">
            <div className="w-10 h-10 bg-white rounded-md border border-[#ae8563]/10 flex items-center justify-center text-lg font-bold text-[#ae8563] flex-shrink-0 shadow-sm mt-1 overflow-hidden">
                {org.imageUrl ? <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover"/> : org.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#171717] truncate" title={org.name}>{org.name}</p>
              <p className="text-[11px] font-semibold text-[#ae8563] truncate mt-0.5">{org.type} • {org.location.split(',')[0]}</p>
              <p className="text-[11.5px] text-gray-600 line-clamp-2 mt-1.5 leading-snug">{org.description}</p>
            </div>
            {org.website ? (
               <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 hover:bg-[#ae8563]/10 text-gray-400 hover:text-[#ae8563] flex items-center justify-center transition-colors" title="Visit Website">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </a>
            ) : (
               <div className="flex-shrink-0 w-8 h-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
