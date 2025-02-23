# Nocturna: Real-Time Danger Detection

Nocturna is a full-stack project that uses a FastAPI backend, a FeathersJS backend and a React Native frontend to perform real-time object detection and danger classification. The FastAPI backend uses YOLOv8 to detect objects in incoming image frames sent from a camera. Then the API automatically calls an endpoint service built in the JS backend (an AI agent by prompting engineering, fine-tuning and configurating the Gemini API) for danger classification (low, medium, high, or unknown). The frontend polls the backend every 5 seconds (due to API call restriction), displays the processed (labelled) image by default with bounding boxes, and allows the user to toggle to the original image where high and medium danger objects are indicated with alert symbols. 

## Features

- **Real-Time Object Detection:**  
  Uses YOLOv8 to detect objects in incoming frames.

- **Danger Classification:**  
  Calls a Gemini API AI agent to classify detected objects as low, medium, high, or unknown danger based on object type, confidence, and estimated distance.

- **Dynamic Frontend:**  
  A React Native app polls the latest detection data every 5 seconds, displays images, and overlays bounding boxes or alert symbols based on the danger level.

- **User Interaction:**
  A toggle button allows the user to switch between the labeled (processed) image and the original image, and planning to implement an announcement system via Raspberry Pi.


## Project Setup

### Prerequisites

- Python 3.8+
- NodeJS 

### Installation

1. JS backend:
   ```bash
   npm i
   mkdir config
   cd config
   touch default.json
   ```
   In default.json, add the mongodb connection string and port:
   ```js
   {
    "mongodb": MONGODB_CONNECTION_STRING,
    "port": PORT_NUMBER
   }
   ```
   Run the js backend with:
   ```bash
   npm start
   ```
2. Py backend:
     - Create and activate python virtual environment with python version 3.8.x
   ```bash
   pip install requirements.txt
   touch .env
   ```
   In the `.env` file, add:
    ```
    gemini_api_key=YOUR_GEMINI_API_KEY
    ```
   Then
   ```bash
   python app.py
   python capture.py
   ```
4. Navigate to the front end, and `npm i` to install the dependencies, then run `app.tsx`.

