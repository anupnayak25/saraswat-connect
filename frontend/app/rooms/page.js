/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ToastProvider";
import { payWithRazorpay } from "@/lib/razorpay";

const FALLBACK_ROOM_IMAGE = "/assets/room.png";

export default function RoomBooking() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { alert } = useToast();

  const [places, setPlaces] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("postAuthRedirect");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed?.path !== "/rooms") return;
      const state = parsed.state || {};
      setSelectedPlaceId(state.selectedPlaceId || "");
      setCheckInDate(state.checkInDate || "");
      setCheckOutDate(state.checkOutDate || "");
      if (state.guests != null) {
        setGuests(Number(state.guests) || 1);
      }
      sessionStorage.removeItem("postAuthRedirect");
    } catch {
      sessionStorage.removeItem("postAuthRedirect");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const [placesResult, roomsResult] = await Promise.all([
          supabase.from("places").select("id, name").order("name", { ascending: true }),
          supabase
            .from("rooms")
            .select(
              "id, name, type, place_id, contact, price_per_night, availability_status, max_guests, amenities, image_url, place:places(name)",
            )
            .order("created_at", { ascending: false }),
        ]);

        if (placesResult.error) throw placesResult.error;
        if (roomsResult.error) throw roomsResult.error;

        if (!cancelled) {
          setPlaces(placesResult.data || []);
          setRooms(roomsResult.data || []);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load rooms");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRooms = useMemo(() => {
    if (!selectedPlaceId) return [];
    const guestCount = Number(guests) || 1;

    return rooms
      .filter((r) => r.place_id === selectedPlaceId)
      .filter((r) => !r.availability_status || r.availability_status === "available")
      .filter((r) => r.max_guests == null || r.max_guests >= guestCount);
  }, [rooms, selectedPlaceId, guests]);

  const handleBookRoom = async (room) => {
    if (authLoading) return;

    if (!user) {
      if (typeof window !== "undefined") {
        const redirectPayload = {
          path: "/rooms",
          state: {
            selectedPlaceId,
            checkInDate,
            checkOutDate,
            guests,
          },
        };
        sessionStorage.setItem("postAuthRedirect", JSON.stringify(redirectPayload));
      }
      router.push(`/login?redirect=${encodeURIComponent("/rooms")}`);
      return;
    }

    if (!selectedPlaceId) {
      await alert("Please select a location first.", { variant: "warning" });
      return;
    }

    if (!checkInDate || !checkOutDate) {
      await alert("Please select check-in and check-out dates.", { variant: "warning" });
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (!(checkIn instanceof Date) || Number.isNaN(checkIn.getTime())) {
      await alert("Invalid check-in date.", { variant: "warning" });
      return;
    }
    if (!(checkOut instanceof Date) || Number.isNaN(checkOut.getTime())) {
      await alert("Invalid check-out date.", { variant: "warning" });
      return;
    }
    if (checkOut <= checkIn) {
      await alert("Check-out date must be after check-in date.", { variant: "warning" });
      return;
    }

    const guestCount = Math.max(1, Number(guests) || 1);
    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay);
    const pricePerNight = Number(room.price_per_night ?? 0);
    const totalPrice = Number.isFinite(pricePerNight) ? nights * pricePerNight : 0;

    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      await alert("Room price is unavailable. Please try another room.", { variant: "warning" });
      return;
    }

    setBookingSubmitting(true);
    try {
      await payWithRazorpay({
        amount: totalPrice * 100,
        name: "Saraswat Connect",
        description: "Room booking",
        prefill: {
          name: user?.full_name || user?.email || "Guest",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        notes: {
          booking_type: "room",
          room_id: room.id,
        },
        theme: {
          color: "#0f766e",
        },
      });

      const { error: insertError } = await supabase.from("room_bookings").insert([
        {
          room_id: room.id,
          user_id: user.id,
          check_in: checkInDate,
          check_out: checkOutDate,
          number_of_guests: guestCount,
          total_price: totalPrice,
          booking_status: "pending",
        },
      ]);

      if (insertError) throw insertError;
      await alert("Booking created. Status: pending", { variant: "success" });
      router.push("/bookings");
    } catch (e) {
      await alert(e?.message || "Failed to create booking", { variant: "error" });
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
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Room Booking</h1>
          <p className="text-stone-600">Book comfortable temple rooms for your stay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-stone-800 mb-6">Search Rooms</h2>

              <div className="space-y-4">
                {/* Location Selection */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Select Location</label>
                  <select
                    value={selectedPlaceId}
                    onChange={(e) => setSelectedPlaceId(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">-- Choose a location --</option>
                    {places.map((place) => (
                      <option key={place.id} value={place.id}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6+ Guests</option>
                  </select>
                </div>

                {/* Search Button */}
                <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition">
                  Search Rooms
                </button>
              </div>
            </div>
          </div>

          {/* Room Options */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Room Options</h2>

            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-stone-600 text-lg">Loading rooms...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : !selectedPlaceId ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-stone-600 text-lg">Please select a location to view available rooms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                      {/* Room Image */}
                      <div className="h-48 overflow-hidden bg-stone-100">
                        <img
                          src={room.image_url || FALLBACK_ROOM_IMAGE}
                          alt={room.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_ROOM_IMAGE;
                          }}
                        />
                      </div>

                      {/* Room Details */}
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-stone-800 mb-2">{room.name}</h3>
                        <p className="text-sm text-teal-600 mb-2 font-medium">{room.place?.name || ""}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-teal-600">
                            ₹ {Number(room.price_per_night ?? 0)}
                          </span>
                          <span className="text-sm text-stone-600">/ Night</span>
                        </div>
                        <div className="flex items-center text-sm text-stone-600 mb-4">
                          <span>{room.max_guests ? `${room.max_guests} Guests` : "Guests: —"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleBookRoom(room)}
                          disabled={bookingSubmitting}
                          className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-60">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-stone-600 text-lg">No rooms available for this location</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
