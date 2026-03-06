import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.7;

export async function compressImage(uri: string): Promise<string> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: MAX_WIDTH } }],
    { compress: JPEG_QUALITY, format: SaveFormat.JPEG },
  );
  return result.uri;
}
