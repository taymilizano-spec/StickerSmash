import { useCallback } from 'react';

/** Web writes through a browser download and does not access the native photo library. */
export function useMediaLibraryPermission(): () => Promise<void> {
  return useCallback(async () => undefined, []);
}
