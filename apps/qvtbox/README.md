# apps/qvtbox

Application principale du site `https://www.qvtbox.com`.

## Routes principales

- `/`
- `/entreprise`
- `/famille`
- `/zena`
- `/securite`
- `/box`

## Commandes

```sh
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Variables d'environnement (frontend)

Créer `apps/qvtbox/.env.local` :

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
VITE_APP_BASE_URL=https://www.qvtbox.com
```

Secrets interdits côté client : ne pas utiliser `VITE_*` pour des API keys privées.

## Variables d'environnement (server-side)

Pour les routes serverless (`/api/*`) :

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxx
OPENAI_API_KEY=xxxx
RESEND_API_KEY=xxxx
CONTACT_FROM_EMAIL=QVT Box <onboarding@resend.dev>
CONTACT_TO_EMAIL=contact@qvtbox.com
```

`RESEND_API_KEY` doit rester côté serveur uniquement.
