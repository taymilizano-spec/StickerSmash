import { Asset } from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';
import type { View } from 'react-native';

export class ImageExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageExportError';
  }
}

/** Android/iOS implementation: capture to a temporary PNG and create a gallery asset. */
export async function exportComposition(viewRef: RefObject<View | null>): Promise<void> {
  const target = viewRef.current;
  if (!target) throw new ImageExportError('El lienzo todavía no está listo para capturarse.');

  const localUri = await captureRef(target, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
  });
  if (typeof localUri !== 'string' || !localUri.startsWith('file://')) {
    throw new ImageExportError('La captura no generó un archivo PNG temporal local.');
  }

  // Asset.create rejects if the file cannot be imported into the system photo library.
  const asset = await Asset.create(localUri);
  if (!asset.id) throw new ImageExportError('El dispositivo no confirmó la creación del archivo en la galería.');

  const filename = await asset.getFilename();
  if (!filename.toLowerCase().endsWith('.png')) {
    throw new ImageExportError(`La galería creó un archivo inesperado (${filename}) en lugar de un PNG.`);
  }
}
