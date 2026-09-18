# Sonify

![Sonify banner](./public/banner.png)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-1.8-5A29E4?logo=axios&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-required-2496ED?logo=docker&logoColor=white)

Lecteur multimédia en ligne développé dans le cadre d'un projet Epitech Web Academy. Sonify permet de parcourir et d'écouter des albums, artistes et genres musicaux via une interface React connectée à une API REST.

**Démo en ligne : [sonify.leaballester.com](https://sonify.leaballester.com)**

---

## Prérequis

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) avec Compose (API + base MySQL)
- npm

---

## Installation

### 1. Cloner le dépôt

```bash
git clone git@github.com:YetAnotherLea/Sonify.git
cd Sonify
```

### 2. Lancer l'API et la base avec Docker

L'API REST (NestJS, fournie par Epitech sous forme compilée dans `api/`) et sa base MySQL sont
décrites dans `docker-compose.yml`. Le catalogue (`my_spotify_db.sql`, ~1 600 albums du label
[Magnatune](https://magnatune.com)) est importé au premier démarrage.

```bash
docker compose up -d --build
```

L'API est accessible sur : `http://localhost:8000` (documentation Swagger sur `http://localhost:8000/api`).

### 3. Installer les dépendances et lancer le front-end

```bash
npm install
npm run dev
```

> L'API doit être active **avant** de lancer le front-end.

L'application est accessible sur : `http://localhost:5173`

---

## Architecture

```
api/
├── dist/               # API NestJS compilée (albums, artistes, genres, pistes, recherche)
├── Dockerfile
└── package.json
src/
├── api/
│   └── api.js          # Fonctions d'appel à l'API REST
├── components/
│   └── Navbar.jsx      # Barre de navigation principale
├── pages/
│   ├── Genres/
│   │   ├── GenreList.jsx
│   │   └── GenreDetail.jsx
│   ├── Accueil.jsx
│   ├── AlbumList.jsx
│   ├── AlbumDetail.jsx
│   ├── ArtistList.jsx
│   ├── ArtistDetail.jsx
│   └── Search.jsx
├── styles/
├── App.jsx             # Routing principal
└── main.jsx            # Point d'entrée
my_spotify_db.sql       # Catalogue (dump MySQL)
```

### Configuration

| Variable | Côté | Défaut |
| --- | --- | --- |
| `VITE_API_URL` | front | `http://localhost:8000` (`/api` en production, cf. `.env.production`) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PWD`, `DB_NAME` | API | voir `docker-compose.yml` |
| `HOST`, `PORT` | API | `0.0.0.0`, `3000` |

En production, le front (build Vite) et l'API sont servis sur le même domaine par nginx, l'API tournant comme service systemd.

---

## Fonctionnalités

### Accueil

Affichage aléatoire d'albums à la connexion.

### Recherche

Recherche unifiée par album, artiste ou genre, avec pagination des résultats.

### Albums

- Liste paginée de tous les albums
- Page de détail : informations complètes et pistes audio

### Artistes

- Liste paginée de tous les artistes
- Page de détail : albums associés

### Genres

- Liste des genres musicaux
- Page de détail : albums associés au genre

---

## Stack technique

| Technologie      | Version | Usage                     |
| ---------------- | ------- | ------------------------- |
| React            | 19      | Framework UI              |
| Vite             | 6       | Build tool & dev server   |
| React Router DOM | 7       | Routing client            |
| Axios            | 1.8     | Appels HTTP vers l'API    |
| NestJS           | 8       | API REST (fournie par Epitech) |
| MySQL            | 8       | Base de données           |
| Docker Compose   | -       | API + base en local       |
| ESLint           | 9       | Linting                   |

---

## Auteurs

- Stefan-Paris Paduraru
- Azat Orcer
- Léa Ballester
- Walid Sifer

_Projet réalisé dans le cadre de la Web Academy Epitech Marseille — Promo 2026_
