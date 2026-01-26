# ZENA (app unifiee)

ZENA est l'app unifiee (web + Android) qui regroupe les spheres Famille et Entreprise.

## Prerequis
- Node.js 20
- Acces Supabase (URL + anon key)

## Installation
```bash
npm install
```

## Lancer en local
```bash
npm --workspace apps/zena run dev
```

## Build web
```bash
npm --workspace apps/zena run build
```

## Android (Capacitor)
```bash
npm --workspace apps/zena run build
npm --workspace apps/zena run android:add
npm --workspace apps/zena run android:sync
npm --workspace apps/zena run android:open
```

### APK debug
1. Ouvrir Android Studio via `android:open`.
2. Menu `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.
3. L'APK debug se trouve dans `apps/zena/android/app/build/outputs/apk/debug/`.

## Variables d'environnement
Creer `apps/zena/.env.local` :
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ZENA_API_URL=
```

`VITE_ZENA_API_URL` est optionnel (chat ZENA bascule sur un stub si absent).
