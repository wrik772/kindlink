import SectionHeader from "@/components/SectionHeader";

export default function ContactPage() {
    return (
        <div className="py-16 md:py-24 max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16">

                {/* Contact Info */}
                <div>
                    <SectionHeader title="Get in Touch" subtitle="We'd love to hear from you. Here's how you can reach us." />

                    <div className="space-y-8 mt-12">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#ae8563] rounded-full flex items-center justify-center text-white flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.12 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#171717] mb-1">Phone</h3>
                                <p className="text-gray-600">+91 98765 43210</p>
                                <p className="text-gray-500 text-sm">Mon-Fri, 9am - 6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#ae8563] rounded-full flex items-center justify-center text-white flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#171717] mb-1">Email</h3>
                                <p className="text-gray-600">support@kindlink.org</p>
                                <p className="text-gray-500 text-sm">We reply within 24 hours</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#ae8563] rounded-full flex items-center justify-center text-white flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#171717] mb-1">Office</h3>
                                <p className="text-gray-600">123, Jayanagar, Bengaluru</p>
                                <p className="text-gray-600">Karnataka - 560078</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-2xl card-shadow border border-[#ae8563]/10">
                    <h3 className="text-2xl font-bold mb-6 text-[#171717]">Send us a message</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#ae8563] focus:ring-1 focus:ring-[#ae8563]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#ae8563] focus:ring-1 focus:ring-[#ae8563]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#ae8563] focus:ring-1 focus:ring-[#ae8563]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#ae8563] focus:ring-1 focus:ring-[#ae8563]">
                                <option>General Inquiry</option>
                                <option>Donation Issue</option>
                                <option>Partnership</option>
                                <option>Volunteering</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#ae8563] focus:ring-1 focus:ring-[#ae8563]"></textarea>
                        </div>
                        <button type="button" className="w-full btn-primary bg-[#ae8563] hover:bg-[#967050]">Send Message</button>
                    </form>
                </div>

            </div>
        </div>
    );
}
