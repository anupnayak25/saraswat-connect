import Image from "next/image";

export default function About() {
  return (
    <section className="py-16 bg-[#f5e6d3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="border-8 border-[#d4a574] rounded-lg overflow-hidden shadow-2xl">
              <div className="relative h-96 bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center">
                {/* Placeholder for temple image */}
                <span className="text-gray-600 text-lg">Temple Image Placeholder</span>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Saraswath Connect</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Saraswath Connect is your trusted platform for temple room booking, pooja reservations, vehicle rentals
              and spiritual tour packages. We provide a seamless, expert experience, and luxury erom for temple.
            </p>
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-semibold shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
