"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import HotelSidebar from "@/components/HotelSidebar";
import { supabase } from "@/lib/supabase";

function HotelBookingsContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      let query = supabase
        .from("room_bookings")
        .select(
          `
          *,
          rooms (name, price),
          users (full_name)
        `,
        )
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const { error } = await supabase.from("room_bookings").update({ status }).eq("id", id);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking: " + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <HotelSidebar activePage="Room Bookings" />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Room Bookings</h1>
          <p className="text-gray-600 mt-1">Manage and process room reservations</p>
        </div>

        <div className="mb-6 flex space-x-4">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status ? "bg-orange-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{booking.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.rooms?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.number_of_guests}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{booking.total_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          booking.status,
                        )}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "confirmed")}
                            className="text-green-600 hover:text-green-900 font-medium">
                            Accept
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            className="text-red-600 hover:text-red-900 font-medium">
                            Reject
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "completed")}
                          className="text-blue-600 hover:text-blue-900 font-medium">
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HotelBookings() {
  return (
    <ProtectedRoute requiredRole="hotel">
      <HotelBookingsContent />
    </ProtectedRoute>
  );
}
