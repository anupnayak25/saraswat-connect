"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const formatDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
};

const formatMoney = (value) => `₹ ${Number(value ?? 0).toLocaleString()}`;

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [roomBookings, setRoomBookings] = useState([]);
  const [vehicleBookings, setVehicleBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [tripBookings, setTripBookings] = useState([]);

  useEffect(() => {
    let cancelled = false;

    if (authLoading) return;

    if (!user) {
      setLoading(false);
      setLoadError(false);
      return;
    }

    setLoading(true);
    setLoadError(false);

    (async () => {
      try {
        const [roomResult, vehicleResult, packageResult, tripResult] = await Promise.all([
          supabase
            .from("room_bookings")
            .select(
              "id, check_in, check_out, number_of_guests, total_price, booking_status, created_at, room:rooms(id, name, price_per_night, place:places(name))",
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("vehicle_bookings")
            .select(
              "id, travel_date, distance_km, pickup_location, drop_location, total_price, booking_status, created_at, vehicle:vehicles(id, type, price_per_km)",
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("package_bookings")
            .select(
              "id, booking_date, number_of_travelers, total_price, booking_status, created_at, package:packages(id, name, duration_days)",
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("trip_bookings")
            .select("id, travel_date, total_price, booking_status, created_at, trip_data")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (roomResult.error || vehicleResult.error || packageResult.error || tripResult.error) {
          throw roomResult.error || vehicleResult.error || packageResult.error || tripResult.error;
        }

        if (cancelled) return;

        setRoomBookings(roomResult.data || []);
        setVehicleBookings(vehicleResult.data || []);
        setPackageBookings(packageResult.data || []);
        setTripBookings(tripResult.data || []);
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">My Bookings</h1>
          <p className="text-stone-600">View your room, vehicle, package, and trip bookings</p>
        </div>

        {authLoading || loading ? (
          <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">Loading bookings...</div>
        ) : !user ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            Please <Link href="/login" className="text-teal-700 underline">sign in</Link> to view your bookings.
          </div>
        ) : loadError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Unable to load bookings right now. Please try again.
          </div>
        ) : (
          <div className="space-y-8">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Room Bookings</h2>
              {roomBookings.length === 0 ? (
                <p className="text-sm text-stone-500">No room bookings yet.</p>
              ) : (
                <div className="space-y-4">
                  {roomBookings.map((booking) => (
                    <div key={booking.id} className="border border-stone-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-stone-800">
                            {booking.room?.name || "Room"} · {booking.room?.place?.name || ""}
                          </p>
                          <p className="text-sm text-stone-600">
                            {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                          </p>
                          <p className="text-sm text-stone-600">Guests: {booking.number_of_guests || "—"}</p>
                        </div>
                        <div className="mt-3 md:mt-0 text-right">
                          <p className="font-semibold text-teal-600">{formatMoney(booking.total_price)}</p>
                          <p className="text-xs text-stone-500">Status: {booking.booking_status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Vehicle Bookings</h2>
              {vehicleBookings.length === 0 ? (
                <p className="text-sm text-stone-500">No vehicle bookings yet.</p>
              ) : (
                <div className="space-y-4">
                  {vehicleBookings.map((booking) => (
                    <div key={booking.id} className="border border-stone-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-stone-800">{booking.vehicle?.type || "Vehicle"}</p>
                          <p className="text-sm text-stone-600">
                            {booking.pickup_location} {" -> "} {booking.drop_location}
                          </p>
                          <p className="text-sm text-stone-600">
                            Travel Date: {formatDate(booking.travel_date)} · Distance: {booking.distance_km || "—"} km
                          </p>
                        </div>
                        <div className="mt-3 md:mt-0 text-right">
                          <p className="font-semibold text-teal-600">{formatMoney(booking.total_price)}</p>
                          <p className="text-xs text-stone-500">Status: {booking.booking_status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Package Bookings</h2>
              {packageBookings.length === 0 ? (
                <p className="text-sm text-stone-500">No package bookings yet.</p>
              ) : (
                <div className="space-y-4">
                  {packageBookings.map((booking) => (
                    <div key={booking.id} className="border border-stone-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-stone-800">{booking.package?.name || "Package"}</p>
                          <p className="text-sm text-stone-600">Booking Date: {formatDate(booking.booking_date)}</p>
                          <p className="text-sm text-stone-600">Travelers: {booking.number_of_travelers}</p>
                        </div>
                        <div className="mt-3 md:mt-0 text-right">
                          <p className="font-semibold text-teal-600">{formatMoney(booking.total_price)}</p>
                          <p className="text-xs text-stone-500">Status: {booking.booking_status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Trip Planner Bookings</h2>
              {tripBookings.length === 0 ? (
                <p className="text-sm text-stone-500">No trip bookings yet.</p>
              ) : (
                <div className="space-y-4">
                  {tripBookings.map((booking) => {
                    const route = Array.isArray(booking.trip_data?.optimizedRoute)
                      ? booking.trip_data.optimizedRoute
                      : [];
                    const routeNames = route.map((stop) => stop?.name).filter(Boolean);
                    const routePreview = routeNames.slice(0, 4).join(" -> ");

                    return (
                      <div key={booking.id} className="border border-stone-200 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-semibold text-stone-800">
                              {booking.trip_data?.startingPoint?.name || "Trip"}
                            </p>
                            <p className="text-sm text-stone-600">
                              {routePreview || "Route details saved"}
                              {routeNames.length > 4 ? " ..." : ""}
                            </p>
                            <p className="text-sm text-stone-600">
                              Travel Date: {formatDate(booking.travel_date || booking.trip_data?.travelDate)}
                            </p>
                          </div>
                          <div className="mt-3 md:mt-0 text-right">
                            <p className="font-semibold text-teal-600">{formatMoney(booking.total_price)}</p>
                            <p className="text-xs text-stone-500">Status: {booking.booking_status}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
