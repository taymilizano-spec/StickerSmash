# Instalación y ejecución de StickerSmash

## 1. Abrir la carpeta

Extrae `StickerSmash.zip` y abre PowerShell/Terminal dentro de la carpeta que contiene `package.json`.

## 2. Comprobar Node y npm

```powershell
node --version
npm --version
```

Usa Node.js 22.13 o superior compatible con Expo SDK 58.

## 3. Instalar

```powershell
npm install
```

El primer `npm install` completa el `package-lock.json` de arranque si el registro npm está accesible. No uses `--force` ni `--legacy-peer-deps`. Si npm muestra `ERESOLVE`, conserva el mensaje completo y revisa la dependencia incompatible; no ocultes el conflicto.

Comprueba las versiones de librerías compatibles con el SDK:

```powershell
npx expo install --check
```

## 4. Arrancar

```powershell
npx expo start
```

En la consola de Expo:

- `w`: navegador Web.
- QR: Expo Go compatible con SDK 58 en Android/iOS.

Otros comandos:

```powershell
npx expo start --web
npx expo start --android
npx expo start --ios
npx expo start --clear
```

Los comandos `--android`/`--ios` necesitan un emulador o dispositivo preparado; iOS nativo requiere macOS para Xcode.

## 5. Verificar calidad y salida Web

```powershell
npm run check:static
npm run typecheck
npx expo-doctor
npx expo config --type public
npm run export:web
```

El éxito de `expo config --type public` confirma que Expo puede resolver la configuración, pero no sustituye la exportación ni las pruebas de dispositivo.

## 6. Comprobar guardado

### Navegador

1. Abre Inicio.
2. Pulsa Seleccionar imagen y elige un archivo.
3. Añade dos o más stickers.
4. Arrástralos a posiciones distintas.
5. Pulsa Guardar creación.
6. Abre el PNG de Descargas y comprueba visualmente la foto y cada sticker.

### Android/iOS

1. Escanea el QR en Expo Go SDK 58.
2. Selecciona una fotografía.
3. Añade y mueve stickers.
4. Guarda y concede el permiso de Fotos si lo solicita.
5. Abre Galería/Fotos y comprueba que el PNG existe y contiene la composición completa.

La verificación móvil requiere dispositivo físico/emulador con el módulo nativo de Expo Go compatible; no puede demostrarse desde una inspección estática del código.
