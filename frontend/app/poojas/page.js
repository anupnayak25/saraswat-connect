"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poojaOptions = [
  {
    id: 1,
    name: "Saraswati Pooja",
    price: 500,
    image: "/assets/saraswati-pooja.jpg",
    duration: "2 hours",
  },
  {
    id: 2,
    name: "Abhishekam",
    price: 200,
    image: "/assets/abhishekam.jpg",
    duration: "1 hour",
  },
  {
    id: 3,
    name: "Archana",
    price: 100,
    image: "/assets/archana.jpg",
    duration: "30 minutes",
  },
  {
    id: 4,
    name: "Special Darshan",
    price: 300,
    image: "/assets/special-darshan.jpg",
    duration: "1 hour",
  },
  {
    id: 5,
    name: "Maha Pooja",
    price: 1500,
    image: "/assets/maha-pooja.jpg",
    duration: "3 hours",
  },
  {
    id: 6,
    name: "Navagraha Pooja",
    price: 800,
    image: "/assets/navagraha.jpg",
    duration: "2 hours",
  },
];

export default function PoojaBooking() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPooja, setSelectedPooja] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Pooja Booking</h1>
          <p className="text-gray-600">Reserve rituals and poojas for divine blessings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Book Pooja</h2>

              <div className="space-y-4">
                {/* Select Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Select Pooja */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Pooja</label>
                  <select
                    value={selectedPooja}
                    onChange={(e) => setSelectedPooja(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">Choose a Pooja</option>
                    {poojaOptions.map((pooja) => (
                      <option key={pooja.id} value={pooja.id}>
                        {pooja.name} - ₹{pooja.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Book Button */}
                <button className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition">
                  Book Pooja
                </button>
              </div>
            </div>
          </div>

          {/* Pooja Options */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pooja Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {poojaOptions.map((pooja) => (
                <div
                  key={pooja.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                  {/* Pooja Image */}
                  <div className="relative h-48 bg-linear-to-br from-orange-300 to-red-400 flex items-center justify-center">
                    <span className="text-white text-sm">Pooja Image</span>
                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-lg font-bold">
                      ₹ {pooja.price}
                    </div>
                  </div>

                  {/* Pooja Details */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{pooja.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span>⏱️ {pooja.duration}</span>
                    </div>
                    <button className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800 transition">
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
