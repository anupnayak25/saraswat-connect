"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/saraswat-admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const { user, loading: authLoading } = useAuth();

  const bookingTabs = ["all", "room", "vehicle", "package", "trip"];
  const activeTabIndex = Math.max(0, bookingTabs.indexOf(filterType));

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [roomBookings, vehicleBookings, packageBookings, tripBookings] = await Promise.all([
        supabase
          .from("room_bookings")
          .select("*, room:rooms(name), user:users(full_name, email)")
          .order("created_at", { ascending: false }),
        supabase
          .from("vehicle_bookings")
          .select("*, vehicle:vehicles(type, vehicle_number), user:users(full_name, email)")
          .order("created_at", { ascending: false }),
        supabase
          .from("package_bookings")
          .select("*, package:packages(name), user:users(full_name, email)")
          .order("created_at", { ascending: false }),
        supabase
          .from("trip_bookings")
          .select("*, user:users(full_name, email)")
          .order("created_at", { ascending: false }),
      ]);

      const allBookings = [
        ...(roomBookings.data || []).map((b) => ({ ...b, type: "Room" })),
        ...(vehicleBookings.data || []).map((b) => ({ ...b, type: "Vehicle" })),
        ...(packageBookings.data || []).map((b) => ({ ...b, type: "Package" })),
        ...(tripBookings.data || []).map((b) => ({ ...b, type: "Trip" })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setBookings(allBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    loadData();
  }, [authLoading, user, loadData]);

  const getBookingItem = (booking) => {
    if (booking.type === "Room") return booking.room?.name || "N/A";
    if (booking.type === "Vehicle") return booking.vehicle?.type || "N/A";
    if (booking.type === "Package") return booking.package?.name || "N/A";
    if (booking.type === "Trip") {
      const startingPoint = booking.trip_data?.startingPoint?.name || booking.trip_data?.startingPoint || null;
      return startingPoint ? `Trip from ${startingPoint}` : "Trip Planner";
    }
    return "N/A";
  };

  const getBookingDate = (booking) => {
    return booking.check_in || booking.travel_date || booking.booking_date || "N/A";
  };

  const getBookingTable = (booking) => {
    if (booking.type === "Room") return "room_bookings";
    if (booking.type === "Vehicle") return "vehicle_bookings";
    if (booking.type === "Package") return "package_bookings";
    if (booking.type === "Trip") return "trip_bookings";
    return null;
  };

  const updateBookingStatus = async (booking, nextStatus, showMessage) => {
    const table = getBookingTable(booking);
    if (!table) {
      showMessage?.("error", "Unsupported booking type");
      return;
    }

    try {
      const { error } = await supabase.from(table).update({ booking_status: nextStatus }).eq("id", booking.id);
      if (error) throw error;

      setBookings((prev) => prev.map((b) => (b.id === booking.id && b.type === booking.type ? { ...b, booking_status: nextStatus } : b)));
      showMessage?.("success", `Booking ${nextStatus}`);
    } catch (err) {
      showMessage?.("error", err?.message || "Failed to update booking status");
    }
  };

  const filteredBookings =
    filterType === "all" ? bookings : bookings.filter((b) => b.type.toLowerCase() === filterType.toLowerCase());

  return (
    <AdminLayout title="Bookings Management" description="View and manage all customer bookings">
      {({ showMessage }) => (
        <>
          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-5">
                {bookingTabs.map((type) => {
                  const isActive = filterType === type;
                  const label = type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1);

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilterType(type)}
                      aria-current={isActive ? "page" : undefined}
                      className={`py-3 text-sm font-semibold transition relative ${
                        isActive ? "text-orange-700" : "text-gray-600 hover:text-gray-900"
                      }`}>
                      {label}
                    </button>
                  );
                })}
              </div>

              <div
                className="absolute bottom-0 left-0 h-0.5 bg-orange-600 transition-transform duration-300"
                style={{
                  width: `calc(100% / ${bookingTabs.length})`,
                  transform: `translateX(${activeTabIndex * 100}%)`,
                }}
              />
            </div>
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.length === 0 ? (
                      <tr>
                          <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
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
                            {getBookingItem(booking)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div>{booking.user?.full_name || "N/A"}</div>
                            <div className="text-xs text-gray-500">{booking.user?.email || ""}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {getBookingDate(booking)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{booking.total_price ?? 0}
                          </td>
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

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => updateBookingStatus(booking, "confirmed", showMessage)}
                                disabled={booking.booking_status === "confirmed"}
                                className="text-green-700 hover:text-green-900 disabled:opacity-40 disabled:cursor-not-allowed mr-4">
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => updateBookingStatus(booking, "cancelled", showMessage)}
                                disabled={booking.booking_status === "cancelled"}
                                className="text-red-700 hover:text-red-900 disabled:opacity-40 disabled:cursor-not-allowed">
                                Reject
                              </button>
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
              <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Room Bookings</div>
              <div className="text-3xl font-bold text-blue-600">{bookings.filter((b) => b.type === "Room").length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Package Bookings</div>
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.type === "Package").length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Trip Bookings</div>
              <div className="text-3xl font-bold text-purple-600">
                {bookings.filter((b) => b.type === "Trip").length}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
