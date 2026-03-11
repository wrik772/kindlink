

import Image from "next/image";

interface CauseCardProps {
    title: string;
    organizer: string;
    description: string;
    raised: string;
    goal: string;
    progress: number;
    daysLeft: number;
    imageSrc: string;
}

export default function CauseCard({
    title,
    organizer,
    description,
    raised,
    goal,
    progress,
    daysLeft,
    imageSrc,
}: CauseCardProps) {
    return (
        <div className="group rounded-xl overflow-hidden border border-[#e5e7eb] bg-white card-shadow h-full flex flex-col">
            {/* Image */}
            <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                {/* Tag */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-[#6b4b34] z-10">
                    Tax Benefit
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1 text-[#171717] line-clamp-2 min-h-[3.5rem]">
                    {title}
                </h3>
                <p className="text-xs font-medium text-[#ae8563] mb-3 uppercase tracking-wide">
                    by {organizer}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {description}
                </p>

                {/* Progress Section */}
                <div className="mt-auto space-y-3">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-[#ae8563] h-full rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <div>
                            <span className="font-bold text-[#171717]">{raised}</span>
                            <span className="text-gray-500 text-xs"> raised</span>
                        </div>
                        <div className="text-right">
                            <span className="font-bold text-[#171717]">{daysLeft}</span>
                            <span className="text-gray-500 text-xs"> days left</span>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <button className="w-full mt-5 py-2.5 border border-[#ae8563] text-[#ae8563] rounded-lg font-semibold text-sm hover:bg-[#f7efe5] transition-colors">
                    Donate Now
                </button>
            </div>
        </div>
    );
}
