"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tourPackages = [
  {
    id: 1,
    name: "Spiritual Darshan Tour",
    days: 3,
    nights: 2,
    price: 5999,
    image: "/assets/spiritual-tour.jpg",
    highlights: ["Temple visits", "Guided tours", "Accommodation", "Meals included"],
  },
  {
    id: 2,
    name: "Hill Station Yatra",
    days: 2,
    nights: 1,
    price: 4499,
    image: "/assets/hill-station.jpg",
    highlights: ["Hill temple", "Scenic views", "Hotel stay", "Breakfast included"],
  },
  {
    id: 3,
    name: "Pilgrimage Special",
    days: 4,
    nights: 3,
    price: 7999,
    image: "/assets/pilgrimage.jpg",
    highlights: ["Multiple temples", "AC bus", "3-star hotel", "All meals"],
  },
  {
    id: 4,
    name: "Weekend Temple Tour",
    days: 2,
    nights: 1,
    price: 3999,
    image: "/assets/weekend-tour.jpg",
    highlights: ["2 temple visits", "Transport", "Lunch", "Guide"],
  },
  {
    id: 5,
    name: "Divine Expedition",
    days: 5,
    nights: 4,
    price: 12999,
    image: "/assets/expedition.jpg",
    highlights: ["5 sacred temples", "Luxury stay", "Full board", "Private vehicle"],
  },
  {
    id: 6,
    name: "Heritage Temple Circuit",
    days: 3,
    nights: 2,
    price: 6499,
    image: "/assets/heritage.jpg",
    highlights: ["Ancient temples", "Cultural shows", "Hotel stay", "Meals"],
  },
];

export default function TourPackages() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Tour Packages</h1>
          <p className="text-stone-600">Explore divine temple tours and spiritual journeys</p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tourPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              {/* Package Image */}
              <div className="h-56 bg-linear-to-br from-teal-200 to-teal-400 flex items-center justify-center relative">
                <span className="text-stone-500">Package Image</span>
              </div>

              {/* Package Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>

                <p className="text-gray-600 text-sm mb-3">
                  {pkg.days} Days / {pkg.nights} Nights
                </p>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-stone-700 mb-2">Package Highlights:</p>
                  <ul className="space-y-1">
                    {pkg.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm text-stone-600 flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-stone-600">From</p>
                    <p className="text-2xl font-bold text-teal-600">₹ {pkg.price.toLocaleString()}</p>
                  </div>
                </div>

                <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition">
                  View Package
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Why Choose Our Tour Packages?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🏨</div>
              <h3 className="font-bold text-stone-800 mb-2">Comfortable Stay</h3>
              <p className="text-sm text-stone-600">Quality accommodations near temples</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚐</div>
              <h3 className="font-bold text-stone-800 mb-2">Easy Transport</h3>
              <p className="text-sm text-stone-600">Hassle-free travel arrangements</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="font-bold text-stone-800 mb-2">Expert Guides</h3>
              <p className="text-sm text-stone-600">Knowledgeable guides for spiritual insights</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
