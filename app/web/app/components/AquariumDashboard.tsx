"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SunIcon, BeakerIcon, FireIcon } from "@heroicons/react/24/solid";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import useWebSocket from "react-use-websocket";

const AquariumDashboard: React.FC = () => {
  // 狀態管理
  const [temperature, setTemperature] = useState<string>("--");
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [ledStatus, setLedStatus] = useState<boolean>(false);
  const [foodStatus, setFoodStatus] = useState<boolean>(false);
  const [hotStatus, setHotStatus] = useState<boolean>(false);
  const [tempError, setTempError] = useState<string | null>(null);
  const [controlError, setControlError] = useState<string | null>(null);
  const [fishCount, setFishCount] = useState<number>(6);
  const [fishError, setFishError] = useState<string | null>(null);

  // 溫度 WebSocket
  const { lastJsonMessage: tempMessage, readyState: tempReadyState } =
    useWebSocket("ws://49.213.238.75:8000/ws/temp/", {
      onOpen: () => setTempError(null),
      onError: (error) => {
        setTempError("溫度 WebSocket 連接失敗");
        console.error("溫度 WebSocket 錯誤:", error);
      },
      onClose: () => setTempError("溫度 WebSocket 連接已關閉"),
      shouldReconnect: () => true,
    });

  // 控制 WebSocket
  const {
    sendJsonMessage: sendControlMessage,
    lastJsonMessage: controlMessage,
    readyState: controlReadyState,
  } = useWebSocket("ws://49.213.238.75:8000/ws/mode/", {
    onOpen: () => setControlError(null),
    onError: (error) => {
      setControlError("控制 WebSocket 連接失敗");
      console.error("控制 WebSocket 錯誤:", error);
    },
    onClose: () => setControlError("控制 WebSocket 連接已關閉"),
    shouldReconnect: () => true,
  });

  // 魚數量 WebSocket
  const { lastJsonMessage: fishMessage, readyState: fishReadyState } =
    useWebSocket("ws://49.213.238.75:8000/ws/fish", {
      onOpen: () => setFishError(null),
      onError: (error) => {
        setFishError("魚數量 WebSocket 連接失敗");
        console.error("魚數量 WebSocket 錯誤:", error);
      },
      onClose: () => setFishError("魚數量 WebSocket 連接已關閉"),
      shouldReconnect: () => true,
    });

  // 處理溫度訊息
  useEffect(() => {
    if (tempMessage) {
      console.log(tempMessage.message);
      const newTemp = parseFloat(tempMessage.message);
      setTemperature(newTemp.toString());
      setTempHistory((prev) => {
        const newHistory = [...prev, newTemp];
        if (newHistory.length > 20) newHistory.shift();
        return newHistory;
      });
    }
  }, [tempMessage]);

  // 處理控制訊息
  useEffect(() => {
    if (controlMessage) {
      switch (controlMessage.message2) {
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
    }
  }, [controlMessage]);

  // 處理魚數量訊息
  useEffect(() => {
    if (fishMessage) {
      if (fishMessage.count !== undefined) {
        setFishCount(fishMessage.count);
      } else if (fishMessage.message2 !== undefined) {
        setFishCount(fishMessage.message2);
      }
    }
  }, [fishMessage]);

  // 發送控制命令
  const sendControl = (message: string) => {
    if (controlReadyState === WebSocket.OPEN) {
      sendControlMessage({ message });
    } else {
      setControlError("控制 WebSocket 未連接，無法發送命令");
      console.error("Control WebSocket not open");
    }
  };

  // 準備圖表資料
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
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "溫度走勢圖",
      },
    },
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
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
              onClick={() => sendControl(ledStatus ? "LED_OFF" : "LED_ON")}
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
              onClick={() => sendControl(foodStatus ? "FOOD_OFF" : "FOOD_ON")}
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
              onClick={() => sendControl(hotStatus ? "HOT_OFF" : "HOT_ON")}
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
      </div>
    </div>
  );
};

export default AquariumDashboard;
