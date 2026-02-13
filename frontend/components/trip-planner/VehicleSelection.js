"use client";

import { useState, useEffect } from "react";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { tripPlannerAPI } from "@/lib/tripPlannerAPI";

export default function Step4VehicleSelection() {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();
  const [vehicles, setVehicles] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    (async () => {
      try {
        // Current mock implementation doesn't use trip details.
        const data = await tripPlannerAPI.getVehiclesAndAgencies();
        if (cancelled) return;
        setVehicles(data.vehicles);
        setAgencies(data.agencies);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);
  const selectVehicle = (vehicle) => {
    updateTripData({ vehicleType: vehicle, seats: 1 });
  };

  const selectAgency = (agency) => {
    updateTripData({ travelAgency: agency });
  };

  const canProceed = tripData.vehicleType && tripData.travelAgency && tripData.seats > 0;

  // Filter agencies based on selected vehicle
  const availableAgencies = agencies.filter(
    (agency) =>
      !tripData.vehicleType || agency.vehicleTypes.includes(tripData.vehicleType.id)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Vehicle</h2>
        <p className="text-gray-600">Select vehicle type and travel agency</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Vehicle Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Vehicle Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vehicles.map((vehicle) => {
                const isSelected = tripData.vehicleType?.id === vehicle.id;
                return (
                  <button
                    key={vehicle.id}
                    onClick={() => selectVehicle(vehicle)}
                    className={`p-4 rounded-lg border-2 transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3">
                        {vehicle.id === "bike"
                          ? "🏍️"
                          : vehicle.id === "car"
                          ? "🚗"
                          : vehicle.id === "suv"
                          ? "🚙"
                          : "🚌"}
                      </div>
                      <h4 className="font-bold text-gray-800 mb-1">{vehicle.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{vehicle.seats} Seats</p>
                      <p className="text-lg font-bold text-orange-600">
                        ₹{vehicle.pricePerKm}/km
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seat Selection */}
          {tripData.vehicleType && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Number of Seats Required
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    updateTripData({ seats: Math.max(1, tripData.seats - 1) })
                  }
                  className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:border-orange-500 transition"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <p className="text-3xl font-bold text-gray-800">{tripData.seats}</p>
                  <p className="text-sm text-gray-600">
                    Max: {tripData.vehicleType.seats} seats
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateTripData({
                      seats: Math.min(tripData.vehicleType.seats, tripData.seats + 1),
                    })
                  }
                  className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:border-orange-500 transition"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Travel Agency Selection */}
          {tripData.vehicleType && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Select Travel Agency</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableAgencies.map((agency) => {
                  const isSelected = tripData.travelAgency?.id === agency.id;
                  return (
                    <button
                      key={agency.id}
                      onClick={() => selectAgency(agency)}
                      className={`p-6 rounded-lg border-2 transition text-left ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <h4 className="font-bold text-gray-800 mb-2">{agency.name}</h4>
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {agency.rating}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Supports: {agency.vehicleTypes.join(", ").toUpperCase()}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        Service Charge:{" "}
                        {agency.surcharge === 0 ? "Free" : `₹${agency.surcharge}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Estimated Cost Preview */}
          {tripData.vehicleType && tripData.travelAgency && (
            <div className="mb-8 p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Estimated Cost</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vehicle Cost</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹{(tripData.totalDistance * tripData.vehicleType.pricePerKm).toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hotels</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹
                    {tripData.selectedHotels
                      .reduce((sum, h) => sum + h.price, 0)
                      .toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Charge</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹{tripData.travelAgency.surcharge}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹
                    {(
                      tripData.totalDistance * tripData.vehicleType.pricePerKm +
                      tripData.selectedHotels.reduce((sum, h) => sum + h.price, 0) +
                      tripData.travelAgency.surcharge
                    ).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={prevStep}
          className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={`flex-1 py-3 rounded-lg font-semibold transition ${
            canProceed
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Review & Confirm →
        </button>
      </div>
    </div>
  );
}
