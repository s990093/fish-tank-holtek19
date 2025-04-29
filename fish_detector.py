#!/usr/bin/env python3
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import threading
import time
from collections import deque, Counter
import cv2
import numpy as np
from ultralytics import YOLO

# 初始化 FastAPI 應用
app = FastAPI()

# 全局變數：存儲 (timestamp, fish_count)
fish_counts = deque()
lock = threading.Lock()

# YOLO 模型與影片來源設定
model = YOLO("yolo11n.pt")
video_path = "IMG_6444.MOV"  # 替換為實際影片路徑
cap = cv2.VideoCapture(video_path)

# 分割網格設定
GRID_ROWS, GRID_COLS = 4, 4

def detection_loop():
    """
    背景執行：每 100ms 讀取一幀、做 YOLO 偵測、
    更新 fish_counts，不顯示 OpenCV 視窗
    """
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("影片已結束或讀取失敗，停止辨識")
            break

        h, w, _ = frame.shape
        cell_h, cell_w = h // GRID_ROWS, w // GRID_COLS
        total_fish_count = 0

        # 分割畫面並進行 YOLO 偵測
        for i in range(GRID_ROWS):
            for j in range(GRID_COLS):
                seg = frame[i*cell_h:(i+1)*cell_h, j*cell_w:(j+1)*cell_w].copy()
                results = model(seg, device="mps")
                res = results[0]
                boxes = res.boxes.xyxy.cpu().numpy().astype(int)

                fish_count = 0
                for (xmin, ymin, xmax, ymax) in boxes:
                    if xmin >= xmax or ymin >= ymax:
                        continue
                    # 計算面積與紅色像素
                    area = (xmax - xmin) * (ymax - ymin)
                    roi = seg[ymin:ymax, xmin:xmax]
                    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
                    mask1 = cv2.inRange(hsv, np.array([0,70,50]), np.array([10,255,255]))
                    mask2 = cv2.inRange(hsv, np.array([170,70,50]), np.array([180,255,255]))
                    red_pixels = cv2.countNonZero(mask1 | mask2)

                    # 判斷條件：面積 >20000 且 紅色像素 >5000
                    if area > 20000 and red_pixels > 5000:
                        fish_count += 1

                total_fish_count += fish_count

        # 更新全局魚數據，保留最近 10 秒資料
        with lock:
            fish_counts.append((time.time(), total_fish_count))
            cutoff = time.time() - 10
            while fish_counts and fish_counts[0][0] < cutoff:
                fish_counts.popleft()

        # Print detection results instead of showing window
        print(f"Total Fish Detected: {total_fish_count}")

        time.sleep(0.1)

    cap.release()
    cv2.destroyAllWindows()

# 啟動時在背景執行偵測線程
@app.on_event("startup")
def start_detection():
    thread = threading.Thread(target=detection_loop, daemon=True)
    thread.start()

# API 端點：回傳最近 5 秒內最常出現的魚數（次數 >2）
@app.get("/fish_count")
async def get_fish_count():
    now = time.time()
    with lock:
        recent = [count for ts, count in fish_counts if ts >= now - 5]
    if recent:
        most_common, freq = Counter(recent).most_common(1)[0]
        if freq > 2:
            return JSONResponse({"most_common_fish_count": most_common, "occurrences": freq})
    return JSONResponse({"most_common_fish_count": None, "occurrences": 0})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010)
