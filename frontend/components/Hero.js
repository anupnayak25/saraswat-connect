import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-orange-100 to-amber-100">
      {/* Background image placeholder */}
      <div className="absolute inset-0 bg-[url('/assets/hero-bg.jpg')] bg-cover bg-center opacity-90"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full py-12">
          {/* Left side - Text content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-8">
              Book Temple Rooms,
              <br />
              Vehicles, Poojas & Spiritual Tours
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/trip-planner">
                <button className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition shadow-lg">
                  Plan Your Trip
                </button>
              </Link>
              <button className="bg-blue-900 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition shadow-lg">
                Explore Services
              </button>
            </div>
          </div>

          {/* Right side - Goddess image placeholder */}
          <div className="flex-1 hidden lg:flex justify-end items-center">
            <div className="w-80 h-96 relative">
              {/* Placeholder for goddess Saraswati image */}
              <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-sm">Goddess Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="#f5e6d3"
          />
        </svg>
      </div>
    </section>
  );
}
