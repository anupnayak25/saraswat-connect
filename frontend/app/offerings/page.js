import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const offerings = [
  {
    id: 1,
    name: "Prasadam",
    description: "Sacred food offering",
    icon: "🍲",
  },
  {
    id: 2,
    name: "Flowers",
    description: "Fresh flower garlands",
    icon: "🌺",
  },
  {
    id: 3,
    name: "Coconut",
    description: "Auspicious coconut offering",
    icon: "🥥",
  },
  {
    id: 4,
    name: "Incense",
    description: "Fragrant incense sticks",
    icon: "🔥",
  },
  {
    id: 5,
    name: "Oil Lamp",
    description: "Traditional oil lamps",
    icon: "🪔",
  },
  {
    id: 6,
    name: "Fruits",
    description: "Fresh fruits basket",
    icon: "🍎",
  },
];

export default function Offerings() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Temple Offerings</h1>
          <p className="text-stone-600">Sacred offerings for divine blessings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((offering) => (
            <div key={offering.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
              <div className="text-5xl mb-4">{offering.icon}</div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{offering.name}</h3>
              <p className="text-stone-600 mb-4">{offering.description}</p>
              <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-800 transition font-semibold">
                Order Now
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
