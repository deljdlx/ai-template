# Recipe: Laravel 12 / SQLite

Stack typique: Laravel 12, SQLite, Pest, Pint, Larastan, IDE Helper, Boost (MCP).

## Stack & outils

| Outil | Role | Commande |
|-------|------|----------|
| Laravel 12 | Framework PHP | `php artisan serve` |
| SQLite | Base de donnees (defaut) | auto-configure |
| Pest | Tests (syntaxe expressive) | `php artisan test` |
| Pint | Code style (PHP CS Fixer) | `./vendor/bin/pint` |
| Larastan | Analyse statique | `./vendor/bin/phpstan analyse` |
| IDE Helper | PHPDoc pour models/facades | `php artisan ide-helper:generate` |
| Boost | Guidelines, skills & MCP server pour AI | `php artisan boost:install` |
| Debugbar | Debug toolbar navigateur | auto (APP_DEBUG=true) |

## Installation from scratch

### 1. Emplacement du projet

**Avant de creer la stack, demander a l'utilisateur** si le projet Laravel doit etre place dans un sous-dossier `src/backend/` ou directement a la racine du depot. Si le depot contient (ou contiendra) un frontend separe (ex: `src/frontend/`), preferer `src/backend/`.

### 2. Creer le projet

```bash
# Option A — dans src/backend/
composer create-project laravel/laravel:^12.0 src/backend
cd src/backend

# Option B — a la racine
composer create-project laravel/laravel:^12.0 NOM_DU_PROJET
cd NOM_DU_PROJET
```

Ou avec l'installeur interactif:

```bash
laravel new NOM_DU_PROJET
```

L'installeur propose: starter kit (None/React/Vue/Livewire), framework de test (PHPUnit/Pest), base de donnees (SQLite par defaut).

**Choisir: Pest + SQLite.**

### 3. Verifier que SQLite fonctionne

```bash
php artisan migrate
```

Le fichier `database/database.sqlite` est cree automatiquement. Aucune configuration supplementaire requise.

### 4. Installer les outils de dev

```bash
# Pest (si pas choisi a l'installation)
composer require pestphp/pest --dev --with-all-dependencies
php artisan pest:install

# Larastan (analyse statique)
composer require larastan/larastan --dev

# IDE Helper (autocompletion pour AI/IDE)
composer require barryvdh/laravel-ide-helper --dev

# Debugbar (toolbar debug navigateur)
composer require barryvdh/laravel-debugbar --dev

# Boost (MCP server pour agents AI)
composer require laravel/boost --dev
```

### 5. Configurer Larastan

Creer `phpstan.neon` a la racine:

```neon
includes:
    - vendor/larastan/larastan/extension.neon

parameters:
    paths:
        - app/
    level: 5
```

Commencer au level 5, monter progressivement. Level 9 = maximum.

### 6. Generer les fichiers IDE Helper

```bash
php artisan ide-helper:generate    # Facades → _ide_helper.php
php artisan ide-helper:models -N   # Models → _ide_helper_models.php
php artisan ide-helper:meta        # Container → .phpstorm.meta.php
```

**Relancer apres chaque ajout de model ou migration.**

Ajouter au `.gitignore`:

```
_ide_helper.php
_ide_helper_models.php
.phpstorm.meta.php
```

### 7. Configurer Boost

```bash
php artisan boost:install
```

`boost:install` genere automatiquement:
- Les **guidelines** (fichiers d'instructions) adaptes aux packages detectes dans `composer.json`
- Les **skills** (modules de connaissance on-demand) pour Pest, Livewire, etc.
- La configuration **MCP** (`.mcp.json`) pour connecter les agents au serveur
- Un fichier `boost.json` de configuration

Les fichiers generes par Boost peuvent etre ajoutes au `.gitignore` — ils se regenerent via `boost:install` ou `boost:update`.

#### Connexion MCP par agent

```bash
# Claude Code
claude mcp add -s local -t stdio laravel-boost php artisan boost:mcp

# Codex
codex mcp add laravel-boost -- php "artisan" "boost:mcp"
```

Pour Cursor, Copilot, Gemini CLI : ouvrir les MCP Settings et activer `laravel-boost`.

#### Maintenir Boost a jour

```bash
php artisan boost:update
```

Ou automatiquement via `composer.json`:

```json
{
  "scripts": {
    "post-update-cmd": [
      "@php artisan boost:update --ansi"
    ]
  }
}
```

## Commandes de verification

Executer **dans cet ordre** avant toute livraison ou PR:

```bash
php artisan test
./vendor/bin/pint --test
./vendor/bin/phpstan analyse
```

Si le frontend est present:

```bash
npm run build
```

**Tout doit etre vert avant de conclure une tache.**

## Style de code PHP

1. **PSR-12** comme base, preset `laravel` de Pint par-dessus.
2. Strict types: ajouter `declare(strict_types=1);` en haut de chaque fichier PHP.
3. Type hints partout: parametres, retours, proprietes.
4. Fonctions courtes: cible <= 30 lignes par methode.
5. Early return pour eviter les imbrications profondes.
6. Nommage:
   - Classes, traits, enums: `PascalCase`
   - Methodes, variables: `camelCase`
   - Constantes: `UPPER_SNAKE_CASE`
   - Tables/colonnes DB: `snake_case`
   - Routes: `kebab-case` (`/user-profile`)
7. Un seul `use` par import, pas de `use` avec wildcard.

## Structure Laravel 12

```
app/
├── Http/Controllers/     # Controllers
├── Models/               # Eloquent models
├── Providers/            # AppServiceProvider uniquement (depuis L11)
bootstrap/
├── app.php               # Bootstrap (middleware, exceptions, routes)
config/                   # Fichiers de configuration
database/
├── database.sqlite       # Base SQLite
├── factories/            # Model factories (Pest/PHPUnit)
├── migrations/           # Migrations
├── seeders/              # Seeders
public/                   # Document root (index.php, assets compiles)
resources/
├── views/                # Blade templates
routes/
├── web.php               # Routes web (session, CSRF)
├── console.php           # Commandes artisan, schedules
storage/                  # Logs, cache, sessions, fichiers generes
tests/
├── Feature/              # Tests feature (HTTP, DB)
├── Unit/                 # Tests unitaires (logique pure)
```

**Note Laravel 12**: pas de `app/Console/Kernel.php`, `app/Exceptions/Handler.php`, ni `app/Http/Middleware/`. Tout est consolide dans `bootstrap/app.php`.

`routes/api.php` n'existe pas par defaut. L'installer si besoin: `php artisan install:api`.

## SQLite — Specificites

1. **Foreign keys**: desactivees par defaut. Activer dans `config/database.php`:
   ```php
   'sqlite' => [
       'foreign_key_constraints' => true,
       // ...
   ],
   ```
2. **ALTER TABLE limite**: impossible d'ajouter une colonne avec `->useCurrent()` sur une table existante. Workaround: recreer la table ou utiliser un raw statement.
3. **Comparaison case-sensitive**: SQLite utilise `BINARY` par defaut. Ajouter `collation('nocase')` sur les colonnes texte (name, email) pour un comportement case-insensitive.
4. **Production**: SQLite convient pour le dev et les petits projets. Pour la production a forte charge, migrer vers PostgreSQL ou MySQL (changer `DB_CONNECTION` dans `.env`).

## Tests avec Pest

1. Fichiers dans `tests/Feature/` et `tests/Unit/`.
2. Syntaxe Pest:
   ```php
   it('returns a successful response', function () {
       $response = $this->get('/');
       $response->assertStatus(200);
   });
   ```
3. Un test par comportement, noms descriptifs en anglais.
4. Utiliser `RefreshDatabase` pour les tests qui touchent la DB.
5. Factories pour generer les donnees de test: `User::factory()->create()`.
6. Ne pas mocker Eloquent. Utiliser une DB de test (SQLite in-memory ou le fichier SQLite).

### Lancer les tests

```bash
# Tous les tests
php artisan test

# Un fichier specifique
php artisan test --filter=UserTest

# En parallele (plus rapide)
php artisan test --parallel
```

## Artisan — Commandes courantes

```bash
# Modele + migration + factory + seeder + controller + form request + policy
php artisan make:model Post -a

# Controller resource
php artisan make:controller PostController --resource

# Migration
php artisan make:migration create_posts_table
php artisan migrate
php artisan migrate:rollback

# Seeder
php artisan db:seed

# Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize        # Tout en un

# Reset complet (dev uniquement)
php artisan migrate:fresh --seed
```

## Pint — Configuration

Pint fonctionne zero-config avec le preset `laravel`. Pour personnaliser, creer `pint.json`:

```json
{
    "preset": "laravel",
    "rules": {
        "declare_strict_types": true
    }
}
```

Lancer:

```bash
# Corriger automatiquement
./vendor/bin/pint

# Verifier sans corriger (CI/PR)
./vendor/bin/pint --test
```

## Boost — Usage avec les agents AI

Boost v2 fournit trois mecanismes pour les agents AI:

### 1. Guidelines (chargees upfront)

Instructions chargeess au demarrage de chaque session. Boost detecte les packages dans `composer.json` et genere les guidelines correspondantes (Laravel core, Pest, Pint, Livewire, Inertia, Tailwind, etc.).

Pour ajouter des guidelines custom: creer des fichiers `.md` ou `.blade.php` dans `.ai/guidelines/`.

### 2. Skills (on-demand)

Modules de connaissance actives a la demande quand l'agent en a besoin. Exemple: `pest-testing`, `livewire-development`, `tailwindcss-development`.

Pour ajouter des skills custom: creer `.ai/skills/{skill-name}/SKILL.md`.

### 3. MCP Server (15+ outils)

Serveur MCP exposant des outils d'introspection et d'interaction:

| Outil | Role |
|-------|------|
| Application Info | Versions PHP/Laravel, packages, models Eloquent |
| Database Schema | Schema de la base de donnees |
| Database Query | Requetes SQL (read-only) |
| List Routes | Routes de l'application |
| Search Docs | Recherche semantique dans 17 000+ docs Laravel |
| Tinker | Execution de code dans le contexte de l'app |
| Get Config | Valeurs de configuration (dot notation) |
| Last Error | Derniere erreur dans les logs |
| Browser Logs | Logs et erreurs du navigateur |

Reference complete: https://laravel.com/docs/12.x/boost

## Anti-patterns

1. **Logique metier dans les controllers**: extraire dans des Services, Actions, ou directement sur le Model.
2. **Requetes N+1**: toujours eager-load les relations (`with()`). Activer `Model::preventLazyLoading()` en dev.
3. **Raw SQL sans binding**: toujours utiliser les query bindings (`?` ou `:param`) pour eviter les injections SQL.
4. **Migrations non reversibles**: toujours implementer `down()` ou marquer explicitement `throw new RuntimeException('Irreversible')`.
5. **`.env` commite**: ne jamais commiter `.env`. Commiter `.env.example` avec les cles vides.
6. **Masse assignment non protege**: toujours definir `$fillable` ou `$guarded` sur les models.
7. **Tests sans assertions**: un test qui passe sans `assert*` ne teste rien.
8. **`dd()` ou `dump()` oublie dans le code commite**: equivalent du `console.log` oublie.
