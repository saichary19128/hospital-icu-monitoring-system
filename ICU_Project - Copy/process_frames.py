import cv2
import easyocr
import re
import os
import time
import requests

FOLDER_PATH = r"C:\Users\saich\Downloads\ICU_Project\frames"

# -----------------------------
# OCR init
# -----------------------------
reader = easyocr.Reader(['en'], gpu=False)


# -----------------------------
# Get latest image
# -----------------------------
def get_latest_image(folder):
    files = [os.path.join(folder, f) for f in os.listdir(folder)
             if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    if not files:
        return None

    return max(files, key=os.path.getctime)


# -----------------------------
# Extract vitals
# -----------------------------
def extract_vitals(image_path):

    img = cv2.imread(image_path)
    if img is None:
        return None

    results = reader.readtext(img)

    items = []
    numbers = []

    for bbox, text, prob in results:
        text = text.lower().strip()

        x = int((bbox[0][0] + bbox[2][0]) / 2)
        y = int((bbox[0][1] + bbox[2][1]) / 2)

        items.append({"text": text, "x": x, "y": y})

        matches = re.findall(r'\d+', text)
        for m in matches:
            numbers.append({"value": int(m), "x": x, "y": y})

    def find_value(label_keywords, valid_range):
        labels = [i for i in items if any(k in i["text"] for k in label_keywords)]

        best = None
        best_score = 999999

        for label in labels:
            for num in numbers:
                val = num["value"]

                if not (valid_range[0] <= val <= valid_range[1]):
                    continue

                dx = abs(label["x"] - num["x"])
                dy = abs(label["y"] - num["y"])

                if dy > 60:
                    continue

                score = dx + dy * 2

                if score < best_score:
                    best_score = score
                    best = val

        return best

    def find_spo2():
        for item in items:
            if "spo" in item["text"]:
                for num in numbers:
                    if 80 <= num["value"] <= 100:
                        return num["value"]
        return None

    # Extract values
    heart_rate = find_value(["hr","heart"], (30, 200))
    spo2 = find_spo2()
    resp = find_value(["rr"], (5, 40))

    bp = None
    for item in items:
        match = re.search(r'(\d{2,3})/(\d{2,3})', item["text"])
        if match:
            bp = f"{match.group(1)}/{match.group(2)}"
            break

    return {
        "heartRate": heart_rate,
        "bp": bp,
        "spo2": spo2,
        "respiratoryRate": resp
    }


# -----------------------------
# MAIN LOOP
# -----------------------------
last_file = None

while True:

    latest = get_latest_image(FOLDER_PATH)

    if latest and latest != last_file:

        print("\n📸 Processing:", latest)

        vitals = extract_vitals(latest)

        if vitals:
            print("\n✅ Extracted Vitals:", vitals)

            # 🔥 SEND TO BACKEND HERE (FIXED)
            data = {
                "bedId": 1,   # 🔥 MUST match bedNumber in frontend
                "ocr": vitals
            }

            try:
                res = requests.post(
                    "http://localhost:5000/api/ocr",
                    json=data
                )
                print("✅ Sent to backend:", res.status_code)
            except Exception as e:
                print("❌ API Error:", e)

        last_file = latest

    time.sleep(1)