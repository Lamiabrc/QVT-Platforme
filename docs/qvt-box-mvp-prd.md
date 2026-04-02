# QVT Box + ZÉNA — PRD & Plan de livraison (MVP Europe)

## 1) PRD

### 1.1 Vision produit
QVT Box est un **réseau luciole**: un produit social centré sur la relation de confiance et le passage à l’action, pas sur la captation de l’attention.

- Question centrale: **« Salut, ça va ? (vraiment) »**
- Unité de valeur: la **Bulle** (check-in émotionnel)
- Accélérateur: **ZÉNA**, assistant IA de soutien non jugeant
- Résultat attendu: moins d’isolement, plus d’actions utiles, plus de liens fiables

### 1.2 Problem statement
Les réseaux traditionnels favorisent:
- la visibilité publique et la comparaison sociale,
- la viralité émotionnelle négative,
- le scroll infini,
- l’économie de l’attention.

QVT Box cible l’inverse:
- partage sélectif et privé,
- engagements concrets (demander/proposer/agir),
- interactions courtes et intentionnelles,
- confidentialité par défaut (RGPD-first).

### 1.3 Objectifs business & produit
1. Construire une **routine quotidienne** de check-in (rétention S1/S4).
2. Démarrer un effet réseau par **cercles privés** (famille, équipe, amis).
3. Maximiser les actions « Agir » (pas la consommation passive de contenu).
4. Permettre un déploiement **B2B2C Europe** (entreprise → salarié → famille).
5. Instaurer une confiance forte via gouvernance des données et transparence.

### 1.4 Non-goals (MVP)
- Aucun feed public algorithmique.
- Aucun mécanisme de viralité ouverte (partages publics, trending, recommandations sociales globales).
- Aucune promesse clinique/diagnostique.
- Pas de gamification addictive (streak anxiogène, likes compétitifs, notifications agressives).

### 1.5 Personas

#### A) Salarié (cœur)
- Besoin: exprimer son état rapidement, demander de l’aide sans stigma, trouver un appui concret.
- Frictions: manque de temps, peur d’être surveillé par l’employeur.
- Valeur MVP: bulle en < 30 sec + partage contrôlé + action immédiate.

#### B) RH / Responsable QVT
- Besoin: piloter la météo globale sans accéder à l’intime individuel.
- Frictions: obligations RGPD, risque de méfiance des salariés.
- Valeur MVP: tableau d’agrégats anonymisés, seuil k-anonymat, adoption/actions.

#### C) Parent / adulte référent
- Besoin: capter signaux faibles dans un cadre de confiance.
- Valeur MVP: cercles familiaux, alertes urgentes opt-in, ressources.

#### D) Ado
- Besoin: espace d’expression discret, pas infantilisé, confidentialité claire.
- Valeur MVP: mode discret, ton ZÉNA adapté, action concrète courte.

#### E) Luciole (mentor, optionnel)
- Besoin: accompagner sans intrusivité.
- Valeur MVP: rôle d’accompagnement dans cercle privé.

### 1.6 User stories (MVP)
- En tant que salarié, je veux créer une bulle en 3 taps pour signaler mon état sans devoir écrire un long texte.
- En tant qu’utilisateur, je veux choisir exactement qui voit ma bulle (privé/cercle/personne).
- En tant qu’utilisateur, je veux qu’on me propose **une** micro-action utile, pas une liste interminable.
- En tant que membre d’un cercle, je veux proposer un moment simple (marcher 15 min, café, appel).
- En tant que RH, je veux des tendances d’équipe anonymisées uniquement au-delà d’un seuil.
- En tant qu’admin, je veux gérer contenus/ressources/recommandations depuis un panel.
- En tant que parent, je veux recevoir une alerte urgente seulement si l’option est activée.

### 1.7 Scope MVP vs V2 vs V3

#### MVP (0–4 mois)
- Auth + onboarding rôles.
- Bulles + historique + partage sélectif.
- Cercles privés + permissions simples.
- « Agir » (3 boutons max).
- Messagerie basique 1-1 et cercle.
- Protocole sécurité (signaux critiques + redirections).
- Dashboard RH agrégé anonymisé.
- Admin panel contenu/rôles/stats basiques.
- ZÉNA v1 (classification simple + micro-actions règles/catalogue).

#### V2 (4–8 mois)
- Plus de personnalisation ZÉNA (contextuelle par rôle et historique).
- Rituels « phygitaux » (box/coups de pouce contextualisés).
- Automatisations entreprise (campagnes bien-être ciblées sur agrégats, jamais individuels).
- Amélioration analytics produit et cohorte rétention.

#### V3 (8–14 mois)
- Voice companion (ZÉNA voice, consentement explicite).
- Lucioles marketplace (mentorat vérifié, encadré).
- Connecteurs SIRH/SSO entreprise.
- Recommandation intelligente multi-objectifs (bien-être + confidentialité + sobriété attentionnelle).

---

## 2) User flows + arborescence écrans

### 2.1 Arborescence (MVP)
- `/` Homepage entreprise (positionnement + CTA)
- `/auth/login`
- `/onboarding`
- `/dashboard` (variant salarié / parent / ado / mentor)
- `/bulle/new`
- `/bulle/history`
- `/circles`
- `/circles/:id`
- `/messages`
- `/agir`
- `/resources`
- `/admin` (admin only)
- `/enterprise/analytics` (RH/QVT agrégé)

### 2.2 Flows clés

#### Flow A — Première connexion
1. Login (magic link ou mot de passe)
2. Onboarding minimal (âge, genre optionnel, situation familiale, rôles)
3. Rattachement org/équipe via code invitation (si entreprise)
4. Arrivée sur `/dashboard`

#### Flow B — Check-in quotidien
1. Entrée `/bulle/new`
2. Score 1–15 + émotions + commentaire optionnel
3. Choix partage: privé / cercle / personnes
4. ZÉNA retourne 1 micro-action (1–3 options max)
5. Utilisateur clique une action « Agir »
6. Journalisation événement produit

#### Flow C — Besoin d’aide
1. Depuis `/agir`, bouton « J’ai besoin d’aide »
2. Choix rapide: message / appel confiance / ressource
3. Si signal critique: protocole sécurité + contacts utiles

#### Flow D — RH Analytics
1. RH ouvre `/enterprise/analytics`
2. Visualise uniquement agrégats conformes seuil k-anonymat
3. Filtre période/équipe (si taille suffisante)
4. Aucune navigation possible vers données individuelles

---

## 3) Schéma DB Supabase + relations + RLS

## 3.1 Tables minimales

### Identité & organisations
- `profiles` (id=auth.users.id, display_name, age_range, gender_opt, roles[], locale, created_at)
- `enterprise_orgs` (id, name, country_code, created_at)
- `teams` (id, org_id, name, created_at)
- `team_memberships` (id, team_id, user_id, role_in_team, created_at)

### Social privé
- `circles` (id, owner_id, circle_type ENUM[family,team,friends], name, org_id nullable, created_at)
- `circle_members` (id, circle_id, user_id, member_role, can_view_bubbles, can_comment, can_propose_action, created_at)
- `checkins` (id, user_id, score_smallint nullable, mood_tags text[], comment text nullable, is_discreet bool, created_at)
- `checkin_shares` (id, checkin_id, share_type ENUM[private,circle,user], circle_id nullable, shared_with_user_id nullable, created_at)

### Agir & activités
- `actions` (id, actor_user_id, action_type ENUM[need_help,propose_moment,coup_de_pouce], source_checkin_id nullable, payload jsonb, created_at)
- `activities` (id, circle_id nullable, creator_user_id, title, starts_at, duration_min, visibility, created_at)
- `activity_participants` (id, activity_id, user_id, status ENUM[pending,accepted,declined], created_at)

### Messagerie
- `message_threads` (id, thread_type ENUM[dm,circle], circle_id nullable, created_by, created_at)
- `messages` (id, thread_id, sender_user_id, body, reaction_count int default 0, created_at)

### Sécurité & contenus
- `alerts` (id, user_id, alert_type ENUM[risk_keyword,urgent_family], severity, status, payload jsonb, created_at)
- `resources` (id, category, locale, title, body, cta_label, cta_url, risk_level, published bool, created_at)
- `recommendations` (id, user_id nullable, circle_id nullable, source ENUM[zena,admin,rule], recommendation_type, payload jsonb, created_at)

### Analytics RGPD
- `aggregated_metrics_daily` (date, org_id, team_id nullable, active_users, checkin_count, avg_score, action_rate, mood_distribution jsonb, k_size int)
  - idéalement table matérialisée alimentée par job Edge Function

### Commerce optionnel MVP+
- `products`, `orders`, `subscriptions` (isolées logiquement, sans couplage implicite avec santé mentale)

## 3.2 Relations principales
- `profiles 1—N checkins`
- `checkins 1—N checkin_shares`
- `circles 1—N circle_members`
- `circles 1—N activities`
- `activities 1—N activity_participants`
- `message_threads 1—N messages`
- `enterprise_orgs 1—N teams`
- `teams 1—N team_memberships`

## 3.3 RLS policies (principes détaillés)

### Règle socle
- RLS activée **sur toutes les tables**.
- Accès par défaut: deny all.

### Données personnelles (`profiles`, `checkins`, `actions`, `alerts`)
- `SELECT/UPDATE profiles`: `auth.uid() = id`.
- `INSERT/SELECT checkins`: `auth.uid() = user_id`.
- Lecture d’un check-in autorisée si:
  - propriétaire, ou
  - partage explicite via `checkin_shares` vers cercle dont user membre, ou
  - partage explicite vers `shared_with_user_id = auth.uid()`.

### Cercles (`circles`, `circle_members`)
- Créateur cercle: full control.
- Membre: lecture cercle + membres si membership actif.
- Modif permissions seulement owner/admin cercle.

### Messagerie (`message_threads`, `messages`)
- DM: seulement les 2 participants.
- Thread cercle: membres du cercle uniquement.
- Écriture message: sender = auth.uid() et user membre thread.

### Entreprise (`enterprise_orgs`, `teams`, `team_memberships`)
- Utilisateur ne lit que org/team où il est membre.
- Rôle RH/QVT contrôlé via claim JWT/role map.

### Agrégats (`aggregated_metrics_daily`)
- RH/QVT `SELECT` autorisé uniquement si:
  - appartient à `org_id`,
  - `k_size >= seuil` (ex. 7 ou 10),
  - pas de jointure exposant identifiants individus.
- Interdire toute vue raw checkins côté RH par policy SQL stricte.

### Étanchéité univers (famille ≠ entreprise)
- `circles.org_id` nullable:
  - cercle famille/friends => `org_id is null`
  - cercle équipe => `org_id = enterprise_org`
- Policies empêchent de requêter un cercle d’un autre univers sans membership explicite.

### Journalisation & audit
- `audit_events` append-only (actor, action, table, row_id, timestamp).
- Seuls rôles techniques autorisés en lecture complète.

---

## 4) Spéc API / Edge Functions

## 4.1 API métier (suggestion)

### `POST /edge/checkins/create`
- Input: score, mood_tags, comment, is_discreet, shares[]
- Output: checkin_id + recommended_action_preview
- Règles: validation length, anti-spam léger, logs

### `POST /edge/zena/analyze-checkin`
- Input: checkin_id (ou payload check-in)
- Output:
  - emotional_state (label + confidence simple)
  - risk_level (none/low/medium/high)
  - micro_actions[1..3]
  - resource_recommendation (max 1)
- Implémentation MVP:
  - classif règles + dictionnaire émotions + signaux critiques
  - génération via catalogue d’actions (pas de génération libre illimitée)

### `POST /edge/actions/trigger`
- Input: action_type + payload + optional checkin_id
- Output: action_id + next_step
- Effets: message auto, création activité, suggestion ressource

### `POST /edge/messages/send`
- Input: thread_id, body
- Output: message_id
- Modération: filtre contenu dangereux/harcèlement léger + flag

### `POST /edge/alerts/process`
- Déclenchée async (queue/cron)
- Détecte signaux critiques et crée `alerts`
- En mode famille avec opt-in: push adulte référent

### `POST /edge/enterprise/compute-aggregates`
- Job quotidien/horaires
- Calcule `aggregated_metrics_daily`
- Applique k-anonymat + suppression petites cohortes

## 4.2 Contrat IA ZÉNA (guardrails)
- Toujours réponse courte, chaleureuse, non culpabilisante.
- 1 action prioritaire affichée, alternatives max 2.
- Interdits: diagnostic médical, conseils dangereux, injonctions morales.
- Si risque élevé:
  1) valider émotion,
  2) inciter aide humaine immédiate,
  3) afficher contacts utiles localisés (FR/UE),
  4) log incident sécurité.

---

## 5) Plan UI (React + Tailwind + shadcn/ui)

## 5.1 Design system
- Couleurs: `#005B5F`, `#F2F7F6`, `#212121`
- Typo: Montserrat
- Formes: bulles arrondies, cartes lumineuses, densité faible
- Accessibilité: contraste AA, focus visible, taille tap mobile >=44px

## 5.2 Composants clés
- `BulleCheckinCard`
- `EmotionSelector`
- `ShareSelector` (privé/cercle/personnes)
- `ZenaActionCard` (1 action primaire)
- `AgirQuickActions` (3 boutons)
- `CircleMembersPanel`
- `ThreadList` + `MessageComposer`
- `RiskBanner`
- `EnterpriseKpiCard`, `MoodWeatherChart`
- `EmptyStateLuciole` (ton rassurant, CTA concret)

## 5.3 Pages + états
- Dashboard:
  - état vide: “Fais ta première bulle aujourd’hui”
  - état actif: tendance 7 jours + action suggérée
- Bulles history:
  - filtres simples (semaine/mois)
- Circles:
  - zéro cercle: assistant création guidée
- Messages:
  - empty = proposer premier message bienveillant pré-rempli
- Analytics RH:
  - si k<seuil: message “Données insuffisantes pour confidentialité”

---

## 6) Plan d’implémentation (sprints, priorités, risques)

## 6.1 Roadmap 6 sprints (2 semaines)

### Sprint 1 — Fondations confiance
- Setup auth, profile, org/team, RLS socle
- UI shell + thème + navigation routes clés
- KPI instrumentés (events tracking)

### Sprint 2 — Bulles MVP
- Création check-in + historique
- Partage sélectif (`checkin_shares`)
- ZÉNA analyse simple (règles)

### Sprint 3 — Cercles + messagerie
- Cercles + membres + permissions
- Threads DM/cercle + messages basiques
- Réactions sobres (sans likes compétitifs)

### Sprint 4 — Agir + ressources
- Module `/agir` (3 boutons)
- Activities + invitations
- Resources + recommandation contextuelle

### Sprint 5 — Sécurité + famille
- Détection signaux critiques
- Alerting famille opt-in
- Disclaimers + contacts utiles localisés

### Sprint 6 — Entreprise analytics + admin
- Agrégats journaliers k-anonymes
- Dashboard RH/QVT
- Admin panel contenu/rôles/stats
- Hardening sécurité + audit

## 6.2 Risques & mitigations
- **Risque confiance employé**: crainte de surveillance
  - Mitigation: UX transparence + preuve technique RLS + wording clair
- **Faux positifs alertes IA**
  - Mitigation: seuils prudents, revue humaine, fallback ressources neutres
- **Complexité multi-rôles**
  - Mitigation: RBAC strict + parcours onboarding conditionnels
- **Adoption faible**
  - Mitigation: boucle quotidienne ultra-courte + notification soft + micro-actions utiles

## 6.3 KPIs de succès pilote
- Rétention S1 > 35%, S4 > 20%
- Check-in quotidien / MAU > 40%
- Taux invitation cercle > 30%
- Taux activation “Agir” > 25% des check-ins
- CSAT > 4/5, NPS > 20

---

## Recommandation finale de delivery
Pour maximiser vitesse + confiance:
1. Livrer MVP strict (sans feed public, sans complexité sociale inutile).
2. Faire un pilote avec 2 entreprises + familles volontaires (8–10 semaines).
3. Ajuster ZÉNA par apprentissage produit (qualité micro-actions, sécurité, utilité).
4. N’ouvrir V2/V3 qu’après validation rétention + preuve RGPD opérationnelle.
