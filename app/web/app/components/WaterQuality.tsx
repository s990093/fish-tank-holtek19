"use client";
import React, { useState } from "react";

const WaterQuality: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(25);
  const [oxygenLevel, setOxygenLevel] = useState<number>(8);
  const [phValue, setPhValue] = useState<number>(7.2);

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Water Quality Monitoring</h2>
      <p>Temperature: {temperature}°C</p>
      <p>Oxygen Level: {oxygenLevel} mg/L</p>
      <p>pH Value: {phValue}</p>
    </div>
  );
};

export default WaterQuality;
