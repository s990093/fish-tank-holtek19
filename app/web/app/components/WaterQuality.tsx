"use client";
import React, { useState } from "react";
import {
  FaThermometerHalf,
  FaWater,
  FaBalanceScale,
  FaFire,
} from "react-icons/fa"; // 引入圖標

const WaterQuality: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(25);
  const [oxygenLevel, setOxygenLevel] = useState<number>(8);
  const [phValue, setPhValue] = useState<number>(7.2);
  const [heaterOn, setHeaterOn] = useState<boolean>(false); // 用於追蹤加熱棒狀態

  const toggleHeater = () => {
    setHeaterOn(!heaterOn);
  };

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-lgtransition duration-300 ease-in-out hover:shadow-xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <FaWater className="text-blue-500" />
        <span>Water Quality Monitoring</span>
      </h2>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg shadow-sm ">
          <FaThermometerHalf className="text-red-500" />
          <div>
            <p className="text-sm font-medium">Temperature</p>
            <p className="text-lg">{temperature}°C</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg shadow-sm ">
          <FaWater className="text-blue-500" />
          <div>
            <p className="text-sm font-medium">Oxygen Level</p>
            <p className="text-lg">{oxygenLevel} mg/L</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg shadow-sm ">
          <FaBalanceScale className="text-green-500" />
          <div>
            <p className="text-sm font-medium">pH Value</p>
            <p className="text-lg">{phValue}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg shadow-sm ">
          <FaFire className="text-orange-500" />
          <div className="flex flex-col">
            <p className="text-sm font-medium">Heater Control</p>
            <button
              onClick={toggleHeater}
              className={`mt-2 py-2 px-4 rounded  ${
                heaterOn
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } transition duration-200`}
            >
              {heaterOn ? "Turn Off Heater" : "Turn On Heater"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterQuality;
