import React from "react";
import AquariumDashboard from "./components/AquariumDashboard";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Smart Aquarium Control</h1>
      <AquariumDashboard />
    </div>
  );
};

export default HomePage;
