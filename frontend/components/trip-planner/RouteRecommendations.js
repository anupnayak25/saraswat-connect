"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useTripPlanner } from "@/contexts/TripPlannerContext";
import { tripPlannerAPI } from "@/lib/tripPlannerAPI";

export default function Step3RouteRecommendations() {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();
  const [activeTab, setActiveTab] = useState("hotels");
  const [recommendations, setRecommendations] = useState({
    hotels: [],
    stays: [],
    attractions: [],
  });
  const [loading, setLoading] = useState(true);
  const [leafletReady, setLeafletReady] = useState(false);
  const [routeUpdating, setRouteUpdating] = useState(false);
  const [routeActionId, setRouteActionId] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const leafletRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    if (!tripData.optimizedRoute || tripData.optimizedRoute.length === 0) return;

    setLoading(true);
    (async () => {
      try {
        const data = await tripPlannerAPI.getRecommendations(tripData.optimizedRoute);
        if (!cancelled) setRecommendations(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tripData.optimizedRoute]);

  const toggleHotel = (hotel) => {
    const isSelected = tripData.selectedHotels.find((h) => h.id === hotel.id);
    if (isSelected) {
      updateTripData({
        selectedHotels: tripData.selectedHotels.filter((h) => h.id !== hotel.id),
      });
    } else {
      updateTripData({
        selectedHotels: [...tripData.selectedHotels, hotel],
      });
    }
  };

  const toggleStay = (stay) => {
    const isSelected = tripData.selectedStays.find((s) => s.id === stay.id);
    if (isSelected) {
      updateTripData({
        selectedStays: tripData.selectedStays.filter((s) => s.id !== stay.id),
      });
    } else {
      updateTripData({
        selectedStays: [...tripData.selectedStays, stay],
      });
    }
  };

  const optimizeWithDestinations = async (nextDestinations, extraData = {}, actionId = null) => {
    if (nextDestinations.length === 0) {
      updateTripData({
        destinations: nextDestinations,
        optimizedRoute: tripData.startingPoint ? [tripData.startingPoint] : [],
        routeGeometry: null,
        totalDistance: 0,
        estimatedDuration: 0,
        ...extraData,
      });
      return;
    }

    setRouteUpdating(true);
    setRouteActionId(actionId);
    try {
      const routeData = await tripPlannerAPI.optimizeRoute(tripData.startingPoint, nextDestinations);
      updateTripData({
        destinations: nextDestinations,
        optimizedRoute: routeData.optimizedOrder,
        routeGeometry: routeData.routeGeometry ?? null,
        totalDistance: routeData.totalDistance,
        estimatedDuration: routeData.estimatedDuration,
        ...extraData,
      });
    } finally {
      setRouteUpdating(false);
      setRouteActionId(null);
    }
  };

  const toggleAttraction = async (attraction) => {
    const isSelected = tripData.selectedAttractions.find((a) => a.id === attraction.id);
    if (isSelected) {
      const nextSelectedAttractions = tripData.selectedAttractions.filter((a) => a.id !== attraction.id);
      const nextDestinations = tripData.destinations.filter((dest) => dest.id !== attraction.id);

      if (nextDestinations.length !== tripData.destinations.length) {
        await optimizeWithDestinations(nextDestinations, { selectedAttractions: nextSelectedAttractions }, attraction.id);
      } else {
        updateTripData({ selectedAttractions: nextSelectedAttractions });
      }
    } else {
      const nextSelectedAttractions = [...tripData.selectedAttractions, attraction];
      const destinationExists = tripData.destinations.some((dest) => dest.id === attraction.id);
      const nextDestinations = destinationExists ? tripData.destinations : [...tripData.destinations, attraction];

      if (destinationExists) {
        updateTripData({ selectedAttractions: nextSelectedAttractions });
      } else {
        await optimizeWithDestinations(nextDestinations, { selectedAttractions: nextSelectedAttractions }, attraction.id);
      }
    }
  };

  const displayRating = (rating) => (rating === null || rating === undefined ? "N/A" : rating);

  const displayList = (list) => (Array.isArray(list) && list.length > 0 ? list.join(" • ") : "—");

  const removeRouteStop = async (location) => {
    if (!location?.id) return;
    const startingPointId = tripData.startingPoint?.id;
    if (location.id === startingPointId) return;
    if (tripData.destinations.length <= 1) return;

    const nextDestinations = tripData.destinations.filter((dest) => dest.id !== location.id);
    const nextSelectedAttractions = tripData.selectedAttractions.filter((attraction) => attraction.id !== location.id);

    await optimizeWithDestinations(nextDestinations, { selectedAttractions: nextSelectedAttractions }, location.id);
  };

  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = async () => {
      if (typeof window === "undefined") return;
      const leafletModule = await import("leaflet");
      if (cancelled) return;

      leafletRef.current = leafletModule;
      leafletModule.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });
      setLeafletReady(true);
    };

    loadLeaflet();

    return () => {
      cancelled = true;
    };
  }, []);

  const routeLatLngs = useMemo(() => {
    const coords = tripData.routeGeometry?.coordinates;
    if (!Array.isArray(coords)) return [];
    return coords.map(([lng, lat]) => [lat, lng]);
  }, [tripData.routeGeometry]);

  const stopMarkers = useMemo(
    () =>
      (Array.isArray(tripData.optimizedRoute) ? tripData.optimizedRoute : [])
        .map((stop) => {
          if (!stop?.coordinates) return null;
          return {
            id: stop.id,
            name: stop.name,
            position: [stop.coordinates.lat, stop.coordinates.lng],
          };
        })
        .filter(Boolean),
    [tripData.optimizedRoute],
  );

  useEffect(() => {
    if (!leafletReady || !leafletRef.current || !mapContainerRef.current || routeLatLngs.length === 0) return;

    const L = leafletRef.current;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: routeLatLngs[0],
        zoom: 7,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
    }

    routeLayerRef.current = L.polyline(routeLatLngs, { color: "#0f766e", weight: 4 }).addTo(map);

    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
      stopMarkers.forEach((stop, index) => {
        const popupHtml = `<div class="text-sm"><div class="font-semibold text-stone-800">Stop ${index + 1}</div><div class="text-stone-600">${stop.name}</div></div>`;
        L.marker(stop.position).bindPopup(popupHtml).addTo(markersLayerRef.current);
      });
    }

    const bounds = L.latLngBounds(routeLatLngs);
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [leafletReady, routeLatLngs, stopMarkers]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const touristPlaceIds = new Set(
    (Array.isArray(tripData.optimizedRoute) ? tripData.optimizedRoute : [])
      .filter((location) => location?.placeId)
      .map((location) => location.placeId),
  );

  const filteredRoute = (Array.isArray(tripData.optimizedRoute) ? tripData.optimizedRoute : []).filter(
    (location) => {
      if (!location?.id) return false;
      if (location.placeId) return true;
      return !touristPlaceIds.has(location.id);
    },
  );

  const selectedAttractionIds = useMemo(
    () => new Set((tripData.selectedAttractions || []).map((attraction) => attraction.id)),
    [tripData.selectedAttractions],
  );

  const destinationIds = useMemo(
    () => new Set((tripData.destinations || []).map((destination) => destination.id)),
    [tripData.destinations],
  );

  const filteredAttractions = useMemo(
    () =>
      (recommendations.attractions || []).filter(
        (attraction) => !selectedAttractionIds.has(attraction.id) && !destinationIds.has(attraction.id),
      ),
    [recommendations.attractions, selectedAttractionIds, destinationIds],
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Your Optimized Route</h2>
        <p className="text-stone-600">Explore recommendations along your journey</p>
      </div>

      {/* Route Summary */}
      <div className="mb-8 p-6 bg-linear-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-stone-800">Route Overview</h3>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-sm text-stone-600">Distance</p>
              <p className="text-lg font-bold text-teal-600">{tripData.totalDistance?.toFixed(0)} km</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-stone-600">Duration</p>
              <p className="text-lg font-bold text-teal-600">{tripData.estimatedDuration?.toFixed(1)} hrs</p>
            </div>
          </div>
        </div>
        {routeUpdating && (
          <div className="mb-3 text-sm text-teal-700 font-medium">Updating route...</div>
        )}

        {/* Route Path */}
        <div className="flex items-center space-x-2 overflow-x-auto py-2">
          {filteredRoute.map((location, index) => (
            <div key={location.id} className="flex items-center">
              <div className="relative px-4 py-2 bg-white rounded-lg shadow-sm whitespace-nowrap">
                <span className="text-sm text-stone-600">{index + 1}.</span>
                <span className="ml-2 font-medium text-stone-800">{location.name}</span>
                <button
                  type="button"
                  onClick={() => removeRouteStop(location)}
                  disabled={routeUpdating || location.id === tripData.startingPoint?.id || tripData.destinations.length <= 1}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs leading-5 text-center shadow disabled:opacity-50">
                  ×
                </button>
              </div>
              {index < filteredRoute.length - 1 && <span className="mx-2 text-teal-600">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Route Map */}
      {routeLatLngs.length > 0 ? (
        <div className="mb-8 h-96 rounded-lg overflow-hidden border border-stone-200 relative">
          <div ref={mapContainerRef} className="h-full w-full" />
          {routeUpdating && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <div className="flex items-center gap-2 text-teal-700 font-medium">
                <span className="h-4 w-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
                Updating route...
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-8 h-96 bg-stone-100 rounded-lg flex items-center justify-center border-2 border-dashed border-stone-300">
          <div className="text-center">
            <p className="text-stone-500 text-lg mb-2">🗺️ Map Preview</p>
            <p className="text-stone-400 text-sm">Route will appear once locations are optimized</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-200">
          {["hotels", "stays", "attractions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition ${
                activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-stone-600 hover:text-stone-800"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
              <button className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs leading-5 text-center shadow disabled:opacity-50">
                  {routeUpdating && routeActionId === location.id ? (
                    <span className="inline-block h-3 w-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "×"
                  )}</button>
      <div className="mb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Hotels Tab */}
            {activeTab === "hotels" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.hotels.map((hotel) => {
                  const isSelected = tripData.selectedHotels.find((h) => h.id === hotel.id);
                  return (
                    <div
                      key={hotel.id}
                      className={`p-4 rounded-lg border-2 transition ${
                        isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                      }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-stone-800">{hotel.name}</h4>
                        <span className="text-yellow-500">⭐ {displayRating(hotel.rating)}</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">📍 {hotel.location}</p>
                      <p className="text-sm text-stone-600 mb-3">{displayList(hotel.amenities)}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-stone-800">₹{hotel.price}/night</span>
                        <button
                          onClick={() => toggleHotel(hotel)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            isSelected
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}>
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Stays Tab */}
            {activeTab === "stays" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.stays.map((stay) => {
                  const isSelected = tripData.selectedStays.find((s) => s.id === stay.id);
                  return (
                    <div
                      key={stay.id}
                      className={`p-4 rounded-lg border-2 transition ${
                        isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                      }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-stone-800">{stay.name}</h4>
                        <span className="text-xs text-stone-500 uppercase">{stay.type}</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">📍 {stay.location}</p>
                      <p className="text-sm text-stone-600 mb-3">{displayList(stay.amenities)}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-stone-800">₹{stay.price}/night</span>
                        <button
                          onClick={() => toggleStay(stay)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            isSelected
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}>
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Attractions Tab */}
            {activeTab === "attractions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAttractions.map((attraction) => {
                  const isSelected = tripData.selectedAttractions.find((a) => a.id === attraction.id);
                  return (
                    <div
                      key={attraction.id}
                      className={`p-4 rounded-lg border-2 transition ${
                        isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                      }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-stone-800">{attraction.name}</h4>
                        <span className="text-yellow-500">⭐ {displayRating(attraction.rating)}</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">📍 {attraction.location}</p>
                      <p className="text-sm text-stone-600 mb-3">🏷️ {attraction.type}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">
                          Entry: {attraction.entryFee === 0 ? "Free" : `₹${attraction.entryFee}`}
                        </span>
                        <button
                          onClick={() => toggleAttraction(attraction)}
                          disabled={routeUpdating && routeActionId === attraction.id}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            isSelected
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          } disabled:opacity-60`}>
                          {routeUpdating && routeActionId === attraction.id ? (
                            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : isSelected ? (
                            "Remove"
                          ) : (
                            "Add"
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={prevStep}
          className="flex-1 py-3 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-50 transition">
          ← Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-800 transition">
          Next: Select Vehicle →
        </button>
      </div>
    </div>
  );
}
