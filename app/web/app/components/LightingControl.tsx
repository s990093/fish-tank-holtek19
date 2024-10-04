import React from "react";

const LightingControl: React.FC = () => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Lighting Control</h2>
      <div className="flex space-x-2">
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Turn On
        </button>
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          Turn Off
        </button>
      </div>
    </div>
  );
};

export default LightingControl;
