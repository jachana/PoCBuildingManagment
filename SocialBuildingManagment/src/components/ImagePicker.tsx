import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImagePickerComponent({ images, onImagesChange, maxImages = 5 }: ImagePickerProps) {
  const pickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Límite', `Máximo ${maxImages} imágenes`);
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: maxImages - images.length,
    });

    if (!result.canceled) {
      const compressed = await Promise.all(
        result.assets.map(async (asset) => {
          const manipulated = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
          );
          return manipulated.uri;
        }),
      );
      onImagesChange([...images, ...compressed].slice(0, maxImages));
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} contentFit="cover" />
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(index)}>
              <Text style={styles.removeBtnText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {images.length < maxImages && (
          <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
            <Text style={styles.addBtnText}>+</Text>
            <Text style={styles.addBtnLabel}>Agregar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  imageWrapper: { width: 100, height: 100, borderRadius: 8, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  removeBtn: {
    position: 'absolute', top: 4, right: 4, width: 24, height: 24,
    borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center',
  },
  removeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  addBtn: {
    width: 100, height: 100, borderRadius: 8, borderWidth: 2,
    borderColor: '#ddd', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { fontSize: 28, color: '#999' },
  addBtnLabel: { fontSize: 11, color: '#999', marginTop: 2 },
});
