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
    rating: row.rating ?? null,
    price: Number(row.price_per_night ?? 0),
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    image_url: row.image_url ?? null,
  };
}

function toStay(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.place?.name ?? "",
    type: row.type ?? "stay",
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

const OSRM_BASE_URL = "https://router.project-osrm.org";
const GEOCODE_ENDPOINT = "/api/geocode";

async function geocodePlace(name, cache) {
  const query = String(name ?? "").trim();
  if (!query) return null;
  if (cache.has(query)) return cache.get(query);

  try {
    const response = await fetch(`${GEOCODE_ENDPOINT}?q=${encodeURIComponent(query)}&limit=1`);

    if (!response.ok) {
      cache.set(query, null);
      return null;
    }

    const data = await response.json();
    const first = Array.isArray(data) ? data[0] : null;
    if (!first) {
      cache.set(query, null);
      return null;
    }

    const coords = {
      lat: Number(first.lat),
      lng: Number(first.lon),
    };

    cache.set(query, coords);
    return coords;
  } catch {
    cache.set(query, null);
    return null;
  }
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

  // Get places by ids
  getPlacesByIds: async (placeIds) => {
    const ids = (Array.isArray(placeIds) ? placeIds : []).filter((id) => typeof id === "string" && id.length > 0);
    if (ids.length === 0) return [];

    const { data, error } = await supabase.from("places").select("id, name, nearby_places").in("id", ids);

    if (error) throw error;
    return data || [];
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

  // Get tourist places for a list of place ids
  getTouristPlacesByPlaceIds: async (placeIds, limit = 24) => {
    const ids = (Array.isArray(placeIds) ? placeIds : []).filter((id) => typeof id === "string" && id.length > 0);
    if (ids.length === 0) return [];

    const { data, error } = await supabase
      .from("tourist_places")
      .select("id, name, place_id")
      .in("place_id", ids)
      .order("name", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(toTouristPlace);
  },

  // Optimize route based on starting point and destinations
  optimizeRoute: async (startingPoint, destinations) => {
    const routeStops = [startingPoint, ...(Array.isArray(destinations) ? destinations : [])].filter(Boolean);
    const geocodeCache = new Map();
    const resolvedStops = [];
    const coordinates = [];
    const placeIds = routeStops
      .map((stop) => stop?.placeId)
      .filter((id) => typeof id === "string" && id.length > 0);
    const uniquePlaceIds = [...new Set(placeIds)];
    const placeNameMap = new Map();

    if (uniquePlaceIds.length > 0) {
      const { data, error } = await supabase.from("places").select("id, name").in("id", uniquePlaceIds);
      if (!error && Array.isArray(data)) {
        data.forEach((row) => {
          placeNameMap.set(row.id, row.name);
        });
      }
    }

    for (const stop of routeStops) {
      const placeName = stop?.placeId ? placeNameMap.get(stop.placeId) : null;
      let coords = await geocodePlace(stop?.name, geocodeCache);

      if (!coords && placeName) {
        coords = await geocodePlace(`${stop?.name}, ${placeName}`, geocodeCache);
      }

      if (!coords && placeName) {
        coords = await geocodePlace(placeName, geocodeCache);
      }

      if (coords) {
        coordinates.push([coords.lng, coords.lat]);
        resolvedStops.push({ ...stop, coordinates: coords });
      } else {
        resolvedStops.push(stop);
      }
    }

    if (coordinates.length < 2) {
      return {
        optimizedOrder: resolvedStops,
        routeGeometry: null,
        totalDistance: 0,
        estimatedDuration: 0,
      };
    }

    const coordString = coordinates.map((coord) => coord.join(",")).join(";");
    const osrmResponse = await fetch(
      `${OSRM_BASE_URL}/route/v1/driving/${coordString}?overview=full&geometries=geojson`,
    );

    if (!osrmResponse.ok) {
      return {
        optimizedOrder: resolvedStops,
        routeGeometry: null,
        totalDistance: 0,
        estimatedDuration: 0,
      };
    }

    const osrmData = await osrmResponse.json();
    const route = Array.isArray(osrmData?.routes) ? osrmData.routes[0] : null;

    return {
      optimizedOrder: resolvedStops,
      routeGeometry: route?.geometry ?? null,
      totalDistance: route?.distance ? route.distance / 1000 : 0,
      estimatedDuration: route?.duration ? route.duration / 3600 : 0,
    };
  },

  // Get recommendations near route
  getRecommendations: async (route) => {
    const placeIds = (Array.isArray(route) ? route : [])
      .map((p) => p?.placeId || p?.id)
      .filter((id) => typeof id === "string" && id.length > 0);

    const uniquePlaceIds = [...new Set(placeIds)];

    if (uniquePlaceIds.length === 0) {
      return { hotels: [], stays: [], attractions: [] };
    }

    const [hotelsResult, staysResult, attractionsResult] = await Promise.all([
      supabase
        .from("hotels")
        .select("id, name, place_id, price_per_night, rating, amenities, image_url, place:places(name)")
        .in("place_id", uniquePlaceIds)
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("rooms")
        .select("id, name, type, place_id, price_per_night, amenities, image_url, place:places(name)")
        .in("place_id", uniquePlaceIds)
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("tourist_places")
        .select("id, name, type, place_id, entry_fee, image_url, place:places(name)")
        .in("place_id", uniquePlaceIds)
        .order("created_at", { ascending: false })
        .limit(60),
    ]);

    if (hotelsResult.error) throw hotelsResult.error;
    if (staysResult.error) throw staysResult.error;
    if (attractionsResult.error) throw attractionsResult.error;

    return {
      hotels: (hotelsResult.data || []).map(toHotel),
      stays: (staysResult.data || []).map(toStay),
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

    const { optimizedRoute, vehicleType, seats, travelAgency, selectedHotels, selectedStays } = tripData;

    // Mock calculation
    const distance = 250; // km
    const vehicleCost = distance * (vehicleType?.pricePerKm || 12);
    const hotelCost = selectedHotels.reduce((sum, hotel) => sum + hotel.price, 0);
    const stayCost = selectedStays.reduce((sum, stay) => sum + stay.price, 0);
    const agencySurcharge = travelAgency?.surcharge || 0;

    const subtotal = vehicleCost + hotelCost + stayCost + agencySurcharge;

    return {
      vehicleCost,
      hotelCost,
      stayCost,
      agencySurcharge,
      taxes: subtotal * 0.18, // 18% GST
      total: subtotal + subtotal * 0.18,
    };
  },

  // Submit booking
  submitBooking: async (tripData, userId, totalPrice) => {
    if (!userId) {
      return {
        bookingId: null,
        status: "failed",
        message: "Please sign in to book your trip.",
      };
    }

    const travelDate = tripData?.travelDate || new Date().toISOString().slice(0, 10);
    const payload = {
      user_id: userId,
      travel_date: travelDate,
      total_price: Number(totalPrice ?? 0),
      booking_status: "pending",
      trip_data: {
        startingPoint: tripData?.startingPoint ?? null,
        destinations: tripData?.destinations ?? [],
        optimizedRoute: tripData?.optimizedRoute ?? [],
        travelDate: tripData?.travelDate || "",
        selectedHotels: tripData?.selectedHotels ?? [],
        selectedStays: tripData?.selectedStays ?? [],
        selectedAttractions: tripData?.selectedAttractions ?? [],
        vehicleType: tripData?.vehicleType ?? null,
        travelAgency: tripData?.travelAgency ?? null,
        totalDistance: tripData?.totalDistance ?? 0,
        estimatedDuration: tripData?.estimatedDuration ?? 0,
      },
    };

    const { data, error } = await supabase.from("trip_bookings").insert([payload]).select("id").single();

    if (error) {
      return {
        bookingId: null,
        status: "failed",
        message: error.message || "Failed to create trip booking.",
      };
    }

    return {
      bookingId: data?.id ?? null,
      status: "confirmed",
      message: "Your trip has been booked successfully!",
    };
  },
};
