# CLAUDE.md - Hackathon Platform Context

## Build & Environment
- **Backend**: Django 5.x, Python 3.13 (Server: `localhost:8000`)
- **Frontend**: React 18, Vite, TypeScript (Client: `localhost:5173`)
- **Integration**: `django-bridge` handles the view layer connection.
- **Database**: PostgreSQL 17 (Docker) or SQLite (Local).

## Key Commands
- **Start All**: `docker compose up -d`
- **Rebuild**: `docker compose up -d --build`
- **Migrations**: `docker compose exec server python manage.py migrate`
- **Logs**: `docker compose logs -f`

## Code Standards
- **Components**: Functional React components with TypeScript interfaces.
- **Styling**: Tailwind CSS utilities only. Primary accent: `#FF2D6F`.
- **Icons**: `lucide-react`.
- **Navigation**: Sidebar with responsive mobile toggle; `RoleNavbar` for top-level view switching.
- **State**: Use `useEffect` for data fetching from `/api/team/` and `/api/users/`.

## Architecture Mandates
- **Scoring**: Categories are 1-5. Display as percentage (Value * 20).
- **Recalculation**: The backend `Score.save()` method triggers `team.calculate_average_score()`.
- **Averaging**: Team scores are the mean of all judge entries.
- **Responsiveness**: All pages must use `flex-col lg:flex-row` and `grid-cols-1 lg:grid-cols-2` patterns to ensure mobile support.
- **Auth**: Authenticated users have roles (`admin`, `judge`, `student`) stored in `localStorage` and enforced by Django decorators.

## Model Summary
- `teams.Team`: `name`, `project_name`, `mentor_name`, `score` (Decimal).
- `teams.Score`: `team`, `judge`, technical, creativity, impact, presentation, ux.
- `users.Users`: `role`, `team`, `must_change_password`.
- `teams.HackathonEvent`: `label`, `start_time`, `end_time`, `order`.
