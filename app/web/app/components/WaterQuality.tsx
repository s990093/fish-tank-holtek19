"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { SunIcon, BeakerIcon, FireIcon } from "@heroicons/react/24/solid";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const AquariumDashboard: React.FC = () => {
  // 狀態管理
  const [temperature, setTemperature] = useState<string>("--");
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [ledStatus, setLedStatus] = useState<boolean>(false);
  const [foodStatus, setFoodStatus] = useState<boolean>(false);
  const [hotStatus, setHotStatus] = useState<boolean>(false);
  const [tempError, setTempError] = useState<string | null>(null);
  const [controlError, setControlError] = useState<string | null>(null);
  const [fishCount, setFishCount] = useState<number>(0);
  const [fishError, setFishError] = useState<string | null>(null);

  // WebSocket 參考
  const tempSocketRef = useRef<WebSocket | null>(null);
  const controlSocketRef = useRef<WebSocket | null>(null);
  const fishSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 連接溫度 WebSocket
    const connectTemp = () => {
      if (tempSocketRef.current?.readyState === WebSocket.OPEN) return;
      tempSocketRef.current = new WebSocket("ws://localhost:8000/ws/temp");
      tempSocketRef.current.onopen = () => setTempError(null);
      tempSocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newTemp = parseFloat(data.message);
        setTemperature(newTemp.toString());
        setTempHistory((prev) => {
          const newHistory = [...prev, newTemp];
          if (newHistory.length > 20) newHistory.shift();
          return newHistory;
        });
      };
      tempSocketRef.current.onerror = (error) => {
        setTempError("溫度 WebSocket 連接失敗");
        console.error("溫度 WebSocket 錯誤:", error);
        setTimeout(connectTemp, 5000);
      };
      tempSocketRef.current.onclose = () => {
        setTempError("溫度 WebSocket 連接已關閉");
        setTimeout(connectTemp, 5000);
      };
    };

    // 連接控制 WebSocket
    const connectControl = () => {
      if (controlSocketRef.current?.readyState === WebSocket.OPEN) return;
      controlSocketRef.current = new WebSocket("ws://localhost:8000/ws/mode");
      controlSocketRef.current.onopen = () => setControlError(null);
      controlSocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.message) {
          case "LED_ON":
            setLedStatus(true);
            break;
          case "LED_OFF":
            setLedStatus(false);
            break;
          case "FOOD_ON":
            setFoodStatus(true);
            break;
          case "FOOD_OFF":
            setFoodStatus(false);
            break;
          case "HOT_ON":
            setHotStatus(true);
            break;
          case "HOT_OFF":
            setHotStatus(false);
            break;
          default:
            break;
        }
      };
      controlSocketRef.current.onerror = (error) => {
        setControlError("控制 WebSocket 連接失敗");
        console.error("控制 WebSocket 錯誤:", error);
        setTimeout(connectControl, 5000);
      };
      controlSocketRef.current.onclose = () => {
        setControlError("控制 WebSocket 連接已關閉");
        setTimeout(connectControl, 5000);
      };
    };

    // 連接魚數量 WebSocket
    const connectFish = () => {
      if (fishSocketRef.current?.readyState === WebSocket.OPEN) return;
      fishSocketRef.current = new WebSocket("ws://localhost:8000/ws/fish");
      fishSocketRef.current.onopen = () => setFishError(null);
      fishSocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.count !== undefined) {
          setFishCount(data.count);
        } else if (data.message !== undefined) {
          setFishCount(data.message);
        }
      };
      fishSocketRef.current.onerror = (error) => {
        setFishError("魚數量 WebSocket 連接失敗");
        console.error("魚數量 WebSocket 錯誤:", error);
        setTimeout(connectFish, 5000);
      };
      fishSocketRef.current.onclose = () => {
        setFishError("魚數量 WebSocket 連接已關閉");
        setTimeout(connectFish, 5000);
      };
    };

    connectTemp();
    connectControl();
    connectFish();

    return () => {
      tempSocketRef.current?.close();
      controlSocketRef.current?.close();
      fishSocketRef.current?.close();
    };
  }, []);

  // 控制命令發送
  const sendControlMessage = (message: string) => {
    if (controlSocketRef.current?.readyState === WebSocket.OPEN) {
      controlSocketRef.current.send(JSON.stringify({ message }));
    } else {
      setControlError("控制 WebSocket 未連接，無法發送命令");
      console.error("Control WebSocket not open");
    }
  };

  // 準備溫度圖表資料
  const chartData = {
    labels: tempHistory.map((_, index) => index + 1),
    datasets: [
      {
        label: "溫度 (°C)",
        data: tempHistory,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "溫度走勢圖" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl w-full">
        {/* 溫度卡 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">溫度</h2>
          <p className="text-5xl font-bold text-blue-600">{temperature}°C</p>
          {tempError && (
            <p className="text-red-500 mt-2 text-sm">{tempError}</p>
          )}
          <div className="mt-4">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        {/* 控制卡 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">控制</h2>
          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center p-3 rounded-md ${
                ledStatus ? "bg-green-500" : "bg-red-500"
              } text-white transition duration-300`}
              onClick={() =>
                sendControlMessage(ledStatus ? "LED_OFF" : "LED_ON")
              }
            >
              <SunIcon className="h-6 w-6 mr-2" />
              {ledStatus ? "關閉 LED" : "打開 LED"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center p-3 rounded-md ${
                foodStatus ? "bg-green-500" : "bg-red-500"
              } text-white transition duration-300`}
              onClick={() =>
                sendControlMessage(foodStatus ? "FOOD_OFF" : "FOOD_ON")
              }
            >
              <BeakerIcon className="h-6 w-6 mr-2" />
              {foodStatus ? "停止投食" : "開始投食"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center p-3 rounded-md ${
                hotStatus ? "bg-green-500" : "bg-red-500"
              } text-white transition duration-300`}
              onClick={() =>
                sendControlMessage(hotStatus ? "HOT_OFF" : "HOT_ON")
              }
            >
              <FireIcon className="h-6 w-6 mr-2" />
              {hotStatus ? "關閉加熱" : "打開加熱"}
            </motion.button>
          </div>
          {controlError && (
            <p className="text-red-500 mt-4 text-sm">{controlError}</p>
          )}
        </div>
        {/* 魚數量卡 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">魚的數量</h2>
          <p className="text-5xl font-bold text-blue-600">{fishCount}</p>
          {fishError && (
            <p className="text-red-500 mt-2 text-sm">{fishError}</p>
          )}
        </div>
        {/* 直播影像卡 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">即時影像</h2>
          <video
            src="/live"
            controls
            autoPlay
            loop
            className="w-full h-auto rounded-md"
          >
            您的瀏覽器不支援 video 標籤。
          </video>
        </div>
      </div>
    </div>
  );
};

export default AquariumDashboard;
