"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ToastProvider";

export default function VehicleBooking() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { alert } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("postAuthRedirect");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed?.path !== "/vehicles") return;
      const state = parsed.state || {};
      setSelectedDate(state.selectedDate || "");
      setPickupLocation(state.pickupLocation || "");
      setDropLocation(state.dropLocation || "");
      setDistanceKm(state.distanceKm || "");
      sessionStorage.removeItem("postAuthRedirect");
    } catch {
      sessionStorage.removeItem("postAuthRedirect");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setLoadError(false);

    (async () => {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("id, type, capacity, price_per_km, image_url, availability_status")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        const normalized = (data || []).map((vehicle) => ({
          id: vehicle.id,
          name: vehicle.type,
          price: Number(vehicle.price_per_km ?? 0),
          image: vehicle.image_url ?? null,
          capacity: vehicle.capacity ?? 0,
          availability: vehicle.availability_status ?? "available",
        }));

        setVehicles(normalized);
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBookVehicle = async (vehicle) => {
    if (authLoading) return;

    if (!user) {
      if (typeof window !== "undefined") {
        const redirectPayload = {
          path: "/vehicles",
          state: {
            selectedDate,
            pickupLocation,
            dropLocation,
            distanceKm,
          },
        };
        sessionStorage.setItem("postAuthRedirect", JSON.stringify(redirectPayload));
      }
      router.push(`/login?redirect=${encodeURIComponent("/vehicles")}`);
      return;
    }

    if (!selectedDate) {
      await alert("Please select a travel date.", { variant: "warning" });
      return;
    }

    if (!pickupLocation || !dropLocation) {
      await alert("Please select pickup and drop locations.", { variant: "warning" });
      return;
    }

    const parsedDistance = Number(distanceKm);
    if (!Number.isFinite(parsedDistance) || parsedDistance <= 0) {
      await alert("Please enter a valid distance in km.", { variant: "warning" });
      return;
    }

    const pricePerKm = Number(vehicle.price ?? 0);
    const totalPrice = Number.isFinite(pricePerKm) ? parsedDistance * pricePerKm : 0;

    setBookingSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("vehicle_bookings").insert([
        {
          vehicle_id: vehicle.id,
          user_id: user.id,
          travel_date: selectedDate,
          distance_km: parsedDistance,
          pickup_location: pickupLocation,
          drop_location: dropLocation,
          total_price: totalPrice,
          booking_status: "pending",
        },
      ]);

      if (insertError) throw insertError;
      await alert("Vehicle booking created. Status: pending", { variant: "success" });
      router.push("/bookings");
    } catch (e) {
      await alert(e?.message || "Failed to create vehicle booking", { variant: "error" });
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Vehicle Booking</h1>
          <p className="text-stone-600">Rent cars and buses for your spiritual journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-stone-800 mb-6">Search Vehicles</h2>

              <div className="space-y-4">
                {/* Select Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Location</option>
                    <option value="temple">Temple Entrance</option>
                    <option value="station">Railway Station</option>
                    <option value="airport">Airport</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>

                {/* Drop Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drop Location</label>
                  <select
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Location</option>
                    <option value="temple">Temple Entrance</option>
                    <option value="station">Railway Station</option>
                    <option value="airport">Airport</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                  <input
                    type="number"
                    min="1"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 120"
                  />
                </div>

                {/* Search Button */}
                <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition">
                  Search Vehicles
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Options */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Vehicle Options</h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              </div>
            ) : loadError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Unable to load vehicles right now. Please try again.
              </div>
            ) : vehicles.length === 0 ? (
              <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-600">
                No vehicles available at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                    {/* Vehicle Image */}
                    <div className="h-48 bg-linear-to-br from-teal-200 to-teal-400 flex items-center justify-center">
                      {vehicle.image ? (
                        <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-stone-500">Vehicle Image</span>
                      )}
                    </div>

                    {/* Vehicle Details */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-stone-800 mb-2">{vehicle.name}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-teal-600">₹ {vehicle.price}</span>
                        <span className="text-sm text-stone-600">per Km</span>
                      </div>
                      <div className="flex items-center text-sm text-stone-600 mb-4">
                        <span>{vehicle.capacity} Capacity</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBookVehicle(vehicle)}
                        disabled={bookingSubmitting}
                        className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-60">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
