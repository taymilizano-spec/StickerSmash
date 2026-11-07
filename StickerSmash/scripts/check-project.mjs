import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const errors = [];
const warnings = [];
const ok = (message) => console.log(`OK  ${message}`);
const fail = (message) => errors.push(message);

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    fail(`${relativePath}: JSON inválido o inaccesible (${error instanceof Error ? error.message : String(error)})`);
    return null;
  }
}

function walk(directory) {
  const found = [];
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...walk(relative));
    else found.push(relative);
  }
  return found;
}

const pkg = readJson('package.json');
const appConfig = readJson('app.json');
const tsconfig = readJson('tsconfig.json');
const lock = readJson('package-lock.json');

if (pkg && appConfig && tsconfig && lock) {
  if (!pkg.dependencies?.expo?.startsWith('~58.')) fail('package.json no fija Expo SDK 58.');
  else ok(`Expo fijado a ${pkg.dependencies.expo}`);

  if (pkg.dependencies.react !== '19.3.0' || pkg.dependencies['react-native'] !== '0.88.0') {
    fail('React y React Native no corresponden a SDK 58 (React 19.3.0 / RN 0.88.0).');
  } else ok('React 19.3.0 y React Native 0.88.0');

  if (tsconfig.compilerOptions?.strict !== true) fail('TypeScript strict no está activado.');
  else ok('TypeScript strict activado');

  if (lock.name !== pkg.name || lock.version !== pkg.version) fail('El encabezado del package-lock no coincide con package.json.');
  else ok('Identidad del package-lock coincide con package.json');

  const lockRoot = lock.packages?.[''];
  if (!lockRoot || JSON.stringify(lockRoot.dependencies ?? {}) !== JSON.stringify(pkg.dependencies)
      || JSON.stringify(lockRoot.devDependencies ?? {}) !== JSON.stringify(pkg.devDependencies)) {
    fail('El manifiesto raíz del package-lock no coincide con package.json.');
  } else {
    ok('Manifiesto raíz del package-lock coincide con package.json');
    if (Object.keys(lock.packages).length === 1) {
      warnings.push('package-lock.json no tiene el árbol transitivo: ejecutar npm install con el registro disponible antes de usar npm ci.');
    }
  }

  const expo = appConfig.expo ?? {};
  for (const [label, value] of [
    ['icon', expo.icon],
    ['splash.image', expo.splash?.image],
    ['web.favicon', expo.web?.favicon],
  ]) {
    if (!value) fail(`Falta la ruta app.json: ${label}`);
    else if (!fs.existsSync(path.join(root, value))) fail(`No existe el recurso ${label}: ${value}`);
    else ok(`Recurso ${label} presente`);
  }

  for (const route of ['app/index.tsx', 'app/about.tsx', 'app/_layout.tsx']) {
    if (!fs.existsSync(path.join(root, route))) fail(`Falta la ruta Expo Router: ${route}`);
    else ok(`Ruta Expo Router presente: ${route}`);
  }

  const pickerPath = path.join(root, 'src/components/StickerPicker.tsx');
  const homePath = path.join(root, 'app/index.tsx');
  if (!fs.existsSync(pickerPath) || !/export\s+function\s+StickerPicker\b/.test(fs.readFileSync(pickerPath, 'utf8'))) {
    fail('StickerPicker no está declarado como export nombrado.');
  } else if (!/import\s+\{\s*StickerPicker\s*\}\s+from\s+['"]@\/components\/StickerPicker['"]/.test(fs.readFileSync(homePath, 'utf8'))) {
    fail('La importación de StickerPicker no coincide con su export nombrado.');
  } else ok('StickerPicker: importación y export nombrado coinciden');

  const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
  for (const ignored of ['node_modules/', '.expo/']) {
    if (!gitignore.includes(ignored)) fail(`.gitignore no excluye ${ignored}`);
    else ok(`.gitignore excluye ${ignored}`);
  }

  const allFiles = [
    ...walk('app').filter((file) => /\.(ts|tsx)$/.test(file)),
    ...walk('src').filter((file) => /\.(ts|tsx)$/.test(file)),
  ];

  for (const sourceFile of allFiles) {
    const source = fs.readFileSync(path.join(root, sourceFile), 'utf8');
    const importPattern = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/gs;
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[2];
      if (!(specifier.startsWith('@/') || specifier.startsWith('.'))) continue;
      const base = specifier.startsWith('@/')
        ? path.join('src', specifier.slice(2))
        : path.join(path.dirname(sourceFile), specifier);
      const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')];
      const resolved = candidates.find((candidate) => fs.existsSync(path.join(root, candidate)));
      if (!resolved) {
        fail(`${sourceFile}: import local sin destino: ${specifier}`);
        continue;
      }

      const importedNames = match[1].split(',').map((item) => item.trim()).filter(Boolean)
        .map((item) => item.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim());
      const target = fs.readFileSync(path.join(root, resolved), 'utf8');
      for (const importedName of importedNames) {
        const escaped = importedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const namedExport = new RegExp(`export\\s+(?:declare\\s+)?(?:async\\s+)?(?:function|const|let|var|class|interface|type|enum)\\s+${escaped}\\b`);
        const exportList = new RegExp(`export\\s*\\{[^}]*\\b${escaped}\\b[^}]*\\}`, 's');
        if (!namedExport.test(target) && !exportList.test(target)) {
          fail(`${sourceFile}: ${importedName} no aparece como export nombrado en ${resolved}`);
        }
      }
    }

    const requirePattern = /require\(['"]([^'"]+)['"]\)/g;
    for (const match of source.matchAll(requirePattern)) {
      if (!match[1].startsWith('.')) continue;
      const base = path.join(path.dirname(sourceFile), match[1]);
      const candidates = [base, `${base}.png`, `${base}.jpg`, `${base}.jpeg`, `${base}.webp`, `${base}.ts`, `${base}.tsx`];
      if (!candidates.some((candidate) => fs.existsSync(path.join(root, candidate)))) {
        fail(`${sourceFile}: recurso de require inexistente: ${match[1]}`);
      }
    }
  }
  ok(`Inspección de ${allFiles.length} archivos TS/TSX e imports locales`);
}

if (fs.existsSync(path.join(root, 'node_modules'))) warnings.push('node_modules existe; no debe incluirse en el ZIP de entrega.');
if (errors.length) {
  console.error('\nErrores:');
  for (const error of errors) console.error(`- ${error}`);
}
if (warnings.length) {
  console.warn('\nAvisos:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}
console.log(`\nResultado: ${errors.length} error(es), ${warnings.length} aviso(s).`);
process.exitCode = errors.length ? 1 : 0;
