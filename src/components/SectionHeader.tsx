interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = false }: SectionHeaderProps) {
    return (
        <div className={`mb-10 ${centered ? "text-center mx-auto max-w-2xl" : ""}`}>
            <h2 className="text-3xl font-bold text-[#171717] mb-3">{title}</h2>
            {subtitle && (
                <div className={`w-16 h-1 bg-[#ae8563] rounded-full mb-4 opacity-80 ${centered ? "mx-auto" : ""}`} />
            )}
            {subtitle && (
                <p className="text-gray-600 text-lg leading-relaxed">{subtitle}</p>
            )}
        </div>
    );
}
