"use client";

import { createContext, useContext, useState, useEffect } from "react";

const TripPlannerContext = createContext({});

export const TripPlannerProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    travelDate: "",
    startingPoint: null,
    destinations: [],
    optimizedRoute: [],
    selectedHotels: [],
    selectedStays: [],
    selectedRestaurants: [],
    selectedAttractions: [],
    vehicleType: null,
    seats: 1,
    travelAgency: null,
    totalCost: 0,
    routeGeometry: null,
  });

  const updateTripData = (data) => {
    setTripData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("tripPlannerState");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed?.tripData) {
        setTripData((prev) => ({ ...prev, ...parsed.tripData }));
      }
      if (parsed?.currentStep) {
        setCurrentStep(parsed.currentStep);
      }
    } catch {
      sessionStorage.removeItem("tripPlannerState");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({
      currentStep,
      tripData,
    });
    sessionStorage.setItem("tripPlannerState", payload);
  }, [currentStep, tripData]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetTrip = () => {
    setCurrentStep(1);
    setTripData({
      travelDate: "",
      startingPoint: null,
      destinations: [],
      optimizedRoute: [],
      selectedHotels: [],
      selectedStays: [],
      selectedRestaurants: [],
      selectedAttractions: [],
      vehicleType: null,
      seats: 1,
      travelAgency: null,
      totalCost: 0,
      routeGeometry: null,
    });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("tripPlannerState");
    }
  };

  return (
    <TripPlannerContext.Provider
      value={{
        currentStep,
        tripData,
        updateTripData,
        nextStep,
        prevStep,
        resetTrip,
        setCurrentStep,
      }}>
      {children}
    </TripPlannerContext.Provider>
  );
};

export const useTripPlanner = () => {
  const context = useContext(TripPlannerContext);
  if (!context) {
    throw new Error("useTripPlanner must be used within TripPlannerProvider");
  }
  return context;
};
