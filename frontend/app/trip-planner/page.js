"use client";

import { TripPlannerProvider, useTripPlanner } from "@/contexts/TripPlannerContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Step1StartingPoint from "@/components/trip-planner/StartingPoint";
import Step2Destinations from "@/components/trip-planner/Destinations";
import Step3RouteRecommendations from "@/components/trip-planner/RouteRecommendations";
import Step4VehicleSelection from "@/components/trip-planner/VehicleSelection";
import Step5ReviewBilling from "@/components/trip-planner/ReviewBilling";

function StepIndicator() {
  const { currentStep, setCurrentStep, tripData } = useTripPlanner();

  const steps = [
    { number: 1, title: "Starting Point", completed: !!tripData.startingPoint },
    { number: 2, title: "Destinations", completed: tripData.destinations.length > 0 },
    { number: 3, title: "Route & Places", completed: tripData.optimizedRoute.length > 0 },
    { number: 4, title: "Vehicle", completed: !!tripData.vehicleType && !!tripData.travelAgency },
    { number: 5, title: "Review", completed: false },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <button
                onClick={() => {
                  // Allow going back to previous steps
                  if (step.number < currentStep) {
                    setCurrentStep(step.number);
                  }
                }}
                disabled={step.number > currentStep}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition ${
                  currentStep === step.number
                    ? "bg-orange-600 text-white scale-110 shadow-lg"
                    : currentStep > step.number
                    ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentStep > step.number ? "✓" : step.number}
              </button>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep >= step.number ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 transition ${
                  currentStep > step.number ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TripPlannerContent() {
  const { currentStep } = useTripPlanner();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Plan Your Spiritual Journey</h1>
          <p className="text-gray-600">
            Create a customized trip to temples and spiritual destinations
          </p>
        </div>

        <StepIndicator />

        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && <Step1StartingPoint />}
          {currentStep === 2 && <Step2Destinations />}
          {currentStep === 3 && <Step3RouteRecommendations />}
          {currentStep === 4 && <Step4VehicleSelection />}
          {currentStep === 5 && <Step5ReviewBilling />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TripPlanner() {
  return (
    <TripPlannerProvider>
      <TripPlannerContent />
    </TripPlannerProvider>
  );
}
