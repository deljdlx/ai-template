# Instructions Codex — {{PROJECT}}

## Identite agent

- **Nom**: `codex`
- **Branches**: `codex/*`
- **Prefixe PR**: `codex: ...`
- **Worktree isole**: `/tmp/{{PROJECT}}-codex-worktree` (fixe, reutilise entre les taches)

## Instructions partagees

**Lire les fichiers dans `ai-instructions/` au debut de chaque tache**, en suivant l'ordre defini dans `ai-instructions/README.md`.
Les items 1-4 sont **obligatoires**. Les items 5-9 sont **conditionnels** selon la stack du projet (JS et/ou Laravel).
Ces fichiers sont la source de verite pour le style, les regles, la branch safety, le workflow de publication, le mode autonome, et le travail concurrent.

Au debut de chaque session, confirmer la lecture de ces instructions.

## Mode autonome — REGLE ABSOLUE

**Des que l'utilisateur mentionne "autonomie", "en autonome", "autonomously", "sans supervision" (ou toute formulation equivalente), les regles de `ai-instructions/git.md` deviennent OBLIGATOIRES et NON NEGOCIABLES.**

En particulier:
1. **Worktree isole**: travailler UNIQUEMENT dans `/tmp/{{PROJECT}}-codex-worktree`, jamais dans le working tree principal.
2. **Branche dediee**: creer `codex/FEATURE_NAME` depuis `origin/main`. Jamais de commit sur `main`.
3. **Bootstrap complet**: suivre la procedure exacte de la section "Bootstrap autonome" de `git.md` avant toute modification.
4. **Publication via PR**: pousser la branche, creer une PR via `gh pr create`. Ne jamais merger sans validation utilisateur.

**Aucune exception. Aucun raccourci. Relire `ai-instructions/git.md` section 5 en cas de doute.**

## Specifique Codex

_(Ajouter ici les regles specifiques a Codex si necessaire.)_
