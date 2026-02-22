# Changelog

Toutes les modifications notables de ce projet sont documentees ici.
Format inspire de [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Add multi-stack integration recipe for Vite + Laravel projects (`claude`)
  - Vite proxy configuration (with `/api/` trailing slash gotcha)
  - API client pattern with configurable `VITE_API_BASE`
  - CORS setup for production deployments
  - Cross-stack testing strategies (Vitest mocks + Pest HTTP tests)
  - Dev workflow and dual-server setup
- Add frontend API client module and demo page for backend communication (`claude`)
  - `GET /api/infos` — combined stack info
  - `GET /api/infos/laravel` — Laravel config
  - `GET /api/infos/php` — PHP version and extensions
  - `GET /api/infos/runtime` — app name, timestamps
- Add API endpoint listing requirement to changelog instructions (`claude`)
- Add infos domain API endpoints for Laravel stack diagnostics (`copilot`) — #19
  - `GET /api/infos` — all stack info (Laravel + PHP + runtime)
  - `GET /api/infos/laravel` — Laravel version, environment, drivers
  - `GET /api/infos/php` — PHP version, SAPI, extensions
  - `GET /api/infos/runtime` — app name, timestamps, timezone
- Add JavaScript conventions file with modules, functions, async, DOM, TypeScript sections (`claude`) — #18
- Add error handling / diagnostic sections to stack-vite.md and stack-laravel.md (`claude`) — #18
- Add pre-flight checklist and autonomous mode trigger phrase table in git.md (`claude`) — #17
- Add placeholder verification step in setup.sh (`claude`) — #17
- Add Laravel Pennant (feature flags) as recommended package in extras recipe (`claude`) — #16

### Changed
- Redesign frontend homepage to explain stack purpose and architecture (`copilot`)
  - Add introductory section highlighting key technologies (Vite, vanilla JS, responsive CSS)
  - Document core features (client-side routing, component architecture, API integration, theme management, testing)
  - Update page title to better reflect the playground's educational purpose
  - Add `.home-intro` styled section with arrow-bullet list
  - Replace "Useful ones" stat with "Possibilities" stat (∞)
- Rename site from "The Useless Machine" to "Frontend Stack Playground" (`copilot`)
  - Update page title (HTML meta)
  - Update main heading and subtitle 
  - Better aligned with educational purpose and modern stack focus
- Add cross-references between instruction files and migration conflict guidance (`claude`) — #15
- Add interactive Laravel packages recipe: Sanctum, Passport, Spatie essentiels, extras (`claude`) — #12
- Add Laravel coding instructions: DDD leger, Actions pattern, PHP robuste (`claude`) — #11
- Add Makefile with init, serve, check, fix commands for frontend and Laravel (`claude`) — #9
- Deploy Laravel 12 stack in src/backend/ with Pest, Pint, Larastan, IDE Helper, Debugbar, Boost v2 (`claude`) — #8
- Add SCSS component foundation with 8 modular files and BEM naming (`claude`) — #7
- Add dark/light theme system via CSS custom properties and data-theme attribute (`claude`) — #7
- Add theme.js module with localStorage persistence and anti-FOUC script (`claude`) — #7
- Add template index README.md documenting project structure and recipes (`claude`) — #6
- Add setup.sh bootstrap script for automated project initialization (`claude`) — #6
- Add reusable client-side JS router with History API (`codex`) — #3
- Add interactive click counter to homepage (`copilot`) — #1
- Add changelog maintenance instructions for agents (`claude`) — #2

### Fixed
- Fix working tree read/write vs read-only contradiction in git.md section 3 (`claude`) — #17
- Fix "lire TOUS les fichiers" contradiction with conditional recipes in agent files (`claude`) — #17
- Fix storage/debugbar/ not ignored by .gitignore (`claude`) — #13

### Changed
- Soften strict_types rule to acknowledge framework-generated files (`claude`) — #17
- Consolidate multi-agent instructions: resolve contradictions, deduplicate anti-patterns, add worktree reuse logic, lock file and migration conflict strategies, agent communication protocol (`claude`) — #15
- Update packages recipe: allow Sanctum + Passport coexistence with separate guards (`claude`) — #14
- Redesign all pages with "Useless Machine" retro-industrial identity and interactive demos (`claude`) — #4
- Move all source and test files from root to src/frontend/ (`claude`) — #5
- Extract 450 lines of inline CSS from index.html into modular SCSS files (`claude`) — #7
- Update Laravel recipe with Boost v2 documentation (guidelines, skills, MCP server) (`claude`) — #8
