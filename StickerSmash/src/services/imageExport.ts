import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';
import type { View } from 'react-native';

export class ImageExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageExportError';
  }
}

/** Checks that the browser capture is a non-empty PNG before downloading it. */
function downloadPng(dataUri: string): void {
  const prefix = 'data:image/png;base64,';
  if (typeof document === 'undefined') {
    throw new ImageExportError('El navegador no está disponible para descargar la imagen.');
  }
  if (!dataUri.startsWith(prefix) || !dataUri.slice(prefix.length).startsWith('iVBORw0KGgo')) {
    throw new ImageExportError('La captura no devolvió un PNG válido. Inténtalo de nuevo.');
  }

  const link = document.createElement('a');
  link.href = dataUri;
  link.download = `stickersmash-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** Web implementation. Native platforms resolve imageExport.native.ts instead. */
export async function exportComposition(viewRef: RefObject<View | null>): Promise<void> {
  const target = viewRef.current;
  if (!target) throw new ImageExportError('El lienzo todavía no está listo para capturarse.');

  const dataUri = await captureRef(target, {
    format: 'png',
    quality: 1,
    result: 'data-uri',
  });
  downloadPng(dataUri);
}
