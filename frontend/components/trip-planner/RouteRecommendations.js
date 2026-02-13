"use client";

import { useState, useEffect } from "react";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { tripPlannerAPI } from "@/lib/tripPlannerAPI";

export default function Step3RouteRecommendations() {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();
  const [activeTab, setActiveTab] = useState("hotels");
  const [recommendations, setRecommendations] = useState({
    hotels: [],
    restaurants: [],
    attractions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!tripData.optimizedRoute || tripData.optimizedRoute.length === 0) return;

    setLoading(true);
    (async () => {
      try {
        const data = await tripPlannerAPI.getRecommendations(tripData.optimizedRoute);
        if (!cancelled) setRecommendations(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tripData.optimizedRoute]);

  const toggleHotel = (hotel) => {
    const isSelected = tripData.selectedHotels.find((h) => h.id === hotel.id);
    if (isSelected) {
      updateTripData({
        selectedHotels: tripData.selectedHotels.filter((h) => h.id !== hotel.id),
      });
    } else {
      updateTripData({
        selectedHotels: [...tripData.selectedHotels, hotel],
      });
    }
  };

  const toggleRestaurant = (restaurant) => {
    const isSelected = tripData.selectedRestaurants.find((r) => r.id === restaurant.id);
    if (isSelected) {
      updateTripData({
        selectedRestaurants: tripData.selectedRestaurants.filter((r) => r.id !== restaurant.id),
      });
    } else {
      updateTripData({
        selectedRestaurants: [...tripData.selectedRestaurants, restaurant],
      });
    }
  };

  const toggleAttraction = (attraction) => {
    const isSelected = tripData.selectedAttractions.find((a) => a.id === attraction.id);
    if (isSelected) {
      updateTripData({
        selectedAttractions: tripData.selectedAttractions.filter((a) => a.id !== attraction.id),
      });
    } else {
      updateTripData({
        selectedAttractions: [...tripData.selectedAttractions, attraction],
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Your Optimized Route</h2>
        <p className="text-stone-600">Explore recommendations along your journey</p>
      </div>

      {/* Route Summary */}
      <div className="mb-8 p-6 bg-linear-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-stone-800">Route Overview</h3>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-sm text-stone-600">Distance</p>
              <p className="text-lg font-bold text-teal-600">{tripData.totalDistance?.toFixed(0)} km</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-stone-600">Duration</p>
              <p className="text-lg font-bold text-teal-600">{tripData.estimatedDuration?.toFixed(1)} hrs</p>
            </div>
          </div>
        </div>

        {/* Route Path */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {tripData.optimizedRoute.map((location, index) => (
            <div key={location.id} className="flex items-center">
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm whitespace-nowrap">
                <span className="text-sm text-stone-600">{index + 1}.</span>
                <span className="ml-2 font-medium text-stone-800">{location.name}</span>
              </div>
              {index < tripData.optimizedRoute.length - 1 && <span className="mx-2 text-teal-600">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mb-8 h-96 bg-stone-100 rounded-lg flex items-center justify-center border-2 border-dashed border-stone-300">
        <div className="text-center">
          <p className="text-stone-500 text-lg mb-2">🗺️ Interactive Map</p>
          <p className="text-stone-400 text-sm">Route visualization with Google Maps/Mapbox integration</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-200">
          {["hotels", "restaurants", "attractions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition ${
                activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-stone-600 hover:text-stone-800"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Content */}
      <div className="mb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Hotels Tab */}
            {activeTab === "hotels" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.hotels.map((hotel) => {
                  const isSelected = tripData.selectedHotels.find((h) => h.id === hotel.id);
                  return (
                    <div
                      key={hotel.id}
                      className={`p-4 rounded-lg border-2 transition ${
                        isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                      }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-stone-800">{hotel.name}</h4>
                        <span className="text-yellow-500">⭐ {hotel.rating}</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">📍 {hotel.location}</p>
                      <p className="text-sm text-stone-600 mb-3">{hotel.amenities.join(" • ")}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-stone-800">₹{hotel.price}/night</span>
                        <button
                          onClick={() => toggleHotel(hotel)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            isSelected
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}>
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Restaurants Tab */}
            {activeTab === "restaurants" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.restaurants.map((restaurant) => {
                  const isSelected = tripData.selectedRestaurants.find((r) => r.id === restaurant.id);
                  return (
                    <div
                      key={restaurant.id}
                      className={`p-4 rounded-lg border-2 transition ${
                        isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                      }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-stone-800">{restaurant.name}</h4>
                        <span className="text-yellow-500">⭐ {restaurant.rating}</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">📍 {restaurant.location}</p>
                      <p className="text-sm text-stone-600 mb-3">🍽️ {restaurant.cuisine}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Avg. ₹{restaurant.avgCost} per person</span>
                        <button
                          onClick={() => toggleRestaurant(restaurant)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            isSelected
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}>
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Attractions Tab */}
            {activeTab === "attractions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.attractions.map((attraction) => {
                  const isSelected = tripData.selectedAttractions.find((a) => a.id === attraction.id);
                  return (
                    <div
                      key={attraction.id}
                      className={`p-4 rounded-lg border-2 transition ${
                        isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                      }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-stone-800">{attraction.name}</h4>
                        <span className="text-yellow-500">⭐ {attraction.rating}</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">📍 {attraction.location}</p>
                      <p className="text-sm text-stone-600 mb-3">🏷️ {attraction.type}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">
                          Entry: {attraction.entryFee === 0 ? "Free" : `₹${attraction.entryFee}`}
                        </span>
                        <button
                          onClick={() => toggleAttraction(attraction)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            isSelected
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}>
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
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
          onClick={nextStep}
          className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-800 transition">
          Next: Select Vehicle →
        </button>
      </div>
    </div>
  );
}
