"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SaraswatSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/saraswat-admin", icon: "📊" },
    { name: "Poojas", href: "/saraswat-admin/poojas", icon: "🪔" },
    { name: "Places", href: "/saraswat-admin/places", icon: "📍" },
    { name: "Packages", href: "/saraswat-admin/packages", icon: "📦" },
    { name: "Rooms", href: "/saraswat-admin/rooms", icon: "🛏️" },
    { name: "Bookings", href: "/saraswat-admin/bookings", icon: "📋" },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Saraswat Admin</h1>
        <p className="text-gray-400 text-sm mt-1">Temple Management</p>
      </div>

      <nav className="flex-1 px-4 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}>
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="px-4 py-2 mb-2 text-sm text-gray-400 truncate">{user?.email || "Admin"}</div>
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
