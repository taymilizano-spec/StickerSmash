# Registro de validación

Fecha de preparación del paquete: 6 de noviembre de 2026.

## Comprobaciones realizadas en este entorno

- [x] Inspección de la estructura y los archivos fuente incluidos.
- [x] Comprobación programática del JSON de `package.json`, `app.json` y `tsconfig.json`.
- [x] Comprobación de que los archivos de icono, splash y favicon referenciados por `app.json` existen.
- [x] Revisión estática de imports locales, rutas relativas, nombres de exports/imports y convenciones del proyecto mediante `node scripts/check-project.mjs` (17 archivos TS/TSX en esta revisión).
- [x] Inclusión de `expo-symbols ~58.0.4` en el manifiesto para resolver los iconos Material (`md`) de NativeTabs en Android.
- [x] Separación del hook Android de permisos: no consulta permisos de lectura de toda la fototeca en Expo Go; iOS conserva el permiso de escritura. Esta corrección requiere prueba real en el Android de la estudiante.
- [x] Transpilación sintáctica de los 16 archivos TS/TSX con la API del compilador TypeScript disponible globalmente (esto no sustituye `tsc --noEmit` ni verifica los tipos de las bibliotecas).
- [x] Comprobación de que el ZIP no contiene `node_modules`.

## Bloqueos del entorno

La resolución de paquetes del registro npm no estuvo disponible (`EAI_AGAIN` contra `registry.npmjs.org`). No se pudieron descargar las dependencias. La transpilación sintáctica no detectó errores de parseo, pero no verifica tipos ni APIs externas. El manifiesto cambió para añadir `expo-symbols`, y el hook de permisos Android se separó; esas modificaciones tampoco han pasado todavía una instalación y compilación completas en este entorno. Por tanto, en este entorno no fue posible ejecutar de forma válida:

- [ ] `npm install` de todo el árbol de dependencias.
- [ ] TypeScript con las declaraciones reales de Expo/React Native (`npm run typecheck`).
- [ ] Expo Doctor (`npx expo-doctor`).
- [ ] Exportación de producción Web (`npm run export:web`).

El `package-lock.json` incluido contiene el manifiesto raíz y sirve de punto de partida; **no es todavía un lockfile transitivo reproducible**. Ejecuta `npm install` con el registro disponible para completarlo. Después, guarda la versión completa del lockfile en la entrega.

## Pruebas que requieren ejecución de la aplicación

- [ ] Abrir las pestañas en navegador y Expo Go.
- [ ] Elegir imágenes en navegador/Android/iOS.
- [ ] Probar el bottom sheet y los gestos reales.
- [ ] Confirmar el PNG descargado en Web.
- [ ] Confirmar el PNG en la Galería/Fotos del dispositivo físico o emulador.
- [ ] Comprobar el splash y el icono tras instalar la aplicación.

**Conclusión:** el paquete contiene código fuente y configuración preparados para instalar y verificar; no se certifica aquí una compilación ni funcionamiento real en dispositivo porque la instalación de dependencias y las pruebas de ejecución no pudieron realizarse.
