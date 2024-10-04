import React from "react";
import LightingControl from "./LightingControl";
import FeedingSystem from "./FeedingSystem";
import WaterQuality from "./WaterQuality";
import VideoStream from "./VideoStream";
import WaterQualityChart from "./chart/WaterQualityChart";

const AquariumDashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <WaterQuality />
        <VideoStream />
        <LightingControl />
        <FeedingSystem />
      </div>

      <WaterQualityChart />
    </div>
  );
};

export default AquariumDashboard;
