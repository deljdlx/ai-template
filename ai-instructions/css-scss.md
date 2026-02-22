# Instructions CSS / SCSS

Conventions et regles pour les styles CSS et le preprocesseur SCSS.

## Principes generaux

1. **Un seul point d'entree**: `src/styles/main.scss` importe tous les partials.
2. **Pas de styles inline** dans le HTML sauf cas exceptionnel (valeur dynamique JS).
3. **Mobile-first**: ecrire les styles de base pour mobile, ajouter les breakpoints avec `min-width`.
4. **Pas de `!important`** sauf pour overrider une librairie tierce. Toujours commenter pourquoi.
5. **Pas de magic numbers**: extraire les valeurs recurrentes en variables/tokens.

## Organisation des fichiers

```
src/styles/
├── main.scss            # Point d'entree — imports uniquement
├── _variables.scss      # Tokens: couleurs, tailles, breakpoints, z-index
├── _mixins.scss         # Mixins reutilisables (responsive, typography, etc.)
├── _base.scss           # Reset/normalize + styles de base (body, a, headings)
├── _layout.scss         # Grille, conteneurs, structure de page
├── _components.scss     # Styles de composants reutilisables
└── _utilities.scss      # Classes utilitaires (optionnel, si pas de framework)
```

Ordre d'import dans `main.scss`:

```scss
@use 'variables';
@use 'mixins';
@use 'base';
@use 'layout';
@use 'components';
@use 'utilities';
```

## Nommage

1. Classes en **kebab-case**: `.nav-item`, `.card-header`.
2. Pas de nommage lie a l'apparence: `.text-red` est fragile, `.error-message` est stable.
3. Prefixer les classes utilitaires: `.u-hidden`, `.u-flex`.
4. Prefixer les classes JS-only: `.js-toggle`, `.js-modal-trigger` (pas de style sur ces classes).
5. Pas d'IDs pour le styling. Reserver les IDs au JS et aux ancres.

## SCSS: `@use` et `@forward`

1. **Toujours `@use`**, jamais `@import`** (`@import` est deprecie en Sass).
2. Namespaces explicites:
   ```scss
   @use 'variables' as vars;
   .title { color: vars.$primary; }
   ```
3. Pour exposer un partial a travers un index: utiliser `@forward`.
4. Pas de `@use` dans un partial qui ne l'utilise pas directement.

## Variables et tokens

```scss
// _variables.scss

// Couleurs
$primary: #1a1a2e;
$accent: #e94560;
$text: #eee;
$bg: #0f0f1a;

// Typographie
$font-body: 'Source Sans Pro', sans-serif;
$font-heading: 'Source Code Pro', monospace;
$font-size-base: 1rem;

// Breakpoints
$bp-sm: 576px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1280px;

// Z-index (echelle controlee, pas de z-index: 9999)
$z-dropdown: 100;
$z-sticky: 200;
$z-modal: 300;
$z-toast: 400;
```

Regles:
1. Centraliser toutes les variables dans `_variables.scss`.
2. Nommer par role, pas par valeur: `$primary` et non `$dark-blue`.
3. Echelle de z-index par paliers de 100. Pas de valeurs arbitraires.

## Nesting

1. **3 niveaux max**. Au-dela, extraire dans un nouveau selecteur ou repenser la structure.
2. Le nesting doit refleter une relation parent-enfant reelle dans le DOM.

```scss
// Bon
.card {
  padding: 1rem;

  &__title {
    font-size: 1.2rem;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

// Mauvais — trop profond
.page {
  .section {
    .card {
      .card-body {
        .title { ... } // 5 niveaux = illisible
      }
    }
  }
}
```

## Mixins et fonctions

```scss
// _mixins.scss

// Responsive breakpoint
@mixin respond-to($bp) {
  @media (min-width: $bp) {
    @content;
  }
}

// Usage
.container {
  padding: 1rem;

  @include respond-to($bp-md) {
    padding: 2rem;
  }
}
```

Regles:
1. Mixin = genere du CSS. Fonction = retourne une valeur.
2. Ne pas creer de mixin pour une seule propriete. `@include font-size(16px)` n'apporte rien vs `font-size: 1rem`.
3. Documenter les parametres si le mixin a plus de 2 arguments.

## Responsive

1. **Mobile-first**: styles de base = mobile, `min-width` pour les ecrans plus grands.
2. Utiliser les variables de breakpoint, jamais de valeurs en dur dans les media queries.
3. Placer les media queries **dans le selecteur** (grace au nesting SCSS), pas dans un fichier separe.
4. Pas plus de 4-5 breakpoints. Au-dela, simplifier le design.

```scss
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @include respond-to($bp-md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to($bp-lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Unites

1. `rem` pour les tailles de texte et espacements (accessible, respecte les preferences utilisateur).
2. `px` pour les bordures, ombres, et valeurs fixes tres petites (1px, 2px).
3. `%` ou `vw/vh` pour les largeurs/hauteurs fluides.
4. Pas de `em` sauf dans un cas precis de taille relative au parent direct.

## Ordre des proprietes

Regrouper par categorie (pas d'ordre alphabetique):

```scss
.element {
  // 1. Positionnement
  position: relative;
  top: 0;
  z-index: $z-dropdown;

  // 2. Display & box model
  display: flex;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;

  // 3. Typographie
  font-family: $font-body;
  font-size: $font-size-base;
  color: $text;

  // 4. Visuel
  background: $bg;
  border: 1px solid $accent;
  border-radius: 4px;

  // 5. Divers
  cursor: pointer;
  transition: all 0.2s ease;
}
```

## Anti-patterns

1. **Selecteurs trop specifiques**: `.page .content .sidebar .widget .title` — fragile et difficile a overrider.
2. **`@extend` excessif**: preferer les mixins. `@extend` genere des selecteurs groupes difficiles a debugger.
3. **Styles dupliques**: si le meme bloc apparait 3+ fois, extraire en mixin ou classe.
4. **Valeurs en dur**: `color: #e94560` repete partout au lieu de `color: $accent`.
5. **Nesting purement cosmetique**: ne pas nester juste pour indenter. Chaque niveau de nesting doit correspondre a une relation DOM.
6. **`@import` au lieu de `@use`**: `@import` est deprecie, pollue le scope global, et sera supprime de Sass.
7. **Styles globaux non resets**: ne pas supposer que tous les navigateurs ont les memes defaults.
