# Philosophie du code

Ce document definit l'orientation fondamentale du code, independamment du langage ou du framework.
Tous les agents doivent internaliser ces principes avant de contribuer.

---

Le code n'est pas un produit intellectuel.
Le code est une **structure operationnelle soumise au temps**.

Le probleme n'est pas "ecrire du code".
Le probleme est **maintenir la coherence sous pression**.

L'architecture est une **strategie anti-entropie**.

---

## 1. Clarity > Cleverness

Refuser:
- abstractions prematurees
- magie framework
- patterns decoratifs

Privilegier:
- lecture locale comprehensible
- causalite explicite
- logs comme source de verite

> Si on ne peut pas expliquer un module en 30 secondes, il est mauvais.

## 2. Le systeme doit etre rejouable

Un systeme robuste doit pouvoir:
- **rejouer** un flux complet
- **simuler** un scenario
- **deboguer apres coup**
- **expliquer pourquoi un etat existe**

Consequence:
- **State = derive**. L'etat courant est toujours reconstituable.
- **Log = verite**. La sequence d'evenements est la source de verite, pas l'etat.

## 3. Determinisme par defaut

Refuser:
- le non-determinisme implicite
- les effets caches
- la logique UI qui influence le modele

Tendre vers:
- command log
- seed RNG
- causal graph

> Sans determinisme, pas de comprehension. Sans comprehension, pas d'echelle.

## 4. Les abstractions sont suspectes

80% des abstractions promettent la flexibilite et livrent de l'opacite.

Exemples typiques a eviter:
- ORM "portable" qu'on ne portera jamais
- framework "agnostique" qu'on ne changera jamais
- architecture hexagonale mal appliquee qui ajoute des couches sans valeur

Regle:
> Une abstraction doit payer son cout immediatement. Sinon → YAGNI.

## 5. Le noyau doit etre petit

Architecture cible:

```
Core minimal        → regles, invariants, logique pure
Rules extensibles   → comportements composables
Content data-driven → donnees editables sans recompilation
Adapters            → IO peripheriques, UI, persistence
```

On construit des **moteurs**, pas des apps.
Le core ne depend de rien. Tout le reste depend du core.

## 6. Separer mecanique et contenu

La **mecanique**:
- deterministe
- stable
- testable

Le **contenu**:
- volatile
- editable
- data (JSON, YAML, DB)

Cette separation permet:
- iteration rapide sur le contenu sans toucher au moteur
- DSL plus tard si necessaire
- IA plus tard si necessaire

## 7. Architecture = lecture du futur

Ne pas chercher la perfection.
Chercher **le chemin de refactor le moins douloureux**.

Donc:
- logs et traces partout
- boundaries explicites entre modules
- invariants documentes
- anti-couplage systematique

> On design pour la pression future, pas pour l'elegance presente.

## 8. La verite doit etre observable

Un systeme sain doit exposer:
- son **etat** courant
- ses **decisions** (pourquoi tel chemin)
- ses **flux** (qui appelle quoi, dans quel ordre)

L'observabilite n'est pas du nice-to-have. C'est un **invariant d'architecture**.

## 9. L'UX est un outil d'architecture

Une micro UI de debug n'est pas cosmetique. C'est un **instrument cognitif**.

Principes:
- headless d'abord, UI ensuite
- les outils de debug/inspection sont des citoyens de premiere classe
- une architecture lisible visuellement = un systeme maitrise

## 10. Delivery > elegance

Refuser:
- la sur-ingenierie par plaisir intellectuel
- la purete academique
- la hype technologique

Optimiser: **temps → comprehension → evolution**.

> Le meilleur code est celui qui survit au temps, pas celui qui impressionne a la review.

---

## Synthese

| Dimension | Position |
|-----------|----------|
| Architecture | anti-entropie |
| State | derive |
| Verite | log / evenements |
| Flexibilite | data-driven |
| Abstractions | pay-as-you-go |
| Core | minimal |
| Debug | first-class |
| UX | instrument cognitif |
| Objectif | survivre au temps |
