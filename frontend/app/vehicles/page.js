"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const vehicleOptions = [
  {
    id: 1,
    name: "Sedan",
    price: 12,
    image: "/assets/sedan.jpg",
    seats: 4,
    type: "Car",
  },
  {
    id: 2,
    name: "Mini Bus",
    price: 20,
    image: "/assets/mini-bus.jpg",
    seats: 18,
    type: "Bus",
  },
  {
    id: 3,
    name: "SUV",
    price: 18,
    image: "/assets/suv.jpg",
    seats: 7,
    type: "Car",
  },
  {
    id: 4,
    name: "Luxury Bus",
    price: 35,
    image: "/assets/luxury-bus.jpg",
    seats: 40,
    type: "Bus",
  },
];

export default function VehicleBooking() {
  const [selectedDate, setSelectedDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Vehicle Booking</h1>
          <p className="text-stone-600">Rent cars and buses for your spiritual journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-stone-800 mb-6">Search Vehicles</h2>

              <div className="space-y-4">
                {/* Select Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Location</option>
                    <option value="temple">Temple Entrance</option>
                    <option value="station">Railway Station</option>
                    <option value="airport">Airport</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>

                {/* Drop Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drop Location</label>
                  <select
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Location</option>
                    <option value="temple">Temple Entrance</option>
                    <option value="station">Railway Station</option>
                    <option value="airport">Airport</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>

                {/* Search Button */}
                <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition">
                  Search Vehicles
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Options */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Vehicle Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicleOptions.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                  {/* Vehicle Image */}
                  <div className="h-48 bg-linear-to-br from-teal-200 to-teal-400 flex items-center justify-center">
                    <span className="text-stone-500">Vehicle Image</span>
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-stone-800 mb-2">{vehicle.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-teal-600">₹ {vehicle.price}</span>
                      <span className="text-sm text-stone-600">per Km</span>
                    </div>
                    <div className="flex items-center text-sm text-stone-600 mb-4">
                      <span>{vehicle.capacity} Capacity</span>
                    </div>
                    <button className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
