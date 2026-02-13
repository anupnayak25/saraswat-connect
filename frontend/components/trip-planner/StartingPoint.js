"use client";

import { useState, useEffect } from "react";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { tripPlannerAPI } from "@/lib/tripPlannerAPI";

export default function Step1StartingPoint() {
  const { tripData, updateTripData, nextStep } = useTripPlanner();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const locations = await tripPlannerAPI.getPopularLocations();
      if (!cancelled) setPopularLocations(locations);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!searchQuery) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const results = await tripPlannerAPI.searchLocations(searchQuery);
        if (!cancelled) setSearchResults(results);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  const selectLocation = (location) => {
    updateTripData({ startingPoint: location });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleNext = () => {
    if (tripData.startingPoint) {
      nextStep();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Where are you starting from?</h2>
        <p className="text-gray-600">Select your journey&apos;s beginning point</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full max-w-2xl mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            {searchResults.map((location) => (
              <button
                key={location.id}
                onClick={() => selectLocation(location)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b last:border-b-0"
              >
                <div className="font-medium text-gray-800">{location.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Starting Point */}
      {tripData.startingPoint && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-sm text-gray-600">Starting Point</p>
                <p className="font-semibold text-gray-800">{tripData.startingPoint.name}</p>
              </div>
            </div>
            <button
              onClick={() => updateTripData({ startingPoint: null })}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Popular Locations */}
      {!tripData.startingPoint && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Locations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => selectLocation(location)}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏛️</span>
                  <span className="font-medium text-gray-800">{location.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          disabled={!tripData.startingPoint}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            tripData.startingPoint
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next: Select Destinations
        </button>
      </div>
    </div>
  );
}
