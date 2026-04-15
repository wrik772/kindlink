"use client";

import { useState, useEffect, useRef } from "react";
import { statesOfIndia, citiesByState } from "@/data/india-data";

interface LocationSelectorProps {
  onLocationChange: (location: string) => void;
}

// Helper to normalize strings to Title Case
const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [localities, setLocalities] = useState<string[]>([]);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Loop prevention: Ref to track last emitted location
  const lastEmittedValue = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableCities = selectedState ? citiesByState[selectedState] || [] : [];

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset logic when state changes
  useEffect(() => {
    setSelectedCity("");
    setSelectedLocality("");
    setLocalities([]);
    setSearchTerm("");
  }, [selectedState]);

  // Handle Locality Search (Debounced)
  useEffect(() => {
    const fetchLocalities = async () => {
      // If no valid city or search term is too short, just use the city-level branches as default
      const query = searchTerm.trim() || selectedCity;
      if (!query || query.length < 2) {
        setLocalities([]);
        return;
      }

      setIsLoadingLocalities(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data && data[0] && data[0].PostOffice) {
          const names = Array.from(new Set(data[0].PostOffice.map((p: any) => p.Name))) as string[];
          // Filter results if we are searching (ensure they match the city if possible)
          setLocalities(names.sort());
        } else {
          setLocalities([]);
        }
      } catch (err) {
        console.error("Failed to fetch localities:", err);
        setLocalities([]);
      } finally {
        setIsLoadingLocalities(false);
      }
    };

    const timeout = setTimeout(fetchLocalities, 500); // 500ms debounce
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCity]);

  // Propagate changes to parent with loop protection and normalization
  useEffect(() => {
    if (!selectedState || !selectedCity) {
      if (lastEmittedValue.current !== "") {
        lastEmittedValue.current = "";
        onLocationChange("");
      }
      return;
    }

    const locality = selectedLocality || searchTerm || "General";
    const normalized = `${toTitleCase(locality)}, ${toTitleCase(selectedCity)}, ${toTitleCase(selectedState)}`;
    
    if (lastEmittedValue.current !== normalized) {
      lastEmittedValue.current = normalized;
      onLocationChange(normalized);
    }
  }, [selectedState, selectedCity, selectedLocality, searchTerm, onLocationChange]);

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* State Selection */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State / UT</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#ae8563]/20 focus:border-[#ae8563] outline-none transition-all"
        >
          <option value="">Select State</option>
          {statesOfIndia.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* City Selection */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
        <select
          value={selectedCity}
          disabled={!selectedState}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#ae8563]/20 focus:border-[#ae8563] outline-none transition-all disabled:opacity-50"
        >
          <option value="">Select City</option>
          {availableCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Smart Locality Search */}
      <div className="relative">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Locality / Area Name</label>
        <div className="relative">
          <input
            type="text"
            placeholder={selectedCity ? `Search in ${selectedCity} (e.g. JP Nagar)` : "Select a city first"}
            disabled={!selectedCity}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedLocality(""); // Reset selection when typing
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#ae8563]/20 focus:border-[#ae8563] outline-none transition-all disabled:opacity-50"
          />
          {isLoadingLocalities && (
            <div className="absolute right-3 top-3.5">
              <div className="w-4 h-4 border-2 border-[#ae8563] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && localities.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {localities.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setSearchTerm(loc);
                  setSelectedLocality(loc);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[#ae8563]/10 transition-colors border-b border-gray-50 last:border-0"
              >
                {loc}
              </button>
            ))}
          </div>
        )}
        <p className="text-[10px] text-gray-400 mt-1">Start typing to see specific neighborhoods (e.g., Jayanagar, BTM)</p>
      </div>
    </div>
  );
}
