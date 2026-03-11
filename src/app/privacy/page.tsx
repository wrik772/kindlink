import SectionHeader from "@/components/SectionHeader";

export default function PrivacyPage() {
    return (
        <div className="py-16 md:py-24 max-w-4xl mx-auto px-4">
            <SectionHeader title="Privacy Policy" subtitle="Your privacy is important to us." />

            <div className="prose prose-brown max-w-none text-gray-700 leading-relaxed space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">1. Information We Collect</h3>
                    <p>We collect information that you provide directly to us, such as when you create an account, make a donation, or contact us for support. This may include your name, email address, payment information, and phone number.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">2. How We Use Your Information</h3>
                    <p>We use the information we collect to operate, maintain, and improve our services, to process your donations, and to communicate with you about your account and our activities.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">3. Information Sharing</h3>
                    <p>We do not share your personal information with third parties except as necessary to process your donations (e.g., payment processors) or as required by law. We may share aggregated, non-personally identifiable information with our partners.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">4. Security</h3>
                    <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">5. Cookies</h3>
                    <p>We use cookies to improve your experience on our site. You can set your browser to refuse all or some browser cookies, but this may cause some parts of the site to not function properly.</p>
                </section>
            </div>
        </div>
    );
}
