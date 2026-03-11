import SectionHeader from "@/components/SectionHeader";

export default function TermsPage() {
    return (
        <div className="py-16 md:py-24 max-w-4xl mx-auto px-4">
            <SectionHeader title="Terms of Service" subtitle="Last updated: October 2023" />

            <div className="prose prose-brown max-w-none text-gray-700 leading-relaxed space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">1. Accepted Terms</h3>
                    <p>By accessing and using KindLink, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">2. Use License</h3>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on KindLink's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">3. Donations</h3>
                    <p>All donations made through KindLink are final. We do our best to vet every cause, but we do not guarantee that your donation will be used for a specific purpose. KindLink retains a small percentage of donations to cover operational costs.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">4. User Account</h3>
                    <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-[#171717] mb-3">5. Limitations</h3>
                    <p>In no event shall KindLink or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on KindLink's website.</p>
                </section>
            </div>
        </div>
    );
}
