# Conventions JavaScript

Ce document détaille les conventions JavaScript à appliquer dans tous les projets.

## 1. Modules et imports

1. ESM uniquement (`import` / `export`). Jamais de CommonJS (`require`, `module.exports`).
2. Extensions `.js` obligatoires dans les imports relatifs:
   ```js
   import Engine from '../core/engine/Engine.js'
   ```
3. Un `export default` par fichier pour les classes. Exports nommés pour les constantes et fonctions utilitaires:
   ```js
   export default class PlaySpellCommand { /* ... */ }
   export const CARD_DEFINITIONS = Object.freeze([...])
   export function getCardDefinition(definitionId) { /* ... */ }
   ```
4. Grouper les imports en haut du fichier:
   - Imports du cœur de l'application en premier
   - Imports de la logique métier ensuite
   - Imports de définitions/constantes en dernier
5. Pas d'import dynamique (`import()`) sauf pour le code-splitting intentionnel.

## 2. Variables et constantes

1. Préférer `const`, puis `let`. Jamais `var`.
2. Nommage:
   - Variables et propriétés: `camelCase`
   - Classes: `PascalCase`
   - Constantes globales et types statiques: `UPPER_SNAKE_CASE`
   - Paramètres inutilisés: préfixer par `_` (requis par ESLint)
3. IDs et types métier en anglais: `playerId`, `targetId`, `ATTACK_DECLARED`.
4. Pas de "magic values" inline — extraire en constante nommée:
   ```js
   // Mauvais
   const newMaxMana = Math.min(current + 1, 10)

   // Bon
   const MANA_CAP = 10
   const newMaxMana = Math.min(current + 1, MANA_CAP)
   ```
5. `Object.freeze()` obligatoire pour les constantes de définitions:
   ```js
   export const HERO_DEFINITIONS = Object.freeze([
       { id: 'WARRIOR', name: 'Warrior', speed: 3, hp: 30 },
       { id: 'MAGE', name: 'Mage', speed: 2, hp: 15 }
   ])
   ```
6. Fonctions d'accès pour les lookups sur les définitions:
   ```js
   export function getHeroDefinition(definitionId) {
       return HERO_DEFINITIONS.find(d => d.id === definitionId)
   }
   ```

## 3. Fonctions et méthodes

1. Cible: <= 40 lignes par méthode. Au-delà, extraire une sous-fonction.
2. Early return pour éviter les blocs imbriqués:
   ```js
   validate(state) {
       if (state.turnState.activePlayerId !== playerId) {
           return { valid: false, reason: 'Not your turn' }
       }
       const attacker = state.heroes[attackerId]
       if (!attacker) {
           return { valid: false, reason: `Attacker "${attackerId}" not found` }
       }
       return { valid: true }
   }
   ```
3. Propriétés privées préfixées par `_`:
   ```js
   export default class Engine {
       /** @type {PatchApplier} */
       _patchApplier;
       /** @type {DomainEventBus} */
       _domainEventBus;
   }
   ```
4. Destructuring en tête de méthode pour les payloads:
   ```js
   apply(state, ctx) {
       const { playerId, cardId } = this.payload
       // ...
   }
   ```

## 4. JSDoc

JSDoc obligatoire pour:
- Méthodes publiques de classes
- Fonctions exportées
- Types complexes (utiliser `@typedef`)

```js
/**
 * @typedef {Object} Patch
 * @property {string} type    - Nom de l'opération (ex: SET_ATTRIBUTE)
 * @property {string} target  - entityId ou path concerné
 * @property {Object} payload - Données spécifiques au type
 */

/**
 * Applique un patch sur le state et retourne un nouveau state.
 *
 * @param {Object} state - Le state courant (ne sera pas muté)
 * @param {Patch}  patch - Le patch à appliquer
 * @returns {Object} Nouveau state avec le patch appliqué
 * @throws {Error} Si le type de patch est inconnu
 */
apply(state, patch) { /* ... */ }
```

JSDoc optionnel pour:
- Méthodes privées (`_method`) triviales
- Getters/setters évidents
- Fonctions internes courtes dans un module

## 5. ESLint

Configuration: flat config (`eslint.config.js`), ESLint 10+, `@eslint/js` recommended.

Règles principales:
- `no-unused-vars`: pattern `^_` autorisé pour args, vars, et destructuring.
- `ecmaVersion: 'latest'`, `sourceType: 'module'`.
- Globals navigateur déclarés manuellement (pas de `browser: true`).

**Important**: Ne pas modifier `eslint.config.js` sans validation utilisateur.
