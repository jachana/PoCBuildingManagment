import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors, spacing } from '@/theme';

interface ImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImagePickerComponent({ images, onImagesChange, maxImages = 5 }: ImagePickerProps) {
  const pickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Limite', `Maximo ${maxImages} imagenes`);
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
              <Text style={styles.removeBtnText}>x</Text>
            </TouchableOpacity>
          </View>
        ))}
        {images.length < maxImages && (
          <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
            <Text style={styles.addBtnText}>+</Text>
            <Text style={styles.addBtnLabel}>AGREGAR</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  imageWrapper: { width: 100, height: 100, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: colors.surfaceBorder },
  image: { width: '100%', height: '100%' },
  removeBtn: {
    position: 'absolute', top: 4, right: 4, width: 22, height: 22,
    borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center',
  },
  removeBtnText: { color: colors.textPrimary, fontSize: 12, fontWeight: '500' },
  addBtn: {
    width: 100, height: 100, borderRadius: 4, borderWidth: 1,
    borderColor: colors.surfaceBorder, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.surface,
  },
  addBtnText: { fontSize: 24, color: colors.gold, fontWeight: '200' },
  addBtnLabel: { fontSize: 9, color: colors.textMuted, marginTop: 2, letterSpacing: 1 },
});
