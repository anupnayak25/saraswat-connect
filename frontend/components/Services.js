import Image from "next/image";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Room Booking",
    description: "Book comfortable temple rooms",
    icon: "🛏️",
    image: "/assets/room-booking.jpg",
    buttonText: "Book Now",
    link: "/rooms",
  },
  {
    id: 2,
    title: "Vehicle Booking",
    description: "Rent cars and buses",
    icon: "🚗",
    image: "/assets/vehicle-booking.jpg",
    buttonText: "Book Now",
    link: "/vehicles",
  },
  {
    id: 3,
    title: "Pooja Booking",
    description: "Reserve rituals and poojas",
    icon: "🪔",
    image: "/assets/pooja-booking.jpg",
    buttonText: "Book Now",
    link: "/poojas",
  },
  {
    id: 4,
    title: "Tour Packages",
    description: "Explore divine temple tours",
    icon: "📍",
    image: "/assets/tour-packages.jpg",
    buttonText: "View Packages",
    link: "/packages",
  },
];

export default function Services() {
  return (
    <section className="py-16 bg-[#f5e6d3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Book Temple Rooms, Vehicles, Poojas <span className="text-gray-600">& Spiritual Tours</span>
          </h2>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-4 border-[#d4a574]">
              {/* Icon Circle */}
              <div className="bg-linear-to-b from-[#f5e6d3] to-white pt-6 pb-4 flex justify-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-3xl shadow-md">
                  {service.icon}
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-3">
                <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
              </div>

              {/* Image placeholder */}
              <div className="relative h-40 bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Image Placeholder</span>
              </div>

              {/* Description */}
              <div className="bg-linear-to-b from-white to-[#f5e6d3] p-4 text-center">
                <p className="text-gray-700 mb-4">{service.description}</p>
                <Link href={service.link}>
                  <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition w-full font-semibold">
                    {service.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
