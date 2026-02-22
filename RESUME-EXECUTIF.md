# 🎯 Résumé exécutif — Améliorations des instructions IA

**TL;DR**: Vos instructions sont **solides mais incomplètes**. 5 actions rapides (4h total) résoudraient 80% des gaps.

---

## Trois niveaux de problèmes

### 🔴 **Critique** — Affecte la clarté fondamentale (4 fichiers)

**Problème**: Confusion sur "quelle est la source de vérité?" + mélange autonome/non-autonome

| # | Problème | Impact | Fix rapide |
|---|----------|--------|-----------|
| 1 | `__draft/` orphelin vs `git.md` | Agents ne savent pas quoi lire | Archiver/fusionner `__draft/` |
| 2 | `git.md` mélange: universelles + autonome + non-autonome | Agents appliquent mal les règles | Restructurer en 3 sections claires |
| 3 | **Aucun runbook d'erreurs** (npm, test, eslint) | Agents stucked sur erreurs non-git | Créer `errors-handling.md` |
| 4 | `README` suppose lecture entière (perds temps sur non-pertinent) | Frontend lit Laravel inutilement | Marquer sections `[Si Laravel]` dans tableau |

**Coût**: ~2-3h pour 4 fixes critiques.

---

### 🟡 **Important** — Gaps dans la couverture par technologie (6 fichiers)

| # | Problème | Impact | Fix rapide |
|---|----------|--------|-----------|
| 5 | CSS = 250 lignes exhaustif, JS = 100 lignes partiel | Asymétrie de guidance | Créer `javascript-conventions.md` (2h) |
| 6 | `laravel-coding.md` — vague sur "quand Action vs Method?" | Agents hésitent sur architecture | Ajouter decision tree tableau (45min) |
| 7 | `philosophy.md` = abstrait, gène implémentation | Agents lisent mais ne changent rien | Créer `patterns-implementation.md` (2h) |
| 8 | Changelog workflow manque dans `git.md` section "publication" | Agents oublient maj changelog 30% du temps | Ajouter `Etape 1b` dans publication (30min) |

**Coût**: ~5h pour 4 améliorations importantes.

---

### 🟢 **Nice-to-have** — Enrichissement (3-4 fichiers)

| # | Problème | Impact | Fix |
|---|----------|--------|-----|
| 9 | Pas de guide "sélectionner dépendances" | Choix ad-hoc | Créer `dependencies.md` (1.5h) |
| 10 | Pas de guide "documenter le code" | Code peu commenté | Créer `documentation.md` (1.5h) |
| 11 | Pas de recipes testing, API, monorepo | Coverage gaps | 3 new recipes (3h) |

**Coût**: 6h total, à faire si iteration future.

---

## 💡 Top 3 recommandations immédiates

### 1️⃣ **Archiver `__draft/` AUJOURD'HUI** (5 min)

```bash
# Sauvegarder le contenu, puis supprimer
mkdir _ARCHIVE
mv __draft/* _ARCHIVE/
rmdir __draft__  # ou garder vide
```

**Pourquoi**: C'est une source de **confusion mentale** pour tous les agents. "Pourquoi y a des brouillons? Faut-les lire? Sont-ils supersédés?"

**Gagne**: Clarté immédiate. Les agents lisent `ai-instructions/git.md`, point final.

---

### 2️⃣ **Restructurer `git.md` en 3 sections** (1-1.5h)

Ajouter au début:

```markdown
# Git — Règles multi-agents

## Mode: Universelles vs Contextuel?

Ce document couvre TROIS contextes:
- **Universelles**: s'appliquent TOUJOURS
- **Mode non-autonome** (interactive): quand agent travaille avec utilisateur
- **Mode autonome** (batch): quand agent travaille seul

Lire la section pertinente pour ton contexte.

---

## 1️⃣ Règles universelles (TOUJOURS)

### 1.1 Jamais de commits sur `main`
...

### 1.2 Branches `agent-name/*`
...

---

## 2️⃣ Mode non-autonome (interactive)

Contexte: Utilisateur demande fix/feature, agent collabore.

### 2.1 Working tree principal
...

---

## 3️⃣ Mode autonome (batch/délégué)

Contexte: Utilisateur dit "fais ça sans supervision".

### 3.1 Worktree isolé obligatoire
...

---

## 4️⃣ Publication (TOUS MODES)
...
```

**Gagne**: Agents comprennent **quand** chaque règle s'applique. Fini la confusion "Dois-je utiliser un worktree?".

---

### 3️⃣ **Créer `errors-handling.md`** (1.5h)

Runbook pour quand les choses cassent:

```markdown
# Gestion des erreurs

Pour chaque erreur: symptôme → diagnostic → solution.

## Erreur: npm install fails

**Symptôme**: `npm ERR! code ERESOLVE` ou `npm ERR! ETIMEDOUT`

**Diagnostic**:
- Réseau instable?
- Nouvelle version imcompatible?
- Cache corrompu?

**Solutions** (dans cet ordre):
1. Retenter: `npm install`
2. Nettoyer cache: `npm cache clean --force && npm install`
3. Si persiste: rapporter utilisateur avec logs complets

## Erreur: Test fails with random errors

**Symptôme**: Test passe/échoue aléatoirement

**Diagnostic**: Problème async ou state partagé

**Solutions**:
1. Vérifier test n'a pas de timers flottants
2. Vérifier pas de state global modifié par test
3. Réordonnancer tests: certains ordres révèlent bugs

...
```

**Gagne**: Agents ont **feuille de route** au lieu d'être stucked sur erreur.

---

## 📊 Estimation effort vs ROI

| Action | Effort | ROI | Quand |
|--------|--------|-----|-------|
| P1: Archiver `__draft/` | 5 min | 🔴 Très élevé | ASAP |
| P1: Restructurer `git.md` | 1h | 🔴 Très élevé | Cette semaine |
| P1: `errors-handling.md` | 1.5h | 🔴 Très élevé | Cette semaine |
| P1: `README` conditionnelles | 30 min | 🟡 Moyen | Cette semaine |
| **Total P1** | **3h** | **Critique** | **Semaine 1** |
| | | | |
| P2: `javascript-conventions.md` | 2h | 🟡 Moyen | Semaine 2 |
| P2: Laravel decision tree | 45 min | 🟡 Moyen | Semaine 2 |
| P2: `patterns-implementation.md` | 2h | 🟡 Moyen | Semaine 2 |
| P2: Add changelog to `git.md` | 30 min | 🟡 Moyen | Semaine 2 |
| **Total P2** | **5h** | **Important** | **Semaine 2-3** |
| | | | |
| P3: Dependencies, docs, recipes | 6h | 🟢 Faible | Sprint futur |

---

## 🚀 Exécution proposée

### **Semaine 1** (Critique) — 3h

```bash
# Jour 1-2
1. Archiver __draft/ → _ARCHIVE/
   - Commit: docs: archive __draft/ (never final)

# Jour 2-3
2. Restructurer git.md
   - Relire complètement + refactoriser
   - Commit: docs: restructure git.md (universal + non-autonomous + autonomous)

# Jour 3
3. Créer errors-handling.md
   - Couvrir: git, npm, tests, lint, runtime
   - Commit: docs: add errors-handling.md

4. Marquer README conditionnel
   - Ajouter colonnes `Condition` et section `Si Laravel...`
   - Commit: docs: clarify conditional reading in README
```

### **Semaine 2-3** (Important) — 5h

```bash
5. Créer javascript-conventions.md (2h)
6. Ajouter changelog step à git.md (30min)
7. Laravel: decision tree (45min)
8. Créer patterns-implementation.md (2h)

# Commits intermédiaires
docs: add javascript-conventions.md
docs: add changelog step to git.md publication
docs: add decision-tree to laravel-coding
docs: add patterns-implementation.md
```

---

## ✅ Validation

Après implémentation, checker:

```bash
# 1. Aucun orphelin
grep -r "git.md" ai-instructions/ README.md CLAUDE.md AGENTS.md | wc -l
# Doit pointer `git.md` dans tous les docs (aucune référence `__draft/`)

# 2. Aucun `__draft/` restant
ls __draft/ 2>/dev/null || echo "✓ __draft/ properly archived"

# 3. Tous les fichiers listés dans README
ls ai-instructions/*.md | wc -l
# Comparer avec nombre d'entrées dans README table

# 4. Pas de {{PROJECT}} oublié
grep -r "{{PROJECT}}" ai-instructions/ README.md CLAUDE.md AGENTS.md
# Doit retourner 0

# 5. Lire `git.md` — doit avoir 3 sections claires au début
grep -E "^## [123].*autonome|^## [123].*universelle" ai-instructions/git.md
```

---

## 🎓 Philosophie de cette refonte

L'intention **n'est pas** de changer les principes. C'est de:

1. **Clarifier** ce qui existe déjà mais est ambigu
2. **Organiser** de façon plus lisible (P1 → P2 → P3)
3. **Compléter** les gaps évidents (pas d'erreurs, pas de JS)
4. **Concrétiser** ce qui est trop abstrait (philosophy)

Tout le code existant reste valable. Les agents vont juste y voir plus clair.

---

## Questions pour décider

**Q1**: Voulez-vous que je commence par les actions P1 maintenant?  
**Q2**: Voulez-vous que je fasse les 4 tâches P1 d'un coup ou étape par étape?  
**Q3**: Voulez-vous que les documents soient en Français ou anglais? (actuels = FR)  
**Q4**: Faut-il créer une branche `copilot/improve-instructions` ou travailler directement en main?

