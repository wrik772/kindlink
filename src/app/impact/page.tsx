import SectionHeader from "@/components/SectionHeader";
import CauseCard from "@/components/CauseCard"; // Reusing for story preview format if suitable, or create simple cards

export default function ImpactPage() {
    return (
        <div className="py-16 md:py-24 max-w-6xl mx-auto px-4">
            <SectionHeader
                title="Impact Stories"
                subtitle="Real stories of hope, resilience, and the power of your generosity."
                centered
            />

            {/* Featured Story */}
            <div className="relative rounded-2xl overflow-hidden bg-[#6b4b34] text-white mb-20 shadow-2xl">
                <div className="absolute inset-0 opacity-40 bg-[url('/images/education.jpg')] bg-cover bg-center" />
                <div className="relative z-10 p-8 md:p-16 max-w-3xl">
                    <span className="bg-[#ae8563] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Featured Story</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">From Street to School: Aryan's Journey</h2>
                    <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
                        Aryan was found working at a tea stall at age 8. Thanks to the "Future Bright Foundation" campaign on KindLink, he is now top of his class and dreaming of becoming a scientist.
                    </p>
                    <button className="bg-white text-[#6b4b34] px-6 py-3 rounded-full font-bold hover:bg-[#f7efe5] transition-colors">
                        Read Full Story
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 border-y border-[#e5e7eb] py-12">
                <div className="text-center">
                    <div className="text-4xl font-bold text-[#ae8563] mb-2">15k+</div>
                    <p className="text-gray-600 text-sm">Donors Joined</p>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-[#ae8563] mb-2">250+</div>
                    <p className="text-gray-600 text-sm">Projects Funded</p>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-[#ae8563] mb-2">35k</div>
                    <p className="text-gray-600 text-sm">Lives Touched</p>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-[#ae8563] mb-2">120</div>
                    <p className="text-gray-600 text-sm">Cities Covered</p>
                </div>
            </div>

            {/* More Stories Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl overflow-hidden border border-[#ae8563]/20 shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-56 bg-[#e5c39c] relative">
                        {/* Placeholder for flood image */}
                        <div className="absolute inset-0 opacity-10 bg-black"></div>
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-[#171717] mb-3">Rebuilding After the Flood</h3>
                        <p className="text-gray-600 mb-6 line-clamp-3">
                            When the waters rose in Assam, entire villages were submerged. See how 500 KindLink donors came together to provide emergency rafts and food packets within 24 hours.
                        </p>
                        <a href="#" className="text-[#ae8563] font-semibold hover:underline">Read more →</a>
                    </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden border border-[#ae8563]/20 shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-56 bg-[#d2ae88] relative">
                        {/* Placeholder for dog image */}
                        <div className="absolute inset-0 opacity-10 bg-black"></div>
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-[#171717] mb-3">A Second Chance for Bella</h3>
                        <p className="text-gray-600 mb-6 line-clamp-3">
                            Bella, a senior golden retriever, was abandoned due to arthritis. With funds raised for her surgery and therapy, she is now running pain-free in her forever home.
                        </p>
                        <a href="#" className="text-[#ae8563] font-semibold hover:underline">Read more →</a>
                    </div>
                </div>
            </div>

        </div>
    );
}
