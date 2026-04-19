# CHATGPT.md - Technical Blueprint

## Project Identity
- **Name**: University Hackathon Management Platform
- **Visuals**: Dark mode, High-contrast, Neo-brutalist cards.
- **Core Color**: Disruptive Pink (`#FF2D6F`).
- **Framework**: Django Bridge (Django + React).

## Implementation Checklist
1. **Frontend**:
   - Check `client/src/views/` for the specific role view.
   - Use `AppLayout` as the root wrapper for consistent backgrounds.
   - For UI changes, apply Tailwind classes directly.
   - Use `lucide-react` for all iconography.
   
2. **Backend**:
   - APIs are located in `server/teams/views.py` and `server/users/views.py`.
   - All team-related data must be serialized via `serialize_team` to ensure judge details are included.
   - Ensure CSRF tokens are handled via `ensure_csrf_cookie` for login/post actions.

3. **Data/Scoring Flow**:
   - Judges slide 1-5 -> Backend calculates weighted average -> Backend multiplies by 20 -> Team score updated (20-100%).
   - The leaderboard sorts by `Team.score` descending.

## Component Reference
- **Sidebar**: Handles navigation and mobile menu state.
- **RoleNavbar**: Switches between internal views based on the user's role.
- **Dashboard**: Displays a countdown and top-5 leaderboard with Gold/Silver/Bronze trophies.
- **Home**: Authenticated users see the event mission and criteria; guests see the landing page.

## Key CSS/Tailwind Patterns
- `rounded-[28px]` for large containers.
- `bg-[#0A0A0A]/90` with `backdrop-blur` for main sections.
- `border-white/10` for subtle borders.
- `bg-[#FF2D6F]` for primary buttons.

## Troubleshooting
- If database changes aren't reflecting, run: `docker compose exec server python manage.py migrate`.
- If the frontend isn't updating, ensure the Docker client container has successfully hot-reloaded or rebuild via `docker compose up -d --build client`.
