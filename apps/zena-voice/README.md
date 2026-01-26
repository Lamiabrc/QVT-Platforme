# ZÉNA - Assistant QVT avec IA et RAG

## 🎯 Présentation du projet

**ZÉNA** (et **ZÉNO**) est un assistant vocal intelligent dédié à la Qualité de Vie au Travail (QVT). Il combine reconnaissance vocale, synthèse vocale, analyse émotionnelle et un système RAG (Retrieval-Augmented Generation) multi-tenant pour fournir des conseils personnalisés aux entreprises.

## ✨ Fonctionnalités principales

### 🎤 Interface vocale
- Reconnaissance vocale multilingue (FR/EN)
- Synthèse vocale avec voix féminine (ZÉNA) et masculine (ZÉNO)
- Avatar animé réagissant aux émotions

### 🧠 Intelligence artificielle
- Analyse émotionnelle en temps réel
- Recommandations personnalisées de boxes QVT
- Support OpenAI et Mistral

### 📚 Système RAG Multi-tenant
- Upload et indexation de documents QVT par entreprise (TXT, MD)
- Recherche sémantique avec pgvector
- Réponses contextualisées basées sur les documents de l'entreprise

### 📊 Tableau de bord
- Suivi du score QVT personnel
- Historique des conversations
- Analytics et insights

## 🚀 Technologies utilisées

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn-ui, Framer Motion
- **Backend**: Supabase (Lovable Cloud)
  - PostgreSQL + pgvector pour le RAG
  - Edge Functions (Deno)
  - Storage pour les documents
  - Auth avec RLS
- **IA**: OpenAI (embeddings + chat), Mistral
- **Tests**: Vitest, React Testing Library

## 📁 Structure du projet

```
src/
├── components/        # Composants UI
│   ├── ui/           # shadcn components
│   ├── ZenaAvatar.tsx
│   ├── VoiceControl.tsx
│   └── ...
├── hooks/            # Custom hooks
│   ├── useZenaZenoBrain.ts  # Cerveau IA + chat
│   ├── useZenaVoice.ts      # Orchestration vocale
│   └── ...
├── pages/            # Pages de l'app
│   ├── Index.tsx
│   ├── ZenaChat.tsx
│   ├── Dashboard.tsx
│   ├── OnboardingUpload.tsx  # Upload documents RAG
│   └── ...
├── data/             # Données statiques
└── __tests__/        # Tests unitaires

supabase/
└── functions/
    ├── qvt-ai/              # Chat avec RAG
    ├── ingest-kb/           # Indexation documents
    ├── generate-emotional-weather/  # Analyse émotionnelle
    └── speech-to-text/      # Transcription vocale
```

## 🛠️ Installation et démarrage

```sh
# Clone le dépôt
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Installe les dépendances
npm install

# Configure les variables d'environnement (automatique avec Lovable Cloud)
# VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY

# Démarre le serveur de développement
npm run dev
```

## 🔐 Configuration des secrets Supabase

Les clés API suivantes doivent être configurées dans Supabase :

- `OPENAI_API_KEY` - Pour embeddings et chat GPT
- `MISTRAL_API_KEY` - Pour chat Mistral (optionnel)
- `SUPABASE_SERVICE_ROLE_KEY` - Auto-configuré
- `LOVABLE_API_KEY` - Auto-configuré

## 🧪 Tests

```sh
# Lance tous les tests
npm run test

# Mode watch pour le développement
npm run test:watch

# Avec rapport de couverture
npm run test:coverage
```

## 🎨 Utilisation du système RAG

### 1. Créer un tenant et ajouter des membres

```typescript
// Créer une entreprise (tenant)
const { data: tenant } = await supabase
  .from('tenants')
  .insert({ name: 'Mon Entreprise' })
  .select()
  .single();

// Ajouter un membre
await supabase.from('tenant_members').insert({
  tenant_id: tenant.id,
  user_id: user.id,
  role: 'admin'
});
```

### 2. Uploader des documents QVT

```tsx
import OnboardingUpload from '@/pages/OnboardingUpload';

<OnboardingUpload 
  tenantId={tenantId}
  onComplete={() => console.log('Docs indexés!')}
/>
```

### 3. Chat avec RAG

```typescript
const res = await fetch(`${SUPABASE_URL}/functions/v1/qvt-ai`, {
  method: 'POST',
  body: JSON.stringify({
    tenant_id: tenantId,     // Active le RAG
    text: 'Comment réduire le stress au travail?',
    persona: 'zena',         // ou 'zeno'
    provider: 'openai',      // ou 'mistral'
    lang: 'fr',
    k: 5                     // Nombre de chunks à récupérer
  })
});

const { reply, mood, used_chunks } = await res.json();
```

## 📚 API Edge Functions

### `qvt-ai` - Chat avec RAG
Génère des réponses contextualisées en utilisant les documents de l'entreprise.

**Paramètres:**
- `text` (required): Question de l'utilisateur
- `tenant_id` (optional): ID du tenant pour activer le RAG
- `persona`: "zena" | "zeno"
- `provider`: "openai" | "mistral"
- `lang`: "fr" | "en"
- `k`: Nombre de chunks à récupérer (défaut: 5)

### `ingest-kb` - Indexation documents
Ingère et indexe des documents pour le RAG.

**Paramètres:**
- `tenant_id` (required): ID du tenant
- `objects` (required): Liste des fichiers à indexer
- `lang`: "fr" | "en"
- `tags`: Tags pour catégoriser
- `bucket`: Nom du bucket storage (défaut: "kb")

## 🎯 Roadmap

- [x] Interface vocale avec ZÉNA/ZÉNO
- [x] Analyse émotionnelle temps réel
- [x] Système RAG multi-tenant avec pgvector
- [x] Upload et indexation de documents
- [x] Support OpenAI et Mistral
- [ ] Support PDF et DOCX (via Unstructured API)
- [ ] Analytics d'entreprise
- [ ] Intégration Microsoft Teams / Slack
- [ ] Application mobile (Capacitor)

## 🔗 Liens utiles

- **Lovable Project**: https://lovable.dev/projects/ebb766cc-dc12-4d64-a580-db96bef091f0
- **Documentation Supabase**: https://supabase.com/docs
- **Documentation pgvector**: https://github.com/pgvector/pgvector

## 📝 Licence

Ce projet est privé et confidentiel.
