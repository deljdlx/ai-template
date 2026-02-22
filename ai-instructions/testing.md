# Testing — Conventions et patterns

Guide unifie pour les tests backend (Pest) et frontend (Vitest). Complement des recipes stack qui couvrent l'installation et les commandes.

> Les tests sont la **forme executable de l'observabilite** (philosophie §8).
> Un test qui echoue signale une rupture de contrat, pas un bug de test.

---

## 1. Principes

1. **Un test par comportement**. Pas par methode, pas par ligne de code. Chaque `it()` teste un seul contrat observable.
2. **Determinisme obligatoire** (philosophie §3). Aucun test ne doit dependre de l'ordre d'execution, de l'heure, ou d'un etat partage.
3. **Noms descriptifs en anglais**. Le nom du test est la documentation: `it('throws validation exception for wrong password')`.
4. **Pas de tests morts**. Un test commente ou `skip()` est un mensonge. Le supprimer ou le corriger.
5. **YAGNI** (philosophie §4). Ne pas tester les getters/setters triviaux ni les comportements du framework.

---

## 2. Organisation des fichiers

### Backend (Pest)

```
tests/
├── Unit/
│   └── Domain/              ← miroir de app/Domain/
│       ├── Auth/
│       │   ├── LoginUserActionTest.php
│       │   └── RegisterUserActionTest.php
│       ├── Infos/
│       │   ├── GetLaravelInfoActionTest.php
│       │   └── ...
│       └── FeatureFlags/
│           └── ...
├── Feature/                 ← tests HTTP (endpoints)
│   ├── AuthEndpointTest.php
│   ├── InfosEndpointTest.php
│   └── ...
└── Pest.php                 ← configuration Pest
```

Convention de nommage:
- Unit: `{NomAction}Test.php` dans `tests/Unit/Domain/{Domaine}/`
- Feature: `{Domaine}EndpointTest.php` dans `tests/Feature/`

### Frontend (Vitest)

```
src/frontend/tests/
├── api.test.js
├── math.test.js
├── strings.test.js
├── arrays.test.js
└── router.test.js
```

Convention: `{module}.test.js` dans `tests/` ou colocalise avec le module.

---

## 3. Unit vs Feature — quand utiliser quoi

| Critere | Unit test | Feature test |
|---------|-----------|-------------|
| **Cible** | Une Action, un Model, une classe | Un endpoint HTTP complet |
| **Scope** | Logique metier isolee | Request → Validation → Action → Response |
| **Base de donnees** | Seulement si l'Action en a besoin | Toujours (via `RefreshDatabase`) |
| **Framework HTTP** | Non | Oui (`$this->getJson()`, `$this->postJson()`) |
| **Vitesse** | Rapide | Plus lent (boot complet) |

**Regle**: chaque Action du domaine a des **unit tests**. Chaque endpoint expose a des **feature tests**.

Les feature tests ne dupliquent pas les unit tests: ils verifient la glue HTTP (validation, status code, structure JSON), pas la logique metier en detail.

---

## 4. Pest — conventions backend

### Structure d'un test unitaire d'Action

```php
<?php

declare(strict_types=1);

use App\Domain\Billing\Actions\CreateInvoiceAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

// Declarer les traits necessaires
uses(Tests\TestCase::class, RefreshDatabase::class);

it('creates an invoice for the given user', function () {
    $user = User::factory()->create();

    $result = (new CreateInvoiceAction)->execute($user, amount: 1000);

    expect($result)->toHaveKeys(['invoice', 'total']);
    expect($result['invoice']->user_id)->toBe($user->id);
});

it('throws exception for negative amount', function () {
    $user = User::factory()->create();

    (new CreateInvoiceAction)->execute($user, amount: -1);
})->throws(InvalidArgumentException::class);
```

### Structure d'un test feature d'endpoint

```php
<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('POST /api/resource', function () {
    it('creates resource and returns 201', function () {
        $this->postJson('/api/resource', ['name' => 'Test'])
            ->assertCreated()
            ->assertJsonStructure(['id', 'name']);
    });

    it('rejects invalid input with 422', function () {
        $this->postJson('/api/resource', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    });
});
```

### Regles Pest

1. **`uses()` explicite**. Declarer `Tests\TestCase::class` et `RefreshDatabase::class` en haut de chaque fichier qui en a besoin. Ne pas modifier `Pest.php` pour des cas specifiques.
2. **`describe()` pour grouper**. Utiliser `describe()` dans les feature tests pour grouper par endpoint. Optionnel dans les unit tests.
3. **`expect()` > `assert*()`**. Privilegier la syntaxe Pest expectations (`expect($x)->toBe(...)`) plutot que les assertions PHPUnit.
4. **Factories pour les donnees**. Toujours `User::factory()->create()`, jamais d'insertion manuelle en DB.
5. **Ne pas mocker Eloquent**. Utiliser la DB SQLite de test. Les mocks Eloquent sont fragiles et ne testent rien de reel.
6. **`->throws()` pour les exceptions**. Syntaxe concise: `})->throws(ValidationException::class);`

### Ce qu'on teste dans un unit test d'Action

- **Structure de retour**: cles attendues, types de valeurs
- **Effets en base**: l'enregistrement existe apres `execute()`
- **Cas d'erreur**: exception levee avec le bon type et message
- **Cas limites**: liste vide, valeur nulle, doublon
- **Idempotence**: si l'Action est idempotente, le verifier

### Ce qu'on teste dans un feature test d'endpoint

- **Status code**: `assertOk()`, `assertCreated()`, `assertUnprocessable()`, `assertNoContent()`
- **Structure JSON**: `assertJsonStructure([...])` pour le contrat d'API
- **Validation**: `assertJsonValidationErrors('field')` pour chaque regle
- **Contenu**: `assertJsonPath('key', 'value')` ou `assertJsonFragment([...])` pour les valeurs critiques

---

## 5. Vitest — conventions frontend

### Structure d'un test

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { myFunction } from '../module.js';

describe('myFunction', () => {
  it('returns expected value for valid input', () => {
    expect(myFunction(42)).toBe('result');
  });

  it('throws on invalid input', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### Mocker fetch

```js
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

it('calls correct URL', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
  });

  await apiFunction();

  expect(mockFetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/endpoint'),
    expect.any(Object),
  );
});
```

### Regles Vitest

1. **Mocker les IO**, pas la logique metier: `fetch`, `localStorage`, `setTimeout`.
2. **Pas de `import.meta.env`** dans les tests. Mocker via `vi.stubGlobal()` ou configurer `define` dans `vitest.config`.
3. **Pas de tests qui manipulent le DOM** sauf pour le router. Les fonctions pures n'ont pas besoin de DOM.
4. **Un `describe()` par module exporte**. Grouper les `it()` par fonction testee.

---

## 6. Anti-patterns

| Anti-pattern | Pourquoi c'est mauvais | Alternative |
|-------------|----------------------|-------------|
| Tester les internals prives | Couplage a l'implementation, casse au refactor | Tester via l'API publique |
| Mocker Eloquent | Fragile, ne teste pas le vrai comportement | Utiliser SQLite de test |
| Test qui depend de l'heure | Non-deterministe, echoue a minuit | `Carbon::setTestNow()` ou `vi.useFakeTimers()` |
| Test qui depend de l'ordre | Echoue en parallele | Chaque test cree ses propres donnees |
| `assertDatabaseHas()` sans `RefreshDatabase` | Pollue les tests suivants | Toujours declarer `RefreshDatabase` |
| Snapshot tests pour du JSON dynamique | Faux positifs permanents | `assertJsonStructure()` pour le contrat, valeurs fixes pour le contenu |
| Test duplique (unit + feature identique) | Double maintenance | Unit = logique metier, Feature = glue HTTP |
| `sleep()` dans un test | Lent et fragile | Mocker le temps ou utiliser des callbacks |

---

## 7. Commandes

### Backend

```bash
# Tous les tests
php artisan test

# Un fichier specifique
php artisan test --filter=LoginUserActionTest

# Un test specifique
php artisan test --filter='it throws validation exception'

# En parallele
php artisan test --parallel

# Avec couverture
php artisan test --coverage
```

### Frontend

```bash
# Tous les tests (single run)
npx vitest run

# Mode watch (dev)
npx vitest

# Un fichier specifique
npx vitest run tests/api.test.js

# Avec couverture
npx vitest run --coverage
```

### Verification complete (pre-push)

```bash
# Backend
php artisan test && ./vendor/bin/pint --test

# Frontend
npx vitest run && npx eslint src/frontend/

# Ou via le Makefile si disponible
make check
```
