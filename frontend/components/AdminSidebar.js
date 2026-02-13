"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminSidebar({ activePage }) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Rooms", href: "/admin/rooms", icon: "🛏️" },
    { name: "Vehicles", href: "/admin/vehicles", icon: "🚗" },
    { name: "Poojas", href: "/admin/poojas", icon: "🪔" },
    { name: "Tour Packages", href: "/admin/packages", icon: "📍" },
    { name: "All Bookings", href: "/admin/bookings", icon: "📋" },
    { name: "Messages", href: "/admin/messages", icon: "💬" },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-1">Saraswath Connect</p>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activePage === item.name ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}>
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
          <span className="text-xl">🚪</span>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
