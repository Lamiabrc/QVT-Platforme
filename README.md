# ZÉNA Family – HeartLink

IA émotionnelle pour adolescents, connectée au compte famille QVT Box. L'ado dispose d'un espace famille et d'un espace amis pour exprimer ses émotions et obtenir du soutien. Le service vise la prévention du mal‑être et du harcèlement, avec une approche empathique, utile et non intrusive.

Domaine produit : https://zena-family.qvtbox.com/

## Fonctionnalités

- Espace ado : journal émotionnel, chat ZÉNA, repères d'humeur.
- Espace famille : météo émotionnelle familiale, partage bienveillant.
- Espace amis : à venir (flux et UI dédiés non implémentés).
- Alertes détresse/harcèlement : à venir (mise en place des tables et des règles d'accès requise).

## Architecture (rapide)

- Frontend : Vite + React + TypeScript + Tailwind + shadcn/ui.
- Backend : Supabase (Auth, DB, Storage).
- Edge Functions : `supabase/functions/chat-with-zena` (gateway IA compatible OpenAI).

## Pré-requis

- Node.js LTS (18+ recommandé).

## Installation

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` : serveur de dev
- `npm run lint` : ESLint
- `npm run build` : build production
- `npm run preview` : prévisualisation du build
- `npm run verify` : lint + build

## Variables d'environnement

Créer un `.env` à la racine en partant de `.env.example`.

Obligatoires (frontend) :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (clé publique Supabase, l'équivalent de `VITE_SUPABASE_ANON_KEY`)
- `VITE_APP_BASE_URL` (optionnel, ex: https://zena-family.qvtbox.com)

Edge Functions (Supabase) :

- `AI_API_KEY` (clé du provider IA)
- `AI_BASE_URL` (URL d'un endpoint OpenAI-compatible, compatible avec les modèles `provider/model`)

Configurer ces variables dans le dashboard Supabase (Edge Functions > Secrets).

## Déploiement Vercel (SPA)

Le projet est configuré comme une SPA avec React Router. Un `vercel.json` fournit les rewrites vers `index.html`.

Étapes :

1) Définir les variables d'environnement `VITE_*` dans Vercel.  
2) Build command : `npm run build`  
3) Output directory : `dist`

## Android (Capacitor)

Pré-requis : Android Studio + SDK installés.

```sh
npm install
npm run build
npx cap sync android
npx cap open android
```

Pour modifier l'identité Android :

- `appId` et `appName` dans `capacitor.config.ts`.

## Sécurité & mineurs

- Privacy by design : données minimales et utiles uniquement.
- RLS Supabase pour cloisonner les familles et les profils.
- Alertes déclenchées uniquement en cas de détresse explicite.
- Pas de stockage inutile d'identifiants sensibles.

## Intégration QVT Box

ZÉNA Family partage la même instance Supabase que QVT Box.

- Auth partagée : mêmes utilisateurs Supabase.
- Tables minimales attendues :
  - `families`
  - `family_members`
  - `teen_profiles`
  - `alerts`
- Le front pointe vers la même URL Supabase que `qvtbox.com`.
