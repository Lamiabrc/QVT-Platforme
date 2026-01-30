# QVT Platform

Monorepo de la plateforme QVT Box avec trois applications :

- QVT Box (hub compte et creation de compte famille) : https://qvtbox.com
- ZENA Family (ados/famille) : https://zena-family.qvtbox.com
- ZENA Voice (moteur IA/voix) : https://zena.qvtbox.com

## Structure

```
apps/qvtbox
apps/zena-family
apps/zena-voice
packages/shared
```

## Auth et backend partages

Les trois apps utilisent le meme backend Supabase et la meme authentification.
Le client Supabase et les types communs sont centralises dans `packages/shared`.

## Installation

```sh
npm install
```

## Scripts racine

```sh
npm run dev:qvtbox
npm run dev:family
npm run dev:voice

npm run build:all
npm run lint
npm run typecheck
```

## Variables d'environnement

Chaque app charge ses variables depuis un fichier `.env.local` dans son dossier.
Copier `.env.example` en base.

- apps/qvtbox
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - VITE_RESEND_API_KEY
  - VITE_APP_BASE_URL

- apps/zena-family
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - VITE_APP_BASE_URL
  - VITE_ALERT_WEBHOOK_URL (optionnel)

- apps/zena-voice
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - VITE_APP_BASE_URL

Aucun secret ne doit etre commite.

## Famille MVP (SQL)

Le schÃ©ma Famille (families, family_members, family_invitations, alerts) est fourni dans :

```
docs/sql/family_mvp.sql
```

Pour l'appliquer :
1. Ouvrir Supabase SQL Editor
2. Coller le fichier ci-dessus
3. ExÃ©cuter la migration

## Deploiement (Vercel)

Ce monorepo correspond a 3 projets Vercel distincts. Pour chacun :

- Root Directory : `apps/qvtbox` ou `apps/zena-family` ou `apps/zena-voice`
- Build Command : `npm run build`
- Output Directory : `dist`

Les `vercel.json` par app gerent les rewrites SPA pour React Router.

## Contexte produit

La plateforme propose une IA emotionnelle pour adolescents, avec un espace famille commun, un espace amis independant, et des alertes en cas de detresse ou de harcelement. Le projet s'inscrit dans une periode de restructuration du paysage numerique francais, de maniere factuelle et non partisane.

## Contact

contact@qvtbox.com

## Build troubleshooting (Windows)

If `npm run build:all` fails with `spawn EPERM` from esbuild while loading a Vite config, it is usually a local permission or antivirus rule blocking the esbuild binary. Try:

- Run the build from an elevated terminal.
- Allow `node_modules/@esbuild/win32-x64/esbuild.exe` in your security tooling.
