# Hackathon Dashboard Platform

## Overview

This is a full-stack **University Hackathon Management Platform** built with **Django Bridge** (Django backend + React/TypeScript frontend). It provides role-based dashboards for students, judges, and admins to manage a live hackathon event — including team management, live judging with multi-judge averaging, live standings, and responsive participant guides.

## Tech Stack

- **Backend**: Django 5.x (Python 3.13), served via Docker
- **Frontend**: React 18 + TypeScript + Tailwind CSS (via Vite)
- **Database**: PostgreSQL 17 (in Docker)
- **Bridge**: `django-bridge` connects Django views to React components
- **Containerization**: Docker Compose (server, client, postgres services)

## Project Structure

```
HACKATHON/
├── docker-compose.yml          # Orchestrates server, client, postgres
├── gemini.md                   # Main AI context & mandates
├── CLAUDE.md                   # Claude-specific mandates
├── CHATGPT.md                  # ChatGPT-specific mandates
├── client/                     # React/TypeScript frontend (Vite)
│   ├── src/
│   │   ├── main.tsx            # View registration & Config
│   │   ├── views/
│   │   │   ├── Home.tsx        # Landing + Info hub (Mission, Schedule, Criteria)
│   │   │   ├── Login.tsx       # Auth (renders inside modal on Home)
│   │   │   ├── Dashboard.tsx   # Live Hub: Standings with Trophies, Phase Clock
│   │   │   ├── Student.tsx     # Student portal: Git guides & Progress
│   │   │   ├── Judge.tsx       # Judge view wrapper
│   │   │   └── Admin.tsx       # Platform management
│   │   └── components/
│   │       ├── Sidebar.tsx     # Responsive Sidebar with Mobile Menu
│   │       ├── RoleNavbar.tsx  # Top navigation (Home, Dashboard, Role View)
│   │       ├── JudgeSection.tsx # Scoring sliders (1-5) + Detailed judge breakdown
│   │       └── ...
├── server/                     # Django backend
│   ├── teams/                  # Teams, Scores, and Events logic
│   ├── users/                  # Custom User model & Auth APIs
│   └── Hackathon/              # Settings & core URL routing
```

## Core Logic & Models

### Scoring System
- **Scale**: Judges score categories from 1 to 5.
- **Weighting**: Technical (30%), Creativity (25%), Impact (20%), Presentation (15%), UX (10%).
- **Calculation**: Individual weighted scores are multiplied by 20 to produce a 20-100% percentage.
- **Averaging**: The `Team.score` is the mathematical average of all submitted `Score` entries from different judges.

### Models
- **Users**: Extended `AbstractUser` with `role` (admin, judge, student) and `team` association.
- **Team**: Stores name, project, mentor, and the aggregated `score`.
- **Score**: Links a `judge` to a `team`. Stores raw 1-5 values and provides a `weighted_score` property.
- **HackathonEvent**: Timeline items with `order`, `start_time`, and `end_time`.

## API Highlights
- `POST /api/team/teams/<id>/submit-score/`: Replaces or creates a judge's score for a team and triggers an average recalculation.
- `GET /api/team/teams/`: Returns all teams including a `judgings` list with individual judge names and breakdowns.

## UI & Design Standards
- **Accent Color**: `#FF2D6F` (Disruptive Pink)
- **Responsiveness**: All views must use `lg:flex-row` / `flex-col` patterns. Sidebar must toggle on mobile.
- **Leaderboard**: Top 3 teams display Gold, Silver, and Bronze trophies with their rank number inside.
- **Modals**: 
  - Login is a modal over the Home page.
  - Judging Criteria on Home opens a detailed rubric modal.
  - Judge breakdown in Judge View is an accordion-style expansion.

## Judging Criteria (Rubric)

| Category | Details |
|---|---|
| **Technical (30%)** | API Data Processing, Relevance & Accuracy, Application Testing |
| **Creativity (25%)** | Originality, Visual Appeal |
| **Impact (20%)** | Audience Value, Overall Impact |
| **Presentation (15%)** | Demo Quality, Showcasing Functionality |
| **Experience (10%)** | Intuitive Design, Interactive Testing |

## Operational Commands
- `docker compose up -d --build`: Rebuild and start.
- `docker compose exec server python manage.py migrate`: Apply database changes.
