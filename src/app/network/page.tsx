import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NetworkPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  await connectToDatabase();
  const currentUser = await User.findOne({ email: session.user.email }).lean() as any;
  if (!currentUser) redirect("/login");

  // Find NGOs matching location AND interests
  const recommendations = await Organization.find({
    location: { $regex: new RegExp(currentUser.location, "i") },
    type: { $in: currentUser.interests }
  }).lean() as any[];

  // Find other users with overlapping interests
  const people = await User.find({
    _id: { $ne: currentUser._id },
    interests: { $in: currentUser.interests }
  }).limit(10).lean() as any[];

  return (
    <div className="py-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-[#171717]">My Network</h1>
        <p className="text-gray-500 mt-2">Connect with like-minded people and organizations making a difference.</p>
      </div>
      
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
                <div className="w-14 h-14 bg-[#fffaf4] rounded-xl border border-[#ae8563]/10 flex items-center justify-center text-2xl font-bold text-[#ae8563] mb-4">
                    {org.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-[#171717]">{org.name}</h3>
                <p className="text-xs bg-[#f2e9e1] text-[#6b4b34] px-2 py-1 rounded inline-block mt-1 mb-3 font-semibold">{org.type}</p>
                <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {org.location}
                </p>
                <p className="text-sm text-gray-700 line-clamp-2 mb-5 leading-relaxed">{org.description}</p>
                <button className="w-full py-2.5 bg-[#ae8563]/10 text-[#ae8563] font-bold text-sm rounded-lg hover:bg-[#ae8563] hover:text-white transition-colors">
                  Follow Impact
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#6b4b34] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            People you may know
        </h2>
        {people.length === 0 ? (
          <p className="text-gray-500 text-sm bg-white p-6 rounded-xl border border-dashed border-[#ae8563]/30">Expand your interests to discover more people.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {people.map(person => (
              <div key={person._id.toString()} className="bg-white border border-[#ae8563]/20 rounded-xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
                 <div className="w-20 h-20 bg-[#fcf9f5] rounded-full mx-auto border-[3px] border-[#ae8563]/10 flex items-center justify-center font-bold text-[#ae8563] text-2xl mb-4">
                    {person.name.charAt(0)}
                 </div>
                 <h3 className="font-bold text-[#171717]">{person.name}</h3>
                 <p className="text-xs text-gray-400 mt-1 truncate">{person.location || "Global Citizen"}</p>
                 <Link href={`/messages?userId=${person._id.toString()}`} className="mt-5 block w-full text-center py-2 border-2 border-[#ae8563]/20 text-[#ae8563] rounded-full text-sm font-bold hover:bg-[#ae8563] hover:text-white hover:border-[#ae8563] transition-colors">
                   Message
                 </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
