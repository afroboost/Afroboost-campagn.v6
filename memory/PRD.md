# Afroboost - Product Requirements Document

## Original Problem Statement
Application de réservation de casques audio pour des cours de fitness Afroboost. Design sombre néon avec fond noir pur (#000000) et accents rose/violet.

**Extension - Système de Lecteur Média Unifié** : Création de pages de destination vidéo épurées (`afroboosteur.com/v/[slug]`) avec miniatures personnalisables, bouton d'appel à l'action (CTA), et aperçus riches (OpenGraph) pour le partage sur les réseaux sociaux.

## User Personas
- **Utilisateurs**: Participants aux cours de fitness qui réservent des casques audio
- **Coach**: Administrateur qui gère les cours, offres, réservations, codes promo et campagnes marketing

## Core Requirements

### Système de Réservation
- [x] Sélection de cours et dates
- [x] Choix d'offres (Cours à l'unité, Carte 10 cours, Abonnement)
- [x] Formulaire d'information utilisateur (Nom, Email, WhatsApp)
- [x] Application de codes promo avec validation en temps réel
- [x] Liens de paiement (Stripe, PayPal, Twint)
- [x] Confirmation de réservation avec code unique

### Mode Coach Secret
- [x] Accès par 3 clics rapides sur le copyright
- [x] Login avec Google OAuth (contact.artboost@gmail.com)
- [x] Tableau de bord avec onglets multiples

### Système de Lecteur Média Unifié (V2 - 23 Jan 2026)
- [x] **MediaViewer Mode Cinéma** : Design fond sombre (#0c0014), texte blanc
- [x] **Bouton CTA rose #E91E63** : Bien visible sous la vidéo
- [x] **Aspect-ratio 16:9** : Lecteur vidéo sans bandes noires
- [x] **Overlays anti-YouTube** : Masquent partiellement le branding YouTube
- [x] **Affichage dynamique** : Titre (au-dessus), Description (en dessous avec pre-wrap), CTA (après description)
- [x] **Template Email V2** : Structure ultra-légère pour délivrabilité maximale

---

## What's Been Implemented (23 Jan 2026)

### MediaViewer V2 - Correction Bug P0
1. ✅ **Bouton CTA rose #E91E63** : Couleur corrigée de #d91cd2 à #E91E63
2. ✅ **Header rose #E91E63** : Cohérence visuelle
3. ✅ **Overlays anti-YouTube** : Gradients en haut (55px) et bas (60px) pour masquer le branding
4. ✅ **Logs de débogage** : `console.log('[MediaViewer] Données reçues:', JSON.stringify(response.data))`
5. ✅ **Protection nulles** : Vérification `!media` avant le rendu
6. ✅ **white-space: pre-wrap** : Sauts de ligne dans la description supportés

### Template Email V2 - Amélioration Délivrabilité
1. ✅ **Structure table** : Layout simplifié pour compatibilité email
2. ✅ **Bouton #E91E63** : Couleur rose cohérente
3. ✅ **Image cliquable** : Bordure rose et lien vers /v/{slug}
4. ✅ **Texte plat** : Évite les div complexes

### Tests Automatisés - Iteration 33
- **Backend** : 10/10 tests passés (100%)
- **Frontend** : Tous les éléments UI vérifiés
- **Fichiers** : `/app/tests/test_media_v33.py`

---

## Technical Architecture

```
/app/
├── backend/
│   ├── server.py       # FastAPI avec AI Webhook, MongoDB, Media API
│   └── .env            # MONGO_URL, RESEND_API_KEY, FRONTEND_URL
└── frontend/
    ├── src/
    │   ├── App.js      # Point d'entrée, routage /v/{slug}
    │   ├── components/
    │   │   ├── CoachDashboard.js # Monolithe ~6000 lignes
    │   │   └── MediaViewer.js    # Lecteur vidéo V2 Mode Cinéma
    │   └── services/
    └── .env            # REACT_APP_BACKEND_URL
```

### Key API Endpoints - Media
- `POST /api/media/create`: Crée un lien média
- `GET /api/media`: Liste tous les liens
- `GET /api/media/{slug}`: Récupère les détails + incrémente vues
- `PUT /api/media/{slug}`: Modifie title, description, cta_text, cta_link
- `DELETE /api/media/{slug}`: Supprime un lien
- `GET /api/share/{slug}`: Page HTML OpenGraph pour aperçus WhatsApp

### Data Model - media_links
```json
{
  "id": "uuid",
  "slug": "string",
  "video_url": "https://youtube.com/watch?v=xxx",
  "youtube_id": "xxx",
  "title": "string",
  "description": "string",
  "thumbnail": "url",
  "cta_text": "RÉSERVER MA PLACE",
  "cta_link": "https://afroboosteur.com",
  "views": 0,
  "created_at": "ISO date"
}
```

---

## Prioritized Backlog

### P0 - Completed ✅
- [x] MediaViewer V2 avec bouton CTA #E91E63
- [x] Template Email V2 ultra-léger
- [x] Tests automatisés iteration 33

### P1 - À faire
- [ ] **Refactoring CoachDashboard.js** : Extraire composants (>6000 lignes)
- [ ] **Migration CSS variables** : Variables --primary-color, --glow-color
- [ ] **Export CSV contacts CRM** : Valider le flux de bout en bout

### P2 - Backlog
- [ ] Dashboard analytics pour le coach
- [ ] Lecteur Audio côté client (playlist des cours)
- [ ] Manuel utilisateur

---

## Credentials
- **Coach Access**: 3 clics rapides sur "© Afroboost 2025" → Login Google OAuth
- **Email autorisé**: contact.artboost@gmail.com
- **Test Media Slug**: session-finale

---

## Known Limitations
- **YouTube branding** : Le watermark "Watch on YouTube" ne peut pas être complètement masqué (limitation API YouTube embed)
- **Emails Promotions** : Malgré le template simplifié, Gmail peut encore classifier certains emails en Promotions
