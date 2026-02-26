"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roomOptions = [
  {
    id: 1,
    name: "AC Deluxe Room",
    price: 1500,
    image: "/assets/ac-room.jpg",
    guests: 2,
    location: "Varanasi",
  },
  {
    id: 2,
    name: "Non-AC Room",
    price: 800,
    image: "/assets/non-ac-room.jpg",
    guests: 2,
    location: "Varanasi",
  },
  {
    id: 3,
    name: "Suite Room",
    price: 2500,
    image: "/assets/suite-room.jpg",
    guests: 4,
    location: "Ayodhya",
  },
  {
    id: 4,
    name: "Dormitory",
    price: 300,
    image: "/assets/dormitory.jpg",
    guests: 6,
    location: "Mathura",
  },
  {
    id: 5,
    name: "Premium Suite",
    price: 3000,
    image: "/assets/premium-suite.jpg",
    guests: 4,
    location: "Ayodhya",
  },
  {
    id: 6,
    name: "Budget Room",
    price: 500,
    image: "/assets/budget-room.jpg",
    guests: 2,
    location: "Mathura",
  },
];

const locations = [...new Set(roomOptions.map((room) => room.location))];

export default function RoomBooking() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);

  const filteredRooms = selectedLocation ? roomOptions.filter((room) => room.location === selectedLocation) : [];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Room Booking</h1>
          <p className="text-stone-600">Book comfortable temple rooms for your stay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-stone-800 mb-6">Search Rooms</h2>

              <div className="space-y-4">
                {/* Location Selection */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Select Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">-- Choose a location --</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6+ Guests</option>
                  </select>
                </div>

                {/* Search Button */}
                <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition">
                  Search Rooms
                </button>
              </div>
            </div>
          </div>

          {/* Room Options */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Room Options</h2>

            {!selectedLocation ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-stone-600 text-lg">Please select a location to view available rooms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                      {/* Room Image */}
                      <div className="h-48 bg-linear-to-br from-teal-200 to-teal-400 flex items-center justify-center">
                        <span className="text-stone-500">Room Image</span>
                      </div>

                      {/* Room Details */}
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-stone-800 mb-2">{room.name}</h3>
                        <p className="text-sm text-teal-600 mb-2 font-medium">{room.location}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-teal-600">₹ {room.price}</span>
                          <span className="text-sm text-stone-600">/ Night</span>
                        </div>
                        <div className="flex items-center text-sm text-stone-600 mb-4">
                          <span>{room.guests} Guests</span>
                        </div>
                        <button className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-stone-600 text-lg">No rooms available for this location</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
