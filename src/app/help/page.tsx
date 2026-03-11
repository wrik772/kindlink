import SectionHeader from "@/components/SectionHeader";

export default function HelpPage() {
    const faqs = [
        {
            question: "How do I know my donation is safe?",
            answer: "We use industry-standard encryption for all transactions. Additionally, every NGO and shelter on our platform goes through a rigorous verification process."
        },
        {
            question: "Can I donate anonymously?",
            answer: "Yes, you can choose to make your donation anonymous during the checkout process. Your name will not be displayed publicly."
        },
        {
            question: "Is my donation tax-deductible?",
            answer: "Most donations on KindLink are eligible for tax exemption under Section 80G. You will receive a tax receipt immediately after your donation."
        },
        {
            question: "How can I volunteer?",
            answer: "Navigate to the 'Volunteer' section on any cause page or check our 'Get Involved' page to see open opportunities near you."
        },
        {
            question: "What percentage of my donation goes to the cause?",
            answer: "We take valid pride in our low overheads. 95% of your donation goes directly to the beneficiary. 5% is used for platform maintenance and payment processing fees."
        },
    ];

    return (
        <div className="py-16 md:py-24 max-w-4xl mx-auto px-4">
            <SectionHeader
                title="Help Center"
                subtitle="Frequently asked questions and support resources."
                centered
            />

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-xl border border-[#ae8563]/20 overflow-hidden">
                        <details className="group">
                            <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-[#171717] hover:bg-[#fffaf4] transition-colors">
                                <span>{faq.question}</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="text-gray-600 px-6 pb-6 pt-0 leading-relaxed">
                                {faq.answer}
                            </div>
                        </details>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center bg-[#fffaf4] p-8 rounded-xl">
                <h3 className="text-xl font-bold text-[#ae8563] mb-2">Still have questions?</h3>
                <p className="text-gray-600 mb-6">We’re here to help. Reach out to our support team.</p>
                <a href="/contact" className="btn-primary">Contact Support</a>
            </div>
        </div>
    );
}
