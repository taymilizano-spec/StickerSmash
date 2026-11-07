import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerHandlers {
  onImageSelected: (uri: string) => void;
  onError: (message: string) => void;
}

export function useImagePicker({ onImageSelected, onError }: ImagePickerHandlers) {
  return useCallback(async () => {
    try {
      // The operating-system photo picker grants access to the selected image.
      // On Web, this opens the computer's file chooser from this user interaction.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        if (selectedAsset) onImageSelected(selectedAsset.uri);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'No se pudo abrir el selector de imágenes.');
    }
  }, [onError, onImageSelected]);
}
