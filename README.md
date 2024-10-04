# 智慧水族箱控制系統

這是一個基於 Next.js 的智慧水族箱控制系統，搭配 Django 後端進行數據處理與管理。該系統提供了多種水族箱監控和控制功能，包括燈光控制、餵食系統、水質監測和實時視頻串流。

## 系統介紹影片

## 檔案結構

- **app/**: 根目錄，包含所有應用程式的檔案。
  - **web/**: 包含 Next.js 前端應用程式的檔案。
  - **server/**: 包含 Django 後端應用程式的檔案。

### 目前功能

#### 前端 (Next.js)

- **燈光控制 (Lighting Control)**: 提供開啟和關閉燈光的功能。
- **餵食系統 (Feeding System)**: 提供即時餵食和預定餵食的功能。
- **水質監測 (Water Quality Monitoring)**: 實時顯示水溫、氧氣含量和 pH 值，並提供加熱棒的控制功能。
- **視頻串流 (Video Stream)**: 實時監控水族箱影像，使用 ESP8266 提供影像串流功能。
- **數據圖表**: 顯示水質數據的圖表，包括溫度和氧氣水平。

#### 後端 (Django)

後端使用 Django 框架提供 API 端點來支持前端功能。

##### API 端點

- **`GET /api/water_quality`**: 獲取當前水質數據，包括溫度、氧氣含量和 pH 值。
- **`POST /api/lighting`**: 控制燈光開關，請求主體包含 `{ "action": "on" | "off" }`。
- **`POST /api/feed`**: 控制餵食系統，請求主體包含 `{ "action": "now" | "schedule" }`。
- **`POST /api/heater`**: 控制加熱棒，請求主體包含 `{ "action": "on" | "off" }`。

#### arduino

系統集成了 Arduino 控制器，用於監控和調節水族箱環境。通過使用 WebSocket 協議，Arduino 可以實時將數據發送到前端，並接收來自用戶界面的控制指令。

- **WebSocket 連接**: 前端將與 Arduino 通過 WebSocket 建立持久連接，以獲取實時數據更新和控制命令。例如，當水溫或氧氣水平異常時，Arduino 可以立即通知前端，讓用戶採取行動。

- **AMI82 鏡頭**: 使用 AMI82 鏡頭提供實時影像串流。通過 WebSocket，前端應用可以獲取來自鏡頭的視頻流，讓用戶隨時隨地監控水族箱狀態。

## 安裝與運行

1. 克隆此項目：

   ```bash
   git clone https://github.com/s990093/fish-tank-holtek19
   cd  fish-tank-holtek19
   ```

2. 進入 app 目錄
   ```bash
   cd  app
   ```
