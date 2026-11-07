# Estado de `package-lock.json`

El manifiesto incluye `expo-symbols ~58.0.4`, requerido por Expo Router para representar iconos `md` en Android con SDK 58.

Durante el empaquetado, el registro `registry.npmjs.org` respondió `EAI_AGAIN`; por eso el lockfile solo contiene la declaración raíz y no el árbol transitivo. No es todavía reproducible con `npm ci`.

Cuando el registro esté accesible, ejecuta en la raíz del proyecto:

```bash
npm install
npm ls --depth=0
npx expo install --check
```

Conserva el `package-lock.json` generado por npm en el repositorio. No uses `--force` ni `--legacy-peer-deps` para resolver discrepancias.
