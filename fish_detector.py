from ultralytics import YOLO
import cv2
import numpy as np
import time

# 載入 YOLO 模型
model = YOLO("yolo11n.pt")

choice = '2'
if choice == '1':
    cap = cv2.VideoCapture(0)  # 攝影機
    if not cap.isOpened():
        print("無法開啟攝影機，請檢查攝影機是否連接正確")
        exit()
    source_type = "Camera"
elif choice == '2':
    video_path = 'IMG_6444.MOV'  # 替換為實際影片路徑
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"無法開啟影片檔案 {video_path}，請檢查路徑是否正確") 
        exit()
    source_type = "Video"
else:
    print("無效選擇，程式結束")
    exit()

# 用來記錄最近 200 次的魚數量（滑動視窗）
fish_count_history = []

while True:
    ret, frame = cap.read()
    if not ret:
        print(f"{source_type} 已結束或無法讀取，程式結束")
        break

    h, w, _ = frame.shape
    cell_h = h // 4  # 垂直分成 4 段
    cell_w = w // 4  # 水平分成 4 段

    total_fish_count = 0
    segments = []

    # 分成 16 塊 (4 列 x 4 欄)
    for i in range(4):
        row_segments = []
        for j in range(4):
            seg = frame[i*cell_h:(i+1)*cell_h, j*cell_w:(j+1)*cell_w].copy()
            
            # 針對每個區塊進行 YOLO 偵測
            results = model(seg, device='mps')
            result = results[0]
            boxes = result.boxes.xyxy.cpu().numpy()
            class_ids = result.boxes.cls.cpu().numpy()
            names = model.names

            fish_count = 0  # 當前區塊中的魚數量

            for idx_box, box in enumerate(boxes):
                xmin, ymin, xmax, ymax = box.astype(int)
                # 檢查座標合理性
                if xmin >= xmax or ymin >= ymax or xmin < 0 or ymin < 0 or xmax > seg.shape[1] or ymax > seg.shape[0]:
                    continue
                
                # 計算面積
                area = (xmax - xmin) * (ymax - ymin)
                
                # 提取檢測框內的區域
                roi = seg[ymin:ymax, xmin:xmax]
                # 將 BGR 轉換為 HSV 以檢測紅色
                hsv_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
                # 定義紅色的 HSV 範圍
                lower_red1 = np.array([0, 70, 50])
                upper_red1 = np.array([10, 255, 255])
                lower_red2 = np.array([170, 70, 50])
                upper_red2 = np.array([180, 255, 255])
                # 建立紅色遮罩
                mask1 = cv2.inRange(hsv_roi, lower_red1, upper_red1)
                mask2 = cv2.inRange(hsv_roi, lower_red2, upper_red2)
                red_mask = mask1 | mask2
                # 計算紅色像素數量
                red_pixels = cv2.countNonZero(red_mask)

                # 條件判斷：面積 > 20000 且紅色像素 > 5000 才計為魚
                if area > 20000 and red_pixels > 5000:
                    fish_count += 1
                    cv2.rectangle(seg, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
                    # 顯示 Fish 編號、面積和紅色像素數
                    label = f'Fish: {fish_count}, Area: {area}, Red: {red_pixels}'
                    cv2.putText(seg, label, (xmin, ymin - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                else:
                    # 不符合條件的物體用藍色框標記，但不計入魚數
                    cv2.rectangle(seg, (xmin, ymin), (xmax, ymax), (255, 0, 0), 2)
                    label = f'Area: {area}, Red: {red_pixels}'
                    cv2.putText(seg, label, (xmin, ymin - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            
            total_fish_count += fish_count
            cv2.putText(seg, f'Fish: {fish_count}', (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            row_segments.append(seg)
        segments.append(row_segments)

    # 合併所有分割畫面到一個大畫面
    merged_frame = np.zeros((h, w, 3), dtype=np.uint8)
    for i in range(4):
        for j in range(4):
            merged_frame[i*cell_h:(i+1)*cell_h, j*cell_w:(j+1)*cell_w] = segments[i][j]

    # 更新 fish_count_history，最多保留最近 200 筆數據
    fish_count_history.append(total_fish_count)
    if len(fish_count_history) > 200:
        fish_count_history.pop(0)

    # 建立一個空白畫布用來繪製折線圖 (白底)
    chart_height = 200
    chart_width = 800
    chart = np.ones((chart_height, chart_width, 3), dtype=np.uint8) * 255

    # 若有超過 1 筆數據，繪製折線圖
    if len(fish_count_history) > 1:
        step = chart_width / (len(fish_count_history) - 1)
        max_count = max(fish_count_history) if max(fish_count_history) > 0 else 1
        points = []
        for i, count in enumerate(fish_count_history):
            x = int(i * step)
            y = chart_height - int((count / max_count) * chart_height)
            points.append((x, y))
        for i in range(len(points)-1):
            cv2.line(chart, points[i], points[i+1], (255, 0, 0), 2)
        for pt in points:
            cv2.circle(chart, pt, 3, (0, 0, 255), -1)

    cv2.putText(chart, f'Total Fish: {total_fish_count}', (10, 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)

    # 顯示合併後的畫面
    cv2.imshow('Merged Detection', merged_frame)
    # 顯示折線圖視窗
    cv2.imshow('Fish Count History', chart)
    print(f'Total Fish Count: {total_fish_count}')
    
    time.sleep(0.033)  # 模擬約 30fps
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()