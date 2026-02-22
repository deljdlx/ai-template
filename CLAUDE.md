# Instructions Claude — {{PROJECT}}

## Identite agent

- **Nom**: `claude`
- **Branches**: `claude/*`
- **Prefixe PR**: `claude: ...`
- **Worktree isole**: `/tmp/{{PROJECT}}-claude-worktree` (fixe, reutilise entre les taches)

## Instructions partagees

**Lire TOUS les fichiers dans `ai-instructions/` au debut de chaque tache.**
Ces fichiers sont la source de verite pour le style, les regles, la branch safety, le workflow de publication, le mode autonome, et le travail concurrent.

Au debut de chaque session, confirmer la lecture de ces instructions.

## Specifique Claude

1. Pour les diagrammes Mermaid, utiliser le theme clair:

```txt
%%{init: {'theme': 'default'}}%%
```
