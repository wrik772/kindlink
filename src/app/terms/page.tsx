export default function TermsPage() {
  return (
    <div className="bg-[#fcf9f5] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-[#ae8563]/20">
        <h1 className="text-4xl font-bold text-[#171717] mb-4">Terms of Service</h1>
        <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8">Governing your use of the KindLink Social Network Ecosystem.</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            By creating a profile on KindLink, you establish yourself as a verified node within our digital community. You must agree to uphold the functional and social standards outlaid within these Terms to maintain active status on the platform.
          </p>

          <h2 className="text-xl font-bold text-[#6b4b34] mt-6">1. Peer Code of Conduct</h2>
          <p>
            The platform feed and messaging infrastructure are provided strictly to broadcast, coordinate, and validate social achievement and volunteer networking. Users must ensure that interactions, including comments on peer posts or direct message dispatches, maintain a professional and empathetic standard. Engaging in harassment, inflammatory debates, or malicious distribution of spam will prompt immediate account moderation and access revocation.
          </p>

          <h2 className="text-xl font-bold text-[#6b4b34] mt-6">2. Content Accuracy and Gamification Integrity</h2>
          <p>
            Providing false geographic locations, impersonating authenticated Non-Governmental Organizations (NGOs), or structurally manipulating peer interactions to artificially inflate your accrued Impact Score (gamification badges) violates the structural integrity of the network. Accounts engaging in orchestrated interactions to manipulate metrics will face badge penalizations or platform bans.
          </p>

          <h2 className="text-xl font-bold text-[#6b4b34] mt-6">3. Interactions with Listed Organizations</h2>
          <p>
            KindLink provides the infrastructure to recommend and index public NGOs based on algorithmic overlapping vectors. However, the operational fulfillment of localized volunteer efforts arranged via our digital communication channels exists as a private execution between you and the respective NGO. KindLink acts solely as an independent indexing and communication layer, bearing no liability for the operational, technical, or legal execution of coordinated real-world initiatives, and claims no official partnership or affiliation with these indexed organizations.
          </p>
        </div>
      </div>
    </div>
  );
}
