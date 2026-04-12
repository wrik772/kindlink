export default function HelpCenterPage() {
  return (
    <div className="bg-[#fcf9f5] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-[#ae8563]/20">
        <h1 className="text-4xl font-bold text-[#171717] mb-4">Help Center</h1>
        <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8">Find answers to the most common questions about networking and using KindLink.</p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#6b4b34] mb-2">How do I find local NGOs to support?</h2>
            <p className="text-gray-700 leading-relaxed">
              When you complete your onboarding profile, you provide a geographical location and select your core causes (e.g., Education, Environment). Our platform's Recommendation Engine automatically maps your profile to registered NGOs matching those exact criteria, which will seamlessly appear on your Dashboard, Feed sidebar, and Network page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#6b4b34] mb-2">What is the purpose of the Social Feed?</h2>
            <p className="text-gray-700 leading-relaxed">
              The Feed acts as your continuous digital resume and networking board for societal impact. You and NGOs can post media updates about volunteer events, community drives, or recent achievements. You can interact via likes and comments to validate peer efforts and stay updated.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#6b4b34] mb-2">How do I earn Badges?</h2>
            <p className="text-gray-700 leading-relaxed">
              Gamification Badges serve as proof of your engagement with the community. As you publish posts and receive interactions (likes/comments) from other peers and recognized NGOs, the system automatically computes your impact score and awards milestone badges visible on your public network profile.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#6b4b34] mb-2">How does direct messaging work?</h2>
            <p className="text-gray-700 leading-relaxed">
              You can instantly establish communication with any peer in your Network tab or through feed interaction. Navigate to the Messages tab to view an active ledger of your professional communications and organize ongoing volunteer coordination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
