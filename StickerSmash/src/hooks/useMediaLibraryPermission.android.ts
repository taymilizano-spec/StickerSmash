import { useCallback } from 'react';

/**
 * Android: the editor only creates a new image; it does not read the user's
 * entire photo library. On Android 13+ MediaStore allows an app to create its
 * own media assets without broad READ_MEDIA_* permission. Avoid querying
 * expo-media-library permissions here because Expo Go intentionally rejects
 * photo/video library permission checks. The image picker handles access to
 * the one image selected by the user.
 */
export function useMediaLibraryPermission(): () => Promise<void> {
  return useCallback(async () => undefined, []);
}
