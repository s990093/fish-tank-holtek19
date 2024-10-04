import React from "react";

const FeedingSystem: React.FC = () => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Feeding System</h2>
      <div className="flex space-x-2">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Feed Now
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
          Schedule Feeding
        </button>
      </div>
    </div>
  );
};

export default FeedingSystem;
