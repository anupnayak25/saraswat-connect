"use client";

import { useState, useEffect, useCallback } from "react";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { tripPlannerAPI } from "@/lib/tripPlannerAPI";

const SUGGESTION_LIMITS = {
  nearby: 6,
  random: 6,
};

export default function Step2Destinations() {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [nearbySuggestions, setNearbySuggestions] = useState([]);
  const [randomSuggestions, setRandomSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!searchQuery) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const startingPointId = tripData.startingPoint?.id;
    const selectedIds = new Set(tripData.destinations.map((d) => d.id));

    setLoading(true);
    (async () => {
      try {
        const results = await tripPlannerAPI.searchLocations(searchQuery);

        // Filter out already selected destinations and starting point
        const filtered = results.filter((loc) => loc.id !== startingPointId && !selectedIds.has(loc.id));

        if (!cancelled) setSearchResults(filtered);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, tripData.startingPoint?.id, tripData.destinations]);

  const refreshSuggestions = useCallback(
    async (destinationsOverride = tripData.destinations) => {
      const startingPointId = tripData.startingPoint?.id;
      if (!startingPointId) {
        setNearbySuggestions([]);
        setRandomSuggestions([]);
        return;
      }

      setSuggestionsLoading(true);
      try {
        const [nearby, random] = await Promise.all([
          tripPlannerAPI.getNearbyTouristPlaces(startingPointId, SUGGESTION_LIMITS.nearby * 3),
          tripPlannerAPI.getRandomTouristPlaces(SUGGESTION_LIMITS.random * 3),
        ]);

        const selectedIds = new Set(destinationsOverride.map((dest) => dest.id));
        selectedIds.add(startingPointId);

        const filterSuggestions = (items) => items.filter((item) => item?.id && !selectedIds.has(item.id));

        setNearbySuggestions(filterSuggestions(nearby).slice(0, SUGGESTION_LIMITS.nearby));
        setRandomSuggestions(filterSuggestions(random).slice(0, SUGGESTION_LIMITS.random));
      } finally {
        setSuggestionsLoading(false);
      }
    },
    [tripData.destinations, tripData.startingPoint?.id],
  );

  useEffect(() => {
    refreshSuggestions();
  }, [refreshSuggestions]);

  const addDestination = (location) => {
    const nextDestinations = [...tripData.destinations, location];
    updateTripData({
      destinations: nextDestinations,
    });
    setSearchQuery("");
    setSearchResults([]);
    refreshSuggestions(nextDestinations);
  };

  const removeDestination = (locationId) => {
    const nextDestinations = tripData.destinations.filter((dest) => dest.id !== locationId);
    updateTripData({
      destinations: nextDestinations,
    });
    refreshSuggestions(nextDestinations);
  };

  const handleSubmit = async () => {
    if (tripData.destinations.length === 0) return;

    setOptimizing(true);
    const routeData = await tripPlannerAPI.optimizeRoute(tripData.startingPoint, tripData.destinations);

    updateTripData({
      optimizedRoute: routeData.optimizedOrder,
      totalDistance: routeData.totalDistance,
      estimatedDuration: routeData.estimatedDuration,
    });

    setOptimizing(false);
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Where do you want to go?</h2>
        <p className="text-stone-600">Add multiple destinations to your trip</p>
      </div>

      {tripData.startingPoint?.id && (
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-stone-700 mb-2">Nearby tourist places</h3>
            {suggestionsLoading && nearbySuggestions.length === 0 ? (
              <div className="text-sm text-stone-500">Loading suggestions...</div>
            ) : nearbySuggestions.length === 0 ? (
              <div className="text-sm text-stone-500">No nearby tourist places found yet.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {nearbySuggestions.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => addDestination(place)}
                    className="px-3 py-1.5 rounded-full border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition">
                    {place.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-2">Explore more places</h3>
            {suggestionsLoading && randomSuggestions.length === 0 ? (
              <div className="text-sm text-stone-500">Loading suggestions...</div>
            ) : randomSuggestions.length === 0 ? (
              <div className="text-sm text-stone-500">No extra places to show right now.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {randomSuggestions.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => addDestination(place)}
                    className="px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 transition">
                    {place.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search and add destinations..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full max-w-2xl mt-2 bg-white border border-stone-200 rounded-lg shadow-lg">
            {searchResults.map((location) => (
              <button
                key={location.id}
                onClick={() => addDestination(location)}
                className="w-full px-4 py-3 text-left hover:bg-stone-50 transition border-b last:border-b-0 flex items-center justify-between">
                <span className="font-medium text-stone-800">{location.name}</span>
                <span className="text-teal-600 text-xl">+</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Destinations */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-stone-700 mb-3">
          Selected Destinations ({tripData.destinations.length})
        </h3>

        {tripData.destinations.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-stone-500">No destinations added yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tripData.destinations.map((dest, index) => (
              <div
                key={dest.id}
                className="flex items-center justify-between p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-stone-600 font-medium">{index + 1}.</span>
                  <span className="font-medium text-stone-800">{dest.name}</span>
                </div>
                <button
                  onClick={() => removeDestination(dest.id)}
                  className="text-red-600 hover:text-red-800 font-bold">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={prevStep}
          className="flex-1 py-3 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-50 transition">
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={tripData.destinations.length === 0 || optimizing}
          className={`flex-1 py-3 rounded-lg font-semibold transition ${
            tripData.destinations.length > 0 && !optimizing
              ? "bg-teal-600 text-white hover:bg-teal-800"
              : "bg-stone-300 text-stone-500 cursor-not-allowed"
          }`}>
          {optimizing ? "Optimizing Route..." : "Optimize Route →"}
        </button>
      </div>
    </div>
  );
}
