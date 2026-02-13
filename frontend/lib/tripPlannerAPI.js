// API service for Trip Planner backend calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Mock data for development
const POPULAR_LOCATIONS = [
  { id: 1, name: "Udupi Temple", lat: 13.3409, lng: 74.7421 },
  { id: 2, name: "Dharmasthala Temple", lat: 12.9497, lng: 75.3803 },
  { id: 3, name: "Kollur Mookambika Temple", lat: 13.8778, lng: 74.7982 },
  { id: 4, name: "Kukke Subramanya Temple", lat: 12.8419, lng: 75.5996 },
  { id: 5, name: "Horanadu Annapoorneshwari Temple", lat: 13.2167, lng: 75.2167 },
  { id: 6, name: "Kateel Durga Parameshwari Temple", lat: 12.9833, lng: 74.9833 },
  { id: 7, name: "Sringeri Sharada Peetham", lat: 13.4167, lng: 75.25 },
  { id: 8, name: "Mangalore", lat: 12.9141, lng: 74.856 },
];

export const tripPlannerAPI = {
  // Search locations with autocomplete
  searchLocations: async (query) => {
    // Mock implementation - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return POPULAR_LOCATIONS.filter((loc) => loc.name.toLowerCase().includes(query.toLowerCase()));
  },

  // Get popular locations
  getPopularLocations: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return POPULAR_LOCATIONS;
  },

  // Optimize route based on starting point and destinations
  optimizeRoute: async (startingPoint, destinations) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock optimization - in real app, use Google Maps Directions API
    // or a route optimization service
    return {
      optimizedOrder: [startingPoint, ...destinations],
      totalDistance: Math.random() * 500 + 100, // km
      estimatedDuration: Math.random() * 10 + 2, // hours
    };
  },

  // Get recommendations near route
  getRecommendations: async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      hotels: [
        {
          id: 1,
          name: "Temple View Hotel",
          location: "Near Udupi",
          rating: 4.5,
          price: 2500,
          amenities: ["WiFi", "AC", "Breakfast"],
        },
        {
          id: 2,
          name: "Pilgrim's Rest",
          location: "Dharmasthala",
          rating: 4.2,
          price: 1800,
          amenities: ["WiFi", "Parking"],
        },
      ],
      restaurants: [
        {
          id: 1,
          name: "Woodlands Restaurant",
          location: "Udupi",
          cuisine: "South Indian",
          rating: 4.3,
          avgCost: 300,
        },
        {
          id: 2,
          name: "Mitra Samaj",
          location: "Udupi",
          cuisine: "Vegetarian",
          rating: 4.6,
          avgCost: 200,
        },
      ],
      attractions: [
        {
          id: 1,
          name: "Malpe Beach",
          location: "Near Udupi",
          type: "Beach",
          rating: 4.4,
          entryFee: 0,
        },
        {
          id: 2,
          name: "St. Mary's Island",
          location: "Malpe",
          type: "Island",
          rating: 4.7,
          entryFee: 50,
        },
      ],
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
