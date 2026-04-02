import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  // If logged in, redirect directly to the new social feed
  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="flex flex-col pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 py-20 lg:py-32 flex flex-col items-center">
        {/* Abstract background blobs for a modern feel, using brand colors */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[var(--brand-cashmere)]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-[var(--brand-muesli)]/10 blur-3xl" />
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fffaf4] border border-[#ae8563]/20 text-[#ae8563] text-sm font-semibold shadow-sm">
                    ✨ The Professional Network for Social Good
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#171717] leading-tight">
                    Share your impact. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c6746] to-[#d2ae88]">Inspire the world.</span>
                </h1>

                <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                    Join KindLink to showcase your societal achievements, connect with local NGOs, and build a meaningful professional network driven by purpose.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                    <Link
                    href="/register"
                    className="btn-primary text-lg px-8 py-4 shadow-xl shadow-[#ae8563]/20 hover:shadow-2xl hover:shadow-[#ae8563]/30 hover:-translate-y-1 transition-all"
                    >
                    Join the Network
                    </Link>
                    <Link
                    href="/login"
                    className="btn-outline text-lg px-8 py-4 hover:-translate-y-1 transition-all bg-white"
                    >
                    Sign In
                    </Link>
                </div>
                
                <div className="pt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-medium border-t border-gray-100 mt-8">
                   <div className="flex -space-x-3">
                       <div className="w-10 h-10 rounded-full bg-[#f7efe5] border-2 border-white flex items-center justify-center font-bold text-[#ae8563] text-xs">NL</div>
                       <div className="w-10 h-10 rounded-full bg-[#e5c39c] border-2 border-white flex items-center justify-center font-bold text-white text-xs">RK</div>
                       <div className="w-10 h-10 rounded-full bg-[#ae8563] border-2 border-white flex items-center justify-center font-bold text-white text-xs">SJ</div>
                   </div>
                   <p>Join 10,000+ changemakers today.</p>
                </div>
            </div>

            <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
                 {/* Mockup UI representation */}
                 <div className="relative rounded-2xl bg-white shadow-2xl shadow-[#ae8563]/10 border border-gray-100 overflow-hidden transform lg:rotate-2">
                     <div className="h-12 bg-[#fffaf4] border-b border-gray-100 flex items-center px-4 gap-2">
                         <div className="flex gap-1.5">
                             <div className="w-3 h-3 rounded-full bg-red-400"></div>
                             <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                             <div className="w-3 h-3 rounded-full bg-green-400"></div>
                         </div>
                     </div>
                     <div className="p-6 space-y-6">
                         <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 rounded-full bg-[#e5c39c] flex items-center justify-center text-white font-bold">W</div>
                             <div>
                                 <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                                 <div className="h-3 w-24 bg-gray-100 rounded"></div>
                             </div>
                         </div>
                         <div className="space-y-2">
                            <div className="h-3 w-full bg-gray-100 rounded"></div>
                            <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
                            <div className="h-3 w-4/6 bg-gray-100 rounded"></div>
                         </div>
                         <div className="w-full aspect-video bg-[#f7efe5] rounded-xl flex items-center justify-center text-[#ae8563]/50 border border-[#ae8563]/10">
                              Planted 50 Trees Today! 🌳
                         </div>
                         <div className="flex gap-4 pt-2 border-t border-gray-50">
                             <div className="h-8 w-16 bg-gray-100 rounded-full"></div>
                             <div className="h-8 w-20 bg-gray-100 rounded-full"></div>
                         </div>
                     </div>
                 </div>
                 
                 {/* Floating Recommendation Panel element */}
                 <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-64 hidden sm:block transform -rotate-3 z-20">
                     <p className="text-xs font-bold text-gray-500 mb-3">Suggested Organization</p>
                     <div className="flex gap-3 items-center">
                         <div className="w-10 h-10 rounded-lg bg-[var(--brand-muesli)] flex items-center justify-center text-white font-bold">GE</div>
                         <div>
                             <p className="font-bold text-sm text-[#171717]">Green Earth</p>
                             <p className="text-xs text-gray-400">Environment • 2km away</p>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#fffaf4] py-24 px-4 w-full">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-[#171717]">More than just a profile</h2>
              <p className="text-lg text-gray-600">KindLink provides the tools to build your social impact resume and discover causes in your local community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#ae8563]/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#f7efe5] rounded-xl flex items-center justify-center mb-6 border border-[#ae8563]/20">
                  <svg className="w-6 h-6 text-[#ae8563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#171717]">Showcase Achievements</h3>
              <p className="text-gray-600 leading-relaxed">Post pictures and videos of your volunteer work. Build a verified history of your societal contributions.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#ae8563]/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#f7efe5] rounded-xl flex items-center justify-center mb-6 border border-[#ae8563]/20">
                  <svg className="w-6 h-6 text-[#ae8563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#171717]">Connect with Peers</h3>
              <p className="text-gray-600 leading-relaxed">Follow other changemakers, engage with their posts, and collaborate on initiatives that matter to you.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#ae8563]/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#f7efe5] rounded-xl flex items-center justify-center mb-6 border border-[#ae8563]/20">
                  <svg className="w-6 h-6 text-[#ae8563]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#171717]">Discover Local NGOs</h3>
              <p className="text-gray-600 leading-relaxed">Our recommendation engine matches you with local shelters and organizations based on your causes and location.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 text-center mt-10">
         <h2 className="text-3xl md:text-4xl font-bold text-[#171717] mb-6">Ready to make a difference?</h2>
         <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">Your impact matters. Start building your societal network today and see how easy it is to inspire change.</p>
         <Link
            href="/register"
            className="btn-primary text-xl px-12 py-5 shadow-xl shadow-[#ae8563]/20 hover:shadow-2xl hover:-translate-y-1 transition-all inline-block"
          >
            Create Your Profile
          </Link>
      </section>
    </div>
  );
}
