# ZENA Voice — moteur IA/voix (QVT Box)

ZENA Voice est le moteur IA et voix de la plateforme QVT Box. Il orchestre l'interface vocale, l'analyse emotionnelle, et les Edge Functions necessaires aux parcours ZENA.

Domaine : https://zena.qvtbox.com/

## Role dans la plateforme

- Interface vocale ZENA/ZENO
- Analyse emotionnelle et meteo emotionnelle
- RAG multi-tenant pour enrichir les reponses
- Edge Functions Supabase (chat, ingestion, voix)

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
- `npm run test` : tests

## Variables d'environnement (frontend)

Creer un fichier `.env.local` dans ce dossier :

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_BASE_URL=
```

## Secrets Edge Functions (Supabase)

Configurer dans Supabase (Edge Functions > Secrets) :

- `OPENAI_API_KEY`
- `MISTRAL_API_KEY` (optionnel)
- `FALLBACK_AI_BASE_URL` (endpoint OpenAI-compatible)
- `FALLBACK_AI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Tests

```sh
npm run test
npm run test:watch
npm run test:coverage
```
