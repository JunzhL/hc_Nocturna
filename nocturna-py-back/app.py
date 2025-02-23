from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # <-- import this
from ultralytics import YOLO
from PIL import Image
from io import BytesIO
import os
import datetime
from math import sqrt
import uvicorn
import requests
import uuid

app = FastAPI()

# Enable CORS for all origins
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI with CORS enabled"}

# Folder where we save images
IMAGES_FOLDER = "images"
os.makedirs(IMAGES_FOLDER, exist_ok=True)

# 1) MOUNT the images folder at the URL path "/images"
app.mount("/images", StaticFiles(directory=IMAGES_FOLDER), name="images")

# Load YOLOv8 model
model = YOLO("yolov8n.pt")
model.info()

# In-memory cache for the latest result
LATEST_RESULT = None

@app.post("/processFrame")
async def process_frame(frame: UploadFile = File(...)):
    """
    1) Receive a frame (image) from the user.
    2) Run YOLOv8 detection.
    3) (Optional) Call Gemini.
    4) Save original & processed images to disk.
    5) Return the image URLs + detections.
    6) Update in-memory cache.
    """
    contents = await frame.read()
    pil_image = Image.open(BytesIO(contents)).convert("RGB")

    results = model.predict(pil_image, conf=0.25)
    annotated_frame = results[0].plot()  # numpy array
    annotated_pil = Image.fromarray(annotated_frame)

    detections_info = []
    for box in results[0].boxes.data.tolist():
        x1, y1, x2, y2, conf, cls_id = box
        label = results[0].names[int(cls_id)]
        distance_to_camera = sqrt(x1**2 + y1**2 + x2**2 + y2**2)

        # Example call to Gemini
        prompt = (
            f"Detected a {label} with confidence {conf:.2f} at distance {distance_to_camera:.2f}.\n"
            f"Classify if the object is dangerous: low, medium, or high."
        )
        try:
            gemini_response = requests.post(
                "http://localhost:3030/gemini", json={"prompt": prompt}, timeout=15
            )
            gemini_response.raise_for_status()
            gemini_data = gemini_response.json()
            danger_level = gemini_data.get("text", "unknown").strip().lower()
        except Exception as e:
            print("Gemini call failed:", e)
            danger_level = "unknown"

        detections_info.append({
            "label": label,
            "confidence": conf,
            "bbox": [x1, y1, x2 - x1, y2 - y1],
            "distance": distance_to_camera,
            "danger_level": danger_level
        })

    unique_id = str(uuid.uuid4())[:8]
    original_filename = f"original_{unique_id}.jpg"
    processed_filename = f"processed_{unique_id}.jpg"

    original_path = os.path.join(IMAGES_FOLDER, original_filename)
    processed_path = os.path.join(IMAGES_FOLDER, processed_filename)

    pil_image.save(original_path, format="JPEG")
    annotated_pil.save(processed_path, format="JPEG")

    doc = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "cameraId": "external_cam_1",
        "detections": detections_info,
        "originalImageUrl": f"http://localhost:8000/images/{original_filename}",
        "processedImageUrl": f"http://localhost:8000/images/{processed_filename}"
    }

    # (Optional) forward doc somewhere
    try:
        response = requests.post("http://localhost:3030/information-upload", json=doc)
        response.raise_for_status()
    except Exception as e:
        print("Error sending detection info:", e)

    global LATEST_RESULT
    LATEST_RESULT = {
        "originalImageUrl": doc["originalImageUrl"],
        "processedImageUrl": doc["processedImageUrl"],
        "detections": detections_info,
        "timestamp": doc["timestamp"]
    }

    return LATEST_RESULT

# REMOVE or COMMENT OUT the old route:
# @app.get("/images/{filename}")
# def get_image(filename: str):
#     ...

@app.get("/latestFrame")
def latest_frame():
    if LATEST_RESULT is None:
        return {"message": "No frames processed yet."}
    return LATEST_RESULT

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

