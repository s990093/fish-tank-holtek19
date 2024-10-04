import React from "react";
import LightingControl from "./LightingControl";
import FeedingSystem from "./FeedingSystem";
import WaterQuality from "./WaterQuality";
import VideoStream from "./VideoStream";
import WaterQualityChart from "./chart/WaterQualityChart";

const AquariumDashboard: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-around gap-4 mt-6">
      <LightingControl />
      <FeedingSystem />
      <WaterQuality />
      <VideoStream />

      <WaterQualityChart />
    </div>
  );
};

export default AquariumDashboard;
