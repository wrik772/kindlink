export default function ContactPage() {
  return (
    <div className="bg-[#fcf9f5] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-[#ae8563]/20">
        <h1 className="text-4xl font-bold text-[#171717] mb-4">Contact Our Team</h1>
        <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8">Whether you are an NGO looking to verify your digital profile or a user experiencing algorithmic constraints, our administrative team is available to assist.</p>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#6b4b34] mb-2">Display Name</label>
              <input type="text" className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563]" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#6b4b34] mb-2">Account Email</label>
              <input type="email" className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563]" placeholder="john@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#6b4b34] mb-2">Inquiry Type</label>
            <select className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563]">
              <option>Account & Profile Support</option>
              <option>NGO Authorization Badge Request</option>
              <option>Feed Algorithm or Recommendations Issue</option>
              <option>Abuse Reporting (Content / Messages)</option>
              <option>General Feedback</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#6b4b34] mb-2">Detailed Message</label>
            <textarea rows={5} className="w-full bg-[#fcf9f5] border border-[#ae8563]/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ae8563]" placeholder="Describe the issue you are facing adjusting your interests, location pairing, or reporting inappropriate peer networking behavior..."></textarea>
          </div>

          <button type="button" className="w-full py-3 bg-[#ae8563] text-white font-bold rounded-lg hover:bg-[#8c6746] transition-colors">
            Dispatch Message securely
          </button>
        </form>
      </div>
    </div>
  );
}
