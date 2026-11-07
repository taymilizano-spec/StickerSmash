import { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/AppButton';
import { DraggableSticker } from '@/components/DraggableSticker';
import { EditorToolbar } from '@/components/EditorToolbar';
import { StickerPicker } from '@/components/StickerPicker';
import { theme } from '@/constants/theme';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useMediaLibraryPermission } from '@/hooks/useMediaLibraryPermission';
import { exportComposition } from '@/services/imageExport';
import type { CanvasSize, PlacedSticker, StickerDefinition } from '@/types/sticker';

const DEFAULT_CANVAS: CanvasSize = { width: 320, height: 400 };
const STICKER_SIZE = 68;

export default function HomeScreen() {
  const canvasRef = useRef<View | null>(null);
  const savingLock = useRef(false);
  const requestMediaPermission = useMediaLibraryPermission();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(DEFAULT_CANVAS);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const reportError = useCallback((description: string) => {
    setMessageType('error');
    setMessage(description);
    if (Platform.OS !== 'web') Alert.alert('No se pudo completar la acción', description);
  }, []);

  const pickImage = useImagePicker({
    onImageSelected: (uri) => {
      setBackgroundImage(uri);
      setImageLoaded(false);
      setMessage(null);
      setStickers([]);
    },
    onError: reportError,
  });

  const addSticker = useCallback((definition: StickerDefinition) => {
    const maxX = Math.max(0, canvasSize.width - STICKER_SIZE);
    const maxY = Math.max(0, canvasSize.height - STICKER_SIZE);
    const nextSticker: PlacedSticker = {
      ...definition,
      instanceId: `${definition.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x: Math.min(maxX, Math.max(0, (canvasSize.width - STICKER_SIZE) / 2)),
      y: Math.min(maxY, Math.max(0, (canvasSize.height - STICKER_SIZE) / 2)),
      size: STICKER_SIZE,
    };
    setStickers((current) => [...current, nextSticker]);
    setPickerVisible(false);
    setMessage(null);
  }, [canvasSize]);

  const moveSticker = useCallback((instanceId: string, x: number, y: number) => {
    setStickers((current) => current.map((sticker) => (
      sticker.instanceId === instanceId ? { ...sticker, x, y } : sticker
    )));
  }, []);

  const saveCreation = useCallback(async () => {
    if (savingLock.current || saving) return;
    if (!backgroundImage) {
      reportError('Primero selecciona una fotografía para crear tu composición.');
      return;
    }
    if (!imageLoaded) {
      reportError('La fotografía todavía se está cargando. Espera un instante e inténtalo de nuevo.');
      return;
    }

    savingLock.current = true;
    setSaving(true);
    setMessage(null);
    try {
      if (Platform.OS !== 'web') await requestMediaPermission();
      await exportComposition(canvasRef);
      setMessageType('success');
      setMessage(Platform.OS === 'web'
        ? 'PNG generado y enviado a las descargas del navegador.'
        : 'Tu composición PNG se guardó en la galería del dispositivo.');
      if (Platform.OS !== 'web') Alert.alert('¡Creación guardada!', 'La imagen PNG ya está en la galería del dispositivo.');
    } catch (error) {
      reportError(error instanceof Error ? error.message : 'Ocurrió un error inesperado al exportar la imagen.');
    } finally {
      savingLock.current = false;
      setSaving(false);
    }
  }, [backgroundImage, imageLoaded, reportError, requestMediaPermission, saving]);

  const onCanvasLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) setCanvasSize({ width, height });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TU TALLER CREATIVO</Text>
            <Text style={styles.title}>Sticker<Text style={styles.titleAccent}>Smash</Text></Text>
            <Text style={styles.subtitle}>¡Crea, edita y guarda tus mejores momentos!</Text>
          </View>
          <View style={styles.logoBubble}><Text style={styles.logoEmoji}>👑</Text></View>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Mi creación</Text>
          <Text style={styles.stepLabel}>01 · EDITAR</Text>
        </View>

        <View
          ref={canvasRef}
          collapsable={false}
          onLayout={onCanvasLayout}
          style={styles.canvas}
          accessibilityLabel="Lienzo de edición con fotografía y stickers"
        >
          {backgroundImage ? (
            <Image
              source={{ uri: backgroundImage }}
              style={styles.backgroundImage}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(false);
                reportError('No se pudo cargar la fotografía seleccionada. Elige otra imagen e inténtalo de nuevo.');
              }}
            />
          ) : (
            <View style={styles.emptyCanvas}>
              <View style={styles.emptyIcon}><Text style={styles.emptyEmoji}>▧</Text></View>
              <Text style={styles.emptyTitle}>Tu lienzo te espera</Text>
              <Text style={styles.emptyText}>Selecciona una fotografía de tu galería o de tu ordenador para comenzar.</Text>
              <Pressable onPress={pickImage} accessibilityRole="button" style={styles.emptyAction}>
                <Text style={styles.emptyActionText}>Elegir fotografía</Text>
              </Pressable>
            </View>
          )}
          {stickers.map((sticker) => (
            <DraggableSticker
              key={sticker.instanceId}
              sticker={sticker}
              boardWidth={canvasSize.width}
              boardHeight={canvasSize.height}
              onPositionChange={moveSticker}
            />
          ))}
          <View pointerEvents="none" style={styles.canvasWatermark}>
            <Text style={styles.watermarkText}>StickerSmash</Text>
          </View>
        </View>

        <View style={styles.tipRow}>
          <Text style={styles.tipIcon}>✦</Text>
          <Text style={styles.tipText}>Consejo: mantén pulsado un sticker y arrástralo para colocarlo donde quieras.</Text>
        </View>

        <EditorToolbar
          onPickImage={pickImage}
          onAddSticker={() => setPickerVisible(true)}
          onSave={saveCreation}
          saving={saving}
          hasImage={Boolean(backgroundImage && imageLoaded)}
        />

        {message ? (
          <View style={[styles.message, messageType === 'error' ? styles.errorMessage : styles.successMessage]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {stickers.length > 0 ? (
          <View style={styles.stickerFooter}>
            <Text style={styles.stickerCount}>{stickers.length} {stickers.length === 1 ? 'sticker añadido' : 'stickers añadidos'}</Text>
            <Pressable onPress={() => setStickers([])} accessibilityRole="button">
              <Text style={styles.clearText}>Quitar todos</Text>
            </Pressable>
          </View>
        ) : null}
        <View style={styles.bottomNote}>
          <Text style={styles.bottomNoteText}>Hecho con creatividad · Universidad de Camagüey</Text>
        </View>
      </ScrollView>

      <StickerPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={addSticker}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  page: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 34, gap: 17, width: '100%', maxWidth: 760, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  eyebrow: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 2.1, marginBottom: 4 },
  title: { color: theme.colors.text, fontSize: 31, fontWeight: '900', letterSpacing: -1.3 },
  titleAccent: { color: theme.colors.primary },
  subtitle: { color: theme.colors.muted, fontSize: 13, marginTop: 2 },
  logoBubble: { width: 58, height: 58, borderRadius: 20, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D8C7FA' },
  logoEmoji: { fontSize: 29 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 },
  sectionTitle: { color: theme.colors.text, fontSize: 19, fontWeight: '800' },
  stepLabel: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, backgroundColor: theme.colors.primarySoft, overflow: 'hidden', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20 },
  canvas: { width: '100%', aspectRatio: 4 / 4.6, minHeight: 310, maxHeight: 570, borderRadius: 24, overflow: 'hidden', backgroundColor: '#EAE2F6', borderWidth: 1, borderColor: '#DDD0EF', position: 'relative' },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  emptyCanvas: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, backgroundColor: '#F1EAFB' },
  emptyIcon: { width: 74, height: 74, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 17, elevation: 2 },
  emptyEmoji: { color: theme.colors.primary, fontSize: 38, fontWeight: '800' },
  emptyTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 8, maxWidth: 310 },
  emptyAction: { backgroundColor: theme.colors.primary, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 14, marginTop: 18 },
  emptyActionText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  canvasWatermark: { position: 'absolute', right: 11, bottom: 9, backgroundColor: 'rgba(25,12,45,0.26)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10 },
  watermarkText: { color: 'rgba(255,255,255,0.88)', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0E9FB', paddingHorizontal: 13, paddingVertical: 11, borderRadius: 14 },
  tipIcon: { color: theme.colors.primary, fontSize: 17 },
  tipText: { flex: 1, color: '#514269', fontSize: 12, lineHeight: 17 },
  message: { borderRadius: 12, paddingVertical: 11, paddingHorizontal: 13 },
  successMessage: { backgroundColor: '#E7F5EE' },
  errorMessage: { backgroundColor: '#FDEAE8' },
  messageText: { color: theme.colors.text, fontSize: 12, lineHeight: 17 },
  stickerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  stickerCount: { color: theme.colors.muted, fontSize: 12 },
  clearText: { color: theme.colors.danger, fontWeight: '700', fontSize: 12 },
  bottomNote: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border, paddingTop: 13, marginTop: 2 },
  bottomNoteText: { color: '#9589A5', textAlign: 'center', fontSize: 11 },
});
