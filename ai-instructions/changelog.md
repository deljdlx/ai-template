# Changelog

Regles de tenue du changelog pour tous les agents. Le changelog est un fichier critique: il sert de memoire du projet et de trace auditable des modifications.

## Fichier

Le changelog est dans `CHANGELOG-AGENT.md` a la racine du projet.

Si le fichier n'existe pas, le creer avec cette structure initiale:

```markdown
# Changelog

Toutes les modifications notables de ce projet sont documentees ici.
Format inspire de [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]
```

## Format

Utiliser le format [Keep a Changelog](https://keepachangelog.com/) adapte au contexte multi-agents.

### Structure d'une entree

```markdown
## [Unreleased]

### Added
- description du changement (`agent-name`) — #PR

### Changed
- description du changement (`agent-name`) — #PR

### Fixed
- description du changement (`agent-name`) — #PR

### Removed
- description du changement (`agent-name`) — #PR
```

### Categories autorisees

| Categorie | Usage |
|-----------|-------|
| `Added` | Nouvelle fonctionnalite, nouveau fichier, nouvelle dependance |
| `Changed` | Modification d'un comportement existant, refactoring |
| `Fixed` | Correction de bug |
| `Removed` | Suppression de code, fichier, ou dependance |
| `Deprecated` | Marquage d'une feature pour suppression future |
| `Security` | Correction de vulnerabilite |

Ne pas inventer d'autres categories.

## Regles

### Quand mettre a jour

1. **A chaque PR**: toute PR doit inclure une mise a jour du changelog dans la section `[Unreleased]`.
2. **Avant le commit final** d'une tache: ajouter l'entree changelog dans le meme commit ou dans un commit dedie juste avant le push.
3. **Pas de mise a jour retroactive**: ne pas modifier les entrees deja releasees sauf correction de typo.

### Quoi documenter

1. **Tout ce qui change le comportement** visible (API, UI, config, CLI).
2. **Tout ajout ou suppression** de fichier, module, ou dependance.
3. **Les refactorings significatifs** qui changent la structure du code.
4. **Les corrections de bug** avec reference au probleme corrige.

### Quoi ne PAS documenter

1. Les modifications de formatting (prettier, eslint --fix).
2. Les mises a jour de fichiers d'instructions AI (`ai-instructions/`).
3. Les modifications de fichiers de config sans impact fonctionnel.
4. Les commits intermediaires (WIP, fixup).

### Comment rediger une entree

1. **Une ligne par changement**. Pas de paragraphes.
2. **Verbe a l'infinitif** en francais ou **past tense** en anglais. Etre constant dans le projet.
3. **Prefixer par le nom de l'agent** entre parentheses: `(claude)`, `(codex)`, `(copilot)`.
4. **Ajouter le numero de PR** si disponible: `— #12`.
5. **Etre specifique**: "Add shuffle function with seeded RNG to arrays module" et non "Update arrays".

```markdown
// Bon
- Add seeded shuffle function to arrays module (`claude`) — #7
- Fix palindrome check ignoring unicode characters (`codex`) — #9

// Mauvais
- Update code
- Fix bug
- Changes
```

## Workflow multi-agents

### Conflits sur le changelog

Le changelog est un fichier modifie par tous les agents. Pour minimiser les conflits:

1. **Toujours fetch + rebase avant d'editer le changelog**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. **Ajouter les nouvelles entrees en haut** de la section `[Unreleased]`, sous le titre de categorie. Cela reduit les conflits de merge (chaque agent ajoute au debut, pas a la fin).
3. **Ne pas reorganiser** les entrees existantes d'un autre agent.

### En cas de conflit

Si un rebase provoque un conflit sur le changelog:
1. Conserver **toutes les entrees des deux agents** sous chaque categorie, dans l'ordre chronologique. Ne jamais supprimer l'entree d'un autre agent.
2. Verifier qu'aucune entree n'est dupliquee (meme description + meme agent = doublon).
3. Si le conflit est trop complexe: `git rebase --abort` et signaler a l'utilisateur.

## Release

Quand l'utilisateur demande une release:

1. Renommer `[Unreleased]` en `[X.Y.Z] - YYYY-MM-DD`.
2. Ajouter une nouvelle section `[Unreleased]` vide au-dessus.
3. Commiter: `chore: release vX.Y.Z`.

```markdown
## [Unreleased]

## [1.1.0] - 2026-02-22

### Added
- Add seeded shuffle function to arrays module (`claude`) — #7
```

## Anti-patterns

1. **Changelog vide sur une PR fonctionnelle**: chaque PR qui change le comportement doit avoir une entree.
2. **Entrees vagues**: "Fix stuff", "Update code", "Misc changes" sont interdits.
3. **Modifier les entrees d'un autre agent**: chaque agent ne modifie que ses propres entrees.
4. **Oublier le prefixe agent**: sans `(agent-name)`, impossible de tracer qui a fait quoi.
5. **Changelog comme commit log**: le changelog documente les changements pour un humain, pas un dump de `git log`.
