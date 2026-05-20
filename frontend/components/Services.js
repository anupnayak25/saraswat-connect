import Image from "next/image";
import Link from "next/link";
import room from "@/assets/room.png";
import tour_package from "@/assets/package.png";
// import pooja from "@/assets/pooja.png";
import vehicel from "@/assets/vehicel.png";

const services = [
  {
    id: 1,
    title: "Room Booking",
    description: "Book comfortable rooms",
    icon: "🛏️",
    image: room,
    buttonText: "Book Now",
    link: "/rooms",
  },
  {
    id: 2,
    title: "Vehicle Booking",
    description: "Rent cars and buses",
    icon: "🚗",
    image: vehicel,
    buttonText: "Book Now",
    link: "/vehicles",
  },
  // {
  //   id: 3,
  //   title: "Pooja Booking",
  //   description: "Reserve rituals and poojas",
  //   icon: "🪔",
  //   image: pooja,
  //   buttonText: "Book Now",
  //   link: "/poojas",
  // },
  {
    id: 4,
    title: "Tour Packages",
    description: "Explore temple tours",
    icon: "📍",
    image: tour_package,
    buttonText: "View Packages",
    link: "/packages",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">Our Services</h2>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white space-y-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-4 border-teal-800 w-full max-w-xs overflow-hidden">
              {/* Title */}
              <div className="text-center py-3">
                <h3 className="text-xl font-bold text-stone-800">{service.title}</h3>
              </div>

              {/* Image placeholder */}
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              </div>

              {/* Description */}
              <div className="bg-linear-to-b from-white to-stone-50 p-4 text-center">
                <p className="text-stone-700 mb-4">{service.description}</p>
                <Link href={service.link}>
                  <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition w-full font-semibold">
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
