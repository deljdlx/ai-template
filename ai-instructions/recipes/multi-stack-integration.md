# Recipe: Integration multi-stack (Vite + Laravel)

Guide pour les projets qui combinent un frontend Vite (`src/frontend/`) et un backend Laravel (`src/backend/`).
Ce fichier couvre les points de jonction entre les deux stacks. Pour les regles specifiques a chaque stack, voir `recipes/stack-vite.md` et `recipes/stack-laravel.md`.

## Quand appliquer cette recipe

Si le projet contient **les deux** dossiers `src/frontend/` et `src/backend/`, cette recipe est obligatoire.

## Architecture de reference

```
src/
├── frontend/              # Vite root (index.html, main.js, styles/)
│   ├── api.js             # Client API (fetch vers le backend)
│   ├── main.js            # Point d'entree SPA
│   ├── styles/            # SCSS
│   └── tests/             # Tests Vitest
├── backend/               # Laravel root (artisan, app/, routes/)
│   ├── app/Domain/        # Logique metier (Actions, Models)
│   ├── app/Http/          # Controllers, Middleware
│   └── routes/api.php     # Endpoints API
vite.config.js             # A la racine du depot, root: src/frontend/
```

## 1. Proxy Vite pour le dev

En developpement, Vite sert le frontend sur `localhost:5173` et Laravel tourne sur `localhost:8000`. Pour eviter les problemes CORS, configurer un proxy dans `vite.config.js`:

```js
server: {
  proxy: {
    '/api/': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
},
```

### Piege: collision de pattern proxy

**CRITIQUE**: Le pattern du proxy doit etre `/api/` (avec trailing slash), pas `/api`.

Pourquoi: si un fichier source s'appelle `api.js`, le navigateur demande `/api.js`. Le proxy Vite avec le pattern `/api` intercepte cette requete (car `/api.js` commence par `/api`) et la redirige vers Laravel au lieu de laisser Vite servir le module.

Symptomes:
- Le frontend se charge mais **aucun style ne s'applique** (les imports SCSS dans main.js ne s'executent jamais)
- Erreur dans la console: le module renvoie du HTML (page Laravel) au lieu de JavaScript
- Le navigateur peut afficher la page Laravel dans le contenu de `api.js`

Regle: **toujours utiliser le trailing slash** pour les patterns proxy qui correspondent a des prefixes de route API.

### Tester le proxy

```bash
# Terminal 1 — Laravel
cd src/backend && php artisan serve

# Terminal 2 — Vite
npm run dev

# Navigateur → http://localhost:5173
# Les appels /api/* sont proxies vers localhost:8000
```

## 2. Client API frontend

Le module `api.js` centralise tous les appels au backend.

### Pattern recommande

```js
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const getInfos = () => fetchJson('/infos');
```

Regles:
1. `API_BASE` configurable via variable d'environnement `VITE_API_BASE` (fallback `/api`).
2. Toujours envoyer `Accept: application/json` pour que Laravel retourne du JSON (pas de redirect vers login page).
3. Pas de classe wrapper, pas de retry, pas d'intercepteur — YAGNI. Ajouter si et quand le besoin se presente.
4. Un export nomme par endpoint ou groupe d'endpoints.

### Nommage de fichier

Eviter les noms qui entrent en collision avec les patterns proxy (voir section 1). Si le fichier s'appelle `api.js` et le proxy utilise `/api`, il y aura collision. Le trailing slash dans le proxy resout ce probleme.

## 3. Variables d'environnement

### Frontend (Vite)

Les variables exposees au client doivent etre prefixees par `VITE_`:

```bash
# .env (ou .env.local)
VITE_API_BASE=/api
```

Accessibles via `import.meta.env.VITE_API_BASE` dans le code frontend.

**Securite**: ne jamais prefixer par `VITE_` une variable contenant un secret (cle API, token). Les variables `VITE_*` sont injectees dans le bundle client et visibles par tous.

### Backend (Laravel)

Variables classiques Laravel dans `src/backend/.env`:

```bash
APP_URL=http://localhost:8000
```

### Bridge

Il n'y a pas de partage automatique de variables entre les deux stacks. Si une valeur doit etre commune (ex: URL de l'API), la definir dans les deux `.env` separement.

## 4. CORS

### En developpement

Le proxy Vite elimine les problemes CORS: le navigateur voit toutes les requetes comme provenant du meme origin (`localhost:5173`).

### En production

Quand le frontend est deploye sur un domaine different du backend, configurer CORS cote Laravel:

```bash
cd src/backend
php artisan config:publish cors
```

Editer `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

Regle: ne jamais mettre `'*'` en `allowed_origins` en production.

## 5. Tests cross-stack

### Tests frontend (Vitest)

Mocker `fetch` pour tester le client API sans backend:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInfos } from '../api.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => mockFetch.mockReset());

it('calls the correct URL', async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
  });
  await getInfos();
  expect(mockFetch).toHaveBeenCalledWith('/api/infos', expect.any(Object));
});
```

### Tests backend (Pest)

Tester les endpoints API avec des requetes HTTP:

```php
it('returns infos as JSON', function () {
    $this->getJson('/api/infos')
        ->assertOk()
        ->assertJsonStructure(['laravel', 'php', 'runtime']);
});
```

### Pas de tests end-to-end automatiques

Les tests E2E (Playwright, Cypress) ne sont pas requis par defaut. Si le projet en a besoin, creer une recipe dediee. Les tests unitaires des deux cotes suffisent pour la plupart des projets.

## 6. Workflow de dev quotidien

### Demarrer l'environnement

```bash
# Option A — deux terminaux
cd src/backend && php artisan serve    # Terminal 1
npm run dev                             # Terminal 2

# Option B — Makefile (si present)
make serve
```

### Verifications avant PR

Executer les checks des **deux stacks** avant de soumettre une PR:

```bash
# Frontend
npm run build
npx vitest run
npx eslint src/frontend/

# Backend
cd src/backend
php artisan test
./vendor/bin/pint --test
./vendor/bin/phpstan analyse
```

Ou si un script `npm run check` existe:

```bash
npm run check
```

## 7. Routes API — conventions

1. Toutes les routes API dans `routes/api.php`. Prefixe `/api` automatique.
2. Nommer les routes: `->name('infos.index')`.
3. Grouper par domaine avec `Route::prefix()`.
4. En phase de dev/test, les endpoints de diagnostic (infos, health) peuvent rester non proteges. En production, ajouter `auth:sanctum` ou un middleware adapte.

## Anti-patterns

1. **Proxy sans trailing slash**: `/api` au lieu de `/api/` — casse les imports de modules nommes `api.*`.
2. **Hardcoder `localhost:8000`** dans le code frontend — utiliser `VITE_API_BASE` ou le proxy.
3. **Pas de `Accept: application/json`** dans les requetes — Laravel peut retourner du HTML (redirect, page d'erreur) au lieu de JSON.
4. **Secrets dans les variables `VITE_*`** — tout ce qui est prefixe `VITE_` est public.
5. **Oublier de demarrer les deux serveurs** — le proxy Vite echoue silencieusement si Laravel ne tourne pas (erreur 502 ou timeout).
6. **Tester le frontend contre le vrai backend** dans les tests unitaires — mocker `fetch`, tester le backend separement.
7. **CORS wildcard `*` en production** — toujours lister les origines autorisees explicitement.
