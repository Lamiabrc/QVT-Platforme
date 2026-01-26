# Architecture (ZENA Family – HeartLink)

Flux principal (texte) :

Parent -> QVT Box (creation famille) -> Invitation ado -> Ado rejoint famille
Ado <-> ZENA Chat (Edge Function) -> AI Gateway
Ado -> journal emotionnel -> Supabase (RLS)
Alerte detresse -> Famille/Tuteur (a venir)

Composants :

- Frontend : Vite + React + Tailwind
- Backend : Supabase (Auth + DB + RLS)
- Edge Function : chat-with-zena (OpenAI-compatible gateway)

