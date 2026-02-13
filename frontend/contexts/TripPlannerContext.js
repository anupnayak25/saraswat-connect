"use client";

import { createContext, useContext, useState } from "react";

const TripPlannerContext = createContext({});

export const TripPlannerProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    startingPoint: null,
    destinations: [],
    optimizedRoute: [],
    selectedHotels: [],
    selectedRestaurants: [],
    selectedAttractions: [],
    vehicleType: null,
    seats: 1,
    travelAgency: null,
    totalCost: 0,
  });

  const updateTripData = (data) => {
    setTripData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetTrip = () => {
    setCurrentStep(1);
    setTripData({
      startingPoint: null,
      destinations: [],
      optimizedRoute: [],
      selectedHotels: [],
      selectedRestaurants: [],
      selectedAttractions: [],
      vehicleType: null,
      seats: 1,
      travelAgency: null,
      totalCost: 0,
    });
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
