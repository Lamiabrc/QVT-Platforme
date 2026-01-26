# QVT Platform

Monorepo de la plateforme QVT Box, qui regroupe trois applications :

- QVT Box (hub compte) : https://qvtbox.com
- ZENA Family (ados/famille) : https://zena-family.qvtbox.com
- ZENA Voice (moteur IA/voix) : https://zena.qvtbox.com (ou usage interne)

## Structure

```
apps/qvtbox
apps/zena-family
apps/zena-voice
packages/shared
```

## Installation

```sh
npm install
```

## Scripts racine

```sh
npm run dev:qvtbox
npm run dev:family
npm run dev:voice

npm run build:qvtbox
npm run build:family
npm run build:voice
npm run build:all
```

## Variables d'environnement

Chaque application charge ses variables depuis un fichier local.

- Copier `.env.example` vers `.env.local` dans chaque app qui en a besoin.
- Ne jamais committer de secrets.

## Deploiement (Vercel)

Ce monorepo correspond a 3 projets Vercel distincts. Pour chacun :

- Root Directory : `apps/qvtbox` ou `apps/zena-family` ou `apps/zena-voice`
- Build Command : `npm run build`
- Output Directory : `dist`

## Contexte produit

La plateforme propose une IA emotionnelle pour adolescents, avec un espace famille et un espace amis, plus des alertes de detresse et de harcelement. Le tout s'inscrit dans une periode de restructuration du paysage numerique francais, de maniere neutre et non partisane.

## Contact

contact@qvtbox.com
