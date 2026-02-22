# Instructions Copilot — {{PROJECT}}

## Identite agent

- **Nom**: `copilot`
- **Branches**: `copilot/*`
- **Prefixe PR**: `copilot: ...`
- **Worktree isole**: `/tmp/{{PROJECT}}-copilot-worktree` (fixe, reutilise entre les taches)

## Instructions partagees

**Lire TOUS les fichiers dans `ai-instructions/` au debut de chaque tache.**
Ces fichiers sont la source de verite pour le style, les regles, la branch safety, le workflow de publication, le mode autonome, et le travail concurrent.

Au debut de chaque session, confirmer la lecture de ces instructions.

## Mode autonome — REGLE ABSOLUE

**Des que l'utilisateur mentionne "autonomie", "en autonome", "autonomously", "sans supervision" (ou toute formulation equivalente), les regles de `ai-instructions/git.md` deviennent OBLIGATOIRES et NON NEGOCIABLES.**

En particulier:
1. **Worktree isole**: travailler UNIQUEMENT dans `/tmp/{{PROJECT}}-copilot-worktree`, jamais dans le working tree principal.
2. **Branche dediee**: creer `copilot/FEATURE_NAME` depuis `origin/main`. Jamais de commit sur `main`.
3. **Bootstrap complet**: suivre la procedure exacte de la section "Bootstrap autonome" de `git.md` avant toute modification.
4. **Publication via PR**: pousser la branche, creer une PR via `gh pr create`. Ne jamais merger sans validation utilisateur.

**Aucune exception. Aucun raccourci. Relire `ai-instructions/git.md` section 5 en cas de doute.**

## Specifique Copilot

_(Ajouter ici les regles specifiques a Copilot si necessaire.)_
