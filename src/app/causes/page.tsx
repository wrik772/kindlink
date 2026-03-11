import SectionHeader from "@/components/SectionHeader";
import CauseCard from "@/components/CauseCard";

export default function CausesPage() {
    return (
        <div className="py-16 md:py-24 max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
                <SectionHeader
                    title="Explore Causes"
                    subtitle="Find a cause close to your heart and make a difference today."
                    centered
                />
            </div>

            {/* Filters (Visual only for now) */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button className="px-6 py-2 rounded-full bg-[#ae8563] text-white font-medium">All</button>
                <button className="px-6 py-2 rounded-full bg-white border border-[#ae8563]/30 text-[#6b4b34] hover:bg-[#f7efe5] transition-colors">Education</button>
                <button className="px-6 py-2 rounded-full bg-white border border-[#ae8563]/30 text-[#6b4b34] hover:bg-[#f7efe5] transition-colors">Health</button>
                <button className="px-6 py-2 rounded-full bg-white border border-[#ae8563]/30 text-[#6b4b34] hover:bg-[#f7efe5] transition-colors">Animals</button>
                <button className="px-6 py-2 rounded-full bg-white border border-[#ae8563]/30 text-[#6b4b34] hover:bg-[#f7efe5] transition-colors">Disaster Relief</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Reusing existing cards + new ones */}
                <CauseCard
                    title="Help provide life-saving food for 500+ stray dogs"
                    organizer="Paws for Cause"
                    description="With winter approaching, we need to stock up on food and blankets for the stray animals in our shelter. Your contribution can keep them warm and fed."
                    raised="₹1,25,000"
                    goal="₹2,00,000"
                    progress={62}
                    daysLeft={5}
                    imageSrc="/images/dogs.jpg"
                />
                <CauseCard
                    title="Sponsor education for underprivileged children"
                    organizer="Future Bright Foundation"
                    description="Help us provide books, uniforms, and school supplies to 100 children in rural Maharashtra. Education is their only way out of poverty."
                    raised="₹4,50,000"
                    goal="₹5,00,000"
                    progress={90}
                    daysLeft={2}
                    imageSrc="/images/education.jpg"
                />
                <CauseCard
                    title="Emergency medical kits for flood victims"
                    organizer="Relief India"
                    description="Recent floods have devastated villages. We are distributing emergency medical kits and dry ration. We need your support to reach more families."
                    raised="₹85,000"
                    goal="₹3,00,000"
                    progress={28}
                    daysLeft={12}
                    imageSrc="/images/flood.jpg"
                />
                {/* Duplicates to fill grid */}
                <CauseCard
                    title="Winter Clothes for Homeless"
                    organizer="City Care"
                    description="Thousands sleep on the streets without warm clothes. Help us distribute blankets and sweaters this winter."
                    raised="₹55,000"
                    goal="₹1,00,000"
                    progress={55}
                    daysLeft={8}
                    imageSrc="/images/education.jpg" // Reuse generic image
                />
                <CauseCard
                    title="Clean Water for Rural Schools"
                    organizer="AquaLife"
                    description="Installing water purifiers in 10 village schools to ensure children have access to safe drinking water."
                    raised="₹2,10,000"
                    goal="₹2,50,000"
                    progress={84}
                    daysLeft={15}
                    imageSrc="/images/flood.jpg" // Reuse generic image
                />
                <CauseCard
                    title="Medical Camp for Seniors"
                    organizer="Elder Care"
                    description="Organizing free health checkups and medicine distribution for abandoned elderly in remote areas."
                    raised="₹40,000"
                    goal="₹80,000"
                    progress={50}
                    daysLeft={20}
                    imageSrc="/images/education.jpg" // Reuse generic image
                />
            </div>
        </div>
    );
}
