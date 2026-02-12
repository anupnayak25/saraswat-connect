import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">About Saraswath Connect</h1>
          <p className="text-gray-600">Your trusted platform for spiritual services</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Saraswath Connect is your trusted platform for temple room booking, pooja reservations, vehicle rentals and
            spiritual tour packages. We provide a seamless, expert experience, and luxury from for temple.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Founded with the vision of making spiritual journeys more accessible and convenient, we have been serving
            devotees for years with dedication and commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">50+ Temples</h3>
            <p className="text-gray-600">Connected across India</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">10,000+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">4.8/5</h3>
            <p className="text-gray-600">Customer Rating</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🛏️</div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Room Booking</h3>
                <p className="text-gray-600">Comfortable temple accommodations</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🚗</div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Vehicle Rental</h3>
                <p className="text-gray-600">Safe and reliable transportation</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🪔</div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Pooja Services</h3>
                <p className="text-gray-600">Traditional rituals and ceremonies</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📍</div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Tour Packages</h3>
                <p className="text-gray-600">Curated spiritual journeys</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
