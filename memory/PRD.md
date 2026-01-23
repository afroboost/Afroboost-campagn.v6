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

### Système de Lecteur Média Unifié (V5 FINAL - 23 Jan 2026)
- [x] **Lecteur HTML5 natif** : Balise `<video>` avec lien direct Google Drive
- [x] **ZÉRO MARQUAGE** : Aucun logo YouTube, contrôles navigateur uniquement
- [x] **Bouton Play rose #E91E63** : Design personnalisé au centre de la thumbnail
- [x] **Bouton CTA rose #E91E63** : Point focal centré sous la vidéo
- [x] **Responsive mobile** : Testé sur iPhone X (375x812)
- [x] **Template Email V4 "Bravooooo"** : Card violet/noir, preheader anti-promotions

---

## What's Been Implemented (23 Jan 2026)

### MediaViewer V5 FINAL - Lecture HTML5 Native
1. ✅ **Balise `<video>` HTML5** : Lecture native sans iframe
2. ✅ **Lien direct Google Drive** : `https://drive.google.com/uc?export=download&id={ID}`
3. ✅ **ZÉRO marquage externe** : Contrôles play/pause/volume/fullscreen natifs
4. ✅ **Bouton Play personnalisé** : SVG rose #E91E63 avant lecture
5. ✅ **Bouton CTA proéminent** : Rose #E91E63, uppercase, centré
6. ✅ **Responsive** : Testé desktop (1920x800) et mobile (375x812)

### Template Email V4 "Bravooooo"
1. ✅ **Header violet gradient** : `#9333EA → #A855F7 → #C084FC`
2. ✅ **Container noir arrondi** : `#111111`, border-radius: 12px
3. ✅ **Preheader invisible** : Anti-promotions Gmail
4. ✅ **Salutation personnalisée** : "Salut {prénom}," AVANT le design
5. ✅ **Ratio texte/image** : 4-5 lignes de texte après l'image
6. ✅ **Bouton "Voir la vidéo"** : Rose #E91E63 avec icône play

---

## Technical Architecture

```
/app/
├── backend/
│   ├── server.py       # FastAPI avec Media API, Email Template V4
│   └── .env            # MONGO_URL, RESEND_API_KEY, FRONTEND_URL
└── frontend/
    ├── src/
    │   ├── App.js      # Point d'entrée, routage /v/{slug}
    │   ├── components/
    │   │   ├── CoachDashboard.js # Monolithe ~6000 lignes
    │   │   └── MediaViewer.js    # Lecteur vidéo V5 - HTML5 Native
    │   └── services/
    └── .env            # REACT_APP_BACKEND_URL
```

### Key API Endpoints - Media
- `POST /api/media/create`: Crée un lien média
- `GET /api/media`: Liste tous les liens
- `GET /api/media/{slug}`: Récupère les détails + incrémente vues
- `PUT /api/media/{slug}`: Modifie video_url, title, description, cta_text, cta_link, custom_thumbnail
- `DELETE /api/media/{slug}`: Supprime un lien
- `GET /api/share/{slug}`: Page HTML OpenGraph pour aperçus WhatsApp
- `POST /api/campaigns/send-email`: Envoi email avec template V4 "Bravooooo"

### Data Model - media_links
```json
{
  "id": "uuid",
  "slug": "string",
  "video_url": "https://drive.google.com/file/d/{ID}/view",
  "youtube_id": "xxx (optionnel, fallback)",
  "title": "string",
  "description": "string",
  "thumbnail": "url",
  "custom_thumbnail": "url",
  "cta_text": "RÉSERVER MA PLACE",
  "cta_link": "https://afroboosteur.com",
  "views": 0,
  "created_at": "ISO date"
}
```

### Sources Vidéo Supportées
| Source | Méthode de lecture | Marquage |
|--------|-------------------|----------|
| Google Drive | `<video>` HTML5 avec lien direct | AUCUN |
| MP4/WebM directs | `<video>` HTML5 | AUCUN |
| YouTube (fallback) | iframe embed | Logo YouTube (après clic) |

---

## Prioritized Backlog

### P0 - Completed ✅
- [x] Lecteur HTML5 natif avec Google Drive (ZÉRO PUB)
- [x] Template Email V4 "Bravooooo" avec header violet
- [x] Responsive mobile vérifié
- [x] Anti-promotions (preheader + salutation texte)

### P1 - À faire
- [ ] **Refactoring CoachDashboard.js** : Extraire composants (>6000 lignes)
- [ ] **Export CSV contacts CRM** : Valider le flux de bout en bout

### P2 - Backlog
- [ ] Dashboard analytics pour le coach
- [ ] Support upload vidéo direct depuis le dashboard
- [ ] Manuel utilisateur

---

## Credentials & URLs de Test
- **Coach Access**: 3 clics rapides sur "© Afroboost 2025" → Login Google OAuth
- **Email autorisé**: contact.artboost@gmail.com
- **Test Media Slug**: test-final
- **URL de test**: https://mediahub-973.preview.emergentagent.com/v/test-final
- **Vidéo Google Drive**: https://drive.google.com/file/d/1AkjHltEq-PAnw8OE-dR-lPPcpP44qvHv/view

---

## Email Template V4 "Bravooooo" - Spécifications
- **Container**: 600px, fond noir #111111, border-radius 12px
- **Header**: Violet gradient `#9333EA → #A855F7 → #C084FC`, texte "Afroboost" blanc
- **Preheader**: Texte invisible "Salut {prénom}, découvre notre nouvelle vidéo exclusive !"
- **Salutation**: "Salut {prénom}," en texte brut AVANT le design violet
- **Image**: Thumbnail avec border-radius 8px
- **Bouton CTA**: "▶ Voir la vidéo" rose #E91E63, border-radius 8px
- **Footer**: "afroboosteur.com" en violet #A855F7
