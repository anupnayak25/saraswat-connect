"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PoojaBooking() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Pooja Booking</h1>
          <p className="text-stone-600">This feature is temporarily disabled.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
