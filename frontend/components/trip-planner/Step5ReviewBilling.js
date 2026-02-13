"use client";

import { useState, useEffect } from "react";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { tripPlannerAPI } from "@/lib/tripPlannerAPI";
import { useRouter } from "next/navigation";

export default function Step5ReviewBilling() {
  const { tripData, prevStep, resetTrip } = useTripPlanner();
  const [costBreakdown, setCostBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    calculateCost();
  }, []);

  const calculateCost = async () => {
    setLoading(true);
    const breakdown = await tripPlannerAPI.calculateCost(tripData);
    setCostBreakdown(breakdown);
    setLoading(false);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    const result = await tripPlannerAPI.submitBooking(tripData);

    if (result.status === "confirmed") {
      alert(`Success! ${result.message}\nBooking ID: ${result.bookingId}`);
      resetTrip();
      router.push("/");
    } else {
      alert("Booking failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Review Your Trip</h2>
        <p className="text-gray-600">Confirm details and complete your booking</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Trip Summary */}
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Details</h3>

            {/* Route */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Route</h4>
              <div className="flex items-center space-x-2 overflow-x-auto">
                {tripData.optimizedRoute.map((location, index) => (
                  <div key={location.id} className="flex items-center">
                    <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded font-medium whitespace-nowrap">
                      {location.name}
                    </div>
                    {index < tripData.optimizedRoute.length - 1 && <span className="mx-2 text-orange-600">→</span>}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Distance: {tripData.totalDistance?.toFixed(0)} km • Duration: {tripData.estimatedDuration?.toFixed(1)}{" "}
                hrs
              </div>
            </div>

            {/* Hotels */}
            {tripData.selectedHotels.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Selected Hotels</h4>
                <div className="space-y-2">
                  {tripData.selectedHotels.map((hotel) => (
                    <div key={hotel.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-800">{hotel.name}</p>
                        <p className="text-sm text-gray-600">{hotel.location}</p>
                      </div>
                      <p className="font-semibold text-gray-800">₹{hotel.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants */}
            {tripData.selectedRestaurants.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Selected Restaurants</h4>
                <div className="flex flex-wrap gap-2">
                  {tripData.selectedRestaurants.map((restaurant) => (
                    <span key={restaurant.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {restaurant.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions */}
            {tripData.selectedAttractions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Selected Attractions</h4>
                <div className="flex flex-wrap gap-2">
                  {tripData.selectedAttractions.map((attraction) => (
                    <span key={attraction.id} className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                      {attraction.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicle Details */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Vehicle & Travel Agency</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                  <p className="font-medium text-gray-800">{tripData.vehicleType?.name}</p>
                  <p className="text-sm text-gray-600">{tripData.seats} seats</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">Travel Agency</p>
                  <p className="font-medium text-gray-800">{tripData.travelAgency?.name}</p>
                  <p className="text-sm text-gray-600">⭐ {tripData.travelAgency?.rating}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">
                  Vehicle Cost ({tripData.totalDistance?.toFixed(0)} km × ₹{tripData.vehicleType?.pricePerKm}/km)
                </span>
                <span className="font-semibold text-gray-800">₹{costBreakdown.vehicleCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Hotels ({tripData.selectedHotels.length} nights)</span>
                <span className="font-semibold text-gray-800">₹{costBreakdown.hotelCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Service Charge</span>
                <span className="font-semibold text-gray-800">₹{costBreakdown.agencySurcharge.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Taxes (18% GST)</span>
                <span className="font-semibold text-gray-800">₹{costBreakdown.taxes.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-orange-50 px-4 rounded-lg">
                <span className="text-lg font-bold text-gray-800">Total Amount</span>
                <span className="text-2xl font-bold text-orange-600">₹{costBreakdown.total.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="/terms" className="text-orange-600 hover:underline">
                  terms and conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-orange-600 hover:underline">
                  privacy policy
                </a>
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={prevStep}
              disabled={submitting}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
              ← Back
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={submitting}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
              {submitting ? "Processing..." : "Confirm & Pay ₹" + costBreakdown.total.toFixed(0)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
