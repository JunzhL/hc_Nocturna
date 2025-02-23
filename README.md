# Nocturna: Real-Time Danger Detection

Nocturna is a full-stack project that uses a FastAPI backend and a React Native frontend to perform real-time object detection and danger classification. The backend uses YOLOv8 to detect objects in incoming image frames, calls a Gemini API for danger classification (low, medium, high, or unknown), and saves both the original and processed images to disk. The frontend polls the backend every 5 seconds, displays the processed (labeled) image by default with bounding boxes, and allows the user to toggle to the original image where high and medium danger objects are indicated with alert symbols.

## Features

- **Real-Time Object Detection:**  
  Uses YOLOv8 to detect objects in incoming frames.

- **Danger Classification:**  
  Calls a Gemini API to classify detected objects as low, medium, high, or unknown danger based on object type, confidence, and estimated distance.

- **Image Storage & Serving:**  
  Saves original and processed images to disk and serves them via FastAPI’s static file mount.

- **Dynamic Frontend:**  
  A React Native app polls the latest detection data every 5 seconds, displays images, and overlays bounding boxes or alert symbols based on the danger level.

- **User Interaction:**  
  The header displays a logo and the title “Nocturna”. A toggle button allows the user to switch between the labeled (processed) image and the original image.


## Backend Setup

### Prerequisites

- Python 3.8+  
- [YOLOv8](https://github.com/ultralytics/ultralytics) (via `pip install ultralytics`)  
- FastAPI, Uvicorn  
- Other dependencies: Pillow, requests, python-dotenv

### Installation

1. Navigate to the js backend directory:
   1. Create a config folder in the root directory go into the config folder, add `default.json`, put the MongoDB connection string in there
   2. Then run `npm i` to install the dependencies
2. Navigate to the py backend directory:
  1. Create and activate python virtual environment with python version 3.8.x
  2. `pip install requirements.txt` to install the dependencies
  3. Create .env file with the Gemini_Api_Key
  4. Run app.py
  5. Run capture.py, make sure you have a camera attached to the computer.
3. Navigate to the front end, and `npm i` to install the dependencies, then run `app.tsx`.

