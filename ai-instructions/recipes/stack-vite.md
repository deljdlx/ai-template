# Recipe: JavaScript / Vite

Stack typique: Vite, ESLint, Prettier, Vitest (ou Jest), TypeScript optionnel.

## Stack & outils

| Outil | Role | Commande |
|-------|------|----------|
| Vite | Build & dev server | `npm run build`, `npm run dev` |
| ESLint | Linting | `npx eslint src` |
| Prettier | Formatting | `npx prettier --check src` |
| Vitest | Tests unitaires / integration | `npx vitest run` |
| TypeScript | Type-checking (si present) | `npx tsc --noEmit` |

## Commandes de verification

Executer **dans cet ordre** avant toute livraison ou PR:

```bash
npm run build
npx vitest run
npx eslint src
```

Si Prettier est configure:

```bash
npx prettier --check src
```

Si TypeScript est present:

```bash
npx tsc --noEmit
```

**Tout doit etre vert avant de conclure une tache.**

## Installation des dependances

```bash
npm install
```

Apres un `git checkout` ou un changement de branche, verifier si `package-lock.json` a change. Si oui, relancer `npm install`.

## Style de code

1. ESM seulement (`import` / `export`), pas de CommonJS.
2. Preferer `const`, puis `let`. Jamais `var`.
3. Fonctions courtes et monotaches. Cible: <= 40 lignes par methode.
4. Early return pour eviter les blocs imbriques profonds.
5. Pas de "magic values" inline si elles ont un sens metier: extraire en constante nommee.
6. Nommage: variable `camelCase`, classe `PascalCase`, constantes globales `UPPER_SNAKE_CASE`.

## Structure projet typique

```
src/
├── main.js              # Point d'entree
├── components/          # Composants UI
├── core/                # Logique metier
├── utils/               # Helpers purs
├── styles/              # CSS / SCSS
└── assets/              # Images, fonts, etc.
tests/
├── unit/                # Tests unitaires (pure logic)
└── integration/         # Tests d'integration (DOM, API)
```

Ne pas creer de nouveaux dossiers racine sans validation de l'utilisateur.

## Tests

1. Privilegier Vitest (natif Vite, compatible Jest API).
2. Fichiers de test: `*.test.js` ou `*.spec.js`, colocalises ou dans `tests/`.
3. Un test par comportement, noms descriptifs:
   ```js
   it('should return empty array when no items match filter', () => { ... })
   ```
4. Pas de tests qui dependent de l'ordre d'execution.
5. Mocker les IO (fetch, localStorage, timers), pas la logique metier.

## Vite specifique

1. Config dans `vite.config.js` (ou `.ts`). Ne pas modifier sans validation.
2. Variables d'environnement: prefixer par `VITE_` pour les exposer au client.
3. Imports statiques preferes aux `import()` dynamiques sauf pour le code-splitting intentionnel.
4. Ne pas confondre `npm run dev` (dev server HMR) et `npm run build` (production).

## Prettier + ESLint

1. Si les deux sont presents, Prettier gere le formatting, ESLint gere les regles logiques.
2. Ne pas ajouter de regles de formatting dans ESLint si Prettier est configure.
3. Respecter la config existante (`.eslintrc.*`, `.prettierrc`, `eslint.config.js`). Ne pas la modifier sans validation.

## Anti-patterns

1. `require()` ou `module.exports` dans un projet Vite (CommonJS interdit).
2. `console.log` oublie dans le code commite.
3. Dependances ajoutees sans `--save-dev` pour les outils de dev.
4. `any` en TypeScript sans justification.
5. Tests qui passent mais ne testent rien (assertions manquantes).
