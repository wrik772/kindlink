"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SectionHeader from "@/components/SectionHeader";
import Logo from "@/components/Logo";
import LocationSelector from "@/components/Onboarding/LocationSelector";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableInterests = [
    "Animals", "Education", "Environment", "Hunger", 
    "Disaster Relief", "Elderly Care", "Healthcare", "Women Empowerment"
  ];

  // If not logged in, redirect to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || selectedInterests.length === 0) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, interests: selectedInterests }),
      });

      if (res.ok) {
        // Force session update if possible, then redirect to feed
        router.push("/home"); // This will be the new feed
      } else {
        console.error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving onboarding details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") return <div className="p-8 text-center text-[#ae8563]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fcf9f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo height={12} width={50} className="mx-auto" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#171717]">
          Welcome to KindLink
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's tailor your experience. What matters to you?
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[#ae8563]/10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-[#6b4b34] mb-4">
                Where are you located?
              </label>
              <LocationSelector onLocationChange={setLocation} />
              <p className="text-xs text-gray-500 mt-4">This helps us find nearby NGOs and shelters for you.</p>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-bold text-[#6b4b34] mb-4">
                Select your interests (at least one)
              </label>
              <div className="flex flex-wrap gap-3">
                {availableInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      selectedInterests.includes(interest)
                        ? "bg-[#ae8563] text-white border-[#ae8563]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#ae8563] hover:text-[#ae8563]"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !location || selectedInterests.length === 0}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ae8563] hover:bg-[#967050] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae8563] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Continue to Feed"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
