# Copilot Instructions: ZÉNA QVT Voice Assistant

## 🎯 Project Overview

**ZÉNA** is a multilingual voice-first AI assistant for workplace wellness (QVT - Qualité de Vie au Travail). It combines real-time emotion analysis, voice I/O, and a RAG system for multi-tenant document retrieval.

**Core Stack:** React 18 + TypeScript, Supabase (PostgreSQL + pgvector), OpenAI/Mistral, Vite, Vitest, Tailwind CSS, Framer Motion for 3D

## 🏗️ Architecture Patterns

### Voice Orchestration Layer
- **`useZenaVoice`** (src/hooks/useZenaVoice.ts) is the **central orchestrator** that manages:
  - STT (Speech-to-Text) pause/resume during TTS playback to prevent feedback
  - TTS (Text-to-Speech) with gender/language selection
  - Audio level analysis for mouth animation
  - **Never call `useVoiceInput` or `useSpeechSynthesis` directly in components**—always go through `useZenaVoice`

### Brain/AI Hook Pattern
- **`useZenaZenoBrain`** wraps:
  - Conversation session creation in Supabase (`conversation_sessions` table)
  - Emotion detection (local analysis → emotional_state exposed)
  - Box recommendation logic
  - **Multi-turn conversations track `currentSessionId`** (refs, not state)
  - Calls Supabase Edge Function `qvt-ai` for chat responses with RAG context

### Data Flow: User Input → AI Response
1. User speaks (STT) → `useZenaVoice.onFinalResult` callback
2. Text sent to `useZenaZenoBrain.handleUserMessage()`
3. Emotion analyzed locally, session logged in DB
4. Query sent to `qvt-ai` Edge Function (includes RAG context from pgvector)
5. Response returned with `emotion` field (used for avatar aura color)
6. TTS plays response → avatar mouth animates via `mouthLevel` prop

### Component Layering
- **Pages** (`src/pages/`) orchestrate multiple hooks (business logic)
- **Components** (`src/components/`) stay presentation-focused, accept props like:
  - `emotion: "positive" | "neutral" | "negative"` (drives visual feedback)
  - `mouthLevel: number` (0-1, animates mouth during speech)
  - `isListening`, `isSpeaking` booleans
- **UI Components** (`src/components/ui/`) are shadcn-ui exports, don't modify

## 🔐 Auth & Data Access

- **`useAuth`** manages Supabase Auth with session persistence
- **Multi-tenancy**: Companies linked via `company_id` → RLS policies enforce data isolation
- **Public key only**: Client uses `VITE_SUPABASE_ANON_KEY` (edge functions use SERVICE_ROLE internally)
- **User lookup pattern:**
  ```ts
  const { user } = useAuth();
  // user.id always available; use for conversation_sessions.user_id, profiles.user_id
  ```

## 🧪 Testing Patterns

- **Setup:** `src/__tests__/setup.ts` mocks `matchMedia`, `IntersectionObserver`, `ResizeObserver` globally
- **Hook tests:** Use `renderHook(useMyHook, { wrapper: SomeProvider })`
- **Component tests:** `render(<Component {...props})` with jest-dom matchers via `@testing-library/jest-dom`
- **Mock Supabase in tests:**
  ```ts
  vi.mock("@/integrations/supabase/client", () => ({
    supabase: { from: vi.fn().mockReturnValue({ ... }) }
  }));
  ```
- **Run tests:** `npm run test` (watch), `npm run test:coverage` (v8 reports)

## 📦 Build & Dev Workflow

- **Dev server:** `npm run dev` (Vite on port 8080)
- **Build:** `npm run build` (dist/ output, rollup chunking: react, charts, ui, data)
- **Lint:** `eslint .` (ESLint + TypeScript, no unused-vars rule disabled)
- **Key Vite configs:**
  - Base: `/` (served at domain root, not `/zena/`)
  - `componentTagger()` plugin dev-only (disabled in prod for Vercel)
  - esbuild drops `console.log` + `debugger` in production

## 📚 Supabase Integration Points

- **Tables used:** `conversation_sessions`, `companies`, `profiles`, `company_invite_codes`, `knowledge_base` (RAG docs)
- **Edge Functions:**
  - `qvt-ai` — Chat + RAG retrieval (expects sessionId, returns text + emotion)
  - `ingest-kb` — Document indexing (called during company onboarding)
  - `generate-emotional-weather` — Batch emotion analysis
  - `speech-to-text` — Deno-based STT (optional, client-side preferred)
- **Environment variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TENANT_ID` (optional)

## 🎨 Design Conventions

- **Avatar emotion colors** (Framer Motion):
  - Positive: `emerald-300/60 to teal-300/40`
  - Negative: `rose-400/60 to red-400/40`
  - Neutral: `[#5B4B8A]/40 to [#4FD1C5]/30`
- **Data assets** in `src/data/` exported as arrays (healthTips, blogArticles, legalContents)
- **Types defined in `src/types/content.types.ts`** (LegalContent, BlogArticle, HealthTip, etc.)
- **Alerts via `sonner`** toast library (preferred over browser alerts)

## 🌍 Internationalization Notes

- Default language: French (`fr-FR`), fallback to English (`en-US`)
- STT language auto-detection: `useVoiceInput` can detect `fr` vs `en`
- TTS gender selection: Component prop `gender="female"` (ZÉNA) or `"male"` (ZÉNO)
- Emotion strings in DB are lowercase English (`positive`, `neutral`, `negative`)

## ⚠️ Common Pitfalls

1. **Don't use `useVoiceInput` directly** — always orchestrate through `useZenaVoice`
2. **Don't create multiple Supabase clients** — import from `@/integrations/supabase/client`
3. **Test file paths:** Must match `src/__tests__/**/*.test.{ts,tsx}` pattern
4. **Emotion state is local** — not persisted per-message in DB (only session-level)
5. **RLS policies silently fail** — check Supabase logs if queries return empty

## 📖 Key Files Reference

| Path | Purpose |
|------|---------|
| `src/hooks/useZenaVoice.ts` | Voice orchestration (STT+TTS) |
| `src/hooks/useZenaZenoBrain.ts` | AI conversation + emotion |
| `src/pages/ZenaChatpage.tsx` | Main chat interface |
| `src/components/ZenaAvatar.tsx` | 3D-animated avatar + aura |
| `src/integrations/supabase/client.ts` | Singleton Supabase client |
| `src/lib/zenaApi.ts` | Session + message API |
| `vitest.config.ts` | Test runner config |
