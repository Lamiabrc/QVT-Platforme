# ZENA Family — IA emotionnelle pour adolescents (QVT Box)

ZENA Family est l'espace ados/famille de la plateforme QVT Box. L'ado dispose d'un espace famille commun et d'un espace amis independant pour exprimer ses emotions, tandis que les parents et tuteurs accedent a un espace d'accompagnement.

Domaine : https://zena-family.qvtbox.com/

## Parcours produit

- Parcours ado : journal emotionnel, chat ZENA, reperes d'humeur.
- Espace famille : meteo emotionnelle commune et partage bienveillant.
- Espace amis : parcours parallele pour l'entourage proche de l'ado.
- Alertes detresse/harcelement : flux MVP (bouton, stockage, notification, log visible).

## Installation

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` : serveur de dev
- `npm run build` : build production
- `npm run preview` : previsualisation du build
- `npm run lint` : ESLint
- `npm run typecheck` : TypeScript
- `npm run android:setup` : ajout du projet Android (Capacitor)
- `npm run android:sync` : synchronise les assets web
- `npm run android:open` : ouvre Android Studio

## Configuration Supabase

Creer un fichier `.env.local` dans ce dossier :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_BASE_URL=
VITE_ALERT_WEBHOOK_URL=
```

`VITE_ALERT_WEBHOOK_URL` est optionnelle : un endpoint webhook pour notifier famille et tuteurs. Sans webhook, l'alerte est loguee dans l'app.

## Alerte detresse / harcelement (MVP)

Le flux MVP enregistre l'alerte en base, tente une notification via webhook, puis ajoute un log visible pour la famille.

Tables attendues :

- `alerts`
- `alert_notifications`

## Android (Capacitor)

```sh
npm run build
npm run android:setup
npm run android:sync
npm run android:open
```

### Generer un APK debug

1) Ouvrir Android Studio via `npm run android:open`.
2) Menu `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
3) Le fichier APK est genere dans `android/app/build/outputs/apk/debug/`.
