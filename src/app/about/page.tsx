import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="py-16 md:py-24 max-w-6xl mx-auto px-4">
            {/* Hero */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-[#171717] mb-6">
                    Empowering Kindness, <br />
                    <span className="text-[#ae8563]">Connecting Communities</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    KindLink is more than just a platform; it's a movement to bridge the gap between those who want to help and those who need it most.
                </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="relative h-80 rounded-2xl overflow-hidden card-shadow">
                    <div className="absolute inset-0 bg-[#e5c39c]" /> {/* Placeholder color/image */}
                    <div className="absolute inset-0 flex items-center justify-center text-[#6b4b34] font-bold opacity-20 text-4xl">Image</div>
                </div>
                <div>
                    <SectionHeader title="Our Mission" subtitle="To create a transparent, efficient, and compassionate ecosystem where every donation finds its way to a genuine cause." />
                    <p className="text-gray-600 mb-6">
                        We started KindLink with a simple observation: many people want to help, but they don't know where or how. Conversely, many small NGOs and shelters struggle to reach donors.
                    </p>
                    <p className="text-gray-600">
                        By leveraging technology, we verify needs in real-time and provide donors with the confidence that their contribution is making a tangible difference.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div className="bg-[#fffaf4] -mx-4 px-4 py-16 rounded-3xl mb-24">
                <div className="max-w-4xl mx-auto text-center">
                    <SectionHeader title="Our Core Values" centered />
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="bg-white p-6 rounded-xl border border-[#ae8563]/20 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-[#ae8563] mb-3">Transparency</h3>
                            <p className="text-gray-600 text-sm">We believe in 100% visibility. Every rupee and every item donated is tracked and accounted for.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-[#ae8563]/20 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-[#ae8563] mb-3">Empathy</h3>
                            <p className="text-gray-600 text-sm">We approach every request with kindness and dignity, ensuring respect for all beneficiaries.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-[#ae8563]/20 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-[#ae8563] mb-3">Community</h3>
                            <p className="text-gray-600 text-sm">We are building a network of local heroes. Change happens when neighbors help neighbors.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
