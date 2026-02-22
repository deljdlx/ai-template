# Git

Regles git pour tous les agents. Source de verite unique.

> **Placeholder**: Remplacer `{{PROJECT}}` par le nom du projet.

## 1. Regles critiques

1. Interdiction de `git commit` et `git push` sur `main`, sauf demande explicite de l'utilisateur.
2. Commits autorises uniquement sur une branche dediee d'agent (`claude/*`, `codex/*`, `copilot/*`).
3. Si l'agent n'est pas sur une branche dediee, il doit s'arreter et demander avant toute operation `commit/push`.
4. Exception: l'utilisateur demande explicitement de merger/pusher sur `main`.

## 2. Conventions de nommage

1. Branches: `AGENT_NAME/FEATURE_NAME` (ex: `claude/fix-drag-drop`, `codex/add-tests`, `copilot/refactor-ui`).
2. Titre de PR: prefixer par `AGENT_NAME:` (ex: `claude: fix drag and drop`).
3. Un agent ne travaille que dans ses propres branches. Interdit d'editer ou merger une branche d'un autre agent.

## 3. Working tree principal

1. Aucun agent ne doit changer la branche active du working tree de l'utilisateur.
2. Interdit de `git checkout <autre-branche>` dans le working tree principal pour merge/rebase/cherry-pick.
3. En **mode non-autonome** (par defaut): l'agent peut lire et editer le code dans le working tree principal quand l'utilisateur le demande. Les operations git (commit, push, checkout) restent interdites sauf demande explicite.
4. En **mode autonome**: l'agent travaille UNIQUEMENT dans son worktree isole. Le working tree principal est en **lecture seule**.

## 4. Worktrees isoles

1. Pour toute operation qui deplace HEAD (creation de branche, merge, rebase), utiliser un worktree isole.
2. Si aucun worktree isole n'est disponible, l'agent doit demander avant de continuer.
3. Chaque agent utilise un **worktree fixe unique** defini dans son fichier d'identite (ex: `/tmp/{{PROJECT}}-claude-worktree`). Ne pas creer un nouveau worktree par feature: reutiliser le meme en changeant de branche entre les taches.

### Maintenance

4. **Nettoyage entre deux taches**: avant de commencer une nouvelle feature, l'agent doit:
   - S'assurer qu'il n'y a pas de changements non commites (`git status`). Si oui, demander a l'utilisateur.
   - Creer la nouvelle branche depuis `origin/main` a jour: `git fetch origin && git checkout -b AGENT_NAME/FEATURE_NAME origin/main`.

5. **Rebase obligatoire avant push**: avant tout `git push`, toujours executer `git fetch origin && git rebase origin/main`. Si le rebase echoue (conflit), executer `git rebase --abort` et signaler a l'utilisateur.

6. **Recovery HEAD detache**: `git checkout -b AGENT_NAME/FEATURE_NAME` pour reattacher, ou `git checkout origin/main` pour repartir propre.

## 5. Mode autonome

### Declencheurs

Le mode autonome s'active quand l'utilisateur utilise une de ces formulations (ou equivalentes):

| Formulation | Langue |
|-------------|--------|
| "en autonomie", "en autonome", "en mode autonome" | FR |
| "autonomously", "autonomous mode", "on your own" | EN |
| "sans supervision", "sans attendre" | FR |
| "fais une PR", "publie", "publish" | FR/EN |
| "dans ton worktree" | FR |

En cas de doute, traiter comme autonome et utiliser le worktree isole. Il vaut mieux etre trop prudent.

### Regles

1. Si l'utilisateur demande "en autonomie" (ou formulation equivalente), l'agent DOIT travailler dans son worktree isole uniquement.
2. En mode autonome, l'agent DOIT utiliser une branche dediee `AGENT_NAME/FEATURE_NAME`.
3. En mode autonome, l'agent NE DOIT JAMAIS intervenir dans le working tree principal de l'utilisateur.
4. Les modifications dans les worktrees isoles sous `/tmp` ne necessitent pas de validation prealable de l'utilisateur.

### Bootstrap autonome

Quand un agent recoit une tache en mode autonome, il prepare son worktree **dans cet ordre exact**:

```bash
# 1. Verifier que le worktree existe
git worktree list

# Si absent → le creer:
git worktree add /tmp/{{PROJECT}}-AGENT_NAME-worktree origin/main

# Si present → le reutiliser:
cd /tmp/{{PROJECT}}-AGENT_NAME-worktree
git fetch origin
git checkout --detach origin/main

# 2. Se placer dans le worktree
cd /tmp/{{PROJECT}}-AGENT_NAME-worktree

# 3. Verifier l'etat
git status
# Changements non commites? → stash ou demander
# Ancienne branche locale? → git branch -d AGENT_NAME/ancienne-branche

# 4. Creer la branche de travail
git fetch origin
git checkout -b AGENT_NAME/FEATURE_NAME origin/main
```

### Pre-flight checklist

Avant de commencer une tache, verifier ces points dans l'ordre:

1. **Instructions lues**: `ai-instructions/` (obligatoires: philosophy, git, changelog, css-scss ; conditionnels: laravel-coding, recipes selon la stack)
2. **Worktree pret**: branche `AGENT_NAME/FEATURE_NAME` creee depuis `origin/main` a jour
3. **Pas de changements pendants**: `git status` propre
4. **Dependances a jour**: `npm install` / `composer install` si necessaire

Avant de publier une PR, verifier:

5. **Tests**: `php artisan test` ou `npm test` selon la stack
6. **Lint/style**: `./vendor/bin/pint --test` ou equivalent
7. **Analyse statique**: `./vendor/bin/phpstan analyse` si Laravel
8. **Changelog**: `CHANGELOG-AGENT.md` mis a jour dans `[Unreleased]`
9. **Rebase**: `git rebase origin/main` reussi

## 6. Workflow de publication

Quand l'utilisateur demande de "publier", "publish", "merge", "envoie la PR", executer **dans cet ordre exact**:

### Etape 1 — Synchronisation

```bash
git fetch origin
git rebase origin/main
```

Si le rebase echoue → `git rebase --abort` et signaler a l'utilisateur.
**Ne jamais forcer un push avec `--force` sans validation utilisateur.**

### Etape 2 — Changelog

Avant de push, verifier que `CHANGELOG-AGENT.md` est a jour dans la section `[Unreleased]`.
Voir `ai-instructions/changelog.md` pour le format exact.

### Etape 3 — Push et PR

```bash
# Verifier qu'aucune PR ouverte n'existe deja
gh pr list --head AGENT_NAME/FEATURE_NAME

# Si PR existante: mettre a jour avec un push
# Sinon: creer la PR
git push -u origin AGENT_NAME/FEATURE_NAME
gh pr create --title "AGENT_NAME: description courte" --body "..."
```

Le body de la PR doit contenir au minimum:
- `## Summary` avec 1-3 bullet points
- `## Test plan` avec les resultats de build/test/lint

### Etape 4 — Verifier CI

```bash
gh pr checks NUMBER
```

Ne pas merger tant que les checks ne sont pas tous verts. Si un check echoue, corriger et re-pusher.

### Etape 5 — Merge

```bash
gh pr merge NUMBER --squash --delete-branch
```

`--delete-branch` supprime la branche remote automatiquement.
**Ne pas** executer `git push origin --delete` ni `git fetch -p` apres.

Si le merge echoue, ne pas retenter en boucle. Signaler a l'utilisateur avec le numero de PR et l'erreur exacte.

### Etape 6 — Nettoyage local

```bash
git checkout main
git branch -d AGENT_NAME/FEATURE_NAME
```

## 7. Travail concurrent multi-agents

### Synchronisation

1. **Fetch obligatoire** avant: creation de branche, push, creation de PR, merge.
2. **Rebase avant push**: `git fetch origin && git rebase origin/main`.
3. Si `main` a avance pendant le travail de l'agent, rebaser avant de continuer les verifications.

### Detection de modifications concurrentes

Avant de modifier un fichier critique partage:

```bash
git fetch origin
git log --oneline origin/main -5 -- chemin/vers/fichier
```

Si le fichier a ete modifie dans les 5 derniers commits de `main`:
1. Lire la version actuelle sur `origin/main` avant de commencer.
2. Baser ses modifications sur la version la plus recente.

### Isolation entre agents

1. Un agent ne travaille que dans ses propres branches (`AGENT_NAME/*`).
2. Un agent n'edite jamais une branche, PR, ou fichier de changelog d'un autre agent.
3. Si un agent detecte un probleme dans le code d'un autre agent, il le signale a l'utilisateur.

### Ordre de merge

1. Premier arrive, premier merge (FIFO).
2. Si deux PRs sont en conflit, le second agent doit rebaser apres le merge du premier.
3. Le rebase est toujours prefere au merge commit.

### Conflits sur les fichiers de lock

Les fichiers `package-lock.json` et `composer.lock` sont frequemment source de conflits entre agents. Strategie:

1. En cas de conflit sur un lock file, toujours accepter la version de `origin/main`.
2. Apres resolution, relancer l'installation pour regenerer le lock file:
   - `npm install` (pour `package-lock.json`)
   - `composer install` (pour `composer.lock`)
3. Commiter le lock file regenere.

### Conflits sur les migrations Laravel

Les migrations avec le meme timestamp peuvent causer des problemes d'ordre. Chaque agent doit:

1. Utiliser `php artisan make:migration` qui genere un timestamp unique (avec secondes).
2. Ne jamais renommer manuellement les fichiers de migration d'un autre agent.

### Agent bloque

Si un agent est bloque par une operation en attente (PR d'un autre agent non mergee, CI en echec sur main, etc.), il doit informer l'utilisateur avec:

1. **Qui** bloque (nom de l'agent ou "CI").
2. **Quoi** est bloque (numero de PR, branche, operation).
3. **Action attendue** (merger la PR, corriger le CI, etc.).

Ne pas retenter en boucle. Signaler une fois et attendre la resolution.

## 8. Maintenance du .gitignore

Le fichier `.gitignore` a la racine du projet est un fichier critique. Il doit etre maintenu a jour.

### Quand mettre a jour

1. **Ajout d'une nouvelle dependance ou outil**: si un outil genere des fichiers locaux (cache, logs, artefacts), ajouter les patterns correspondants.
2. **Changement de stack**: si un framework ou runtime est ajoute/retire, adapter les sections concernees.
3. **Decouverte de fichiers non souhaites**: si `git status` montre des fichiers qui ne devraient pas etre trackes, les ajouter au `.gitignore` et nettoyer avec `git rm --cached`.

### Regles

1. **Ne jamais commiter** de secrets, credentials, `.env`, cles privees. Verifier le `.gitignore` avant le premier commit d'un projet.
2. **Organiser par categorie** avec des commentaires de section clairs.
3. **Preferer les patterns specifiques** (`*.log`, `dist/`) aux patterns trop larges (`*`).
4. **Utiliser les negations** (`!.env.example`) pour autoriser les fichiers template.
5. **Verifier apres ajout**: `git status` ne doit montrer aucun fichier non souhaite.

### Nettoyage d'un fichier deja tracke

Si un fichier a ete commite par erreur et doit etre ignore:

```bash
# Retirer du tracking sans supprimer le fichier local
git rm --cached chemin/vers/fichier

# Pour un dossier entier
git rm -r --cached chemin/vers/dossier/

# Commiter le changement
git commit -m "chore: remove tracked file now in .gitignore"
```

## 9. Gestion d'erreurs git

### Conflit lors du rebase

```bash
git rebase --abort
```

Signaler a l'utilisateur avec:
- La branche source et la branche cible
- Les fichiers en conflit (`git diff --name-only --diff-filter=U`)
- Ne jamais resoudre un conflit manuellement sans validation utilisateur

### Worktree corrompu

```bash
git worktree remove /tmp/{{PROJECT}}-AGENT_NAME-worktree --force
git worktree add /tmp/{{PROJECT}}-AGENT_NAME-worktree origin/main
cd /tmp/{{PROJECT}}-AGENT_NAME-worktree
# Reinstaller les dependances selon la stack
```

### Echec reseau (git fetch, git push, gh)

1. Retenter une fois apres quelques secondes.
2. Si l'echec persiste: signaler a l'utilisateur.

### Echec de merge de PR

Si `gh pr merge` echoue:
1. Verifier les checks CI: `gh pr checks NUMBER`
2. Verifier les conflits: `gh pr view NUMBER`
3. Si conflit: rebaser, re-pusher, retenter.
4. Si checks en echec: corriger, re-pusher, attendre, retenter.
5. Apres 2 tentatives: signaler a l'utilisateur avec le numero de PR et l'erreur.
