export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fcf9f5] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-[#ae8563]/20">
        <h1 className="text-4xl font-bold text-[#171717] mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8">Last updated: April 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            At KindLink, we are fundamentally committed to transparency. Because our social network algorithm relies on geo-spatial and semantic data points to curate your connections, this page clearly outlines exactly how your data powers your experience. 
          </p>

          <h2 className="text-xl font-bold text-[#6b4b34] mt-6">1. Data We Collect and Why</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Geographical Location:</strong> We do not track live GPS. Instead, we securely store the text-based location you input during onboarding to accurately index your proximity to active NGOs and localized networking opportunities.</li>
            <li><strong>Interest Vectors:</strong> The causes you support (e.g., Hunger, Healthcare) are strictly utilized by our algorithmic engine to filter irrelevant content out of your feed and render applicable organizations in your Network tab.</li>
            <li><strong>User-Generated Content:</strong> Posts and multimedia you publish to the social feed are securely stored and publicly associated with your authenticated Identity Document to transparently display your community actions.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#6b4b34] mt-6">2. Direct Communication Privacy</h2>
          <p>
            Messages transmitted between you and other peers or NGOs via our direct messaging interface are securely stored within isolated conversation sockets. These logs are accessible only to the authenticated session profiles participating in the thread. We do not mine your direct communication for advertising purposes.
          </p>

          <h2 className="text-xl font-bold text-[#6b4b34] mt-6">3. Third-Party Sharing</h2>
          <p>
            We fundamentally oppose selling personal data profiles to third-party data brokers. Profile data and network graphs are exclusively utilized as internal infrastructure to calculate gamified impact badges and pair you with social endeavors aligning directly with your specified parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
