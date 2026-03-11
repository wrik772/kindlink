import Link from "next/link";
import CauseCard from "@/components/CauseCard";
import SectionHeader from "@/components/SectionHeader";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-[#fcf9f5] -mx-4 px-4 py-20 sm:py-32 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-repeat" /> {/* texture placeholder */}
        <div className="relative z-10 max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#ae8563]/30 text-[#ae8563] text-sm font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#ae8563] animate-pulse" />
            Over 10,000 lives impacted this month
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#171717]">
            Make a real difference in <span className="text-[#ae8563] text-glow">real time</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            KindLink connects you directly with NGOs and shelters. No middlemen, just pure impact. Your help reaches those who need it most, instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/home"
              className="btn-primary text-lg px-8 py-4 shadow-xl shadow-[#ae8563]/20 hover:shadow-2xl hover:shadow-[#ae8563]/30"
            >
              Start Donating
            </Link>
            <Link
              href="/about"
              className="btn-outline text-lg px-8 py-4"
            >
              How it Works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[var(--brand-muesli)] text-white py-16 -mx-4 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold">50+</div>
            <div className="text-[#e5c39c] font-medium">Partner NGOs</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold">12k</div>
            <div className="text-[#e5c39c] font-medium">Donations</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold">₹1.2Cr</div>
            <div className="text-[#e5c39c] font-medium">Funds Raised</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-bold">100%</div>
            <div className="text-[#e5c39c] font-medium">Transparency</div>
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <SectionHeader
          title="Urgent Causes"
          subtitle="These campaigns need your immediate attention. Every second counts."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>

        <div className="text-center mt-12">
          <Link href="/home" className="btn-outline">
            View All Campaigns
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-[#fffaf4] py-20 -mx-4">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            title="How KindLink Works"
            subtitle="Transparency and ease at every step of your giving journey."
            centered
          />

          <div className="grid md:grid-cols-3 gap-12 text-center relative">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-[#ae8563]/20 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#ae8563]">1</div>
              <h3 className="text-xl font-bold mb-3">Choose a Cause</h3>
              <p className="text-gray-600">Browse through verified campaigns from trusted NGOs and Shelters.</p>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-[#ae8563]/20 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#ae8563]">2</div>
              <h3 className="text-xl font-bold mb-3">Make a Donation</h3>
              <p className="text-gray-600">Donate securely. Even small contributions make a significant impact.</p>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-[#ae8563]/20 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#ae8563]">3</div>
              <h3 className="text-xl font-bold mb-3">Track Impact</h3>
              <p className="text-gray-600">Get updates on how your donation was used and the lives you changed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
