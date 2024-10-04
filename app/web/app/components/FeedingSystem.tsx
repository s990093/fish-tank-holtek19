"use client";
import React, { useState } from "react";
import { FaFish, FaClock } from "react-icons/fa";

const FeedingSystem: React.FC = () => {
  const [scheduled, setScheduled] = useState(false); // 用於追蹤是否已排程

  const handleScheduleFeeding = () => {
    setScheduled(true);
    // 這裡可以添加更多的排程邏輯，例如設置餵食時間
    setTimeout(() => {
      setScheduled(false); // 2秒後重置排程狀態
    }, 2000);
  };

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md  transition duration-300 ease-in-out transform hover:scale-105">
      <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <FaFish className="text-blue-500" />
        <span>Feeding System</span>
      </h2>

      <div className="flex space-x-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-blue-600 transition duration-200">
          <FaFish className="text-white" />
          <span>Feed Now</span>
        </button>
        <button
          onClick={handleScheduleFeeding}
          className="bg-yellow-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-yellow-600 transition duration-200"
        >
          <FaClock className="text-white" />
          <span>Schedule Feeding</span>
        </button>
      </div>

      {scheduled && (
        <div className="mt-4 p-2 text-green-600 border border-green-300 bg-green-100 rounded-md">
          Feeding has been scheduled!
        </div>
      )}
    </div>
  );
};

export default FeedingSystem;
