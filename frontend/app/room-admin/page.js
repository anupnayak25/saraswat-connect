"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    rooms: 0,
    vehicles: 0,
    poojas: 0,
    packages: 0,
    bookings: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [rooms, vehicles, poojas, packages, bookings, messages] = await Promise.all([
        supabase.from("rooms").select("*", { count: "exact", head: true }),
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("poojas").select("*", { count: "exact", head: true }),
        supabase.from("tour_packages").select("*", { count: "exact", head: true }),
        supabase.from("room_bookings").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        rooms: rooms.count || 0,
        vehicles: vehicles.count || 0,
        poojas: poojas.count || 0,
        packages: packages.count || 0,
        bookings: bookings.count || 0,
        messages: messages.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Rooms", value: stats.rooms, icon: "🛏️", color: "bg-blue-500" },
    { title: "Total Vehicles", value: stats.vehicles, icon: "🚗", color: "bg-green-500" },
    { title: "Total Poojas", value: stats.poojas, icon: "🪔", color: "bg-orange-500" },
    { title: "Tour Packages", value: stats.packages, icon: "📍", color: "bg-purple-500" },
    { title: "Total Bookings", value: stats.bookings, icon: "📋", color: "bg-red-500" },
    { title: "Messages", value: stats.messages, icon: "💬", color: "bg-yellow-500" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activePage="Dashboard" />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your system.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat) => (
              <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
