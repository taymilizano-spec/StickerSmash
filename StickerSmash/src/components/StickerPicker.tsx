import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { STICKERS } from '@/constants/stickers';
import { theme } from '@/constants/theme';
import type { StickerDefinition } from '@/types/sticker';

interface StickerPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (sticker: StickerDefinition) => void;
}

export function StickerPicker({ visible, onClose, onSelect }: StickerPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable accessibilityLabel="Cerrar selector" style={styles.scrim} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headingRow}>
            <View>
              <Text style={styles.title}>Añade un sticker</Text>
              <Text style={styles.subtitle}>Elige uno y arrástralo sobre tu foto</Text>
            </View>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar">
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>
          <FlatList
            data={STICKERS}
            keyExtractor={(item) => item.id}
            numColumns={4}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Añadir ${item.label}`}
                onPress={() => onSelect(item)}
                style={({ pressed }) => [styles.stickerButton, pressed && styles.selected]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.stickerLabel}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(22, 12, 39, 0.48)' },
  sheet: {
    maxHeight: '76%',
    minHeight: 390,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 14,
  },
  handle: { width: 42, height: 5, borderRadius: 5, backgroundColor: '#D7CDE3', alignSelf: 'center' },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: theme.colors.text, fontSize: 21, fontWeight: '800' },
  subtitle: { color: theme.colors.muted, fontSize: 13, marginTop: 4 },
  close: { color: theme.colors.text, fontSize: 30, fontWeight: '300', paddingHorizontal: 5 },
  grid: { paddingBottom: 10, gap: 10 },
  row: { justifyContent: 'space-between', gap: 10 },
  stickerButton: {
    width: '23%',
    minHeight: 100,
    backgroundColor: '#F8F4FF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE5FB',
    paddingVertical: 8,
    gap: 5,
  },
  selected: { backgroundColor: '#EEE3FF', borderColor: theme.colors.primary },
  emoji: { fontSize: 34 },
  stickerLabel: { color: theme.colors.muted, fontSize: 11, fontWeight: '600' },
});
