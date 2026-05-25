"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ToastProvider";
import { payWithRazorpay } from "@/lib/razorpay";

const DEFAULT_HIGHLIGHTS = ["Temple visits", "Guided tours", "Accommodation", "Meals included"];

export default function TourPackages() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { alert } = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("postAuthRedirect");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed?.path !== "/packages") return;
      const state = parsed.state || {};
      setBookingDate(state.bookingDate || "");
      if (state.travelers != null) {
        setTravelers(Number(state.travelers) || 1);
      }
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
          .from("packages")
          .select("id, name, duration_days, price, description, highlights, image_url, is_available")
          .eq("is_available", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        const normalized = (data || []).map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          days: Number(pkg.duration_days ?? 0),
          price: Number(pkg.price ?? 0),
          description: pkg.description ?? "",
          highlights: Array.isArray(pkg.highlights) && pkg.highlights.length > 0 ? pkg.highlights : DEFAULT_HIGHLIGHTS,
          image: pkg.image_url ?? null,
          isAvailable: pkg.is_available ?? true,
        }));

        setPackages(normalized);
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

  const handleBookPackage = async (pkg) => {
    if (authLoading) return;

    if (!user) {
      if (typeof window !== "undefined") {
        const redirectPayload = {
          path: "/packages",
          state: {
            bookingDate,
            travelers,
          },
        };
        sessionStorage.setItem("postAuthRedirect", JSON.stringify(redirectPayload));
      }
      router.push(`/login?redirect=${encodeURIComponent("/packages")}`);
      return;
    }

    if (!bookingDate) {
      await alert("Please select a booking date.", { variant: "warning" });
      return;
    }

    const travelerCount = Math.max(1, Number(travelers) || 1);
    const totalPrice = Number(pkg.price ?? 0) * travelerCount;

    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      await alert("Package price is unavailable. Please try another package.", { variant: "warning" });
      return;
    }

    setBookingSubmitting(true);
    try {
      await payWithRazorpay({
        amount: totalPrice * 100,
        name: "Saraswat Connect",
        description: "Package booking",
        prefill: {
          name: user?.full_name || user?.email || "Guest",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        notes: {
          booking_type: "package",
          package_id: pkg.id,
        },
        theme: {
          color: "#0f766e",
        },
      });

      const { error: insertError } = await supabase.from("package_bookings").insert([
        {
          package_id: pkg.id,
          user_id: user.id,
          booking_date: bookingDate,
          number_of_travelers: travelerCount,
          total_price: totalPrice,
          booking_status: "pending",
        },
      ]);

      if (insertError) throw insertError;
      await alert("Package booking created. Status: pending", { variant: "success" });
      router.push("/bookings");
    } catch (e) {
      await alert(e?.message || "Failed to create package booking", { variant: "error" });
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
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Tour Packages</h1>
          <p className="text-stone-600">Explore divine temple tours and spiritual journeys</p>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Booking Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Booking Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Travelers</label>
              <input
                type="number"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end text-sm text-stone-500">
              Select a date and traveler count before booking any package.
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">Loading packages...</div>
        ) : loadError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Unable to load packages right now. Please try again.
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
            No packages available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                {/* Package Image */}
                <div className="h-56 bg-linear-to-br from-teal-200 to-teal-400 flex items-center justify-center relative">
                  {pkg.image ? (
                    <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-stone-500">Package Image</span>
                  )}
                </div>

                {/* Package Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{pkg.days} Days</p>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-stone-700 mb-2">Package Highlights:</p>
                    <ul className="space-y-1">
                      {pkg.highlights.map((highlight, index) => (
                        <li key={index} className="text-sm text-stone-600 flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-stone-600">From</p>
                      <p className="text-2xl font-bold text-teal-600">₹ {pkg.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookPackage(pkg)}
                    disabled={bookingSubmitting}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-60">
                    Book Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Why Choose Our Tour Packages?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🏨</div>
              <h3 className="font-bold text-stone-800 mb-2">Comfortable Stay</h3>
              <p className="text-sm text-stone-600">Quality accommodations near temples</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚐</div>
              <h3 className="font-bold text-stone-800 mb-2">Easy Transport</h3>
              <p className="text-sm text-stone-600">Hassle-free travel arrangements</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="font-bold text-stone-800 mb-2">Expert Guides</h3>
              <p className="text-sm text-stone-600">Knowledgeable guides for spiritual insights</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
