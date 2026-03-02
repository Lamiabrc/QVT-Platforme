# QVT Platform

Monorepo QVT Box centré sur un seul site produit:

- Site principal: `https://www.qvtbox.com`
- Parcours clés: `/entreprise`, `/famille`, `/zena`, `/lucioles`, `/devenir-luciole`, `/securite`, `/box`

Les apps `zena-family` et `zena-voice` sont conservées uniquement en redirect vers `qvtbox.com`.

## Structure

```txt
apps/qvtbox        # app principale (unique produit)
apps/zena-family   # redirect-only -> /famille
apps/zena-voice    # redirect-only -> /zena
packages/shared    # types, ui, config partagés
```

## Installation

```sh
npm install
```

## Scripts racine

```sh
npm run dev
npm run build
npm run lint
npm run typecheck
```

Tous ces scripts ciblent `apps/qvtbox`.

## Variables d'environnement

Copier `.env.example` en `.env.local` (ou configurer sur Vercel).

### Frontend (`VITE_*`)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_BASE_URL`
- `VITE_GA_ID` (optionnel)
- `VITE_QVTBOX_URL`, `VITE_ZENA_FAMILY_URL`, `VITE_ZENA_VOICE_URL`, `VITE_CONTACT_EMAIL` (optionnels)

Important: ne jamais mettre de secret dans `VITE_*`.

### Server-side (API routes / functions)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (optionnel pour `/api/zena/chat`)
- `RESEND_API_KEY` (obligatoire pour `/api/contact`)
- `CONTACT_FROM_EMAIL` (optionnel)
- `CONTACT_TO_EMAIL` (optionnel)

## API serverless (qvtbox)

- `apps/qvtbox/api/zena/chat.ts`
- `apps/qvtbox/api/contact.ts`

Les clés sensibles restent côté serveur uniquement.

## PWA

`apps/qvtbox` embarque `vite-plugin-pwa`:

- Manifest installable
- Icônes PWA
- Page hors-ligne `offline.html`
- Service worker auto-update

## Supabase (Lucioles MVP)

Migration SQL ajoutée:

- `apps/qvtbox/supabase/migrations/20260301120000_lucioles_mvp.sql`

Elle crée:

- `lucioles`
- `luciole_applications`
- `luciole_subscriptions` (stub)

Avec RLS:

- profil Luciole modifiable par la Luciole elle-même
- annuaire visible uniquement pour les Lucioles `approved`

## Déploiement Vercel

### App principale

- Project root: `apps/qvtbox`
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite: `apps/qvtbox/vercel.json`

### Anciens sous-domaines

- `apps/zena-family` redirige vers `https://www.qvtbox.com/famille`
- `apps/zena-voice` redirige vers `https://www.qvtbox.com/zena`
