# Plan d'action — Améliorations des instructions IA

Suivi des améliorations proposées dans `ANALYSE-INSTRUCTIONS.md`.

---

## 📋 Tâches P1 — Critique (À faire en priorité)

### [  ] T1 — Archiver ou clarifier `__draft/`

**Problème**: Confusion sur source de vérité (brouillons vs `git.md`).

**Action**:
- [ ] Décider: Archive ou fusion du contenu drafts → `git.md`?
- [ ] Si archive: déplacer `__draft/` → `_ARCHIVE/v1-draft-refactorisation/`
- [ ] Si fusion: vérifier que `__draft/` n'ajoute rien à `git.md`, puis supprimer
- [ ] Mettre à jour `.gitignore` si nécessaire

**Effort**: 15 min  
**Dépend de**: Aucun  
**Bloque**: T2

---

### [  ] T2 — Restructurer `git.md` (autonome vs non-autonome)

**Problème**: Sections 3, 5, et autres mélangent règles universelles et contextuelles.

**Action**:
- [ ] Relire `git.md` en entier
- [ ] Créer outline: Section Universelle | Non-autonome | Autonome
- [ ] Déplacer contenu section 3 (worktrees) dans les bonnes sections
- [ ] Ajouter un **TL;DR au début** par mode
- [ ] Commit: `docs: restructure git.md for clarity (autonome vs non-autonome)`

**Exemple outline**:
```markdown
## 1. Règles universelles (TOUS CONTEXTES)
- 1.1 Interdit `main`
- 1.2 Branches `agent-name/*`
- ...

## 2. Mode non-autonome (interactive, avec utilisateur)
- 2.1 Working tree principal
- 2.2 Demandes d'autorisation
- ...

## 3. Mode autonome (délégué, batch)
- 3.1 Worktree isolé
- 3.2 Bootstrap
- ...

## 4. Publication (TOUS)
- 4.1 Sync
- 4.2 PR
- ...
```

**Effort**: 1h - 1.5h  
**Dépend de**: T1  
**Bloque**: T3

---

### [  ] T3 — Créer `errors-handling.md`

**Problème**: Aucun runbook pour erreurs hors-git (npm, composer, eslint, test).

**Action**:
- [ ] Créer `ai-instructions/errors-handling.md`
- [ ] Sections: 
  - Erreurs git (cross-ref `git.md` section 9)
  - Erreurs build (npm, composer, Vite, webpack)
  - Erreurs test (vitest, Pest, Jest failures)
  - Erreurs validation (eslint, tsc, prettify)
  - Erreurs runtime (null pointer, type error, etc.)
  - Erreurs communication (conflits multi-agents, PR checks)
- [ ] Pour chaque type: symptôme → diagnostic → solution
- [ ] Ajouter à `README.md` comme "lire après git.md"
- [ ] Commit: `docs: add errors-handling.md runbook`

**Template section**:
```markdown
## Erreur: npm install timeout

**Symptômes**: 
- npm ERR! code ETIMEDOUT
- npm ERR! network request failed

**Diagnostic**:
- Réseau instable?
- Registry surchargé?

**Solutions** (dans cet ordre):
1. Retenter: `npm install`
2. Augmenter timeout: `npm config set fetch-timeout 60000`
3. Signaler utilisateur avec logs
```

**Effort**: 1.5h - 2h  
**Dépend de**: Aucun (parallèle T1-T2 possible)  
**Bloque**: Publication

---

### [  ] T4 — Mettre à jour `README.md` (sections conditionnelles)

**Problème**: Tableau "Ordre de lecture" ne marque pas ce qui est conditionnel.

**Action**:
- [ ] Recopier le tableau "Ordre de lecture"
- [ ] Ajouter colonne `Condition` s'il y a
- [ ] Ajouter section après le tableau:
  ```markdown
  ## Lecture conditionnelle (choisir selon stack)

  | Condition | Fichiers |
  |-----------|----------|
  | Stack frontend (Vite/React/etc) | `css-scss.md`, `recipes/stack-vite.md` |
  | Stack Laravel | `laravel-coding.md`, `recipes/stack-laravel.md` |
  | ...
  ```
- [ ] Commit: `docs: clarify conditional reading in README`

**Effort**: 30 min  
**Dépend de**: Aucun  
**Bloque**: Aucun

---

## 🟡 Tâches P2 — Importantes (Après P1)

### [  ] T5 — Ajouter changelog au workflow publication (`git.md`)

**Problème**: Section 5 (Publication) omet update changelog.

**Action**:
- [ ] Relire `changelog.md` pour format + timing
- [ ] Éditer `git.md` section 5, ajouter **Etape 1b**:
```markdown
### Etape 1b — Mise à jour du changelog

Avant le premier commit:
1. Ouvrir `CHANGELOG-AGENT.md`
2. Ajouter une entree section `[Unreleased]`
3. Format: `- description (agent-name) — #PR-NUMBER`
4. Inclure dans le commit: `git add CHANGELOG-AGENT.md`
```
- [ ] Linker vers `changelog.md` pour le format exact
- [ ] Commit: `docs: add changelog step to git.md publication workflow`

**Effort**: 30 min  
**Dépend de**: T2 (aprés restructuration)  
**Bloque**: Aucun

---

### [  ] T6 — Créer `javascript-conventions.md`

**Problème**: CSS exhaustif (250+ lignes), JS partiel (~100 lignes).

**Action**:
- [ ] Créer `ai-instructions/javascript-conventions.md` (~200-250 lignes)
- [ ] Sections (analogues à CSS):
  - Principes généraux (ESM, const>let, early return)
  - Nommage (camelCase, PascalCase, UPPER_SNAKE)
  - Async/await et promesses (pattern, error handling)
  - Import/export (organisation, ordre)
  - Comments et docstrings (JSDoc format)
  - Error handling (try-catch, fallback, logging)
  - Anti-patterns (closure leaks, var, callback hell, silent errors)
- [ ] Ajouter à `README.md` ordre lecture après `css-scss.md`
- [ ] Commit: `docs: add javascript-conventions.md`

**Exemple structure**:
```markdown
# JavaScript Conventions

## 1. Principes généraux
- ESM only (import/export)
- Prefer const, then let, never var
- Early return to avoid nesting
- ...

## 2. Nommage
### Variables & functions
- camelCase: `calculateTotal`, `emailService`

### Classes
- PascalCase: `PaymentGateway`, `UserService`

### Constants (global scope)
- UPPER_SNAKE: `API_TIMEOUT`, `MAX_RETRIES`

## 3. Async/Await
### Pattern 1: Try-catch wrapper
\`\`\`js
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    logger.error('Fetch user failed', { id, err });
    throw err;
  }
}
\`\`\`

...
```

**Effort**: 1.5 - 2h  
**Dépend de**: T1 (clarté globale)  
**Bloque**: Aucun

---

### [  ] T7 — Laravel: Ajouter Decision tree Actions vs Methods

**Problème**: Section 2 (Actions) vague sur "quand utiliser Actions?"

**Action**:
- [ ] Éditer `laravel-coding.md` section 2
- [ ] Ajouter **Decision tree** (avant les anti-patterns):
```markdown
## Quand utiliser Actions, Methods, ou Controllers directs?

### Décision rapide

| Type d'opération | Où | Pourquoi |
|---|---|---|
| Update 1 champ simple (ex: `$post->update(['title' => 'x'])`) | Controller | Trop simple, pas besoin |
| Mutation métier + invariants (ex: `markInvoiceAsPaid`) | Action | Reutilisable, invariants, observabilité |
| Query/selection | Scope ou Model method | Pas de side effects |
| Cross-domain logic (ex: créer facture + envoi email) | Action | Orchestration |
| Validation métier | Model/Action | Jamais dans controller |

### Exemples détaillés

**Cas 1: Mutation simple** → Controller
\`\`\`php
Route::post('articles/{article}', function (Article $article, UpdateArticleRequest $request) {
    $article->update($request->validated());
    return redirect(...)->with('success', 'Updated');
});
\`\`\`

**Cas 2: Mutation métier** → Action
\`\`\`php
// Trop de logique pour le controller
$action = new MarkInvoiceAsPaidAction();
$invoice = $action->execute($invoiceId);
\`\`\`

...
```
- [ ] Commit: `docs: add decision-tree to laravel-coding Actions`

**Effort**: 45 min - 1h  
**Dépend de**: Aucun  
**Bloque**: Aucun

---

### [  ] T8 — Créer `patterns-implementation.md`

**Problème**: `philosophy.md` est abstrait, pas d'implémentation concrète.

**Action**:
- [ ] Créer `ai-instructions/patterns-implementation.md` (~250-300 lignes)
- [ ] Relier chaque principe philosophie → code concret
- [ ] Sections:
  - Introduction: "philosophy est la vision, ceci est le comment"
  - Anti-entropie: exemple logging, traçage
  - Déterminisme: seeding RNG, command log
  - Replayable: enregistrement inputs/outputs
  - Observable state: expose debug API
  - Minimal core: structure feature isolée
  - Data-driven content: exemple config vs code
- [ ] Exemples multi-langage (PHP, JS, CSS où applicable)
- [ ] Commit: `docs: add patterns-implementation with concrete examples`

**Template**:
```markdown
# Patterns d'implémentation

Concrétiser les principes de `philosophy.md` dans le code de tous les jours.

## 1. Anti-entropie via Logging

**Philosophy**: Architecture = stratégie anti-entropie. Le système doit rester compréhensible sous pression.

**Implémentation**: Logging systématique et observable.

### Pattern Laravel
\`\`\`php
class CreateInvoiceAction {
    public function execute(InvoiceData $data): Invoice {
        Log::debug('CreateInvoice.start', ['customerId' => $data->customerId]);
        
        $invoice = Invoice::create([...]);
        
        Log::info('CreateInvoice.success', ['invoiceId' => $invoice->id]);
        return $invoice;
    }
}
\`\`\`

### Pattern JavaScript
\`\`\`js
async function createInvoice(data) {
  logger.debug('Invoice.create.start', { customerId: data.customerId });
  
  const invoice = await fetch('/api/invoices', { method: 'POST', body: JSON.stringify(data) });
  
  logger.info('Invoice.create.success', { invoiceId: invoice.id });
  return invoice;
}
\`\`\`

...
```

**Effort**: 2 - 2.5h  
**Dépend de**: T1, T2 (clarté générale)  
**Bloque**: Aucun

---

## 🟢 Tâches P3 — Nice-to-have (Si temps/itération future)

### [  ] T9 — Créer `dependencies.md`

**Problème**: Aucun guide pour sélection dépendances.

**Action**:
- [ ] Créer `ai-instructions/dependencies.md` (~150 lignes)
- [ ] Sections:
  - Critères (popularity, maintenance, license, security, size)
  - Whitelist commune (bien testées par l'équipe)
  - Blacklist (à éviter)
  - Procédure d'ajout de dépendance (validation)
  - Documentation d'usage
- [ ] Commit: `docs: add dependencies.md guidelines`

**Effort**: 1 - 1.5h  
**Dépend de**: Aucun  
**Bloque**: Aucun

---

### [  ] T10 — Créer `documentation.md`

**Problème**: Aucun guide pour documentation du code.

**Action**:
- [ ] Créer `ai-instructions/documentation.md` (~150 lignes)
- [ ] Sections:
  - Types: code comments, docstrings, README, architecture diagrams
  - Quand commenter (complexité, "why" pas "what")
  - Docstring templates (JSDoc, PHPDoc)
  - Exemples dans les comments
  - Anti-patterns
- [ ] Commit: `docs: add documentation.md standards`

**Effort**: 1 - 1.5h  
**Dépend de**: Aucun  
**Bloque**: Aucun

---

### [  ] T11 — Créer recipes manquantes

**Action**:
- [ ] `recipes/testing.md` (patterns Vitest, Pest, Jest)
- [ ] `recipes/api.md` (REST, GraphQL patterns)
- [ ] `recipes/monorepo.md` (pnpm, workspaces)

**Effort**: 2 - 3h (total)  
**Dépend de**: T1 (clarté)  
**Bloque**: Aucun

---

## 📅 Planning suggéré

### Sprint 1 (1-2 jours)
- [x] T1 — Archiver `__draft/`
- [x] T4 — README conditionnelles
- [x] T2 — Restructurer `git.md`

### Sprint 2 (1-2 jours)
- [x] T3 — Créer `errors-handling.md`
- [x] T5 — Ajouter changelog à `git.md`
- [x] T6 — Créer `javascript-conventions.md`

### Sprint 3 (optional)
- [x] T7 — Laravel decision tree
- [x] T8 — `patterns-implementation.md`

### Sprint 4+ (future)
- [x] T9, T10, T11

---

## Checklist finale (après implémentation)

- [ ] Tous les fichiers `.md` listés dans `README.md`
- [ ] Aucun lien orphelin (grep pour vérifier)
- [ ] Placeholders `{{PROJECT}}` = 0
- [ ] Cohérence: chaque section de `git.md` clairement marquée (Universelle / Non-autonome / Autonome)
- [ ] `errors-handling.md` couvre tous les types d'erreurs courants
- [ ] `javascript-conventions.md` ≈ même nível de détail que `css-scss.md`
- [ ] `laravel-coding.md` a décision tree clair
- [ ] Aucun fichier dans `__draft/` (archivé ou fusionné)
- [ ] Commit final: `docs: improve instructions with clarity + new patterns docs`

