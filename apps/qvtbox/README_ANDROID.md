# Android (Capacitor) — QVT Box (ZÉNA)

Ce guide ajoute un shell Android autour de l'app web `apps/qvtbox` sans casser le déploiement Vercel.

## Prérequis
- Node 20+
- Android Studio + SDK

## Installation (racine)
```sh
npm install
```

## Build web (Capacitor)
```sh
npm --workspace apps/qvtbox run build:android
```

## Ajout Android (première fois)
```sh
npm --workspace apps/qvtbox run android:add
```

## Synchronisation
```sh
npm --workspace apps/qvtbox run android:sync
```

## Ouvrir dans Android Studio
```sh
npm --workspace apps/qvtbox run android:open
```

## Build APK/AAB
- Ouvrir Android Studio
- Build > Generate Signed Bundle / APK
- Choisir AAB pour Google Play

## Icônes & Splash
Placeholders actuels dans :
- `apps/qvtbox/android/app/src/main/res`
  - `mipmap-*` pour les icônes
  - `drawable*` / `splash` pour l'écran de démarrage

Pour régénérer proprement :
```sh
npx @capacitor/assets generate --iconPath <icone.png> --splashPath <splash.png>
```

## Notes
- Le build web Vercel reste inchangé.
- Le mode Capacitor utilise `vite build --mode capacitor` (base `./`).
