import { useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import type { PlacedSticker } from '@/types/sticker';

const MIN_SIZE = 60;

interface DraggableStickerProps {
  sticker: PlacedSticker;
  boardWidth: number;
  boardHeight: number;
  onPositionChange: (instanceId: string, x: number, y: number) => void;
}

/** Sticker positioned in the captured canvas and movable with a native pan gesture. */
export function DraggableSticker({
  sticker,
  boardWidth,
  boardHeight,
  onPositionChange,
}: DraggableStickerProps) {
  const dragX = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const size = Math.max(MIN_SIZE, sticker.size);

  const pan = usePanGesture({
    // Avoid a Reanimated/worklets runtime requirement; Gesture Handler uses RN Animated on JS.
    disableReanimated: true,
    onUpdate: Animated.event(
      [{ translationX: dragX, translationY: dragY }],
      { useNativeDriver: false },
    ),
    onDeactivate: (event) => {
      if (!event.canceled) {
        const nextX = Math.max(0, Math.min(Math.max(0, boardWidth - size), sticker.x + event.translationX));
        const nextY = Math.max(0, Math.min(Math.max(0, boardHeight - size), sticker.y + event.translationY));
        onPositionChange(sticker.instanceId, nextX, nextY);
      }
      dragX.setValue(0);
      dragY.setValue(0);
    },
  });

  const animatedStyle = useMemo(
    () => ({
      left: sticker.x,
      top: sticker.y,
      width: size,
      height: size,
      transform: [{ translateX: dragX }, { translateY: dragY }],
    }),
    [dragX, dragY, size, sticker.x, sticker.y],
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.sticker, animatedStyle]} accessibilityLabel={`Sticker ${sticker.label}`}>
        <Animated.Text style={styles.emoji}>{sticker.emoji}</Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  emoji: {
    fontSize: 46,
    textShadowColor: 'rgba(24, 12, 42, 0.28)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    includeFontPadding: false,
  },
});
