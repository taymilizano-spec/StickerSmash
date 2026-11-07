import { useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';

/** iOS: requests write-only access to the Photos library. Android has a dedicated no-op implementation. */
export function useMediaLibraryPermission(): () => Promise<void> {
  const [, requestPermission] = MediaLibrary.usePermissions({
    writeOnly: true,
  });

  return useCallback(async () => {
    const permission = await requestPermission();
    if (!permission.granted) {
      const nextStep = permission.canAskAgain
        ? 'Concede el permiso de Fotos para poder guardar la creación.'
        : 'Activa el permiso de Fotos para StickerSmash desde los ajustes del dispositivo.';
      throw new Error(`No se concedió permiso para guardar en la galería. ${nextStep}`);
    }
  }, [requestPermission]);
}
