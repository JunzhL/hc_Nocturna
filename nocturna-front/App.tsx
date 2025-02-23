import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import AlertSymbol from './components/AlertSymbol';

// Example interface for detection objects
interface Detection {
  bbox: [number, number, number, number];
  danger_level?: string;
  label: string;
}

export default function App() {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [showProcessed, setShowProcessed] = useState<boolean>(false);

  // Adjust if you're on Android emulator: use "http://10.0.2.2:8000"
  const FASTAPI_URL = 'http://localhost:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${FASTAPI_URL}/latestFrame`);
        const data = await res.json();

        if (data.message) {
          console.log(data.message); // "No frames processed yet."
          return;
        }
        setOriginalImageUrl(data.originalImageUrl);
        setProcessedImageUrl(data.processedImageUrl);
        setDetections(data.detections);
      } catch (error) {
        console.error('Error fetching latestFrame:', error);
      }
    };

    // Fetch once immediately
    fetchData();
    // Then poll every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleToggle = () => {
    setShowProcessed(!showProcessed);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./logo/logo.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Nocturna</Text>
      </View>

      <View style={styles.imageWrapper}>
        {showProcessed && processedImageUrl ? (
          <Image
            source={{ uri: processedImageUrl }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        ) : (
          originalImageUrl && (
            <Image
              source={{ uri: originalImageUrl }}
              style={styles.mainImage}
              resizeMode="contain"
            />
          )
        )}

        {showProcessed && detections.length > 0 && (
          <View style={styles.overlayContainer}>
            {detections.map((det, i) => {
              const [x, y, w, h] = det.bbox;
              const level = (det.danger_level || '').toLowerCase().trim();
              if (level !== 'high' && level !== 'medium') {
                return null;
              }
              const color = level === 'high' ? 'red' : 'yellow';

              return (
                <View
                  key={i}
                  style={[
                    styles.boundingBox,
                    {
                      left: x,
                      top: y,
                      width: w,
                      height: h,
                      borderColor: color,
                    },
                  ]}
                >
                  <Text style={styles.dangerLabel}>
                    {det.label} ({level})
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        {!showProcessed && detections.length > 0 && (
          <View style={styles.overlayContainer}>
            {detections.map((det, i) => {
              const [x, y, w, h] = det.bbox;
              const level = (det.danger_level || '').toLowerCase().trim();
              if (level !== 'high' && level !== 'medium') {
                return null;
              }
              const color = level === 'high' ? 'red' : 'yellow';
              const left = x + w / 2 - 10;
              const top = y + h / 2 - 10;
              return (
                <AlertSymbol
                  key={i}
                  left={left}
                  top={top}
                  color={color}
                  level={level}
                />
              );
            })}
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.toggleButton} onPress={handleToggle}>
        <Text style={styles.toggleButtonText}>
          {showProcessed ? 'Show Original' : 'Show Labeled'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  appName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  imageWrapper: {
    width: 640,
    height: 480,
    position: 'relative',
    marginBottom: 20,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 640,
    height: 480,
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 3,
  },
  dangerLabel: {
    position: 'absolute',
    left: 0,
    top: -20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  toggleButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});


// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';

// // Interface for detection objects
// interface Detection {
//   bbox: [number, number, number, number];
//   danger_level?: string;
//   label: string;
// }

// export default function App() {
//   const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
//   const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
//   const [detections, setDetections] = useState<Detection[]>([]);
//   const [showProcessed, setShowProcessed] = useState<boolean>(true);

//   // For demonstration, you might need to adjust this for your environment:
//   const FASTAPI_URL = 'http://localhost:8000'; // or "http://10.0.2.2:8000" on Android emulator

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`${FASTAPI_URL}/latestFrame`);
//         const data = await res.json();

//         if (data.message) {
//           console.log(data.message); // "No frames processed yet."
//           return;
//         }
//         setOriginalImageUrl(data.originalImageUrl);
//         setProcessedImageUrl(data.processedImageUrl);
//         setDetections(data.detections);
//       } catch (error) {
//         console.error('Error fetching latestFrame:', error);
//       }
//     };

//     // Fetch once immediately
//     fetchData();
//     // Then poll every 5 seconds
//     const intervalId = setInterval(fetchData, 5000);

//     // Cleanup on unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   const handleToggle = () => {
//     setShowProcessed(!showProcessed);
//   };

//   // We’ll assume the YOLO image is ~640px wide for bounding box alignment
//   // In practice, you may need to scale the bounding box coords if the displayed image size differs
//   const IMAGE_WIDTH = 640;
//   const IMAGE_HEIGHT = 480; // or whatever YOLO uses

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Danger Detection (React Native)</Text>

//       <TouchableOpacity style={styles.toggleButton} onPress={handleToggle}>
//         <Text style={styles.toggleButtonText}>
//           {showProcessed ? 'Show Original' : 'Show Labeled'}
//         </Text>
//       </TouchableOpacity>

//       <View style={styles.imageWrapper}>
//         {/* Display either processed or original image */}
//         {showProcessed && processedImageUrl ? (
//           <Image
//             source={{ uri: processedImageUrl }}
//             style={styles.mainImage}
//             resizeMode="contain"
//           />
//         ) : (
//           originalImageUrl && (
//             <Image
//               source={{ uri: originalImageUrl }}
//               style={styles.mainImage}
//               resizeMode="contain"
//             />
//           )
//         )}

//         {/* Overlays only if processed is shown */}
//         {showProcessed && detections.length > 0 && (
//           <View style={styles.overlayContainer}>
//             {detections.map((det, i) => {
//               const [x, y, w, h] = det.bbox;
//               const level = (det.danger_level || '').toLowerCase().trim();

//               // Only highlight if "high" or "medium"
//               if (level !== 'high' && level !== 'medium') {
//                 return null;
//               }

//               const color = level === 'high' ? 'red' : 'yellow';

//               // For a perfect overlay, you'd scale bounding box coords to match the displayed image size.
//               // This example assumes 640x480 is displayed exactly, so we can place bounding boxes directly.
//               return (
//                 <View
//                   key={i}
//                   style={[
//                     styles.boundingBox,
//                     {
//                       left: x,
//                       top: y,
//                       width: w,
//                       height: h,
//                       borderColor: color,
//                     },
//                   ]}
//                 >
//                   <Text style={styles.dangerLabel}>
//                     {det.label} ({level})
//                   </Text>
//                 </View>
//               );
//             })}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//     paddingTop: 50,
//     alignItems: 'center',
//   },
//   title: {
//     color: '#fff',
//     fontSize: 20,
//     marginBottom: 10,
//   },
//   toggleButton: {
//     backgroundColor: '#3498db',
//     borderRadius: 5,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 20,
//   },
//   toggleButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   imageWrapper: {
//     width: 640, // same as YOLO image width
//     height: 480, // same as YOLO image height
//     position: 'relative',
//   },
//   mainImage: {
//     width: '100%',
//     height: '100%',
//   },
//   overlayContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 640,
//     height: 480,
//   },
//   boundingBox: {
//     position: 'absolute',
//     borderWidth: 3,
//     borderColor: 'red',
//   },
//   dangerLabel: {
//     position: 'absolute',
//     left: 0,
//     top: -20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     color: '#fff',
//     fontSize: 12,
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
// });
