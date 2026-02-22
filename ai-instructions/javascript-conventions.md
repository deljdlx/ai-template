# JavaScript — Conventions de code

Conventions JS/TS pour tous les projets frontend. Complement de `css-scss.md` (styles) et `recipes/stack-vite.md` (tooling).

---

## 1. Modules et imports

```js
// ESM uniquement — jamais de require() ou module.exports
import { createRouter } from './router.js';
import { formatDate } from '../utils/date.js';
```

Regles:
1. **ESM seulement** (`import` / `export`). CommonJS interdit dans les projets Vite.
2. **Un export par fichier** quand le fichier a une responsabilite unique. `export default` pour le composant/classe principal, `export` nomme pour les utilitaires.
3. **Pas d'import wildcard** (`import * as utils`). Preferer les imports nommes pour le tree-shaking.
4. **Extensions explicites** dans les imports: `.js`, `.ts`. Necessaire pour la resolution ESM native.
5. **Imports groupes** dans l'ordre: packages externes → chemins absolus → chemins relatifs. Ligne vide entre chaque groupe.

## 2. Variables et constantes

```js
// Bon
const MAX_RETRIES = 3;
const userName = getUserName();
let attemptCount = 0;

// Mauvais
var data = fetch(...);          // var interdit
let config = { port: 3000 };   // const si jamais reassigne
```

Regles:
1. **`const` par defaut**. `let` uniquement si la variable est reassignee. **Jamais `var`**.
2. **Constantes globales** en `UPPER_SNAKE_CASE`: `MAX_RETRIES`, `API_BASE_URL`.
3. **Variables et fonctions** en `camelCase`: `userName`, `fetchData()`.
4. **Classes et constructeurs** en `PascalCase`: `UserService`, `EventEmitter`.
5. **Pas de magic values**: extraire en constante nommee si la valeur a un sens metier.

## 3. Fonctions

```js
// Bon — courte, un seul but, nommee par intention
function calculateTotalWithTax(items, taxRate) {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    return Math.round(subtotal * (1 + taxRate));
}

// Mauvais — trop longue, effets de bord, nom vague
function processData(data) {
    // ... 80 lignes ...
}
```

Regles:
1. **<= 40 lignes** par fonction. Au-dela, decomposer.
2. **Nommer par intention**: `calculateTotal`, `formatUserName`, `validateEmail`. Pas `doStuff`, `handle`, `process`.
3. **Early return** pour eviter les imbrications profondes.
4. **Fonctions pures** quand possible: meme entree → meme sortie, pas d'effets de bord.
5. **Arrow functions** pour les callbacks courts et les fonctions sans `this`. Fonctions nommees pour la lisibilite et le debugging (stack traces).
6. **Parametres**: 3 max. Au-dela, passer un objet avec destructuring.

```js
// Bon — destructuring pour > 3 params
function createUser({ name, email, role = 'user', avatar = null }) {
    // ...
}

// Mauvais
function createUser(name, email, role, avatar, isActive, createdAt) {
    // ...
}
```

## 4. Gestion d'erreurs

```js
// Bon — try/catch au boundary, erreur specifique
async function fetchUser(id) {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch user ${id}: ${response.status}`);
    }
    return response.json();
}

// Dans le controller/handler
try {
    const user = await fetchUser(42);
    renderUser(user);
} catch (error) {
    showErrorMessage('Impossible de charger le profil');
    console.error(error);
}
```

Regles:
1. **Ne pas ignorer les erreurs**: un `catch` vide est un bug cache.
2. **Errors au boundary**: `try/catch` dans les handlers d'evenements, les appels API, les points d'entree. Pas dans chaque fonction.
3. **Messages descriptifs**: inclure le contexte (quel ID, quelle operation).
4. **Pas de `throw` de strings**: toujours `throw new Error(...)`.
5. **Erreurs async**: `try/catch` avec `await`, ou `.catch()` sur les promises. Jamais de promise non geree.

## 5. Asynchrone

```js
// Bon — async/await
async function loadDashboard() {
    const [user, stats] = await Promise.all([
        fetchUser(),
        fetchStats(),
    ]);
    return { user, stats };
}

// Mauvais — callback hell
fetchUser(function(user) {
    fetchStats(function(stats) {
        render(user, stats);
    });
});
```

Regles:
1. **`async/await`** prefere aux `.then()` chains. Plus lisible, meilleur debugging.
2. **`Promise.all()`** pour les requetes paralleles independantes.
3. **Pas de `await` en serie** quand les operations sont independantes.
4. **Timeouts**: toujours prevoir un timeout ou un abort pour les requetes reseau.

## 6. DOM et evenements

```js
// Bon — delegation d'evenements
document.querySelector('.todo-list').addEventListener('click', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;
    toggleTodo(item.dataset.id);
});

// Mauvais — listener par element
document.querySelectorAll('.todo-item').forEach(item => {
    item.addEventListener('click', () => toggleTodo(item.dataset.id));
});
```

Regles:
1. **Delegation d'evenements** quand possible (un listener parent au lieu d'un par enfant).
2. **`querySelector` / `querySelectorAll`** au lieu de `getElementById`. API coherente.
3. **Data attributes** (`data-*`) pour passer des donnees au JS. Pas de parsing de classes CSS.
4. **Separation DOM/logique**: la logique metier ne doit pas dependre du DOM. Extraire dans des fonctions pures testables.
5. **Cleanup**: retirer les listeners quand l'element est detruit (SPA, composants dynamiques).

## 7. Structure d'un module

```js
// 1. Imports
import { formatDate } from '../utils/date.js';
import { API_BASE } from '../config.js';

// 2. Constantes du module
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// 3. Fonctions privees (non exportees)
function buildUrl(path) {
    return `${API_BASE}${path}`;
}

// 4. Fonctions publiques (exportees)
export function fetchUsers() {
    return fetch(buildUrl('/users')).then(r => r.json());
}

// 5. Init (si necessaire)
export function init() {
    // ...
}
```

Regles:
1. **Un module = une responsabilite**. Si le fichier depasse 200 lignes, le decomposer.
2. **Ordre**: imports → constantes → fonctions privees → exports → init.
3. **Pas de code au top-level** qui s'execute a l'import (side effects). Encapsuler dans une fonction `init()`.

## 8. TypeScript (si present)

```ts
// Bon — types explicites aux boundaries
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

function createUser(data: Omit<User, 'id'>): User {
    return { id: generateId(), ...data };
}
```

Regles:
1. **Typer les boundaries**: parametres de fonctions publiques, retours, interfaces API. L'inference gere le reste.
2. **Interfaces > types** pour les objets. `type` pour les unions et les utilitaires.
3. **Pas de `any`** sans justification en commentaire. Preferer `unknown` puis narrowing.
4. **Strict mode**: `"strict": true` dans `tsconfig.json`.
5. **Enums**: preferer les unions de string literals (`type Role = 'admin' | 'user'`) aux `enum` TS.

## Anti-patterns

1. **`var`**: toujours `const` ou `let`.
2. **Callback hell**: utiliser `async/await`.
3. **`==` au lieu de `===`**: toujours la comparaison stricte.
4. **Mutation de parametres**: ne pas modifier les objets/arrays passes en argument. Creer une copie.
5. **`console.log` oublie**: equivalent du `dd()` en PHP. Retirer avant le commit.
6. **Fonctions geantes**: > 40 lignes = decomposer.
7. **Import dynamique sans raison**: `import()` uniquement pour le code-splitting intentionnel.
8. **Event listeners sans cleanup**: fuites memoire dans les SPA.
9. **Concatenation de strings pour le HTML**: utiliser `template literals` ou un moteur de templates.
10. **Fetch sans gestion d'erreur**: toujours verifier `response.ok`.
