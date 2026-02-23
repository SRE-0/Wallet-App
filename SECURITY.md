# Seguridad — manejo de secretos

Este documento describe pasos prácticos para evitar exponer secretos (API keys, client IDs) y cómo remediar exposiciones ya ocurridas.

1) Uso recomendado en producción — EAS Secrets (Expo)
- Instala EAS CLI: `npm install -g eas-cli`.
- Crea secrets en tu proyecto (no se almacenan en el repositorio):

  ```bash
  eas secret:create --name EXPO_CLIENT_ID --value "<tu-client-id>"
  eas secret:create --name EXPO_PUBLIC_FIREBASE_API_KEY --value "<tu-api-key>"
  ```

- En tus builds en EAS, define que estas variables se inyecten como variables de entorno. Consulta https://docs.expo.dev/eas/secret-management/.

2) Desarrollo local
- Copia `.env.example` a `.env` y rellena valores locales.
- Para cargar `.env` localmente con `dotenv-cli`:

  ```bash
  npm install --save-dev dotenv-cli
  # luego en package.json puedes añadir:
  # "start:env": "dotenv -e .env expo start"
  npm run start:env
  ```

- Nota: en Expo las variables que empiezan por `EXPO_PUBLIC_` están pensadas para ser públicas en el bundle. Evita poner secretos sensibles sin un backend.

3) Rotación de claves expuestas (por ejemplo Firebase)
- Si una clave pública (ej. Firebase Web API key) estuvo pública y quieres mayor cautela, regenera/rotala desde la consola de Firebase:
  - Ve a Firebase Console → Project settings → General → Web API Key (regenera o reemplaza la configuración asociada).
- Actualiza los EAS secrets o `.env` con la nueva clave.

4) Eliminar secretos del historial de Git
- Esto es destructivo: afecta al historial y requiere forzar push. Coordina con tu equipo.
- Opción recomendada: `git-filter-repo` (instálalo con `pip install git-filter-repo`).

  Ejemplo para eliminar un archivo que contenía secret:

  ```bash
  # clona un espejo
  git clone --mirror git@github.com:usuario/repo.git
  cd repo.git
  # elimina todas las apariciones del archivo
  git filter-repo --path features/auth/firebase/config.ts --invert-paths
  # empuja el repo filtrado al remoto
  git push --force --all
  git push --force --tags
  ```

- O usar BFG Repo-Cleaner para reemplazar textos concretos:

  ```bash
  # prepara un archivo replacements.txt con las entradas a reemplazar
  java -jar bfg.jar --replace-text replacements.txt repo.git
  cd repo.git
  git reflog expire --expire=now --all && git gc --prune=now --aggressive
  git push --force
  ```

5) Verificación y pruebas
- Revisa que no queden secretos en el repo:

  ```bash
  git grep -n "AIzaSy\|client_secret\|EXPO_CLIENT_ID\|API_KEY" || true
  ```

6) Buenas prácticas adicionales
- Nunca guardes secretos sensibles en el bundle de la app; usa un backend para operaciones sensibles.
- Limita permisos de las claves (por ejemplo reglas de Firestore, restricciones de API key por origen).
- Audita accesos y rota claves periódicamente.

Si quieres, puedo:
- Configurar localmente `dotenv` y un script `start:env` (no requiere cambios destructivos).
- Ejecutar la limpieza del historial git por ti (necesitaré permiso explícito y confirmación porque es irreversible en el remoto).
