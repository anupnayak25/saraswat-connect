import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const bookingCategories = [
  {
    id: 1,
    title: "Room Bookings",
    icon: "🛏️",
    link: "/rooms",
    color: "bg-orange-100",
  },
  {
    id: 2,
    title: "Vehicle Bookings",
    icon: "🚗",
    link: "/vehicles",
    color: "bg-blue-100",
  },
  {
    id: 3,
    title: "Pooja Bookings",
    icon: "🪔",
    link: "/poojas",
    color: "bg-red-100",
  },
  {
    id: 4,
    title: "Tour Packages",
    icon: "📍",
    link: "/packages",
    color: "bg-green-100",
  },
];

export default function Bookings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage all your bookings in one place</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookingCategories.map((category) => (
            <Link key={category.id} href={category.link}>
              <div className={`${category.color} rounded-lg p-6 hover:shadow-lg transition cursor-pointer`}>
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Bookings</h2>
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">No bookings yet</p>
            <p className="text-sm mt-2">Start booking your spiritual journey today!</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
