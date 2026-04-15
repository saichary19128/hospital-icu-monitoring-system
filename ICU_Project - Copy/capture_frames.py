import cv2
import time
import os

# ✅ Save inside your current project folder
folder = os.path.join(os.getcwd(), "frames")
os.makedirs(folder, exist_ok=True)

# ✅ Correct stream URL
cap = cv2.VideoCapture("http://192.168.1.137:8000/video")

count = 0
last_time = 0

print("Capturing frames from Pi stream...")

while True:
    ret, frame = cap.read()

    if not ret or frame is None:
        print("❌ No frame received")
        continue

    # Save 2 frames per second
    if time.time() - last_time >= 1:
        last_time = time.time()

        filename = os.path.join(folder, f"frame_{count}.jpg")
        cv2.imwrite(filename, frame)

        print("Saved:", filename)
        count += 1

    # Show live stream
    cv2.imshow("Pi Camera Stream", frame)

    if cv2.waitKey(1) == 27:  # ESC key
        break

cap.release()
cv2.destroyAllWindows()
