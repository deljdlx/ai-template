# Analyse des instructions IA — Améliorations proposées

**Date**: Février 2026  
**Scope**: Analyse complète de `ai-instructions/` et documents agents

---

## 1. Vue générale — Points forts

### ✅ Force 1: Mutalisation maximale
L'architecture est bien pensée: un seul ensemble d'instructions (`ai-instructions/`) pointe par 3 fichiers agents minces (`CLAUDE.md`, `AGENTS.md`, `copilot-instructions.md`). Zéro duplication.

### ✅ Force 2: Philosophie claire
`philosophy.md` exprime des principes solides (anti-entropie, déterminisme, observabilité). Elle sert de **fondation intellectuelle** commune.

### ✅ Force 3: Git robuste
`git.md` couvre les workflows critiques (worktrees isolés, mode autonome, multi-agents). Très bon niveau de détail.

### ✅ Force 4: Stack-aware organization
Les recipes conditionnelles (`recipes/stack-*.md`) permettent d'adapter les instructions sans surcharge.

### ✅ Force 5: Changelog discipliné  
Format cohérent inspiré [Keep a Changelog](https://keepachangelog.com/), avec traceabilité multi-agents.

---

## 2. Problèmes identifiés

### 🔴 Problème 1: Redondance git.md ↔ brouillons

**Localisation**: `ai-instructions/git.md` vs `__draft/01-*.md` à `__draft/06-*.md`

**Issue**: Les brouillons sont **40% du contenu** de `git.md`: règles critiques, bootstrap, workflow, gestion erreurs.
- Brouillons: 9 fichiers séparés, bien architecturés
- Source de vérité: `git.md` = 1 monolithe de 350+ lignes

**Impact**: Confusion sur la source de vérité. Les brouillons semblent être une **refonte en cours** jamais finalisée.

**Recommandation**: 
- **Garder `git.md`** comme source unique (c'est ce qui est pointé dans README.md)
- **Archiver `__draft/`** ou le renommer en `ARCHIVE/ANCIENNES-VERSIONS/`
- **OU** : Restructurer `git.md` en sous-fichiers si c'est trop gros

---

### 🔴 Problème 2: Absence de runbook d'erreurs

**Issue**: `git.md` couvre déjà les erreurs (section 9), mais **aucun document** couvre les erreurs hors-git:
- Erreurs de build (npm, composer)
- Erreurs de tests
- Erreurs de validation (eslint, type-check)
- Erreurs de communication entre agents

**Actualité**: La brouillon `__draft/09-gestion-erreurs.md` existe mais n'est pas intégrée.

**Recommandation**: Créer `ai-instructions/errors-handling.md` avec:
- Arbre de décision des erreurs courantes
- Actions à prendre pour chaque type d'erreur
- Quand demander à l'utilisateur vs. quand corriger seul

---

### 🔴 Problème 3: Absence de "code conventions générales"

**Issue**: Les conventions sont éparses:
- PHP → `laravel-coding.md`
- CSS → `css-scss.md`  
- JS → `recipes/stack-vite.md` (partiel)
- **Mais aucun document** pour:
  - Logging et observabilité
  - Naming conventions multi-langage
  - Comment écrire du code "replayable" (philosophie abstraite, pas de concret)
  - Patterns communs (factory, builder, etc.)

**Recommandation**: Créer `ai-instructions/code-conventions.md` couvrant:
- Logging en tant que **première classe** (niveau log, format, traçabilité)
- Nommage cohérent (fichiers, fonctions, variables, structures)
- Statelles vs. stateful — quand l'état doit être observable
- Tests comme documentation

---

### 🔴 Problème 4: Changelog et git.md—Asymétrie sur quel fichier modifier

**Issue**: 
- `changelog.md` dit "à chaque PR", mais ne dit pas **quand** dans le cycle (avant commit? après rebase?)
- `git.md` section 5 (workflow publication) omet complètement la mise à jour du changelog
- Pour un agent autonome, l'ordre n'est pas clair: créer branche → modif code → update changelog → commit? Ou commit → update changelog → commit again?

**Recommandation**: Ajouter à `git.md` section 5 (publication):
```
### Etape 1b — Mise à jour du changelog

Avant de commiter, ajouter une entree au changelog (section `[Unreleased]`):
1. Fetch + rebase si necessaire
2. Editer CHANGELOG-AGENT.md
3. Commiter ensemble: git commit -m "feat: ... + changelog"
```

---

### 🔴 Problème 5: Pas d'index clair pour les recipes non-stack

**Issue**: `README.md` liste les recipes `stack-*.md`, mais **aucune recipe** pour:
- Mono-repo / multi-packages
- API REST vs GraphQL
- Mobile (React Native, Flutter)
- CLI / Daemon / Worker
- Testing infrastructure (setup Vitest, Pest, etc.)

**Actualité**: Si un projet utilise Vitest, un agent doit lire où? Nulle part — c'est mentionné en passant dans `stack-vite.md` mais c'est partiel.

**Recommandation**: 
- Créer `recipes/testing.md` unique pour les patterns de test multi-stack
- Créer `recipes/api.md` pour REST/JSON-API/GraphQL patterns
- Créer `recipes/monorepo.md` pour pnpm/workspaces/lerna

---

### 🔴 Problème 6: Mode autonome vs. non-autonome mélangés

**Issue**: `git.md` mélange:
- Règles TOUJOURS applicables (branches, worktrees)
- Règles SEULEMENT en mode autonome (worktrees isolés, PR directement)
- Règles OPTIONNELLES dépendant de la complexité

**Exemple confus**:
- Section 3 (worktrees): "Aucun agent ne doit changer la branche active du working tree" — okay pour non-autonome?
- Section 5 (autonome): "Mode autonome = working tree isolé" — donc section 3 ne s'applique pas en autonome?

**Recommandation**: Restructurer `git.md`:
```
## Section 1: Règles universelles (TOUJOURS)
- Pas de main—exceptions explicites
- Branches dédiées agent-name/*
- Commits atomiques avec messages clairs

## Section 2: Mode NON-autonome (interactive)
- Édition dans le working tree principal
- Working tree en lecture/écriture contrôlée
- Demandes d'autorisation avant commits

## Section 3: Mode AUTONOME (batch/delegué)
- Worktree isolé obligatoire
- Bootstrap complet
- PR auto-publiée
```

---

### 🔴 Problème 7: CSS/SCSS très détaillé, mais JavaScript == manque de détails

**Issue**: 
- `css-scss.md` = 250+ lignes, très complet (nommage, nesting, order, anti-patterns)
- `recipes/stack-vite.md` JS = ~100 lignes, **beaucoup moins de détails**
  - Pas de pattern pour l'organisation des composants
  - Pas de pattern pour error handling en JS
  - Pas de convention pour les commentaires
  - Pas de anti-patterns JavaScript

**Recommandation**: 
- Créer `ai-instructions/javascript-conventions.md` (150+ lignes) couvrant:
  - Nommage (functions, variables, classes, modules)
  - Async/await patterns
  - Error handling
  - Comments et documentation
  - Common anti-patterns (closure leaks, callback hell, etc.)

---

### 🔴 Problème 8: Laravel très exhaustif, mais "quand utiliser Actions vs Méthodes Model?"

**Issue**: `laravel-coding.md` dit "si > 30 lignes → sous-Actions" et "si reutilisée 3x → Action". Bon. Mais:
- Pas d'exemple de decision tree: mutation basique (update 1 champ) vs. complexe (plein de relations)?
- Table `quand creer Action` n'a que 3 cas. Beaucoup trop schématique.
- Pas de pattern pour "où écrire la logique de validation complexe"?

**Recommandation**: 
- Ajouter à `laravel-coding.md` section 2.5 "Decision tree: Action vs Controller vs Model method":
```
Mutation simple (1-2 champs)..... → Controller directement
Mutation métier (invariants).... → Action
Query.............. → Scope ou méthode Model
Logique cross-domain.......... → Action
```

---

### 🔴 Problème 9: Pas de pattern pour les erreurs de validation

**Issue**: 
- Form Requests gèrent la validation HTTP
- Mais qu'à propos de la **validation métier**? Ex: "Impossible de facturer un client sans adresse"
- Où vit cette logique? Action? Model? FormRequest custom?

**Recommandation**: Ajouter à `laravel-coding.md`:
```php
// Validations HTTP → Larvel validation rules (FormRequest)
// Validations métier → logique Action / Model methods

// En Action:
if (! $customer->hasShippingAddress()) {
    throw new CustomerMissingAddressException($customer);
}
```

---

### 🔴 Problème 10: Philosophy très abstrait pour le code du jour

**Issue**: `philosophy.md` est excellent pour la **vision** (anti-entropie, déterminisme), mais:
- Comment "implémenter" déterminisme en JavaScript async?
- Comment coder l'observabilité dans une Action Laravel?
- Comment structurer un module "rejouable"?

**Impact**: Les agents lisent `philosophy.md`, hochent la tête, **puis écrivent du code identique à avant**.

**Recommandation**: 
- Créer `ai-instructions/patterns-implementation.md` avec du **concret**:
  - "Observable state": exemple avec logging
  - "Replayable": enregistrement des inputs, capture des outputs
  - "Minimal core": structure de feature isolée
  - Cas d'usage par technologie (Laravel, JS, CSS)

---

### 🔴 Problème 11: Pas de guide pour les dépendances externes

**Issue**: 
- Quand ajouter une dépendance?
- Comment choisir entre 3 alternatives?
- Quand refuser une dépendance?
- Procédure de review/validation?

**Actualité**: `recipes/laravel-packages.md` existe mais c'est spécifique Laravel. Rien pour JS, CSS, etc.

**Recommandation**: Créer `ai-instructions/dependencies.md`:
- Critères de sélection (popularité, maintenance, performance)
- Whitelist/blacklist commune
- Procédure de proposition
- Comment documenter l'usage (README, code comments)

---

### 🔴 Problème 12: Pas de guide pour la documentation du code

**Issue**: 
- Quand écrire un commentaire?
- Comment documenter une fonction publique?
- Qu'est-ce qu'une "bonne" docstring?
- Quand créer un README dans un dossier?

**Recommandation**: Créer `ai-instructions/documentation.md`:
- Types de documentation (code, README, architecture)
- Templates pour docstrings
- Quand ajouter des exemples
- Anti-patterns (code comments qui dupliquent le code)

---

### 🔴 Problème 13: README.md suppose la lecture entière

**Issue**: `ai-instructions/README.md` dit "Ordre de lecture":
1. philosophy.md
2. git.md
3. changelog.md
4. css-scss.md
5. laravel-coding.md
6. recipes/*

**Mais**: Un agent travaillant en frontend ne va **jamais** avoir besoin de `laravel-coding.md` et `recipes/stack-laravel.md`. Et un backend ne va jamais lire `recipes/stack-vite.md`.

**Impact**: 
- Faux sentiment "j'ai pas lu tout" (bien que ce ne soit pas pertinent)
- Long à lire même pour les parties non-pertinentes
- Pas d'indication "cette recipe ne s'applique que si..."

**Recommandation**: Restructurer le README:
```
## Ordre de lecture — TOUJOURS

philosophy.md
git.md
changelog.md

## Ordre de lecture — CONDITIONNELS

Si stack frontend (Vite/React/etc): css-scss.md, recipes/stack-vite.md
Si stack Laravel: laravel-coding.md, recipes/stack-laravel.md
Si autre: [custom recipe]
```

---

## 3. Propositions d'amélioration par priorité

### 🔥 P1 — Critique (affecte tous les agents)

| # | Amélioration | Effort | Impact |
|-|-----------|--------|--------|
| 1 | Clarifier: autonome vs non-autonome dans `git.md` | 1h | Très haut — évite confusion fondamentale |
| 2 | Créer `errors-handling.md` | 2h | Haut — runbook manquant pour toutes les erreurs |
| 3 | Archiver `__draft/` ou le clarifier | 15min | Haut — source confusion "quelle est la source"? |
| 4 | README.md: préciser "lecture conditionnelle" | 30min | Moyen — meilleure clarté |

### 🟡 P2 — Important (améliorations clés par domaine)

| # | Amélioration | Effort | Impact |
|-|-----------|--------|--------|
| 5 | JavaScript conventions (analogues à CSS) | 2h | Haut — équilibre avec CSS |
| 6 | Ajouter changelog au workflow publication (git.md) | 30min | Moyen — clarté processus |
| 7 | Laravel: Decision tree Actions vs Methods | 1h | Moyen — guidance dans les choix |
| 8 | Créer patterns-implementation.md | 2h | Moyen — rend philosophie concrète |

### 🟢 P3 — Nice-to-have (enrichissement)

| # | Amélioration | Effort | Impact |
|-|-----------|--------|--------|
| 9 | Dependencies.md (sélection, validation) | 1h30 | Faible — best practices |
| 10 | Documentation.md (code comments, docstrings) | 1h | Faible — standards docs |
| 11 | Créer recipes pour testing, API, monorepo | 3h | Moyen — couverture gaps |
| 12 | Laravel: validation métier (excepts customs) | 30min | Faible — clarification |

---

## 4. Chaîne de commandes pour valider les améliorations

Une fois implémentées, valider:

```bash
# Vérifier qu'aucun fichier n'est orphelin
grep -r "laravel-coding" ai-instructions/ CLAUDE.md AGENTS.md

# Vérifier les placeholders {{PROJECT}}
grep "{{PROJECT}}" ai-instructions/*.md git.md

# S'assurer que README.md liste tous les fichiers ai-instructions/*.md
ls ai-instructions/*.md | wc -l
# vs contenu du README index table

# Vérifier cohérence git.md et changelog.md sur le workflow
grep -A5 "publication" ai-instructions/git.md
grep -A5 "PR" ai-instructions/changelog.md
```

---

## 5. Résumé des problèmes critiques

| Problème | Sévérité | Solution rapide |
|----------|----------|-----------------|
| **Redondance git ↔ brouillons** | 🔴 Haute | Archiver `__draft/`, garder `git.md` comme source unique |
| **Autonome vs non-autonome mélangés** | 🔴 Haute | Restructurer `git.md` en 3 sections claires |
| **Pas d'erreurs-handling.md** | 🔴 Haute | Créer runbook complet |
| **JavaScript == underspecified** | 🟡 Moyen | Créer js-conventions.md (symétrique CSS) |
| **Pas d'implémentation concrète de philosophy** | 🟡 Moyen | Créer patterns-implementation.md avec exemples |
| **README suppose lecture entière** | 🟡 Moyen | Marquer les parties conditionnelles |
| **Pas de guide dépendances** | 🟢 Bas | Nice-to-have, ajouter si itération future |

---

## 6. Proposition d'architecture finale

```
ai-instructions/
├── README.md                      # Index + ordre lecture (avec sections conditionnelles)
├── philosophy.md                  # [INCHANGÉ]
├── git.md                         # [RESTRUCTURÉ: universelles + non-autonome + autonome]
├── changelog.md                   # [+ lien vers git.md workflow publication]
├── code-conventions.md            # [NOUVEAU: logging, nommage, observabilité]
├── errors-handling.md             # [NOUVEAU: decision tree erreurs]
├── documentation.md               # [NOUVEAU: comments, docstrings, README]
├── javascript-conventions.md      # [NOUVEAU: symétrique à css-scss.md]
├── patterns-implementation.md     # [NOUVEAU: concrétiser philosophy]
├── dependencies.md                # [NOUVEAU: sélection, validation, whitelist]
├── css-scss.md                    # [INCHANGÉ]
├── laravel-coding.md              # [+ Decision tree Actions, + validation métier]
├── recipes/
│   ├── stack-vite.md              # [Inchangé]
│   ├── stack-laravel.md           # [Inchangé]
│   ├── laravel-packages.md        # [Inchangé]
│   ├── testing.md                 # [NOUVEAU: patterns tests multi-stack]
│   ├── api.md                     # [NOUVEAU: REST/GraphQL patterns]
│   └── monorepo.md                # [NOUVEAU: pnpm/workspaces patterns]
```

**Ligne de base**: 8 fichiers actuels + 5 nouveaux = ~14 fichiers, toujours > la structure uniforme.

---

## Conclusion

L'architecture actuelle est **solide mais incomplète**. Les principaux défauts sont:

1. **Confusion (brouillons orphelins, autonome vs non-autonome mélangé)**
2. **Gaps (pas d'erreurs, pas de JS explicite, pas patterns d'implémentation)**
3. **Asymétries (CSS exhaustif, JS partiel; git.md monolithe, brouillons modularisés)**

Les **5 actions prioritaires** (P1) résoudraient 80% des problèmes en ~4 heures de travail. À partir de là, les P2 et P3 enrichissent progressivement.

