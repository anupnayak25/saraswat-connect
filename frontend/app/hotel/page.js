"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import HotelSidebar from "@/components/HotelSidebar";
import { supabase } from "@/lib/supabase";

function HotelDashboardContent() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: bookings, error } = await supabase.from("room_bookings").select("status");

      if (error) throw error;

      const stats = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        completed: bookings.filter((b) => b.status === "completed").length,
      };

      setStats(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Bookings", value: stats.total, icon: "📊", color: "bg-blue-500" },
    { title: "Pending", value: stats.pending, icon: "⏳", color: "bg-yellow-500" },
    { title: "Confirmed", value: stats.confirmed, icon: "✅", color: "bg-green-500" },
    { title: "Completed", value: stats.completed, icon: "🎉", color: "bg-purple-500" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <HotelSidebar activePage="Dashboard" />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hotel Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your room bookings efficiently</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default function HotelDashboard() {
  return (
    <ProtectedRoute requiredRole="hotel">
      <HotelDashboardContent />
    </ProtectedRoute>
  );
}
