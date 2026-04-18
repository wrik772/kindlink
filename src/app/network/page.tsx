import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import FriendActionButton from "@/components/Network/FriendActionButton";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  await connectToDatabase();
  const currentUser = await User.findOne({ email: session.user.email })
    .populate('friends', 'name avatar location')
    .populate('friendRequests.user', 'name avatar location')
    .lean() as any;

  if (!currentUser) redirect("/login");

  const friends = currentUser.friends || [];
  const incomingRequests = (currentUser.friendRequests || []).filter((req: any) => req.status === 'pending');

  const friendsIds = friends.map((f:any) => f._id.toString());
  const incomingReqIds = incomingRequests.map((r:any) => r.user._id.toString());

  let recommendations = [];
  if (currentUser.geometry && currentUser.geometry.coordinates && currentUser.geometry.coordinates.length === 2) {
    recommendations = await Organization.find({
      geometry: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: currentUser.geometry.coordinates },
          $maxDistance: 10000 // 10km in meters
        }
      },
      type: { $in: currentUser.interests }
    }).lean() as any[];
  } else {
    const userCity = currentUser.location?.split(',')[1]?.trim() || currentUser.location;
    // Find NGOs matching location AND interests
    recommendations = await Organization.find({
      location: { $regex: new RegExp(userCity, "i") },
      type: { $in: currentUser.interests }
    }).lean() as any[];
  }

  // Find ALL possible users with overlapping interests to recommend
  const rawPeople = await User.find({
    _id: { $ne: currentUser._id },
    interests: { $in: currentUser.interests }
  }).lean() as any[];

  // Filter out friends and those engaged in request loops
  const peopleToConnect = rawPeople.filter(person => {
      const pid = person._id.toString();
      // Exclude existing friends
      if (friendsIds.includes(pid)) return false;
      // Exclude people who already sent us a request
      if (incomingReqIds.includes(pid)) return false;
      // Exclude people WE already sent a request to (they have our ID in their friendRequests)
      const weSentRqst = person.friendRequests?.some((r: any) => r.user.toString() === currentUser._id.toString());
      if (weSentRqst) return false;

      return true;
  }).slice(0, 10);

  return (
    <div className="py-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-[#171717]">My Network</h1>
        <p className="text-gray-500 mt-2">Connect with like-minded people and organizations making a difference.</p>
      </div>

      {/* Incoming Friend Requests Section */}
      {incomingRequests.length > 0 && (
          <section className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
             <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                 Incoming Requests
             </h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {incomingRequests.map((req: any) => (
                    <div key={req.user._id.toString()} className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm text-center">
                        <Link href={`/user/${req.user._id.toString()}`} className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center font-bold text-orange-600 text-xl mb-3 overflow-hidden block hover:opacity-80 transition-opacity">
                            {req.user.avatar ? <img src={req.user.avatar} className="w-full h-full object-cover"/> : req.user.name.charAt(0)}
                        </Link>
                        <Link href={`/user/${req.user._id.toString()}`} className="font-bold text-[#171717] hover:underline block">{req.user.name}</Link>
                        <p className="text-xs text-gray-400 mt-1 mb-4">{req.user.location || "Global Citizen"}</p>
                        <div className="flex gap-2 w-full justify-center">
                            <FriendActionButton userId={req.user._id.toString()} actionType="accept" label="Accept" className="bg-[#ae8563] text-white px-4 py-1.5 rounded-md text-sm font-bold flex-1" />
                            <FriendActionButton userId={req.user._id.toString()} actionType="reject" label="Decline" className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-bold flex-1" />
                        </div>
                    </div>
                 ))}
             </div>
          </section>
      )}

      {/* People You Know (Friends) */}
      <section>
        <h2 className="text-xl font-bold text-[#6b4b34] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            People You Know
        </h2>
        {friends.length === 0 ? (
          <p className="text-gray-500 text-sm bg-white p-6 rounded-xl border border-dashed border-[#ae8563]/30">You haven't added any professional connections yet. Send some requests!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.map((person: any) => (
              <div key={person._id.toString()} className="bg-white border border-[#ae8563]/20 rounded-xl p-5 shadow-sm text-center hover:shadow-md transition-shadow relative group">
                 <Link href={`/user/${person._id.toString()}`} className="w-20 h-20 bg-[#fcf9f5] rounded-full mx-auto border-[3px] border-[#ae8563]/10 flex items-center justify-center font-bold text-[#ae8563] text-2xl mb-4 overflow-hidden block hover:opacity-80 transition-opacity">
                    {person.avatar ? <img src={person.avatar} alt={person.name} className="w-full h-full object-cover"/> : person.name.charAt(0)}
                 </Link>
                 <Link href={`/user/${person._id.toString()}`} className="font-bold text-[#171717] hover:underline block">{person.name}</Link>
                 <p className="text-xs text-gray-400 mt-1 truncate">{person.location || "Global Citizen"}</p>
                 <Link href={`/messages?userId=${person._id.toString()}`} className="mt-5 block w-full text-center py-2 bg-[#ae8563]/10 text-[#ae8563] rounded-full text-sm font-bold hover:bg-[#ae8563] hover:text-white transition-colors">
                   Message User
                 </Link>
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FriendActionButton userId={person._id.toString()} actionType="remove" label="×" className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-bold flex items-center justify-center text-xs" />
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended People to Connect With */}
      <section>
        <h2 className="text-xl font-bold text-[#6b4b34] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            Expand Your Network
        </h2>
        {peopleToConnect.length === 0 ? (
          <p className="text-gray-500 text-sm bg-white p-6 rounded-xl border border-dashed border-[#ae8563]/30">You are connected to everyone matching your interests!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {peopleToConnect.map((person: any) => (
              <div key={person._id.toString()} className="bg-white border border-[#ae8563]/20 rounded-xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
                 <Link href={`/user/${person._id.toString()}`} className="w-20 h-20 bg-[#fcf9f5] rounded-full mx-auto border-[3px] border-[#ae8563]/10 flex items-center justify-center font-bold text-[#ae8563] text-2xl mb-4 overflow-hidden block hover:opacity-80 transition-opacity">
                    {person.avatar ? <img src={person.avatar} alt={person.name} className="w-full h-full object-cover"/> : person.name.charAt(0)}
                 </Link>
                 <Link href={`/user/${person._id.toString()}`} className="font-bold text-[#171717] hover:underline block">{person.name}</Link>
                 <p className="text-xs text-gray-400 mt-1 truncate">{person.location || "Global Citizen"}</p>
                 <div className="mt-5 w-full">
                    <FriendActionButton userId={person._id.toString()} actionType="send" label="Send Request" className="w-full py-2 border-2 border-[#ae8563]/20 text-[#ae8563] rounded-full text-sm font-bold hover:bg-[#ae8563] hover:text-white hover:border-[#ae8563] transition-colors" />
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NGOs Section */}
      <section>
        <h2 className="text-xl font-bold text-[#6b4b34] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Organizations to Support
        </h2>
        {recommendations.length === 0 ? (
          <p className="text-gray-500 text-sm bg-white p-6 rounded-xl border border-dashed border-[#ae8563]/30">No organizations found matching your profile yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(org => (
              <div key={org._id.toString()} className="bg-white border border-[#ae8563]/20 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#fffaf4] rounded-xl border border-[#ae8563]/10 flex items-center justify-center text-2xl font-bold text-[#ae8563] mb-4 overflow-hidden">
                    {org.imageUrl ? <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover"/> : org.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-[#171717]">{org.name}</h3>
                <p className="text-xs bg-[#f2e9e1] text-[#6b4b34] px-2 py-1 rounded inline-block mt-1 mb-3 font-semibold">{org.type}</p>
                <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {org.location}
                </p>
                <p className="text-sm text-gray-700 line-clamp-2 mb-5 leading-relaxed">{org.description}</p>
                {org.website && (
                    <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-2.5 bg-[#ae8563]/10 text-[#ae8563] font-bold text-sm rounded-lg hover:bg-[#ae8563] hover:text-white transition-colors">
                      Follow Impact
                    </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
