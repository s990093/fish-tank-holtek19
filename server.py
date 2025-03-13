from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
import asyncio
import random
import json
import os

app = FastAPI()

@app.websocket("/ws/temp")
async def websocket_temp(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # 模擬隨機溫度，範圍 20°C ~ 30°C
            temperature = round(random.uniform(20.0, 30.0), 2)
            data = {"message": str(temperature)}
            await websocket.send_json(data)
            await asyncio.sleep(2)  # 每 2 秒傳送一次
    except WebSocketDisconnect:
        print("客戶端已斷開 /ws/temp 連線")

@app.websocket("/ws/mode")
async def websocket_mode(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            command = payload.get("message")
            # 根據控制命令回傳相同指令
            if command in ["LED_ON", "LED_OFF", "FOOD_ON", "FOOD_OFF", "HOT_ON", "HOT_OFF"]:
                await websocket.send_json({"message": command})
            else:
                await websocket.send_json({"message": "UNKNOWN_COMMAND"})
    except WebSocketDisconnect:
        print("客戶端已斷開 /ws/mode 連線")

@app.websocket("/ws/fish")
async def websocket_fish(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # 模擬魚的數量，隨機 0~10 隻
            fish_count = random.randint(0, 10)
            await websocket.send_json({"count": fish_count})
            await asyncio.sleep(5)  # 每 5 秒更新一次
    except WebSocketDisconnect:
        print("客戶端已斷開 /ws/fish 連線")

@app.get("/live")
async def live_video():
    # 假設影片檔案名稱為 aquarium_live.mp4，請確保檔案存在
    file_path = "test.mp4"
    if not os.path.exists(file_path):
        return {"error": "影片檔案不存在"}
    # 使用 FileResponse 回傳 mp4 影片
    return FileResponse(file_path, media_type="video/mp4")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
