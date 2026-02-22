# ai-template

Multi-agent testing playground — "Useless Machine" project combining a Vite/SCSS frontend with a Laravel 12 API backend.

## Structure

```
src/
├── frontend/          # Vite + vanilla JS + SCSS
│   ├── index.html
│   ├── main.js
│   ├── styles/        # SCSS modules (BEM, dark/light theme)
│   └── tests/
└── backend/           # Laravel 12 + SQLite
    ├── app/
    │   ├── Domain/    # DDD leger (Actions)
    │   └── Http/
    ├── routes/
    └── tests/
```

## Quick start

```bash
make init              # Install frontend + backend dependencies
make front-dev         # Start Vite dev server
make laravel-serve     # Start Laravel dev server
```

## API endpoints

### Infos (stack diagnostics)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/infos` | All stack info (Laravel + PHP + runtime) |
| GET | `/api/infos/laravel` | Laravel version, environment, drivers |
| GET | `/api/infos/php` | PHP version, SAPI, extensions |
| GET | `/api/infos/runtime` | App name, timestamps, timezone |

## Checks

```bash
make check             # Run all checks (frontend + backend)
make front-check       # Build + test + lint (frontend)
make laravel-check     # Pest + Pint + PHPStan (backend)
```

## AI agent instructions

Agent instructions live in `ai-instructions/`. See `ai-instructions/README.md` for the reading order.

| File | Scope |
|------|-------|
| `philosophy.md` | Core principles |
| `git.md` | Branch safety, worktrees, publication |
| `changelog.md` | CHANGELOG-AGENT.md conventions |
| `css-scss.md` | SCSS/BEM/theme conventions |
| `javascript-conventions.md` | JS/ES modules conventions |
| `laravel-coding.md` | DDD, Actions, Eloquent patterns |
