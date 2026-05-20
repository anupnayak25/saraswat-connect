// API service for Trip Planner backend calls
//
// NOTE: This project uses Supabase with public SELECT policies for:
// - places
// - rooms
// - tourist_places

import { supabase } from "@/lib/supabase";

function toPlace(row) {
  return {
    id: row.id,
    name: row.name,
  };
}

function toHotel(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.place?.name ?? "",
    rating: null,
    price: Number(row.price_per_night ?? 0),
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    image_url: row.image_url ?? null,
  };
}

function toAttraction(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.place?.name ?? "",
    type: row.type ?? "attraction",
    rating: null,
    entryFee: Number(row.entry_fee ?? 0),
    image_url: row.image_url ?? null,
  };
}

function toTouristPlace(row) {
  return {
    id: row.id,
    name: row.name,
    placeId: row.place_id ?? null,
  };
}

function shuffleList(list) {
  const copy = Array.isArray(list) ? [...list] : [];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const tripPlannerAPI = {
  // Search locations with autocomplete
  searchLocations: async (query) => {
    const q = String(query ?? "").trim();
    if (!q) return [];

    const { data, error } = await supabase
      .from("places")
      .select("id, name")
      .ilike("name", `%${q}%`)
      .order("name", { ascending: true })
      .limit(10);

    if (error) throw error;
    return (data || []).map(toPlace);
  },

  // Get popular locations
  getPopularLocations: async () => {
    const { data, error } = await supabase
      .from("places")
      .select("id, name")
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) throw error;
    return (data || []).map(toPlace);
  },

  // Get tourist places for a starting location
  getNearbyTouristPlaces: async (placeId, limit = 12) => {
    const id = String(placeId ?? "").trim();
    if (!id) return [];

    const { data, error } = await supabase
      .from("tourist_places")
      .select("id, name, place_id")
      .eq("place_id", id)
      .order("name", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(toTouristPlace);
  },

  // Get a randomized list of tourist places
  getRandomTouristPlaces: async (limit = 12) => {
    const { data, error } = await supabase
      .from("tourist_places")
      .select("id, name, place_id")
      .limit(Math.max(limit * 4, 24));

    if (error) throw error;
    return shuffleList((data || []).map(toTouristPlace)).slice(0, limit);
  },

  // Optimize route based on starting point and destinations
  optimizeRoute: async (startingPoint, destinations) => {
    return {
      optimizedOrder: [startingPoint, ...destinations],
      totalDistance: 0,
      estimatedDuration: 0,
    };
  },

  // Get recommendations near route
  getRecommendations: async (route) => {
    const placeIds = (Array.isArray(route) ? route : [])
      .map((p) => p?.id)
      .filter((id) => typeof id === "string" && id.length > 0);

    if (placeIds.length === 0) {
      return { hotels: [], restaurants: [], attractions: [] };
    }

    const [roomsResult, attractionsResult] = await Promise.all([
      supabase
        .from("rooms")
        .select("id, name, type, place_id, price_per_night, amenities, image_url, place:places(name)")
        .in("place_id", placeIds)
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("tourist_places")
        .select("id, name, type, place_id, entry_fee, image_url, place:places(name)")
        .in("place_id", placeIds)
        .order("created_at", { ascending: false })
        .limit(60),
    ]);

    if (roomsResult.error) throw roomsResult.error;
    if (attractionsResult.error) throw attractionsResult.error;

    return {
      hotels: (roomsResult.data || []).map(toHotel),
      restaurants: [],
      attractions: (attractionsResult.data || []).map(toAttraction),
    };
  },

  // Get available vehicles and agencies
  getVehiclesAndAgencies: async (tripDetails) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      vehicles: [
        {
          id: "bike",
          name: "Bike",
          seats: 2,
          pricePerKm: 8,
          image: "/assets/bike.jpg",
        },
        {
          id: "car",
          name: "Car (Sedan)",
          seats: 4,
          pricePerKm: 12,
          image: "/assets/sedan.jpg",
        },
        {
          id: "suv",
          name: "SUV",
          seats: 7,
          pricePerKm: 18,
          image: "/assets/suv.jpg",
        },
        {
          id: "bus",
          name: "Mini Bus",
          seats: 18,
          pricePerKm: 25,
          image: "/assets/mini-bus.jpg",
        },
      ],
      agencies: [
        {
          id: 1,
          name: "Saraswath Connect Tours",
          rating: 4.8,
          vehicleTypes: ["bike", "car", "suv", "bus"],
          surcharge: 0,
        },
        {
          id: 2,
          name: "Temple Travels",
          rating: 4.5,
          vehicleTypes: ["car", "suv"],
          surcharge: 200,
        },
        {
          id: 3,
          name: "Coastal Cabs",
          rating: 4.3,
          vehicleTypes: ["bike", "car"],
          surcharge: 150,
        },
      ],
    };
  },

  // Calculate total cost
  calculateCost: async (tripData) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const { optimizedRoute, vehicleType, seats, travelAgency, selectedHotels } = tripData;

    // Mock calculation
    const distance = 250; // km
    const vehicleCost = distance * (vehicleType?.pricePerKm || 12);
    const hotelCost = selectedHotels.reduce((sum, hotel) => sum + hotel.price, 0);
    const agencySurcharge = travelAgency?.surcharge || 0;

    return {
      vehicleCost,
      hotelCost,
      agencySurcharge,
      taxes: (vehicleCost + hotelCost) * 0.18, // 18% GST
      total: vehicleCost + hotelCost + agencySurcharge + (vehicleCost + hotelCost) * 0.18,
    };
  },

  // Submit booking
  submitBooking: async (tripData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock submission
    return {
      bookingId: `TRP${Date.now()}`,
      status: "confirmed",
      message: "Your trip has been booked successfully!",
    };
  },
};
