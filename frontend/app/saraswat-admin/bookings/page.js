"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/saraswat-admin/AdminLayout";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomBookings, vehicleBookings, poojaBookings, packageBookings] = await Promise.all([
        supabase
          .from("room_bookings")
          .select("*, room:rooms(name), user:users(full_name, email)")
          .order("created_at", { ascending: false }),
        supabase
          .from("vehicle_bookings")
          .select("*, vehicle:vehicles(type, vehicle_number), user:users(full_name, email)")
          .order("created_at", { ascending: false }),
        supabase
          .from("pooja_bookings")
          .select("*, pooja:poojas(name), user:users(full_name, email)")
          .order("created_at", { ascending: false }),
        supabase
          .from("package_bookings")
          .select("*, package:packages(name), user:users(full_name, email)")
          .order("created_at", { ascending: false }),
      ]);

      const allBookings = [
        ...(roomBookings.data || []).map((b) => ({ ...b, type: "Room" })),
        ...(vehicleBookings.data || []).map((b) => ({ ...b, type: "Vehicle" })),
        ...(poojaBookings.data || []).map((b) => ({ ...b, type: "Pooja" })),
        ...(packageBookings.data || []).map((b) => ({ ...b, type: "Package" })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setBookings(allBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings =
    filterType === "all" ? bookings : bookings.filter((b) => b.type.toLowerCase() === filterType.toLowerCase());

  return (
    <AdminLayout title="Bookings Management" description="View and manage all customer bookings">
      {({ showMessage }) => (
        <>
          {/* Filter Tabs */}
          <div className="mb-6 flex space-x-2">
            {["all", "room", "vehicle", "pooja", "package"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === type ? "bg-orange-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Bookings
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booked On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
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
                            <div>{booking.user?.full_name || "N/A"}</div>
                            <div className="text-xs text-gray-500">{booking.user?.email || ""}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {booking.check_in || booking.travel_date || booking.booking_date || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{booking.total_price}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.booking_status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.booking_status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : booking.booking_status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
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
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
              <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Room Bookings</div>
              <div className="text-3xl font-bold text-blue-600">{bookings.filter((b) => b.type === "Room").length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Pooja Bookings</div>
              <div className="text-3xl font-bold text-orange-600">
                {bookings.filter((b) => b.type === "Pooja").length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Package Bookings</div>
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.type === "Package").length}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
