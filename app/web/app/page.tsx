import React from "react";
import AquariumDashboard from "./components/AquariumDashboard";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 text-center min-h-screen flex flex-col justify-center">
      <h1 className="text-4xl font-bold mb-6">Smart Aquarium Control</h1>
      {/* 即時影像區塊，使用 video 元素呈現 MJPEG 串流 */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 flex justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">即時影像</h2>
          <div className="overflow-hidden flex justify-center">
            <video
              autoPlay
              muted
              src="http://localhost:8001/live"
              className="w-[800px] h-[300px] rounded-md transform origin-center"
            >
              您的瀏覽器不支援 video 標籤。
            </video>
          </div>
        </div>
      </div>
      <AquariumDashboard />
    </div>
  );
};

export default HomePage;
