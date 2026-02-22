# ai-instructions — Index

Ce dossier contient toutes les instructions partagees entre les agents AI (Claude, Codex, Copilot).
C'est la **source de verite unique** pour le style, les regles, les workflows et les conventions.

## Ordre de lecture

Un agent qui demarre une session doit lire dans cet ordre:

| # | Fichier | Contenu |
|---|---------|---------|
| 1 | `philosophy.md` | Principes fondamentaux du code (anti-entropie, determinisme, YAGNI) |
| 2 | `git.md` | Regles git, branches, worktrees, mode autonome, publication, multi-agents |
| 3 | `changelog.md` | Format et regles de tenue du changelog |
| 4 | `css-scss.md` | Conventions CSS/SCSS (nommage, nesting, variables, responsive) |
| 5 | `javascript-conventions.md` | Conventions JS/TS (modules, fonctions, async, DOM, TypeScript) — si stack JS |
| 6 | `laravel-coding.md` | Architecture Laravel (DDD leger, Actions, Models, PHP robuste) — si stack Laravel |
| 7 | `recipes/stack-vite.md` | Recipe JS/Vite — si le projet utilise cette stack |
| 8 | `recipes/stack-laravel.md` | Recipe Laravel 12 — si le projet utilise cette stack |
| 9 | `recipes/laravel-packages.md` | Catalogue packages extras (Sanctum, Spatie, etc.) — interactif |

Les items 1-4 sont **obligatoires**. Les items 5-9 sont **conditionnels** selon la stack du projet (JS et/ou Laravel).

## Architecture du template

```
CLAUDE.md                         ← identite agent Claude (pointe ici)
AGENTS.md                         ← identite agent Codex (pointe ici)
.github/copilot-instructions.md   ← identite agent Copilot (pointe ici)
.claude/settings.json             ← permissions Claude Code
.gitignore                        ← multi-stack, organise par categorie
setup.sh                          ← script de bootstrap (remplace {{PROJECT}})

ai-instructions/
├── README.md                     ← ce fichier (index + checklist)
├── philosophy.md                 ← principes du code
├── git.md                        ← regles git multi-agents
├── changelog.md                  ← format changelog
├── css-scss.md                   ← conventions CSS/SCSS
├── javascript-conventions.md     ← conventions JS/TS (modules, async, DOM, TypeScript)
├── laravel-coding.md             ← architecture Laravel (DDD leger, Actions, PHP robuste)
└── recipes/
    ├── stack-vite.md             ← recipe JS/Vite
    ├── stack-laravel.md          ← recipe Laravel 12/SQLite
    └── laravel-packages.md       ← packages extras (interactif)
```

## Checklist de bootstrap d'un nouveau projet

Quand on utilise ce template pour demarrer un nouveau projet:

### 1. Cloner et configurer

```bash
# Cloner le template
git clone https://github.com/deljdlx/ai-template.git MON_PROJET
cd MON_PROJET

# Lancer le setup (remplace {{PROJECT}}, reinitialise git)
chmod +x setup.sh
./setup.sh MON_PROJET
```

### 2. Choisir la stack

Selectionner la recipe correspondante dans `recipes/`. Supprimer les recipes non utilisees pour eviter la confusion.

| Stack | Recipe | Action |
|-------|--------|--------|
| JS / Vite | `recipes/stack-vite.md` | Suivre les instructions d'installation |
| Laravel 12 | `recipes/stack-laravel.md` | Suivre les instructions d'installation |
| Autre | — | Creer une nouvelle recipe sur le meme modele |

### 3. Supprimer le code de demo

Le template contient un projet JS de demo ("Useless Machine") dans `src/frontend/`. Le supprimer si non pertinent:

```bash
rm -rf src/frontend/ vite.config.js eslint.config.js .prettierrc package.json package-lock.json
```

### 4. Verifier

- [ ] `{{PROJECT}}` remplace partout (fichiers agent, git.md)
- [ ] `.gitignore` adapte a la stack choisie
- [ ] `.claude/settings.json` — permissions ajustees si besoin
- [ ] Recipe non utilisee supprimee
- [ ] Code de demo supprime
- [ ] Premier commit effectue

## Principes de conception du template

1. **Mutualization maximale**: les 3 fichiers agents sont ultra-minces (identite + pointeur). Toute la logique est dans `ai-instructions/`.
2. **Pas de duplication**: si une regle existe dans `git.md`, elle n'est pas repetee dans les recipes.
3. **Recipes conditionnelles**: une recipe par stack, activee uniquement si pertinente.
4. **Placeholders**: `{{PROJECT}}` est le seul placeholder. Il apparait dans exactement 4 fichiers: `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`, et `ai-instructions/git.md`.
5. **Mode autonome comme standard**: le workflow worktree/branche/PR est le mode par defaut des qu'un agent travaille en autonomie.

## Ajouter une nouvelle recipe

1. Creer `recipes/stack-NOM.md` en suivant le format des recipes existantes.
2. Sections obligatoires: Stack & outils, Installation, Commandes de verification, Style de code, Structure, Tests, Anti-patterns.
3. Ne pas dupliquer ce qui est deja dans les fichiers partages (git, philosophy, changelog).
