# ZENA Voice — moteur IA/voix (QVT Box)

ZENA Voice est le moteur IA et voix de la plateforme QVT Box. Il orchestre l'interface vocale, l'analyse émotionnelle, et les Edge Functions nécessaires aux parcours ZENA.

Domaine : https://zena.qvtbox.com/

## Rôle dans la plateforme

- Interface vocale ZENA/ZENO
- Analyse émotionnelle et météo émotionnelle
- RAG multi-tenant pour enrichir les réponses
- Edge Functions Supabase (chat, ingestion, voix)

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

## Variables d'environnement (frontend)

Créer un fichier `.env.local` dans ce dossier :

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
