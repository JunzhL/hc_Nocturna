import cv2
import time
import requests

def main():
    camera_url = 0  # 0 = default USB camera

    cap = cv2.VideoCapture(camera_url)
    if not cap.isOpened():
        print("Cannot open camera")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame")
            break

        # Encode the frame as JPEG
        success, buffer = cv2.imencode('.jpg', frame)
        if not success:
            print("Failed to encode frame")
            continue

        jpg_bytes = buffer.tobytes()

        # Send to YOLOv8 service
        try:
            files = {'frame': ('frame.jpg', jpg_bytes, 'image/jpeg')}
            r = requests.post('http://0.0.0.0:8000/processFrame', files=files, timeout=10)
            if r.status_code == 200:
                data = r.json()
                # print("Frame processed. Detected:", data['detections'])
            else:
                print("Error from YOLO service:", r.text)
        except Exception as e:
            print("Exception sending frame:", e)

        # Wait 1 second before capturing the next frame
        time.sleep(5)

    cap.release()

if __name__ == "__main__":
    main()
