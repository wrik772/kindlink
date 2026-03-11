import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";

export default function PartnersPage() {
    const partners = [
        { name: "Global Relief", type: "Disaster Response" },
        { name: "EduCare", type: "Education" },
        { name: "Green World", type: "Environment" },
        { name: "Pawsitive", type: "Animal Welfare" },
        { name: "MediCross", type: "Healthcare" },
        { name: "FoodForAll", type: "Hunger Relief" },
        { name: "SeniorHope", type: "Elderly Care" },
        { name: "WomenRise", type: "Women Empowerment" },
    ];

    return (
        <div className="py-16 md:py-24 max-w-6xl mx-auto px-4">
            <SectionHeader
                title="Our Partners"
                subtitle="We collaborate with verified and trusted organizations to ensure your donation makes the biggest impact."
                centered
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {partners.map((partner, index) => (
                    <div key={index} className="bg-white p-8 rounded-xl border border-[#ae8563]/20 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow aspect-square">
                        <div className="w-16 h-16 bg-[#fffaf4] rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-[#ae8563]">
                            {partner.name[0]}
                        </div>
                        <h3 className="font-bold text-[#171717]">{partner.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{partner.type}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#ae8563] text-white rounded-2xl p-12 mt-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
                <p className="max-w-2xl mx-auto mb-8 opacity-90">
                    Are you an NGO or a Shelter doing impactful work? Join our network and reach thousands of donors who want to support your cause.
                </p>
                <button className="bg-white text-[#ae8563] px-8 py-3 rounded-full font-bold hover:bg-[#f7efe5] transition-colors">
                    Apply for Partnership
                </button>
            </div>
        </div>
    );
}
