# StickerSmash

Aplicación académica multiplataforma desarrollada con **Expo SDK 58**, **Expo Router**, **React Native** y **TypeScript estricto**. Permite elegir una fotografía, colocar stickers que se pueden arrastrar y exportar la composición completa en PNG.

## Datos académicos

- **Estudiante:** Taymí Lizano Umpierre
- **Universidad:** Universidad de Camagüey
- **Carrera:** Ingeniería Informática
- **Curso:** 3er año
- **Asignatura:** React Native
- **Aplicación:** StickerSmash

## Funcionalidades incluidas

- Navegación de dos pestañas con `NativeTabs` de Expo Router: **Inicio** y **About**.
- Iconos Material Design de las pestañas Android mediante `expo-symbols` (dependencia opcional requerida por Expo Router para `md`).
- Pantalla de edición adaptable con Flexbox y componentes de React Native.
- Selección de una imagen mediante `expo-image-picker` (galería en móvil y selector de archivos en Web).
- Panel inferior modal para elegir entre stickers.
- Arrastre táctil de stickers con `react-native-gesture-handler`.
- Captura del lienzo completo con `react-native-view-shot`.
- Android: creación del PNG en la galería con `Asset.create()` sin consultar permisos de lectura de toda la fototeca; el selector del sistema gestiona la fotografía elegida.
- iOS: solicitud de acceso de solo escritura a Fotos y creación del PNG con `Asset.create()`.
- Web: generación de un PNG Data URI y descarga en el navegador.
- Icono, splash screen, favicon, barra de estado y permisos declarados en `app.json`.

## Requisitos previos

- Node.js **22.13 o superior** (o una rama compatible posterior admitida por Expo SDK 58).
- npm incluido con Node.
- Expo Go compatible con SDK 58 para probar en Android/iOS. Si la tienda de tu dispositivo aún no ofrece esa versión, utiliza un development build; no cambies el SDK a ciegas.
- Para compilar una aplicación nativa independiente: Android Studio/JDK o Xcode en macOS, según plataforma. Para la práctica con Expo Go no hace falta generar esos binarios.

## Instalación en Windows, macOS o Linux

1. Descomprime el proyecto y abre una terminal dentro de la carpeta `StickerSmash`.
2. Comprueba las versiones:

   ```bash
   node --version
   npm --version
   ```

3. Instala las dependencias declaradas:

   ```bash
   npm install
   ```

4. Comprueba que Expo reconoce las versiones compatibles del SDK (incluido `expo-symbols`):

   ```bash
   npx expo install --check
   ```

5. Inicia Expo:

   ```bash
   npx expo start
   ```

   - Pulsa `w` para abrir la versión Web.
   - Escanea el QR con Expo Go para abrir Android/iOS, usando una versión de Expo Go compatible con SDK 58.
   - También puedes ejecutar `npx expo start --web`, `npx expo start --android` o `npx expo start --ios`.

Si Metro conserva una caché antigua, detén el servidor y ejecuta:

```bash
npx expo start --clear
```

## Comprobaciones del proyecto

```bash
npm run check:static
npm run typecheck
npx expo-doctor
npx expo config --type public
npm run export:web
```

`npm run check` ejecuta las cuatro últimas comprobaciones automatizadas (`typecheck`, Expo Doctor y exportación Web, además de la inspección estática). Para revisar por separado cada fase se recomienda ejecutar los comandos anteriores uno a uno.

## Cómo comprobar cada funcionalidad

1. **Inicio/About:** cambia entre las dos pestañas y confirma que About muestra los datos académicos.
2. **Selector de imágenes:** pulsa «Seleccionar imagen» y elige una foto local.
3. **Bottom sheet:** pulsa «Añadir stickers»; selecciona varios y comprueba que el panel se cierra después de cada selección.
4. **Gestos:** arrastra cada sticker a distintas zonas del lienzo. Deben moverse sin salir de los límites visibles.
5. **Guardar:** pulsa «Guardar creación». En iOS concede el permiso de escritura a Fotos cuando se solicite. En Android no se solicita acceso general a la biblioteca: se crea un nuevo elemento multimedia. Verifica el PNG desde Galería/Fotos. En Web acepta la descarga y abre el PNG descargado para comprobar que aparecen tanto la foto como todos los stickers.
6. **Producción visual:** confirma que se ve el icono y la pantalla splash al abrir una instalación nativa y que la barra de estado es legible.

La captura que se debe comprobar es el contenido del lienzo, no la pantalla completa de la aplicación. La carpeta `evidencias/` incluye instrucciones para incorporar capturas reales de estas pruebas.

## Estructura

```text
StickerSmash/
├── app/                      # Rutas Expo Router y pestañas nativas
├── assets/
│   ├── branding/             # Concepto gráfico (no es evidencia de ejecución)
│   └── images/               # Icono, splash y favicon
├── docs/                     # Instalación, validación y checklist
├── evidencias/               # Capturas/GIF reales por incorporar
├── scripts/                  # Comprobaciones estáticas del repositorio
├── src/
│   ├── components/           # Botones, selector modal, stickers y toolbar
│   ├── constants/            # Tema y catálogo de stickers
│   ├── hooks/                # Selector de imágenes
│   ├── services/              # Exportación PNG
│   └── types/                # Tipos de dominio
├── app.json
├── package.json
└── package-lock.json
```

## Capítulos del tutorial de Expo

| Capítulo del PDF | Implementación en este proyecto |
|---|---|
| 1. Creación del proyecto | Expo SDK 58, TypeScript y Expo Router |
| 2. Navegación | `NativeTabs` con Inicio y About; `expo-symbols` para los iconos `md` en Android |
| 3. Diseño de pantallas | Flexbox, SafeAreaView y componentes nativos |
| 4. Selector de imágenes | `expo-image-picker` |
| 5. Selector modal | `StickerPicker` con `Modal` inferior |
| 6. Gestos táctiles | `usePanGesture` de Gesture Handler 3 |
| 7. Captura y almacenamiento | `react-native-view-shot`, `Asset.create()` y descarga Web |
| 8. Configuración de producción | Status bar, splash, icono, favicon y permisos en `app.json` |

## Retos técnicos y decisiones

- **Compatibilidad por SDK:** el proyecto fija Expo SDK 58 y sus versiones principales compatibles; evita mezclar paquetes de SDK distintos.
- **Selector de imágenes:** el selector del sistema gestiona el acceso a la imagen seleccionada, sin pedir acceso amplio a toda la fototeca para escoger un único archivo.
- **Arrastre:** el gesto actualiza la posición visual y confirma la nueva posición al terminar; se limita al tamaño del lienzo.
- **Captura:** el área que se captura contiene la imagen de fondo y todos los stickers. El botón tiene bloqueo durante el guardado y propaga errores en vez de simular un éxito.
- **Permisos y biblioteca:** Android utiliza un hook específico que no consulta permisos de lectura de fotos en Expo Go; `Asset.create()` registra el nuevo archivo en MediaStore. iOS conserva el permiso de escritura de Fotos. `expo-image-picker` gestiona el acceso a la imagen individual seleccionada.
- **Web:** el renderizado usa `html2canvas-pro` como dependencia explícita de la ruta Web de `react-native-view-shot`.

## GitHub y entrega

El código está organizado para publicarse en un repositorio llamado `stickersmash`. La publicación remota requiere conectar la cuenta GitHub desde ChatGPT o autenticar GitHub CLI en el ordenador. Si se publica manualmente, crea un repositorio vacío (sin README, licencia ni `.gitignore` iniciales) y ejecuta desde esta carpeta:

```bash
git init
git add .
git commit -m "StickerSmash: proyecto Expo SDK 58"
git branch -M main
git remote add origin https://github.com/<USUARIO>/stickersmash.git
git push -u origin main
```

No incluyas `node_modules`, claves, tokens ni archivos `.env`. Añade las evidencias reales a `evidencias/` cuando termines las pruebas en el navegador o dispositivo.

## Estado de verificación de este paquete

La conexión al registro npm no estuvo disponible durante la preparación de este ZIP (`EAI_AGAIN` en `registry.npmjs.org`). Por esa razón, **no se pudo ejecutar una instalación completa ni generar un lockfile con el árbol transitivo real**. Se entrega un `package-lock.json` de arranque con el manifiesto raíz; después de recuperar Internet, ejecuta `npm install` para resolver y guardar el árbol real. No uses `npm ci` hasta que ese comando haya terminado correctamente y haya generado el lockfile completo.

No se afirma que TypeScript, Expo Doctor, la exportación Web ni el guardado móvil estén aprobados: esas pruebas quedan pendientes hasta instalar dependencias y ejecutar la app. La validación estática local tiene su propio comando y resultado en `docs/VALIDACION.md`.
