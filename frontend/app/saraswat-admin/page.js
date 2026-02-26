"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AdminLayout from "@/components/saraswat-admin/AdminLayout";

export default function SaraswatAdminDashboard() {
  const [stats, setStats] = useState({
    poojas: 0,
    places: 0,
    packages: 0,
    rooms: 0,
    totalBookings: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        poojasCount,
        placesCount,
        packagesCount,
        roomsCount,
        roomBookings,
        vehicleBookings,
        poojaBookings,
        packageBookings,
      ] = await Promise.all([
        supabase.from("poojas").select("id", { count: "exact", head: true }),
        supabase.from("places").select("id", { count: "exact", head: true }),
        supabase.from("packages").select("id", { count: "exact", head: true }),
        supabase.from("rooms").select("id", { count: "exact", head: true }),
        supabase
          .from("room_bookings")
          .select("*, room:rooms(name), user:users(full_name, email)")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("vehicle_bookings")
          .select("*, vehicle:vehicles(type), user:users(full_name, email)")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("pooja_bookings")
          .select("*, pooja:poojas(name), user:users(full_name, email)")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("package_bookings")
          .select("*, package:packages(name), user:users(full_name, email)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const allRecentBookings = [
        ...(roomBookings.data || []).map((b) => ({ ...b, type: "Room" })),
        ...(vehicleBookings.data || []).map((b) => ({ ...b, type: "Vehicle" })),
        ...(poojaBookings.data || []).map((b) => ({ ...b, type: "Pooja" })),
        ...(packageBookings.data || []).map((b) => ({ ...b, type: "Package" })),
      ]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);

      setStats({
        poojas: poojasCount.count || 0,
        places: placesCount.count || 0,
        packages: packagesCount.count || 0,
        rooms: roomsCount.count || 0,
        totalBookings:
          (roomBookings.count || 0) +
          (vehicleBookings.count || 0) +
          (poojaBookings.count || 0) +
          (packageBookings.count || 0),
        recentBookings: allRecentBookings,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { name: "Manage Poojas", href: "/saraswat-admin/poojas", icon: "🪔", color: "bg-orange-500" },
    { name: "Manage Places", href: "/saraswat-admin/places", icon: "📍", color: "bg-blue-500" },
    { name: "Manage Packages", href: "/saraswat-admin/packages", icon: "📦", color: "bg-green-500" },
    { name: "Manage Rooms", href: "/saraswat-admin/rooms", icon: "🛏️", color: "bg-purple-500" },
    { name: "View Bookings", href: "/saraswat-admin/bookings", icon: "📋", color: "bg-indigo-500" },
  ];

  return (
    <AdminLayout title="Dashboard" description="Overview of your temple management system">
      {() => (
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Poojas</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.poojas}</p>
                    </div>
                    <div className="text-4xl">🪔</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Places</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.places}</p>
                    </div>
                    <div className="text-4xl">📍</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Packages</p>
                      <p className="text-3xl font-bold text-green-600">{stats.packages}</p>
                    </div>
                    <div className="text-4xl">📦</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Rooms</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.rooms}</p>
                    </div>
                    <div className="text-4xl">🛏️</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                      <p className="text-3xl font-bold text-indigo-600">{stats.totalBookings}</p>
                    </div>
                    <div className="text-4xl">📋</div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`${link.color} text-white rounded-lg shadow p-6 hover:opacity-90 transition`}>
                      <div className="text-3xl mb-2">{link.icon}</div>
                      <div className="font-medium">{link.name}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentBookings.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            No recent bookings
                          </td>
                        </tr>
                      ) : (
                        stats.recentBookings.map((booking) => (
                          <tr key={`${booking.type}-${booking.id}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {booking.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.room?.name ||
                                booking.vehicle?.type ||
                                booking.pooja?.name ||
                                booking.package?.name ||
                                "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {booking.user?.full_name || booking.user?.email || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.booking_status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.booking_status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}>
                                {booking.booking_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {stats.recentBookings.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200 text-center">
                    <Link href="/saraswat-admin/bookings" className="text-orange-600 hover:text-orange-700 font-medium">
                      View All Bookings →
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </AdminLayout>
  );
}
