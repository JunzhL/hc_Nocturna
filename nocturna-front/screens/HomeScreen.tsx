// // screens/HomeScreen.tsx
// import React, { useState } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { uploadSingleImage } from '../services/api';
// import DetectionList from '../components/DetectionList';

// export default function HomeScreen() {
//   const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
//   const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);
//   const [detections, setDetections] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const pickImage = async () => {
//     const result = await launchImageLibrary({ mediaType: 'photo' });
//     if (result.assets && result.assets.length > 0) {
//       setSelectedImageUri(result.assets[0].uri || null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedImageUri) return;
//     setLoading(true);

//     try {
//       const { processedImage, detections } = await uploadSingleImage(selectedImageUri);
//       setProcessedImageUri(processedImage);
//       setDetections(detections);
//     } catch (error) {
//       console.warn('Error uploading image:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>YOLOv8 Single Image Demo</Text>

//       {/* Pick Image Button */}
//       <TouchableOpacity style={styles.button} onPress={pickImage}>
//         <Text style={styles.buttonText}>Pick an Image</Text>
//       </TouchableOpacity>

//       {/* Display Selected Image */}
//       {selectedImageUri && (
//         <Image source={{ uri: selectedImageUri }} style={styles.imagePreview} resizeMode="contain" />
//       )}

//       {/* Upload & Process */}
//       <TouchableOpacity style={[styles.button, { backgroundColor: '#f39c12' }]} onPress={handleUpload} disabled={loading}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Process with YOLO</Text>}
//       </TouchableOpacity>

//       {/* Processed Image + Detections */}
//       {processedImageUri && (
//         <View style={styles.resultContainer}>
//           <Text style={styles.resultTitle}>Processed Image</Text>
//           <Image source={{ uri: processedImageUri }} style={styles.processedImage} resizeMode="contain" />
//           <DetectionList detections={detections} />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#000' },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
//   button: {
//     backgroundColor: '#2980b9',
//     padding: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   buttonText: { color: '#fff', fontSize: 16 },
//   imagePreview: {
//     width: '100%',
//     height: 200,
//     marginBottom: 12,
//   },
//   resultContainer: { marginTop: 20 },
//   resultTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 8 },
//   processedImage: {
//     width: '100%',
//     height: 300,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
// });
