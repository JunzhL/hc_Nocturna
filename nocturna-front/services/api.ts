// services/api.ts
const SERVER_URL = 'http://0.0.0.0:8000';

export async function fetchLatestFrame() {
  const response = await fetch(`${SERVER_URL}/latestFrame`);
  if (!response.ok) {
    throw new Error('Failed to fetch latest frame');
  }
  // { originalImage, processedImage, detections, timestamp }
  console.log('fetchLatestFrame response:', response.json());
  return response.json();
}

