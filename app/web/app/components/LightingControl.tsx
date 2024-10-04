"use client";
import React, { useState } from "react";
import { FaLightbulb } from "react-icons/fa";

const LightingControl: React.FC = () => {
  const [brightness, setBrightness] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(Number(e.target.value));
  };

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md  transition duration-300 ease-in-out transform hover:scale-105">
      <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <div className="text-yellow-500 animate-pulse">
          <FaLightbulb />
        </div>
        {/* 燈泡圖標 */}
        <span>Lighting Control</span>
      </h2>

      <div className="flex flex-col items-center space-y-4">
        <input
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={handleSliderChange}
          className="w-full"
        />
        <p className="text-sm text-gray-600">Brightness: {brightness}%</p>
      </div>
    </div>
  );
};

export default LightingControl;
