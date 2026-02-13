import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const menuItems = [
  {
    id: 1,
    title: "About Us",
    icon: "ℹ️",
    link: "/about",
  },
  {
    id: 2,
    title: "Contact Us",
    icon: "📞",
    link: "/contact",
  },
  {
    id: 3,
    title: "Services",
    icon: "⚙️",
    link: "/services",
  },
  {
    id: 4,
    title: "FAQs",
    icon: "❓",
    link: "/faqs",
  },
  {
    id: 5,
    title: "Terms & Conditions",
    icon: "📄",
    link: "/terms",
  },
  {
    id: 6,
    title: "Privacy Policy",
    icon: "🔒",
    link: "/privacy",
  },
];

export default function More() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">More</h1>
          <p className="text-stone-600">Additional information and settings</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {menuItems.map((item, index) => (
            <Link key={item.id} href={item.link}>
              <div
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition ${
                  index !== menuItems.length - 1 ? "border-b border-gray-200" : ""
                }`}>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-lg font-medium text-gray-800">{item.title}</span>
                </div>
                <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4">App Version</h2>
          <p className="text-stone-600">Version 1.0.0</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
