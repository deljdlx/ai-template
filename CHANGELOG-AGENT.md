# Changelog

Toutes les modifications notables de ce projet sont documentees ici.
Format inspire de [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Fixed
- Fix API category tabs so each `/api/:tab` route displays the correct frontend content pane (`codex`)
- Fix API tab content not updating when clicking sub-tabs (`copilot`)
  - Reorder routes: place `/api/:tab` before `/api` for proper parameter matching
  - Router now correctly matches parameterized routes before static ones
  - Fixes issue where URL changed but content remained on default 'combined' tab
- Fix autonomous bootstrap: add `git clean -fd` to handle leftover untracked files blocking checkout (`claude`)
- Fix CI check step: allow skipping when no CI is configured or network is unavailable (`claude`)

### Added
- Add testing conventions file `ai-instructions/testing.md` (`claude`)
  - Unified testing philosophy aligned with project principles (determinism, observability, YAGNI)
  - Pest conventions: unit vs feature boundaries, Action test patterns, `describe`/`expect` syntax
  - Vitest conventions: mocking IO, `describe` per module, `stubGlobal` for fetch
  - File organization: `tests/Unit/Domain/` mirroring `app/Domain/`, feature tests by endpoint
  - Anti-patterns table (8 common pitfalls with alternatives)
  - Command reference for both stacks
- Add comprehensive backend unit tests for all domain Actions (`claude`)
  - Infos domain: `GetLaravelInfoAction` (5), `GetPhpInfoAction` (5), `GetRuntimeInfoAction` (5), `GetPackagesAction` (6)
  - Auth domain: `RegisterUserAction` (4), `LoginUserAction` (5)
  - FeatureFlags domain: `GetFeatureFlagsAction` (4), `UpsertFeatureFlagAction` (5), `DeleteFeatureFlagAction` (3)
  - Feature tests for missing Infos endpoints: `GET /api/infos`, `/api/infos/laravel`, `/api/infos/php`, `/api/infos/runtime` (7)
  - Total: 49 new tests, bringing backend from 16 to 65 tests (320 assertions)
- Add Laravel Pennant feature flags management across frontend and backend (`codex`)
  - `GET /api/feature-flags` - list global feature flags with enabled state
  - `POST /api/feature-flags` - create or update a global feature flag
  - `PUT /api/feature-flags/{name}` - toggle an existing global feature flag
  - `DELETE /api/feature-flags/{name}` - delete a global feature flag
  - Frontend: add `/feature-flags` page with create/toggle/delete actions
  - Frontend API client: add feature flag endpoints and helpers
  - Backend: add FeatureFlagController and DDD-lite actions for list/upsert/delete
  - Tests: add frontend API unit tests and backend feature tests
- Add authentication endpoints with Laravel Sanctum (`claude`)
  - `POST /api/auth/register` — create account, return user + API token
  - `POST /api/auth/login` — authenticate, return user + API token
  - `RegisterUserAction` + `LoginUserAction` — DDD-lite domain actions
  - `AuthController` — validates requests, delegates to actions
  - `HasApiTokens` trait added to User model
  - Frontend: Register and Login pages with form UI and error handling
  - `postJson()` API helper with Laravel validation error parsing
  - Pest feature tests (7) + Vitest unit tests (3)
- Add packages listing endpoint with full-stack integration (`claude`)
  - `GET /api/infos/packages` — lists installed Composer packages (name, constraint, version, dev flag)
  - `GetPackagesAction` — reads composer.json + composer.lock
  - Frontend: API function + demo section on /api page
  - Pest feature tests (3) + Vitest unit test (1)
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
- Group frontend utility demos under a single `Tests` section with Math/Strings/Arrays sub-tabs (`codex`)
- Migrate frontend routing to hash-based URLs (`/#/...`) and update all navigation links accordingly (`codex`)
- Display frontend API client configuration on the `/api` page (base URL, env override, and resolved endpoints) (`codex`)
- Integrate API tabs into router with proper URL routing (`copilot`)
  - Add `/api/:tab` route to handle sub-tabs (combined, framework, php, runtime, packages)
  - Replace tab buttons with router links for proper navigation
  - Update `setActiveLink()` to mark /api active for all /api/* routes
  - Remove client-side `switchApiTab()` function (now handled by router)
  - Enable browser back/forward navigation between API tabs
  - Shareable URLs for specific API categories (e.g., /api/php)
  - Better UX with proper routing and history management
- Refine homepage messaging with more professional product-language in hero and overview sections (`codex`)
- Add tabbed navigation to frontend API page (`copilot`)
  - Implement 5 sub-tabs: Combined, Framework, PHP, Runtime, Packages
  - Show one category at a time for focused exploration
  - Add `.api-tabs` styled component with active state management
  - Fade-in animation when switching between tabs
  - Responsive design with horizontal scroll on mobile
  - Improves UX by reducing visual clutter and organizing content
- Organize frontend API page with categorical sections (`copilot`)
  - Group endpoints into 5 semantic categories: Combined Diagnostics, Framework Information, PHP Runtime, Application Runtime, Dependencies
  - Add descriptive titles and explanations for each category
  - Improve visual hierarchy with `.api-category` styling
  - Better UX for understanding endpoint purpose and relationships
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
