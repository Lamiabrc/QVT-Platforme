# ZENA Family — IA émotionnelle pour adolescents (QVT Box)

ZENA Family est l'espace ados/famille de la plateforme QVT Box. L'ado dispose d'un espace famille et d'un espace amis pour exprimer ses émotions, tandis que les parents accèdent à un espace d'accompagnement.

Domaine : https://zena-family.qvtbox.com/

## Parcours produit

- Parcours ado : journal émotionnel, chat ZENA, repères d'humeur.
- Parcours parent/famille : météo émotionnelle, repères d'accompagnement, partage bienveillant.
- Alertes détresse/harcèlement : déclenchement prévu via règles et tables Supabase.

## Installation

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` : serveur de dev
- `npm run build` : build production
- `npm run preview` : prévisualisation du build
- `npm run lint` : ESLint
- `npm run typecheck` : TypeScript

## Configuration Supabase

Créer un fichier `.env.local` dans ce dossier :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_BASE_URL=
```

## Android (Capacitor)

```sh
npm run build
npx cap sync android
npx cap open android
```
