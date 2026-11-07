import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

const academicDetails: ReadonlyArray<readonly [string, string]> = [
  ['Nombre', 'Taymí Lizano Umpierre'],
  ['Universidad', 'Universidad de Camagüey'],
  ['Carrera', 'Ingeniería Informática'],
  ['Curso', '3er año'],
  ['Asignatura', 'React Native'],
];

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.iconFrame}>
            <Image source={require('../assets/images/icon.png')} style={styles.appIcon} />
          </View>
          <Text style={styles.title}>StickerSmash</Text>
          <Text style={styles.tagline}>¡Tu creatividad, sin límites!</Text>
          <Text style={styles.description}>
            Una aplicación multiplataforma para transformar fotografías en composiciones divertidas mediante stickers que puedes colocar libremente y guardar como imágenes PNG.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Datos académicos</Text>
          {academicDetails.map(([label, value]) => (
            <View key={label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>¿Qué puedes hacer?</Text>
          <Feature emoji="🖼️" title="Elegir una fotografía" description="Selecciona una imagen desde la galería del móvil o desde tu ordenador." />
          <Feature emoji="✨" title="Añadir y mover stickers" description="Explora el selector inferior y arrastra cada sticker hasta la posición deseada." />
          <Feature emoji="💾" title="Guardar tu composición" description="Exporta el lienzo completo en PNG: galería en Android/iOS o descarga en Web." />
        </View>

        <Text style={styles.footer}>Proyecto académico · Expo SDK 58 · React Native + TypeScript</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}><Text style={styles.featureEmoji}>{emoji}</Text></View>
      <View style={styles.featureCopy}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  page: { width: '100%', maxWidth: 700, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 28, paddingBottom: 36, gap: 18 },
  hero: { alignItems: 'center', paddingTop: 12, paddingBottom: 10 },
  iconFrame: { width: 116, height: 116, borderRadius: 30, overflow: 'hidden', backgroundColor: theme.colors.primary, marginBottom: 14 },
  appIcon: { width: '100%', height: '100%' },
  title: { color: theme.colors.text, fontSize: 27, fontWeight: '900', letterSpacing: -0.8 },
  tagline: { color: theme.colors.primary, fontSize: 15, fontWeight: '800', marginTop: 3 },
  description: { color: theme.colors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 13, maxWidth: 510 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 21, borderWidth: 1, borderColor: theme.colors.border, padding: 18, gap: 14 },
  sectionTitle: { color: theme.colors.text, fontSize: 17, fontWeight: '800', marginBottom: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 14, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border },
  detailLabel: { color: theme.colors.muted, fontSize: 13 },
  detailValue: { color: theme.colors.text, fontSize: 13, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  featureEmoji: { fontSize: 22 },
  featureCopy: { flex: 1, gap: 3 },
  featureTitle: { color: theme.colors.text, fontSize: 14, fontWeight: '800' },
  featureDescription: { color: theme.colors.muted, fontSize: 12, lineHeight: 17 },
  footer: { color: '#9589A5', textAlign: 'center', fontSize: 11, marginTop: 3 },
});
