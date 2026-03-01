# QVT Platform

Monorepo QVT Box centré sur un seul site produit :

- Site principal : `https://www.qvtbox.com`
- Parcours : `/entreprise`, `/famille`, `/zena`, `/securite`, `/box`

Les anciens projets `zena-family` et `zena-voice` sont conservés uniquement pour rediriger vers `qvtbox.com`.

## Structure

```
apps/qvtbox        # app principale
apps/zena-family   # redirect-only -> /famille
apps/zena-voice    # redirect-only -> /zena
packages/shared    # liens, types, utilitaires partagés
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

Copier `.env.example` en `.env.local` (ou variables Vercel).

### Frontend (`VITE_*`)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_BASE_URL`
- `VITE_GA_ID` (optionnel)
- `VITE_QVTBOX_URL`, `VITE_ZENA_FAMILY_URL`, `VITE_ZENA_VOICE_URL`, `VITE_CONTACT_EMAIL` (optionnels)

Ne jamais mettre de secret dans `VITE_*`.

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

## Déploiement Vercel

### App principale

- Project root : `apps/qvtbox`
- Build command : `npm run build`
- Output directory : `dist`
- SPA rewrite : géré par `apps/qvtbox/vercel.json`

### Anciens sous-domaines

- `apps/zena-family` redirige vers `https://www.qvtbox.com/famille`
- `apps/zena-voice` redirige vers `https://www.qvtbox.com/zena`

## Contact

`contact@qvtbox.com`
