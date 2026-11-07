export interface StickerDefinition {
  id: string;
  emoji: string;
  label: string;
  category: 'fantasia' | 'emociones' | 'diversion' | 'naturaleza';
}

export interface PlacedSticker extends StickerDefinition {
  instanceId: string;
  x: number;
  y: number;
  size: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}
