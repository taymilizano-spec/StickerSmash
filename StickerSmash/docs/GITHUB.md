# Publicación del repositorio GitHub

## Datos propuestos

- Nombre del repositorio: `stickersmash`
- Descripción: `Aplicación multiplataforma de edición de fotografías con stickers, desarrollada con Expo SDK 58, Expo Router y TypeScript.`
- Rama principal: `main`
- Visibilidad recomendada inicialmente: **privado**; la estudiante puede cambiarlo a público desde Settings → General → Danger Zone cuando decida compartirlo como portafolio.

## Publicación manual

1. En GitHub, crea un repositorio vacío llamado `stickersmash`. No marques las opciones para añadir README, `.gitignore` ni licencia porque esos archivos ya están en este proyecto.
2. En una terminal, abre la carpeta que contiene `package.json`.
3. Ejecuta:

   ```bash
   git init
   git add .
   git commit -m "StickerSmash: proyecto Expo SDK 58"
   git branch -M main
   git remote add origin https://github.com/<USUARIO>/stickersmash.git
   git push -u origin main
   ```

4. Sustituye `<USUARIO>` por tu nombre de usuario de GitHub.
5. Confirma que GitHub muestra `README.md`, `app/`, `src/`, `assets/`, `docs/` y `package.json`.

## Seguridad

No subas `node_modules`, carpetas `.expo`, archivos `.env`, credenciales, tokens ni datos privados. El `.gitignore` del proyecto ya excluye dependencias, cachés y archivos temporales comunes.

## Historial sugerido

Si decides dividir la evolución en commits adicionales, usa commits reales y posteriores a cambios concretos. No fabriques fechas ni commits retroactivos para aparentar un historial que no existió.
