QVT Box — Qualité de Vie et Conditions de Travail (QVCT)
À propos

QVT Box conçoit des solutions phygitales (physiques + digitales) pour améliorer la QVCT :

Box Pouvoir d’Achat discrète, co-personnalisée avec les salariés.

Application QVCT pour prendre le pouls des équipes, détecter les signaux faibles et piloter les actions (DUERP/RPS).

Nos solutions
Box Pouvoir d’Achat (principale)

Livraison discrète en fin de mois.

Co-personnalisation : alimentaire, hygiène, essentiels, surprise.

Sourcing responsable, partenaires locaux quand c’est possible.

Box thématiques & événementielles

Focus & Performance, Mobilité & Ergonomie, Pénibilité & Récupération, Cohésion & Reconnaissance.

Retraite, Naissance/Adoption, Anniversaire, Promotion/Réussite, etc.

Application QVCT (SaaS)

Micro-question quotidienne (“Ça va ?”), alertes en cas de signaux faibles.

Tableaux de bord anonymisés pour RH/Managers/CSE, exports DUERP, suivi RPS.

Intégrations : SSO, SIRH, exports avancés.

Consultation & accompagnement

Diagnostic participatif, ateliers, co-construction de plans d’actions.

Mise en place rapide, indicateurs d’impact, amélioration continue.

Conformité (France)

DUERP renforcé (loi du 2 août 2021) : conservation 40 ans, dépôt dématérialisé progressif, transmission au SPST.

Adossement à un programme d’actions (PAPRIPACT ≥ 50 salariés / liste d’actions < 50).

L’app QVCT facilite la traçabilité, les tendances et les justificatifs (prévention RPS).


Contact

Site : https://qvtbox.com

Email : contact@qvtbox.fr / lamia.brechet@outlook.fr

📞 Téléphone : +33 (0)6 76 43 55 51 / 02 23 24 28 45

Pile technique

Front : React + TypeScript, React Router, Tailwind CSS, shadcn/ui, @tanstack/react-query

Back/Services : Supabase (auth & DB), Resend (emails)

Build & hébergement : Vite, Vercel

Mobile / installable : PWA + Capacitor (iOS/Android)

Démarrage
npm install         # dépendances
npm run dev         # dev server
npm run build       # build production
npm run preview     # prévisualisation du build

Variables d’environnement (.env)

Créer .env à la racine (ne pas commiter). Exemple :

VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_RESEND_API_KEY=re_xxx...
VITE_APP_BASE_URL=https://qvtbox.com


Inclure un .env.example (sans secrets) dans le repo.

Déploiement (Vercel) — SPA + redirections

Crée vercel.json à la racine pour :

Rediriger /international → / (pas d’offre International).

Réécrire toutes les routes SPA vers index.html (évite les 404 au refresh).

{
  "redirects": [
    { "source": "/international", "destination": "/", "permanent": true }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

Route côté React Router (optionnel mais recommandé)

Ajoute une route de confort pour /international (au cas où) :

// App.tsx
import { Navigate } from "react-router-dom";

// ...
<Routes>
  {/* ...tes routes... */}
  <Route path="/international" element={<Navigate to="/" replace />} />
  <Route path="*" element={<NotFound />} />
</Routes>

SEO & assets

Placer les visuels OG/Twitter dans public/og/... et référencer des URLs du domaine (pas de sandbox).

Exemple :

<meta property="og:image" content="https://qvtbox.com/og/hero.jpg" />
