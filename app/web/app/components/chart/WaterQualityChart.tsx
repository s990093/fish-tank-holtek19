"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WaterQualityChart: React.FC = () => {
  const [data, setData] = useState([
    { time: "12:00", temperature: 25, oxygenLevel: 8 },
    { time: "12:10", temperature: 25.5, oxygenLevel: 8.1 },
    { time: "12:20", temperature: 26, oxygenLevel: 8.3 },
    { time: "12:30", temperature: 26.5, oxygenLevel: 8.4 },
    { time: "12:40", temperature: 27, oxygenLevel: 8.2 },
  ]);

  // 模擬實時更新假數據
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const newTemperature = (Math.random() * (28 - 24) + 24).toFixed(1); // 模擬溫度數據
      const newOxygenLevel = (Math.random() * (8.5 - 7.5) + 7.5).toFixed(1); // 模擬氧氣含量數據

      setData((prevData) => [
        ...prevData.slice(1), // 保留最新的數據點
        {
          time: newTime,
          temperature: Number(newTemperature),
          oxygenLevel: Number(newOxygenLevel),
        },
      ]);
    }, 5000); // 每5秒更新一次數據

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm w-full h-80">
      <h2 className="text-lg font-semibold mb-4">
        Water Quality Monitoring (Temperature & Oxygen Level)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ff7300"
            name="Temperature (°C)"
          />
          <Line
            type="monotone"
            dataKey="oxygenLevel"
            stroke="#387908"
            name="Oxygen Level (mg/L)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterQualityChart;
