import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { theme } from '@/constants/theme';

interface EditorToolbarProps {
  onPickImage: () => void;
  onAddSticker: () => void;
  onSave: () => void;
  saving: boolean;
  hasImage: boolean;
}

export function EditorToolbar({ onPickImage, onAddSticker, onSave, saving, hasImage }: EditorToolbarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.half}>
          <AppButton label="Seleccionar imagen" icon={<Text style={styles.icon}>▧</Text>} onPress={onPickImage} variant="secondary" />
        </View>
        <View style={styles.half}>
          <AppButton label="Añadir stickers" icon={<Text style={styles.icon}>☺</Text>} onPress={onAddSticker} variant="secondary" disabled={!hasImage} />
        </View>
      </View>
      <AppButton
        label={saving ? 'Guardando…' : 'Guardar creación'}
        icon={<Text style={styles.saveIcon}>⇩</Text>}
        onPress={onSave}
        loading={saving}
        disabled={!hasImage || saving}
        fullWidth
      />
      {!hasImage ? <Text style={styles.helper}>Selecciona una fotografía para activar el guardado.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  icon: { color: theme.colors.primary, fontSize: 20, fontWeight: '800' },
  saveIcon: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  helper: { color: theme.colors.muted, textAlign: 'center', fontSize: 12 },
});
