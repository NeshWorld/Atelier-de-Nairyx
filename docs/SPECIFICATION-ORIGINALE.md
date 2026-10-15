# PROMPT MAÎTRE — WORK / CODEX
## Construire « Laboratoire pédagogique IA » — mission exécutable

**Date :** 15 octobre 2026  
**Statut :** instruction de réalisation, avec cahier des charges historique annexé  
**Chemin de travail impératif (Windows) :** `C:\Users\apapi\L'atelier de Nairyx`  
**Nom du projet :** Laboratoire pédagogique IA — ne jamais confondre avec « Data Engineering Lab ».

> **INSTRUCTION À L'AGENT PRINCIPAL (Work ou Codex).** Tu es responsable de la réalisation concrète de cette application. Analyse l'environnement et les fichiers existants avant toute modification. Utilise le chemin Windows ci-dessus comme **racine de création de l'application**. S'il existe déjà, inspecte son contenu, n'écrase jamais un projet ou des fichiers utilisateur sans accord explicite et crée au besoin un sous-dossier dédié `Laboratoire-pedagogique-IA` sous cette racine. Ne déplace pas silencieusement le projet ailleurs. Si l'environnement d'exécution n'a pas accès au PC Windows ou à ce chemin, indique-le clairement et demande l'accès approprié ; ne prétends pas avoir écrit dans ce dossier. Ne te contente pas d'un plan ou de maquettes : implémente, teste et livre un incrément fonctionnel dans la mesure des capacités et autorisations disponibles. Signale honnêtement toute limitation.

---

# A. Règles de priorité et décisions définitives

1. **Ce prompt maître prévaut sur les idées antérieures contradictoires** figurant dans l'annexe historique. Conserver l'annexe comme banque d'exigences, pas comme liste de commandes simultanées.
2. Application **desktop native du point de vue utilisateur**, ouverte par double-clic dans sa propre fenêtre ; pas d'onglet navigateur externe ni de console imposée au lancement normal.
3. **Windows en priorité**, fonctionnement **entièrement local et hors ligne** après installation ; aucun compte, serveur, API, LLM cloud ou accès réseau nécessaire aux fonctionnalités de base. Les futures intégrations cloud seront facultatives et explicitement consenties.
4. **Tauri v2 + React + TypeScript** constitue le choix technique de référence, à valider par un court prototype technique. Python local est un moteur distinct. Tout changement majeur de pile doit être justifié et approuvé.
5. **Deux parcours**, tous deux **ludiques, interactifs, soignés et personnalisables** :
   - **Découverte :** personnes sans aucune expérience de programmation ; langage simple, visualisations manipulables, scénarios éventuellement simulés/prédéfinis et clairement étiquetés ; pas de Python nécessaire.
   - **Développeur :** explications et animations interactives pendant les cours, **mais exercices en véritable Python**, avec éditeur, console, erreurs, tests et calculs réels. NumPy et PyTorch doivent être disponibles dans l'environnement du parcours. Ne jamais substituer un simulateur visuel à l'exécution réelle du code. Les graphiques scientifiques issus du code sont permis ; ne pas imposer d'animation neuronale à chaque exécution.
6. **Navigation principale : arbre technologique façon jeu vidéo**, arborescent et non linéaire. **La ville isométrique est abandonnée.** Un nœud peut représenter un sous-concept précis ; relations transversales et prérequis conseillés, sans verrouillage rigide. Même référentiel de concepts, profondeur de présentation différente selon le parcours.
7. **Découverte : arborescence fortement simplifiée par défaut** (quelques branches essentielles, ramifications avancées masquées jusqu'à action volontaire « Approfondir »). Éviter absolument de submerger les non-codeurs. **Développeur :** branches fines et sous-concepts techniques accessibles.
8. **Priorité produit à très court terme :** faire tester une expérience Découverte complète par des personnes n'ayant **jamais codé**. Ne pas sacrifier ce but à la construction prématurée d'une gigantesque bibliothèque de cours ou d'un éditeur complet.
9. Chaque cours peut contenir mini-parties, animations manipulables, flashcards recto-verso de rappel actif, mini-exercices et évaluation finale. Ne pas exiger de réponse textuelle identique mot pour mot ; préférer QCM, tolérances numériques, variantes, tests de code, ou autoévaluation guidée. Ne pas prétendre à une correction sémantique fiable sans moteur adapté.
10. Les contenus scientifiques restent exacts même simplifiés. Toujours distinguer simulation, calcul réellement exécuté, approximation pédagogique et modèle réellement entraîné.

# B. Stratégie d'exécution : sous-agents

**Créer et coordonner des sous-agents pendant l'opération SI la plateforme permet effectivement leur création.** Ne jamais simuler leur existence ni affirmer qu'ils ont travaillé s'ils n'ont pas été lancés. Si cette fonction n'existe pas, répartir les responsabilités en tâches explicites exécutées séquentiellement, en indiquant cette limitation.

**Répartition recommandée, adaptable selon les outils et la charge :**

| Agent | Responsabilité | Livrables / contrôle |
|---|---|---|
| A — Architecture / intégration | Tauri, React, TypeScript, conventions, structure monorepo, intégration finale | application démarrable, ADR, scripts de build |
| B — UX/UI / direction artistique | arbre technologique, simplification Découverte, design system, navigation clavier, responsive fenêtre | composants, tokens visuels, tests d'ergonomie |
| C — Pédagogie / contenu | référentiel concepts, cours novice, flashcards, QCM, rigueur scientifique | contenu structuré et critères de réussite |
| D — Python / parcours développeur | sidecar/processus Python, éditeur, console, NumPy/PyTorch, tests d'exécution | exécution authentique et reproductible |
| E — Sécurité / robustesse | modèle de menace, isolement, permissions, timeouts, ressources, fichiers, dépendances | audit, tests négatifs, limites documentées |
| F — QA / accessibilité | tests unitaires, intégration, E2E, offline, régression, novices, crash/reprise | matrice de tests, rapports, bugs reproductibles |

**Coordination obligatoire :**
- L'agent principal établit d'abord les interfaces/contrats partagés (types de concepts, événements, format de progression, protocole d'exécution Python), ainsi que les chemins de fichiers propriétaires par agent.
- Définir les dépendances et éviter que plusieurs agents modifient simultanément les mêmes fichiers. Utiliser branches ou répertoires de travail isolés si disponibles ; sinon sérialiser les changements.
- Prévoir points d'intégration réguliers : revue de PR/diff, compilation, tests, revue sécurité, puis fusion.
- Ne jamais fusionner un travail qui casse la compilation ou des tests précédemment verts. Les décisions importantes et blocages sont consignés.
- Un sous-agent ne peut déclarer une fonctionnalité « terminée » sans preuve d'exécution/test adaptée.

# C. MVP à livrer d'abord

**Objectif : un parcours Découverte court mais complet, testable par une personne n'ayant jamais codé.** L'arbre doit être extensible, sans exiger que tous ses nœuds soient déjà implémentés.

**Vertical slice prioritaire :**
1. Lancement desktop autonome et écran d'accueil clair ; choix Découverte / Développeur visible, avec priorité d'implémentation Découverte.
2. Arbre technologique interactif **simplifié** en Découverte : quelques branches principales, zoom/pan si utile, clic sur nœud, état de progression, ouverture facultative des sous-branches ; aucun écran noyé sous des dizaines de nœuds.
3. Un **cours introductif complet sur la tokenisation**, découpé en étapes : phrase → découpage manipulable → tokens → identifiants (exemple pédagogique explicitement simplifié), flashcards retournables, mini-exercice, évaluation et retour explicatif.
4. Un second module court, par exemple « qu'est-ce qu'un neurone artificiel ? », avec poids/biais et curseurs réellement reliés à un calcul simple ; signaler le caractère simplifié.
5. Progression et préférences stockées localement ; reprise après fermeture ; autosauvegarde et récupération raisonnable.
6. Mode hors ligne démontré ; navigation clavier et lisibilité de base.
7. Préparer l'architecture du parcours Développeur sans bloquer le test novice : au minimum une **preuve de faisabilité réelle** de l'exécution Python locale et un test d'intégration console/erreurs. L'IDE complet, le giga-exercice et le déploiement lourd PyTorch peuvent venir dans les phases suivantes, mais restent des exigences produit fermes, non annulées.

**Ne pas construire au MVP :** des centaines de contenus, un moteur 3D, un cloud, une génération automatique de cours par LLM, une simulation faussement présentée comme IA réelle, ou une interface saturée de badges/effets.

**Phases après MVP :** (1) élargir le référentiel de concepts ; (2) développer l'arbre profond du parcours Développeur ; (3) intégrer IDE, environnements Python/NumPy/PyTorch locaux et giga-exercice du fichier vide au modèle entraîné/sauvé/rechargé ; (4) améliorer outils de mathématiques, visualisations, personnalisation et éventuels services optionnels.

# D. Architecture, données et fonctionnement hors ligne

- Séparer UI Tauri/React, moteur de navigation et contenu, stockage local, moteur visuel pédagogique, et exécution Python. Les animations pédagogiques n'exécutent pas arbitrairement le code de l'apprenant.
- Modéliser un **graphe de concepts** avec identifiants stables, parents, sous-concepts, liens transversaux, prérequis recommandés, niveaux de visibilité Découverte/Développeur, contenus et exercices. Garder les contenus éditables sous un format versionné (JSON/Markdown validé par schéma, par exemple).
- Prévoir migrations de données locales, sauvegarde atomique ou transactionnelle, restauration après corruption et versionnement du format de progression. Ne jamais effacer silencieusement les projets de l'utilisateur lors d'une mise à jour.
- Emballer les ressources indispensables (polices autorisées, icônes, animations, cours, bibliothèques nécessaires). Aucun CDN ni télémétrie imposée. Aucune ressource distante requise pour afficher l'arbre.
- Pour Windows, vérifier la stratégie de distribution **WebView2 hors ligne** et les prérequis réels de la cible ; prévoir installateur et procédure de test sur machine propre.
- Prévoir des tailles d'installation réalistes : PyTorch et dépendances GPU peuvent être volumineux. Documenter stratégie CPU de base et GPU facultatif, versions compatibles, licences et vérification des artefacts.
- Respecter les chemins Windows avec espaces, apostrophe et caractères accentués ; tester spécifiquement `C:\Users\apapi\L'atelier de Nairyx` et éviter les commandes shell non échappées. Utiliser des API de chemins plutôt que de concaténer des commandes.

# E. Charte graphique contraignante

**Style cible : arbre technologique de jeu vidéo, vivant mais lisible, pas un tableau de bord surchargé.**

- Une hiérarchie visuelle nette : un élément principal à la fois, intitulés courts, contrastes suffisants, espacement cohérent, regroupement logique.
- **Aucune pluie d'icônes.** Chaque icône doit avoir une fonction claire (navigation, statut ou concept réellement distinct). Éviter icônes décoratives répétées, emojis omniprésents, badges superflus et boutons redondants. Privilégier libellés explicites.
- Limiter la palette et les effets lumineux. Animations sobres, cohérentes, courtes, désactivables via « réduire les animations » ; pas de clignotements distrayants.
- Les nœuds de l'arbre doivent rester lisibles même avec beaucoup de sous-concepts ; affichage progressif, filtrage, recherche, zoom, recentrage et indicateur de position. Découverte : branches avancées repliées par défaut.
- Cohérence des composants (typographie, tailles, états hover/focus/disabled, feedback, erreurs), densité maîtrisée, absence de chevauchements et de texte coupé.
- Accessibilité : clavier, focus visible, contraste, taille de texte adaptable, alternatives textuelles, ne jamais coder l'information uniquement par la couleur, zones cliquables confortables.
- **Les représentations mathématiques restent conventionnelles** : vecteurs, matrices, symboles et équations lisibles, sans remplacer les nombres par des icônes thématiques.
- Les thèmes personnels peuvent changer l'ambiance et les exemples, pas déformer la science. Éviter le « gamification washing » : aucune décoration qui ralentit l'apprentissage.
- Inclure une revue graphique explicite avec captures et vérification des écrans de petite taille, redimensionnement de fenêtre et mise à l'échelle Windows.

# F. Exécution Python : sécurité, durée, ressources

**Menace à prendre au sérieux :** du Python écrit par un apprenant est du **code arbitraire**. Un simple sous-processus n'est **pas** un bac à sable de sécurité. Ne jamais présenter un timeout comme une isolation fiable.

- Lancer les exercices dans un processus séparé du processus UI, avec répertoire de travail contrôlé, chemins validés, protocole de communication explicite, sortie stdout/stderr bornée et journalisation des erreurs.
- Définir une politique de confiance : pour un exercice local, expliquer clairement que le code exécuté possède potentiellement les permissions de l'utilisateur. Étudier un isolement plus fort (compte restreint, conteneur/VM ou mécanisme OS adapté) sans affirmer qu'il existe avant implémentation et audit.
- Éviter l'injection de commandes : aucune interpolation brute de code, de chemins ou de paramètres dans une ligne de commande shell. Utiliser arguments structurés et APIs subprocess.
- Gérer arbres de processus, arrêt gracieux puis forcé, fermeture d'application, annulation, absence de processus orphelins, et limite de volume des logs.
- **Ne pas imposer un timeout court aux entraînements d'IA** : profils distincts scripts courts / tests / entraînements prolongés ; budget d'exécution choisi avant lancement, possibilité d'extension avant échéance, bouton Stop toujours disponible, avertissement avant interruption.
- Surveiller CPU/RAM et GPU si supporté ; afficher un retour clair, limiter les consommations anormales quand possible et éviter de bloquer l'UI. Les mécanismes de limitation doivent être testés sur Windows et leurs limites documentées.
- Autosauvegarder **le code source et la progression** ; checkpoints de modèles seulement si le code et le format d'entraînement le permettent. Ne jamais promettre de récupérer les poids d'un entraînement arbitraire interrompu de force.
- Restreindre les chemins utilisés par l'application et prévenir les suppressions accidentelles de données du projet ; cependant, ne pas prétendre empêcher un script Python libre de modifier les fichiers accessibles à l'utilisateur sans véritable isolation OS.
- Vérifier les dépendances (versions figées, provenance, intégrité, licences), minimiser les permissions, interdire les téléchargements silencieux et documenter la surface d'attaque des plugins/extensions éventuels.

# G. Plan de tests obligatoire et preuves

Créer une **matrice de tests** (cas, risque, procédure, résultat, preuve, statut) et exécuter réellement les tests applicables. **Interdiction d'inventer des résultats ou de marquer « réussi » sans exécution.** Si environnement, matériel ou autorisations manquent, marquer « non exécuté » avec motif et commande reproductible.

1. **Unitaires** : schémas du graphe, filtres de profondeur, prérequis, progression, flashcards, évaluations, normalisation des réponses, calculs pédagogiques.
2. **Intégration** : navigation arbre→cours→flashcard→évaluation→sauvegarde→reprise ; pont Tauri↔Python ; propagation stdout/stderr/exceptions ; absence de blocage UI.
3. **E2E desktop** : lancement par double-clic, fenêtre native, redimensionnement, navigation clavier, fermeture/reprise, parcours novice complet.
4. **Hors ligne** : machine déconnectée du réseau avant lancement et pendant usage ; aucune requête nécessaire ; contenus et exercices accessibles ; installation hors ligne si promise.
5. **Sécurité** : entrée malformée, traversée de chemins, injection shell, sorties gigantesques, processus enfants, boucles infinies, arrêt forcé, dépendances vulnérables, fichiers non fiables, permissions et fuite de données ; tests dans environnement isolé pour les scénarios destructifs.
6. **Résilience** : fermeture brutale, corruption simulée du stockage, manque d'espace disque, erreurs de permissions, crash Python, interruption d'entraînement, relance et reprise.
7. **Performance** : grand graphe synthétique (centaines de nœuds), temps de chargement, fluidité zoom/pan, mémoire, charge CPU/GPU, absence de fuite de processus, cas machine modeste.
8. **Qualité graphique/accessibilité** : aucune surcharge d'icônes, aucun chevauchement, contraste, lisibilité, focus, taille des textes, réduction des animations, états vides/chargement/erreur.
9. **Tests utilisateurs débutants** : au moins un protocole prêt à l'emploi pour personnes n'ayant jamais codé : trouver un cours sans aide, comprendre la tokenisation, retourner une flashcard, finir l'exercice, expliquer avec leurs mots, retrouver leur progression. Recueillir observations, erreurs, points de blocage et modifications proposées. Ne pas inventer de sessions avec de vrais testeurs.
10. **Non-régression** : lancer la suite de tests après chaque intégration et avant livraison. Établir une liste de défauts avec gravité, reproduction et statut.

**Critères bloquants :** démarrage impossible ; dépendance Internet non déclarée ; perte de progression ; code Python exécuté dans le processus UI ; processus enfants non contrôlés ; faille de chemin/injection connue non corrigée ; interface Découverte incompréhensible ; tests critiques non exécutés sans signalement.

# H. Plan d'action de l'agent principal

1. **Reconnaissance** : inspecter le dossier Windows cible, identifier projets existants, outils disponibles, versions, espace disque, permissions et contraintes ; ne rien écraser. Lister les incertitudes bloquantes.
2. **Architecture légère** : choisir la structure, définir contrats, documenter les décisions (ADR) et découper les tâches des sous-agents.
3. **Prototype de faisabilité** : valider Tauri desktop, rendu d'un mini-graphe interactif, persistance locale, et communication avec un processus Python local. Faire une démonstration réelle.
4. **Implémentation du MVP Découverte** : construire la boucle complète du cours de tokenisation, une animation manipulable, flashcards, évaluation, progression.
5. **Intégration** : relire chaque changement, résoudre les conflits, exécuter tests unitaires/intégration/E2E et audits sécurité, puis corriger les défauts.
6. **Packaging** : produire un exécutable/installateur Windows quand l'environnement le permet ; tester sur machine propre, sans réseau, si possible.
7. **Livraison** : fournir sources, scripts de lancement/build, installateur si produit, documentation utilisateur, architecture, matrice de tests, rapport sécurité, limitations connues, backlog priorisé et étapes pour la suite Développeur.

**À chaque jalon**, publier un compte rendu factuel : implémenté, testé (avec commandes et résultats), non testé, risques, prochaine action. Ne jamais prétendre avoir livré un exécutable Windows si seul un prototype web a été lancé. Ne jamais substituer une capture ou une maquette à une fonctionnalité opérationnelle.

**Définition de « terminé » pour le MVP :** un utilisateur sans expérience du code peut ouvrir l'application desktop sans Internet, naviguer dans un arbre simplifié, effectuer un cours avec manipulation + flashcard + évaluation, fermer et retrouver sa progression ; les tests applicables ont été exécutés et les risques critiques corrigés ou explicitement bloquants.

# I. Annexe historique et règles d'interprétation

Le document ci-dessous est le cahier des charges historique complet. Il comprend des idées exploratoires, des répétitions et des choix ensuite révisés. **En cas de contradiction, appliquer exclusivement les décisions de la section A et les exigences de sécurité/qualité ci-dessus.** Notamment : **pas de ville**, **pas de navigation linéaire imposée**, **pas d'arbre dense pour les novices**, **pas d'animations imposées lors de l'exécution de code**, **pas de dépendance cloud**, **pas de confusion avec Data Engineering Lab**.

---

# Projet — Laboratoire interactif pour comprendre et construire des IA

> **Document de cadrage / sauvegarde du contexte — 15 octobre 2026**  
> Statut : idée en exploration, **pas** un cahier des charges validé.  
> Ce projet est envisagé comme une application distincte de **Data Engineering Lab**.

## 1. Vision initiale

Créer une application permettant de **découvrir, comprendre et construire les mécanismes de l'intelligence artificielle**, sous plusieurs formes, en les manipulant directement.

L'objectif n'est pas seulement de lire des cours ou d'utiliser une IA déjà prête : l'apprenant expérimente les mécanismes internes, constate les résultats, puis peut apprendre à les reproduire en code.

Deux publics doivent pouvoir en bénéficier :

1. **Les personnes sans connaissance en programmation ni en IA**, grâce à des manipulations visuelles accessibles.
2. **Les développeurs, débutants en code et apprenants techniques**, qui doivent trouver un véritable contenu d'apprentissage, et pas seulement des animations simplifiées.

Le parcours pourrait offrir plusieurs niveaux de profondeur sur un même concept, plutôt que séparer artificiellement les deux publics.

## 2. Première idée concrète : tokeniser une phrase à la main

### Interaction imaginée par l'utilisateur

Afficher une phrase et permettre à l'apprenant de **placer ou déplacer des séparateurs** par glisser-déposer pour la découper en tokens.

Phrase d'exemple :

> Le dragon vole admirablement bien dans la brume

Exemple de découpe proposé pendant la discussion :

> Le | dragon | vole | admire | able | ment | bien | dans | la brume |

Le geste est le cœur de l'exercice : **l'utilisateur choisit lui-même où couper**, observe les segments produits et comprend progressivement les règles possibles.

### Progression pédagogique possible

- D'abord, segmenter en mots.
- Ensuite, découvrir que les **tokens ne correspondent pas toujours à des mots entiers** : ils peuvent être des sous-mots, caractères ou groupes de caractères selon le tokenizer.
- Comprendre l'influence du vocabulaire et de l'algorithme de tokenisation.
- Construire un vocabulaire et attribuer des identifiants numériques aux tokens.
- Comparer sa propre segmentation à celle d'un tokenizer réel.

**Précision importante :** la découpe illustrative ci-dessus n'est pas nécessairement celle d'un tokenizer existant. L'application doit expliquer qu'il n'existe pas une seule « bonne » segmentation indépendante du modèle choisi. Un exercice peut avoir une solution attendue **en fonction d'un algorithme ou d'un vocabulaire explicitement défini**.

Une première maquette interactive dans la conversation permettait d'activer/désactiver des séparateurs entre les mots. L'idée originale va plus loin : permettre de déplacer les séparations **au niveau des caractères**, notamment à l'intérieur d'un mot.

## 3. Autre idée centrale : programmation visuelle plutôt que Python obligatoire

L'utilisateur a proposé une **zone de code à images / blocs visuels** en remplacement ou en complément du code Python.

Inspirations évoquées : **Scratch** (blocs de programmation) et **Node-RED** (flux de blocs connectés), mais dans un environnement spécialisé pour l'IA.

### Fonctionnement envisagé

L'apprenant manipule des blocs fonctionnels représentant des opérations :

```text
[Texte d'entrée]
        ↓
[Tokenisation]
        ↓
[Construction du vocabulaire]
        ↓
[Encodage en identifiants]
        ↓
[Résultat / visualisation]
```

Les blocs pourraient être **déplacés, reliés et configurés**. Ils devraient transporter de **vraies données**, pas simplement déclencher des animations.

Les connexions pourraient exposer les types de données :

- `String` : texte ;
- `List[String]` : liste de chaînes ;
- `List[Int]` : identifiants numériques ;
- vecteurs, matrices, images, etc.

Une connexion incompatible deviendrait une occasion d'apprendre : par exemple, expliquer pourquoi un bloc attendant une liste de nombres ne peut pas recevoir directement une image.

**Question technique non tranchée :** le système visuel doit-il devenir un moteur de programmation complet permettant de construire une petite IA fonctionnelle **sans écrire une seule ligne de Python** ? Cette question a été posée, mais pas encore résolue.

## 4. Trois modes pour un même concept (proposition)

| Mode | Expérience | Public / objectif |
|---|---|---|
| **Découverte** | Manipulations et blocs visuels sans code | Débutants complets ; compréhension intuitive |
| **Hybride** | Blocs visuels et affichage du code correspondant | Transition vers la programmation ; compréhension des opérations |
| **Code** | Implémentation par l'apprenant, par exemple en Python | Codeurs débutants et développeurs ; approfondissement technique |

Ces trois modes pourraient utiliser **les mêmes concepts et données**, en augmentant progressivement l'autonomie demandée.

Exemple : segmentation par espaces, présentée explicitement comme **tokenisation simplifiée**, et non comme un tokenizer moderne complet :

```python
texte = "Le dragon vole dans la brume"
tokens = texte.split()
vocab = {mot: i for i, mot in enumerate(dict.fromkeys(tokens))}
```

Le mode « Code » ne devrait pas écrire automatiquement les exercices à la place de l'utilisateur.

## 5. Méthode pédagogique proposée

Pour chaque notion, quatre étapes :

1. **Manipuler** : observer et modifier visuellement le mécanisme.
2. **Comprendre** : expliquer le résultat, anticiper ce qui se passe si l'on change un paramètre.
3. **Programmer** : reconstruire le mécanisme soi-même en code, avec indices progressifs si nécessaire.
4. **Construire** : réutiliser les éléments acquis dans un système plus complet.

Principes :

- Apprendre **par expérimentation**, pas seulement par lecture.
- Montrer les entrées, transformations, sorties et erreurs.
- Rendre les concepts accessibles sans supprimer leur profondeur.
- Éviter les solutions automatiques qui court-circuitent l'apprentissage.
- Permettre de revenir sur une notion ou d'explorer librement.
- Ne pas inventer de nouvelles fonctionnalités uniquement pour décorer l'interface.

## 6. Parcours d'apprentissage envisagés

### Branche « langage et LLM »

**Tokenisation** : mots, sous-mots, vocabulaire, identifiants et tokenizers réels.

**Représentations numériques / embeddings** : comprendre qu'un identifiant de token n'est pas un embedding ; représenter des éléments par des vecteurs ; calculer des similarités ; découvrir comment ces représentations peuvent être apprises.

**Réseaux de neurones** : entrées, poids, biais, activation, prédiction, erreur, mise à jour des poids et apprentissage.

**Attention et Transformers** : relations entre tokens, scores d'attention et mécanismes simplifiés, puis limites des simplifications.

**Petits modèles de langage** : commencer par un système simple, par exemple à base de n-grammes, avant d'aborder des architectures plus complexes.

### Autres branches indispensables pour couvrir « l'IA sous toutes ses formes »

- **IA symbolique**, règles, logique et recherche de chemins.
- **Machine learning classique** et classification.
- **Vision par ordinateur**.
- **Apprentissage par renforcement**.
- **Systèmes de recommandation**.
- **Agents et systèmes multi-agents**.

Ces branches sont des **pistes proposées**, pas un programme définitif. Il faudra définir des prérequis et une progression réaliste.

## 7. Exemple de laboratoire : similarité vectorielle

Une démonstration interactive a été imaginée : afficher deux vecteurs A et B, faire varier l'angle entre eux avec un curseur et mettre à jour la **similarité cosinus**.

Observations pédagogiques :

- À **0°**, vecteurs alignés : similarité `1`.
- À **90°**, vecteurs orthogonaux : similarité `0`.
- À **180°**, directions opposées : similarité `-1`.

L'objectif est d'appréhender intuitivement le calcul avant de le reproduire avec des formules puis en Python.

**Limite à expliciter :** déplacer manuellement deux vecteurs n'explique pas à lui seul comment un modèle apprend des embeddings sémantiques. Ce serait une première étape pédagogique.

## 8. Construire un système progressivement

Idée directrice : **chaque chapitre peut débloquer une pièce réutilisable** dans les exercices suivants.

Par exemple :

```text
Segmentation de texte
    ↓
Vocabulaire et identifiants
    ↓
Représentations numériques
    ↓
Calculs / apprentissage
    ↓
Petit modèle fonctionnel
    ↓
Expérimentations personnelles
```

À terme, l'utilisateur pourrait assembler les mécanismes étudiés pour construire un petit classifieur, un modèle de langage simple ou un autre système adapté à la branche choisie.

Un **laboratoire libre** pourrait permettre d'utiliser les composants débloqués hors des exercices guidés, modifier les paramètres, comparer des approches et observer les conséquences.

## 9. Exigence de rigueur scientifique et pédagogique

L'application doit toujours distinguer :

1. **Ce qui est calculé réellement**.
2. **Ce qui est simulé à des fins pédagogiques**.
3. **Ce qui est volontairement simplifié**.

Exemples de distinctions importantes :

- Un identifiant numérique de token n'est pas un embedding.
- Une segmentation par espaces n'est pas un tokenizer universel.
- Une animation de réseau de neurones ne prouve pas qu'un apprentissage réel se produit.
- Un schéma de Transformer ne remplace pas le calcul effectif de l'attention.
- Quelques blocs de tokenisation et d'embeddings ne suffisent pas à construire un LLM.

Le logiciel devrait exposer les calculs et les hypothèses, et éviter de donner une illusion de compréhension par de seules animations.

## 10. Positionnement du projet

**Intention confirmée par l'utilisateur :**

- Une application accessible aux non-connaisseurs.
- Un véritable apprentissage, y compris pour les personnes sachant déjà coder.
- Des exercices interactifs qui s'enchaînent.
- Des mécanismes d'IA manipulables à la main.
- Une alternative visuelle au code Python, avec des blocs / images.

**Pistes proposées au cours de la discussion, à valider :**

- Trois modes Découverte / Hybride / Code.
- Blocs connectés avec types de données.
- Déblocage progressif de composants.
- Laboratoire libre.
- Parcours couvrant différentes familles d'IA.
- Projet autonome distinct de Data Engineering Lab.

## 11. Questions ouvertes pour la prochaine discussion

1. **Le moteur visuel doit-il exécuter de vrais programmes d'IA entièrement sans Python ?**
2. Les blocs seront-ils de type Scratch (emboîtables), Node-RED (nœuds connectés), ou un système hybride ?
3. Quel premier parcours construire : tokenisation, réseau de neurones, IA symbolique ou autre ?
4. Comment évaluer une réponse lorsque plusieurs tokenisations sont possibles ?
5. Comment organiser les niveaux de difficulté pour débutants complets et développeurs ?
6. Quelle place donner aux exercices Python optionnels ou obligatoires ?
7. Comment concevoir une première version limitée mais pédagogiquement convaincante ?
8. Quel environnement de distribution choisir : Web local, application de bureau ou site hébergé ?

## 12. Première version minimale possible (proposition, non validée)

Un prototype centré sur **un seul atelier de tokenisation** pourrait permettre :

- de saisir ou choisir une phrase ;
- de placer des séparateurs entre **caractères**, y compris au milieu des mots ;
- de visualiser les tokens produits ;
- d'appliquer une règle ou un vocabulaire de référence explicite ;
- de comprendre les erreurs et les alternatives ;
- de voir les identifiants associés aux tokens ;
- d'ouvrir un mode hybride montrant le code correspondant.

Ce serait un test du principe pédagogique avant de développer un moteur complet de blocs ou plusieurs branches d'IA.

---

**Résumé en une phrase :** concevoir un laboratoire pédagogique interactif où l'on peut **manipuler, comprendre, programmer et assembler** les mécanismes de l'intelligence artificielle, depuis les premiers pas sans code jusqu'à la construction de petits systèmes réels.

# Laboratoire pédagogique IA — Partie 2
## Visualisation interactive du fonctionnement d'un LLM

**Statut :** Concept en cours de réflexion  
**Document :** Suite du concept initial de laboratoire pédagogique IA  
**Objectif :** Conserver les idées, les interactions envisagées et les précisions techniques avant la conception de l'application.

---

## 1. Nouvelle idée : voyager à l'intérieur d'un LLM

L'application doit proposer une expérience pédagogique interactive permettant à l'utilisateur de suivre le parcours d'une information à travers un modèle de langage.

L'idée initiale est celle d'une présentation ressemblant à un PowerPoint, mais avec des animations et des interactions beaucoup plus avancées.

Il ne s'agit ni d'une succession d'images fixes ni d'une vidéo.

L'utilisateur doit pouvoir :

- Passer d'une scène à une autre.
- Observer les transformations des informations.
- Suivre visuellement leur circulation dans le modèle.
- Mettre une animation en pause.
- Revenir en arrière.
- Zoomer sur un composant.
- Manipuler certaines valeurs.
- Comprendre les calculs effectués.
- Approfondir les explications selon son niveau.

**Principe central : montrer comment une phrase devient une représentation numérique, comment celle-ci est traitée par un réseau neuronal, puis comment le modèle génère progressivement du texte.**

Cette expérience doit constituer un véritable outil d'apprentissage, et pas seulement une animation décorative.

---

## 2. Parcours pédagogique proposé

L'utilisateur commence par saisir une phrase, par exemple :

> Le dragon vole dans la brume

Cette phrase sert de fil conducteur à travers plusieurs scènes.

### Scène 1 — Texte d'entrée

Afficher la phrase originale.

L'utilisateur découvre que le modèle ne traite pas directement les mots comme un humain.

**Interactions envisagées :**
- Modifier la phrase.
- Lancer le parcours.
- Observer les caractères composant le texte.

### Scène 2 — Tokenisation

La phrase traverse visuellement un tokenizer.

Elle est découpée en plusieurs tokens, dont les frontières dépendent du tokenizer choisi.

L'animation doit faire apparaître progressivement les séparations.

**Interactions envisagées :**
- Déplacer manuellement les séparateurs.
- Comparer sa proposition à la découpe du tokenizer.
- Examiner les tokens individuellement.
- Comprendre pourquoi un mot peut contenir plusieurs tokens.
- Comparer plusieurs méthodes de tokenisation.

La découpe doit être présentée comme dépendante de l'algorithme et du vocabulaire utilisés, et non comme une règle universelle.

### Scène 3 — Conversion en identifiants numériques

Chaque token est associé à un identifiant entier issu du vocabulaire.

Exemple purement illustratif :

| Token | Identifiant |
|---|---:|
| Le | 105 |
| dragon | 4821 |
| vole | 903 |

**Objectif pédagogique :** comprendre que les identifiants numériques ne sont pas encore des embeddings.

### Scène 4 — Embeddings

Les identifiants sont utilisés pour retrouver des vecteurs numériques dans une table d'embeddings apprise.

L'animation représente la transformation :

Token → ID → Vecteur

Exemple illustratif :

`dragon → 4821 → [0.8, -0.2, 0.4, ...]`

**Interactions envisagées :**
- Examiner les dimensions du vecteur.
- Observer les valeurs numériques.
- Visualiser des représentations en deux ou trois dimensions.
- Comparer des vecteurs.
- Découvrir la similarité cosinus.
- Comprendre que les embeddings sont des paramètres appris, et non des nombres choisis arbitrairement dans un véritable modèle.

La visualisation 2D ou 3D doit être présentée comme une simplification ou une projection lorsque les vecteurs réels possèdent davantage de dimensions.

### Scène 5 — Entrée dans le Transformer

Les représentations numériques entrent dans les blocs du Transformer.

L'utilisateur découvre une vue générale du modèle, composée de plusieurs couches.

L'animation doit permettre d'observer la progression des représentations à travers les différents blocs.

Les éléments abordés progressivement peuvent inclure :

- Les informations de position.
- Le mécanisme d'attention.
- Les projections linéaires.
- Les réseaux feed-forward.
- Les fonctions d'activation.
- Les connexions résiduelles.
- La normalisation.
- Les transformations des représentations.

L'application doit expliquer que ces calculs ne correspondent pas simplement à une succession de neurones isolés : de nombreuses opérations matricielles et vectorielles sont réalisées en parallèle.

---

## 3. Fonctionnalité centrale : zoomer à l'intérieur d'un neurone

**Idée exprimée par le créateur :** permettre à l'utilisateur de zoomer sur un neurone pour observer comment il transforme les nombres qu'il reçoit.

Cette interaction doit faire passer l'utilisateur d'une représentation globale d'un réseau à une explication mathématique détaillée.

### Déroulement envisagé

1. L'utilisateur voit un réseau de neurones.
2. Il sélectionne un neurone ou une unité de calcul.
3. La caméra effectue un zoom.
4. Les entrées numériques deviennent visibles.
5. Les poids associés apparaissent.
6. Le biais est présenté.
7. La somme pondérée est calculée.
8. La fonction d'activation est appliquée.
9. Le résultat numérique apparaît.
10. L'utilisateur revient à la vue générale pour observer la suite du traitement.

### Exemple de calcul pédagogique

On considère trois entrées :

- x₁ = 0,5
- x₂ = 0,8
- x₃ = 0,2

Avec trois poids :

- w₁ = 0,5
- w₂ = 0,3
- w₃ = -0,4

Et un biais :

- b = 0,1

La somme pondérée est :

`z = (x₁ × w₁) + (x₂ × w₂) + (x₃ × w₃) + b`

Soit :

`z = (0,5 × 0,5) + (0,8 × 0,3) + (0,2 × -0,4) + 0,1`

`z = 0,51`

En appliquant ReLU :

`ReLU(z) = max(0, z) = 0,51`

### Manipulations possibles

L'utilisateur pourrait :

- Modifier les entrées.
- Déplacer des curseurs pour changer les poids.
- Modifier le biais.
- Choisir une fonction d'activation.
- Observer immédiatement le nouveau résultat.
- Comparer plusieurs configurations.

**Précision scientifique :** cette démonstration représente un neurone artificiel classique. Elle servira d'introduction aux opérations plus complexes d'un Transformer, et ne doit pas être présentée comme une description exhaustive de son architecture.

---

## 4. Visualiser le fonctionnement des blocs Transformer

Après avoir compris les opérations élémentaires, l'utilisateur revient à la vue générale.

Il peut examiner les mécanismes qui composent un bloc Transformer.

### Attention

Une scène pourrait montrer comment les représentations des tokens interagissent.

Par exemple, l'utilisateur pourrait :

- Sélectionner un token.
- Observer les autres positions auxquelles il peut prêter attention.
- Visualiser des scores d'attention.
- Examiner une matrice d'attention.
- Comprendre le masque causal utilisé pour la prédiction autoregressive.

L'animation devra éviter de présenter les poids d'attention comme une explication complète et certaine du raisonnement du modèle.

### Réseau feed-forward

Une autre scène pourrait montrer comment les représentations sont transformées par les opérations linéaires et les activations.

Le zoom sur un neurone servirait ici de passerelle pédagogique vers la compréhension des opérations matricielles.

### Connexions résiduelles et normalisation

L'application pourrait montrer comment certaines informations sont conservées et combinées au fil des transformations.

L'ordre exact des opérations devra correspondre à l'architecture choisie pour la démonstration.

---

## 5. Génération prédictive du prochain token

Après le passage dans les blocs Transformer, le modèle produit des représentations contextualisées.

Pour la position utilisée pour la prédiction, ces représentations permettent de calculer des scores associés aux tokens possibles du vocabulaire.

### Scène 6 — Scores et probabilités

L'utilisateur découvre :

1. La projection vers les scores du vocabulaire, appelés logits.
2. La transformation éventuelle de ces scores en probabilités.
3. Le classement des prochains tokens possibles.
4. La sélection d'un token selon une stratégie de décodage.

Une visualisation pourrait afficher plusieurs candidats avec leurs probabilités.

Les probabilités doivent être calculées par le modèle pédagogique ou explicitement indiquées comme fictives.

### Scène 7 — Décodage et apparition du texte

Le token sélectionné est converti en texte par le décodeur du tokenizer.

Il est ajouté à la séquence en cours de génération.

L'animation montre alors que le processus recommence pour prédire le token suivant.

**Concept à enseigner : génération autoregressive.**

La boucle pédagogique devient :

Texte → Tokenisation → IDs → Embeddings → Transformer → Logits → Sélection d'un token → Décodage → Nouvelle prédiction.

### Précision importante

Un LLM ne transforme pas directement son dernier vecteur en un mot.

Il produit des scores sur un vocabulaire de tokens, puis une procédure de sélection choisit le prochain token.

Le décodage convertit ensuite les tokens sélectionnés en texte.

---

## 6. Présentation interactive plutôt que vidéo

Le système doit être pensé comme un ensemble de scènes interactives.

Chaque scène possède :

- Un état.
- Des objets visuels.
- Des animations.
- Des transitions.
- Des interactions utilisateur.
- Des explications pédagogiques.
- Des paramètres modifiables.
- Des conditions de passage à l'étape suivante, si nécessaire.

### Contrôles envisagés

- Précédent.
- Suivant.
- Lecture.
- Pause.
- Recommencer.
- Zoom avant.
- Zoom arrière.
- Retour à la vue globale.
- Affichage des valeurs numériques.
- Affichage des formules.
- Affichage du code.

Les animations doivent rester pilotables par l'utilisateur.

L'utilisateur ne doit pas être obligé d'attendre une longue séquence animée pour accéder à une information.

Les transitions doivent contribuer à la compréhension de la circulation et de la transformation des données.

---

## 7. Plusieurs niveaux de lecture

Ce système doit rester cohérent avec le concept initial de l'application : être accessible aux personnes sans connaissances en programmation tout en proposant un apprentissage approfondi aux développeurs.

### Niveau Découverte

L'utilisateur suit les animations et manipule les éléments visuels.

Le vocabulaire technique est introduit progressivement.

### Niveau Hybride

L'utilisateur voit les transformations visuelles accompagnées des nombres, structures de données et calculs simplifiés.

### Niveau Code

L'utilisateur peut examiner ou implémenter les opérations en Python.

### Commandes pédagogiques envisagées

**« Montre-moi les mathématiques »**

Affiche les équations et les calculs correspondant à l'étape observée.

**« Montre-moi le Python »**

Affiche une implémentation pédagogique du mécanisme.

Ces commandes doivent permettre d'approfondir une scène sans imposer d'emblée un niveau technique élevé.

---

## 8. Lien avec la programmation visuelle par blocs

Le parcours animé pourrait être relié au système de programmation visuelle imaginé dans le premier document.

L'utilisateur pourrait retrouver les mécanismes étudiés sous forme de blocs réutilisables :

- Entrée texte.
- Tokenizer.
- Encodage en identifiants.
- Table d'embeddings.
- Opérations vectorielles.
- Couches neuronales.
- Fonctions d'activation.
- Attention.
- Calcul de probabilités.
- Sélection de token.
- Décodage.

Ces blocs pourraient être assemblés pour reproduire des systèmes pédagogiques.

Il faudra distinguer :

- Les blocs purement explicatifs.
- Les blocs exécutant réellement des calculs.
- Les blocs simplifiant des mécanismes complexes.

**Question ouverte :** jusqu'où permettre la construction d'une IA fonctionnelle entièrement par programmation visuelle, sans Python ?

---

## 9. Proposition technique initiale

Pour une première version, une application Web pourrait être suffisante.

### Technologies envisageables

- HTML et CSS pour l'interface.
- JavaScript ou TypeScript pour les interactions.
- SVG pour les éléments animés, les vecteurs et les connexions.
- Un moteur de calcul pédagogique pour les opérations mathématiques.
- Éventuellement Python pour certains exercices avancés.

L'usage d'un moteur 3D ou d'un véritable grand modèle de langage n'est pas nécessaire pour la première version.

L'objectif n'est pas de reproduire immédiatement un LLM de grande taille, mais de représenter fidèlement les mécanismes essentiels à une échelle compréhensible.

### Architecture conceptuelle

Séparer :

1. Le moteur de scènes et d'animations.
2. Le moteur de calcul.
3. Les contenus pédagogiques.
4. Les exercices et évaluations.
5. Le système de progression.
6. L'éditeur de programmation visuelle, s'il est retenu.

Cette séparation permettrait d'éviter que les animations deviennent indissociables de la logique mathématique.

---

## 10. Première version réalisable — MVP

Il est proposé de commencer par un parcours court et complet.

### Objectif du MVP

Permettre à l'utilisateur de suivre une phrase jusqu'à la génération d'un nouveau token.

### Contenu minimal

1. Saisie d'une phrase.
2. Tokenisation simplifiée ou tokenizer défini.
3. Attribution des identifiants.
4. Recherche des embeddings.
5. Passage dans un modèle pédagogique réduit.
6. Zoom sur un calcul neuronal.
7. Calcul des scores de sortie.
8. Sélection du prochain token.
9. Décodage.
10. Affichage de la nouvelle séquence.

### Exigence essentielle

Privilégier des calculs réellement exécutés plutôt qu'une animation dont tous les résultats seraient prédéfinis.

Lorsqu'une simplification est nécessaire, elle doit être clairement indiquée.

Il peut être pertinent de commencer avec un très petit modèle, un vocabulaire limité et des paramètres contrôlables.

Le MVP n'a pas besoin de générer du texte de qualité comparable à un LLM commercial.

Son objectif est de rendre le mécanisme intelligible.

---

## 11. Principes pédagogiques et scientifiques

Le projet doit respecter plusieurs règles :

- Ne pas confondre token, identifiant et embedding.
- Ne pas confondre une animation illustrative avec un calcul réel.
- Ne pas représenter les Transformers comme une simple chaîne linéaire de neurones.
- Ne pas présenter les probabilités fictives comme des résultats calculés.
- Ne pas laisser croire qu'un vecteur est directement reconverti en mot.
- Ne pas présenter l'attention comme une explication complète du raisonnement.
- Ne pas masquer les simplifications du modèle pédagogique.
- Permettre à l'utilisateur de vérifier les résultats.
- Encourager la manipulation et l'expérimentation.
- Donner accès progressivement aux mathématiques et au code.

L'objectif est de rendre l'IA compréhensible sans transmettre de conceptions erronées.

---

## 12. Distinction entre idées initiales et propositions complémentaires

### Idées exprimées directement par le créateur

- Créer une animation interactive ressemblant à une présentation PowerPoint.
- Ne pas utiliser de simples images fixes.
- Ne pas utiliser une vidéo comme support principal.
- Faire progresser les informations de scène en scène.
- Visualiser le passage dans un tokenizer.
- Montrer la conversion du texte en nombres.
- Visualiser les embeddings.
- Suivre les nombres dans les réseaux neuronaux.
- Zoomer sur un neurone pour comprendre comment il transforme ses entrées.
- Observer le passage dans d'autres unités ou couches.
- Visualiser le retour vers le texte.
- Enseigner la génération prédictive.
- Orienter particulièrement cette expérience vers la compréhension des LLM et de l'IA générative.

### Propositions complémentaires de l'assistant

- Créer un moteur de scènes interactives.
- Ajouter des contrôles de lecture, de pause et de navigation.
- Permettre de modifier les poids et biais d'un neurone.
- Proposer une visualisation des scores d'attention.
- Afficher les logits et les probabilités.
- Ajouter les commandes « Montre-moi les mathématiques » et « Montre-moi le Python ».
- Relier les scènes à l'éditeur visuel par blocs.
- Utiliser SVG et JavaScript pour un premier prototype.
- Construire un modèle jouet effectuant de vrais calculs.
- Développer d'abord un parcours minimal complet.

Ces propositions restent à discuter et ne constituent pas encore des décisions définitives.

---

## 13. Questions ouvertes pour la suite

1. Les scènes doivent-elles fonctionner comme un diaporama linéaire ou permettre une navigation libre dans les composants ?
2. L'utilisateur doit-il pouvoir changer les données d'entrée à tout moment ?
3. Souhaite-t-on visualiser un véritable petit Transformer ou commencer par des calculs neuronaux simplifiés ?
4. Quelle profondeur mathématique proposer à chaque niveau ?
5. Les scènes animées doivent-elles être intégrées aux exercices existants ou constituer un module indépendant ?
6. Comment relier les animations à la programmation visuelle par blocs ?
7. Peut-on faire construire à l'utilisateur un modèle réellement fonctionnel à partir des composants étudiés ?
8. Comment conserver des animations fluides sans rendre l'application trop lourde ?
9. Comment rendre les interactions accessibles au clavier et aux personnes ne pouvant pas utiliser les animations ?
10. Comment tester que les animations correspondent bien aux calculs exécutés ?

---

## 14. Vision à conserver

L'ambition n'est pas seulement de montrer un réseau de neurones ou de faire défiler des nombres à l'écran.

**L'utilisateur doit pouvoir entrer dans le fonctionnement d'un modèle d'intelligence artificielle, observer chaque transformation, manipuler ses mécanismes et comprendre progressivement comment un système génératif produit ses réponses.**

La même expérience doit rester accessible à une personne qui découvre l'informatique et suffisamment rigoureuse pour permettre à un développeur d'approfondir les mécanismes mathématiques et algorithmiques.

Cette partie complète le concept initial du laboratoire pédagogique IA. Elle sera fusionnée ultérieurement avec le document principal pour produire une spécification cohérente et structurée.

# Laboratoire pédagogique IA — Partie 3
## Personnalisation des parcours et interface visuelle dynamique

**Statut :** Concept en cours de réflexion  
**Document :** Suite des parties 1 et 2  
**Thématique :** Personnalisation pédagogique, identité visuelle et séparation entre immersion et rigueur scientifique.

---

## 1. Nouvelle fonctionnalité : choisir ses centres d'intérêt

### Idée initiale

Lors de la première utilisation, l'application pourrait demander :

**« Quels sont tes centres d'intérêt ? »**

L'objectif est d'éviter d'imposer systématiquement les mêmes exemples à tous les utilisateurs.

Une personne intéressée par le football ne devrait pas nécessairement commencer son apprentissage de la tokenisation avec une phrase parlant de dragons.

Inversement, une personne passionnée de fantasy pourrait trouver cet univers particulièrement motivant.

### Exemples de centres d'intérêt

- Fantasy, dragons et univers imaginaires.
- Football et autres sports.
- Astronomie et exploration spatiale.
- Jeux vidéo.
- Sciences et technologies.
- Nature et animaux.
- Musique.
- Vie quotidienne.

Cette liste est indicative et pourra évoluer.

L'utilisateur pourrait sélectionner un ou plusieurs thèmes, ne faire aucun choix ou modifier ses préférences ultérieurement.

La personnalisation doit rester facultative.

---

## 2. Adapter les exemples sans modifier les connaissances enseignées

### Principe fondamental

**Un même concept scientifique doit pouvoir être enseigné à travers plusieurs univers, sans modifier son fonctionnement réel.**

Exemple pour un exercice de tokenisation :

**Thème Fantasy :**

> Le dragon traverse la forêt.

**Thème Astronomie :**

> La fusée traverse l'espace.

**Thème Football :**

> Le joueur marque un but.

Les phrases changent, mais les objectifs pédagogiques restent les mêmes :

1. Comprendre ce qu'est un token.
2. Identifier les frontières entre les tokens.
3. Découvrir que les tokens ne correspondent pas toujours à des mots entiers.
4. Comprendre le rôle d'un tokenizer.
5. Observer la conversion des tokens en identifiants numériques.

Les mécanismes, les exigences scientifiques et les critères de réussite doivent rester cohérents entre les différents thèmes.

### Architecture proposée

Séparer les contenus thématiques des mécanismes pédagogiques.

**Moteur pédagogique :**
- Concepts enseignés.
- Progression.
- Exercices.
- Vérifications.
- Critères de réussite.

**Bibliothèque de contenus thématiques :**
- Phrases.
- Exemples.
- Petits jeux de données.
- Contextes narratifs.
- Illustrations adaptées.

**Préférences utilisateur :**
- Centres d'intérêt.
- Thème visuel.
- Niveau pédagogique.
- Préférences d'accessibilité.

Cette organisation permettrait d'ajouter de nouveaux thèmes sans recréer l'intégralité des exercices.

---

## 3. Personnalisation dynamique de l'interface

### Nouvelle idée exprimée par le créateur

L'application pourrait disposer d'une interface particulièrement soignée, dont l'apparence se transforme dynamiquement selon les préférences de l'utilisateur.

La personnalisation ne concernerait donc plus uniquement les textes et les exercices.

Elle pourrait également modifier les éléments visuels utilisés dans les animations et les diaporamas interactifs.

### Exemples

**Thème Football**

Dans certaines animations, les éléments représentant la circulation des informations pourraient prendre la forme de petits ballons de football.

L'environnement pourrait utiliser des références visuelles discrètes aux terrains, aux trajectoires de passes ou aux tableaux tactiques.

**Thème Astronomie**

Les éléments illustratifs pourraient devenir de petites planètes.

L'interface pourrait évoquer un observatoire ou un environnement spatial.

**Thème Fantasy**

Les informations pourraient être accompagnées de symboles fantastiques, de runes, de dragons miniatures ou d'effets visuels magiques.

### Objectif

Donner à chaque utilisateur l'impression d'évoluer dans un environnement correspondant à ses goûts, tout en conservant une application pédagogique cohérente.

**La personnalisation doit enrichir l'expérience d'apprentissage, et non devenir une source de distraction ou de confusion.**

---

## 4. Limite fondamentale : préserver les mathématiques

### Décision explicitement formulée par le créateur

**Tout ce qui relève des mathématiques pures doit conserver une représentation mathématique claire.**

Il faut éviter de transformer les objets, opérations et notations mathématiques en icônes thématiques.

La raison est pédagogique : remplacer les mathématiques par des symboles décoratifs risque de désorienter l'utilisateur et de rendre les mécanismes plus difficiles à comprendre.

### Exemple

Un ballon de football peut représenter visuellement une information qui se déplace dans une animation.

En revanche, lorsque l'utilisateur examine le calcul réalisé par un neurone, il doit retrouver les véritables éléments mathématiques :

- Variables.
- Nombres.
- Vecteurs.
- Matrices.
- Poids.
- Biais.
- Sommes.
- Multiplications.
- Fonctions d'activation.
- Résultats numériques.

Ces éléments ne doivent pas être remplacés par des ballons, des planètes ou des symboles fantastiques.

### Exemple de calcul conservé

`z = (x₁ × w₁) + (x₂ × w₂) + b`

Puis :

`a = ReLU(z)`

Quel que soit le thème choisi, les expressions mathématiques doivent rester explicites.

Les couleurs, les arrière-plans ou les éléments périphériques peuvent éventuellement varier, mais jamais au détriment de la lisibilité.

---

## 5. Séparation entre immersion et rigueur scientifique

### Règle de conception

**Les thèmes visuels personnalisent l'environnement, les exemples et les transitions. Ils ne modifient ni les calculs, ni les notations, ni les représentations mathématiques nécessaires à la compréhension.**

Cette règle doit s'appliquer à l'ensemble de l'application.

### Trois catégories d'éléments

#### A. Éléments librement personnalisables

- Décors.
- Arrière-plans.
- Illustrations.
- Icônes de navigation.
- Ambiances graphiques.
- Éléments narratifs.
- Transitions non scientifiques.
- Exemples textuels.

#### B. Éléments personnalisables sous conditions

- Représentations visuelles des tokens.
- Animation de circulation des données.
- Schémas pédagogiques.
- Couleurs des connexions.
- Illustrations des étapes d'un pipeline.
- Représentations globales des architectures.

Ces éléments peuvent recevoir un habillage thématique uniquement si leur signification reste immédiatement identifiable.

#### C. Éléments devant conserver une représentation scientifique

- Équations.
- Opérateurs mathématiques.
- Variables et constantes.
- Valeurs numériques.
- Vecteurs et matrices.
- Dimensions.
- Graphiques scientifiques.
- Poids et biais.
- Fonctions d'activation.
- Calculs de probabilités.
- Scores d'attention.
- Résultats intermédiaires.
- Structures de données lorsqu'elles sont étudiées en tant que telles.

La représentation de ces éléments doit rester stable, explicite et rigoureuse.

---

## 6. Transition visuelle vers les calculs

### Proposition complémentaire

Dans les diaporamas interactifs, l'application pourrait effectuer une transition entre l'univers thématique et une zone scientifique neutre.

### Exemple : thème Football

1. Un ballon représente visuellement un élément d'information.
2. Le ballon progresse dans une animation illustrant le parcours des données.
3. L'utilisateur arrive à l'étape du réseau neuronal.
4. L'habillage thématique s'efface progressivement.
5. Les entrées numériques deviennent visibles.
6. Les poids, le biais et les opérations mathématiques apparaissent.
7. L'utilisateur observe et manipule les calculs.
8. Le résultat est affiché numériquement.
9. L'animation reprend éventuellement son habillage thématique pour présenter l'étape suivante.

### Objectif pédagogique

Créer une transition naturelle entre une représentation intuitive et une représentation scientifique.

L'utilisateur doit pouvoir comprendre qu'il s'agit du même processus observé à différents niveaux de détail.

La représentation thématique ne doit jamais se substituer à l'explication réelle.

---

## 7. Deux modes de visualisation complémentaires

### Proposition à étudier

L'application pourrait proposer deux modes de représentation.

#### Vue immersive

Elle privilégie les illustrations thématiques et les animations contextualisées.

Elle est particulièrement adaptée à la découverte et à l'exploration générale.

#### Vue scientifique

Elle privilégie les représentations techniques :

- Données.
- Tokens et identifiants.
- Vecteurs.
- Matrices.
- Équations.
- Graphiques.
- Structures des modèles.
- Calculs intermédiaires.

### Fonctionnement envisagé

L'utilisateur pourrait passer librement d'une vue à l'autre.

Cependant, **la vue immersive ne doit pas masquer ou remplacer les mathématiques lorsqu'elles constituent précisément l'objet de l'apprentissage**.

La vue scientifique doit toujours rester accessible.

Cette distinction complète les trois niveaux pédagogiques déjà envisagés dans la partie 1 : Découverte, Hybride et Code.

Les niveaux pédagogiques déterminent la profondeur des explications ; les vues déterminent leur présentation.

---

## 8. Moteur de thèmes visuels

### Proposition d'architecture

Prévoir un système indépendant chargé de la personnalisation graphique.

Ce moteur pourrait contrôler :

- Les palettes de couleurs.
- Les illustrations.
- Les icônes thématiques.
- Les arrière-plans.
- Certaines animations.
- Les éléments décoratifs.
- Les transitions entre scènes.

Il ne doit pas intervenir dans les calculs scientifiques.

### Séparation des responsabilités

**Moteur scientifique**

Exécute les opérations et produit les résultats.

**Moteur pédagogique**

Organise les apprentissages, les exercices et les explications.

**Moteur de scènes**

Gère les animations, les transitions et les interactions du diaporama.

**Moteur de personnalisation**

Adapte les contenus et l'habillage visuel selon les préférences.

Cette architecture est une proposition de conception, pas encore une décision technique définitive.

---

## 9. Cohérence et accessibilité

La personnalisation doit respecter certaines contraintes.

### Lisibilité

Les couleurs choisies doivent conserver des contrastes suffisants.

Les éléments décoratifs ne doivent pas masquer les informations.

### Stabilité

Un même symbole doit conserver une signification cohérente dans un parcours.

Il faut éviter qu'un ballon représente successivement un token, un neurone et un poids sans distinction explicite.

### Accessibilité

L'utilisateur devrait pouvoir :

- Réduire ou désactiver les animations.
- Désactiver les éléments décoratifs.
- Revenir à un thème neutre.
- Modifier ses préférences.
- Utiliser l'interface au clavier.
- Accéder aux informations sans dépendre uniquement des couleurs.

### Performances

La personnalisation ne doit pas nécessiter de recharger ou de recalculer l'ensemble du modèle scientifique.

Le changement de thème doit essentiellement modifier la présentation.

---

## 10. Éviter l'explosion du périmètre

### Constat

Le projet devient progressivement très ambitieux.

Il comprend désormais :

- Une plateforme d'apprentissage de l'intelligence artificielle.
- Plusieurs niveaux pédagogiques.
- Des exercices interactifs.
- Une programmation visuelle par blocs.
- Un laboratoire d'expérimentation.
- Un parcours animé à travers un LLM.
- Des visualisations mathématiques.
- Une personnalisation des contenus.
- Une personnalisation graphique dynamique.

Il est donc important de distinguer la vision finale des fonctionnalités nécessaires à une première version.

### Proposition pour une première implémentation

Commencer avec :

1. Un thème graphique neutre.
2. Deux ou trois thèmes facultatifs.
3. Un seul parcours pédagogique complet.
4. Quelques phrases adaptées aux thèmes.
5. Une animation interactive de tokenisation.
6. Une visualisation mathématique identique pour tous les thèmes.
7. Un changement de thème sans modification des calculs.

La création de nombreux univers visuels détaillés pourra intervenir ultérieurement.

**Il faut concevoir l'architecture pour accueillir la personnalisation sans chercher à réaliser tous les thèmes dès le départ.**

---

## 11. Décisions, idées et propositions

### Idées exprimées directement par le créateur

- Proposer un choix des centres d'intérêt au démarrage.
- Adapter les exemples aux préférences des utilisateurs.
- Créer une interface visuellement soignée.
- Faire évoluer dynamiquement l'apparence de l'application selon les préférences.
- Remplacer certains éléments illustratifs par des objets thématiques, comme des ballons de football ou de petites planètes.
- Préserver une représentation mathématique explicite.
- Éviter de transformer les mathématiques pures en icônes, car cela risque de perdre l'utilisateur.

### Propositions complémentaires de l'assistant

- Rendre la personnalisation facultative.
- Permettre plusieurs centres d'intérêt.
- Séparer les contenus thématiques des mécanismes pédagogiques.
- Concevoir un moteur de thèmes indépendant.
- Définir plusieurs catégories d'éléments selon leur degré de personnalisation autorisé.
- Prévoir une transition vers une présentation scientifique neutre lors des calculs.
- Étudier des vues immersive et scientifique.
- Prévoir un thème neutre et des options d'accessibilité.
- Commencer avec un nombre limité de thèmes pour le MVP.

---

## 12. Questions ouvertes

1. Combien de centres d'intérêt proposer initialement ?
2. L'utilisateur peut-il en choisir plusieurs ?
3. Comment gérer un exercice qui ne possède pas d'exemple adapté au thème sélectionné ?
4. Les thèmes visuels doivent-ils concerner toute l'application ou principalement les scènes interactives ?
5. Jusqu'où personnaliser les schémas sans nuire à leur compréhension ?
6. Faut-il changer automatiquement de présentation lors de l'entrée dans une zone mathématique ?
7. Les vues immersive et scientifique doivent-elles être accessibles en permanence ?
8. Comment garantir la cohérence des symboles à travers plusieurs chapitres ?
9. Quels éléments de personnalisation intégrer dès le MVP ?
10. Comment mesurer si un thème améliore réellement la compréhension plutôt que seulement l'engagement ?

---

## 13. Principe directeur à conserver

**L'application doit s'adapter à l'univers de l'utilisateur sans déformer les connaissances qu'elle transmet.**

Les thèmes personnalisent la découverte, l'environnement et les exemples.

Les mathématiques, les données et les mécanismes scientifiques conservent leur représentation explicite.

L'immersion doit faciliter l'entrée dans le sujet ; la rigueur doit permettre d'en comprendre réellement le fonctionnement.

Cette partie complète les deux documents précédents et devra être intégrée à la future spécification générale du laboratoire pédagogique IA.

# Laboratoire pédagogique IA — Partie 4
## Parcours Développeur : construire réellement une intelligence artificielle

**Statut :** Concept en cours de définition  
**Document :** Suite des parties 1, 2 et 3  
**Thématique :** Programmation Python, construction de réseaux neuronaux, environnement de développement et apprentissage comparatif avec NumPy et PyTorch.

---

## 1. Objectif final de l'application

L'application doit permettre à deux catégories d'utilisateurs de construire une intelligence artificielle ou une partie fonctionnelle d'un réseau neuronal.

### Parcours Découverte

Destiné aux personnes n'ayant jamais programmé ou étudié le fonctionnement de l'intelligence artificielle.

L'utilisateur construit des systèmes en assemblant des composants visuels.

Les blocs représentent des opérations ou des mécanismes réels, mais leur utilisation ne nécessite pas de programmation textuelle.

### Parcours Développeur

Destiné aux personnes souhaitant comprendre et implémenter les mécanismes réels de l'intelligence artificielle.

Ce parcours repose sur la programmation Python, les opérations mathématiques et la construction progressive de modèles.

**Les deux parcours poursuivent un objectif commun : permettre à l'utilisateur de construire un système fonctionnel, et pas seulement de regarder des démonstrations.**

Le parcours Développeur n'est pas simplement une version plus difficile du parcours Découverte.

Il propose une autre méthode de construction, fondée sur le code.

---

## 2. Philosophie du parcours Développeur

### Principe exprimé par le créateur

Le parcours doit permettre de rentrer « dans le dur ».

Cette expression ne signifie pas que les exercices doivent être inutilement complexes.

Elle signifie que les utilisateurs doivent travailler sur les véritables mécanismes et outils de développement.

### Conséquences pédagogiques

- Utiliser du véritable Python.
- Manipuler des données réelles ou des jeux de données pédagogiques clairement identifiés.
- Exécuter de vrais calculs.
- Programmer des fonctions et des classes.
- Construire des réseaux neuronaux fonctionnels.
- Comprendre les opérations mathématiques.
- Observer les résultats de son propre code.
- Tester et corriger ses implémentations.
- Découvrir progressivement les outils utilisés dans le développement de modèles d'IA.

La complexité doit augmenter progressivement, sans sacrifier l'authenticité des mécanismes étudiés.

**L'objectif n'est pas de simuler la programmation d'une IA, mais de permettre à l'apprenant d'en programmer réellement une.**

---

## 3. Concept central : le « giga exercice »

### Idée exprimée par le créateur

Proposer un très grand exercice de programmation, décomposé en nombreuses étapes.

L'utilisateur commence avec un éditeur Python vide.

À chaque étape, il reçoit un objectif pédagogique et développe une nouvelle partie de son intelligence artificielle.

Le code construit précédemment est conservé et réutilisé.

### Fonctionnement général

1. L'utilisateur démarre un nouveau projet.
2. Un environnement Python est préparé.
3. L'éditeur s'ouvre sur un fichier vide.
4. Une première consigne est affichée.
5. L'utilisateur écrit son propre code.
6. Il peut exécuter son programme.
7. Il examine les résultats et les erreurs.
8. Des tests permettent de vérifier son implémentation.
9. Une fois l'étape terminée, il accède à la suivante.
10. Le projet s'enrichit progressivement jusqu'à devenir un système d'IA fonctionnel.

### Principe de continuité

Les exercices ne doivent pas systématiquement repartir de zéro.

L'apprenant développe un véritable projet qui évolue avec sa progression.

Cela permet également d'enseigner :

- L'organisation des fichiers.
- La modularité.
- La réutilisation des fonctions.
- La programmation orientée objet.
- La maintenance du code.
- Les tests.
- Le débogage.
- La documentation.
- Les dépendances.
- La gestion de versions, éventuellement.

Ces compétences doivent être introduites lorsqu'elles deviennent utiles au projet, plutôt que comme des obstacles préalables.

---

## 4. Un véritable environnement de développement Python

### Exigence exprimée par le créateur

L'environnement de programmation doit proposer les fonctionnalités d'un éditeur de code.

Il ne doit pas se limiter à une zone de texte rudimentaire.

### Fonctionnalités envisagées

**Édition du code**
- Coloration syntaxique.
- Indentation automatique.
- Numérotation des lignes.
- Autocomplétion.
- Gestion des parenthèses et des guillemets.
- Recherche dans le code.
- Annulation et rétablissement.
- Gestion de plusieurs fichiers.

**Exécution**
- Bouton d'exécution.
- Console intégrée.
- Affichage de la sortie standard.
- Affichage des exceptions.
- Messages d'erreur compréhensibles.
- Arrêt d'une exécution.
- Limites de temps et de ressources.

**Développement**
- Tests automatisés.
- Indices pédagogiques.
- Documentation intégrée.
- Visualisation des variables.
- Débogage pas à pas, si techniquement réalisable.
- Sauvegarde de la progression.
- Conservation des différentes versions du projet.

### Sécurité

L'exécution de code Python utilisateur nécessite une isolation adaptée.

La conception devra notamment prendre en compte :

- L'accès au système de fichiers.
- Les accès réseau.
- Les processus.
- Les dépendances.
- Les limites de mémoire.
- Les limites de calcul.
- Les interruptions.
- La séparation entre utilisateurs.

Le choix d'un environnement local, d'une exécution dans le navigateur ou d'une infrastructure distante reste à déterminer.

---

## 5. NumPy et PyTorch disponibles nativement

### Décision exprimée par le créateur

**Les deux bibliothèques doivent être disponibles dès le départ dans l'environnement de développement :**

- NumPy.
- PyTorch.

L'utilisateur ne doit pas être obligé de les installer manuellement avant de commencer les exercices.

### Précision d'implémentation

Les bibliothèques doivent être préinstallées et directement utilisables dans l'environnement pédagogique.

Les imports peuvent être fournis automatiquement dans les exercices guidés :

```python
import numpy as np
import torch
```

Dans un projet Python autonome, il pourra également être utile d'apprendre à gérer explicitement les imports et les dépendances.

### Distinction importante

**La disponibilité de PyTorch ne signifie pas que son utilisation est autorisée dans tous les exercices.**

L'application doit proposer deux approches d'implémentation distinctes.

---

## 6. Deux modes : sans PyTorch et avec PyTorch

### Mode A — Sans PyTorch

L'utilisateur travaille avec Python et NumPy.

Il doit programmer lui-même les mécanismes fondamentaux du réseau neuronal.

Selon l'étape, cela peut comprendre :

- La création des vecteurs et matrices.
- Les produits scalaires.
- Les produits matriciels.
- Les poids.
- Les biais.
- Les fonctions d'activation.
- La propagation avant.
- Les fonctions de perte.
- Le calcul des gradients.
- La rétropropagation.
- La mise à jour des paramètres.
- Les boucles d'entraînement.

### Objectif

Comprendre les opérations réalisées à l'intérieur d'un réseau neuronal.

L'utilisation de NumPy permet d'effectuer les calculs numériques sans masquer les mécanismes spécifiques à l'apprentissage neuronal.

### Mode B — Avec PyTorch

L'utilisateur réalise un objectif scientifique comparable en utilisant les fonctionnalités de PyTorch.

Selon l'étape, cela peut comprendre :

- Les tenseurs PyTorch.
- Les opérations différentiables.
- La différentiation automatique.
- `autograd`.
- Les modules de réseaux neuronaux.
- Les fonctions de perte.
- Les optimiseurs.
- Les boucles d'entraînement.
- La sauvegarde et le chargement des paramètres.
- L'utilisation éventuelle d'accélérateurs matériels.

### Objectif

Apprendre à construire et entraîner des modèles avec les outils spécialisés du deep learning.

L'utilisateur doit comprendre ce que PyTorch automatise et ce qui reste sous sa responsabilité.

---

## 7. Même objectif, deux implémentations

### Principe de fonctionnement

Un exercice peut proposer deux méthodes de réalisation :

**Sans PyTorch :** implémentation manuelle avec Python et NumPy.

**Avec PyTorch :** implémentation utilisant les outils de PyTorch.

Les deux approches doivent viser des résultats comparables.

### Exemple : construire un neurone

**Version sans PyTorch**

L'utilisateur doit :
1. Créer un vecteur d'entrées.
2. Définir les poids.
3. Définir le biais.
4. Calculer la somme pondérée.
5. Appliquer une fonction d'activation.
6. Retourner le résultat.

**Version avec PyTorch**

L'utilisateur doit :
1. Créer les tenseurs nécessaires.
2. Définir les paramètres.
3. Effectuer le calcul.
4. Appliquer une activation.
5. Vérifier le résultat.
6. Explorer éventuellement le calcul automatique des gradients.

### Comparaison pédagogique

Lorsque les deux implémentations sont terminées, l'application pourrait comparer :

- Les sorties numériques.
- Les dimensions des tenseurs.
- Les gradients.
- Les paramètres.
- Les fonctions de perte.
- Les résultats d'entraînement.
- Les différences d'implémentation.

Les comparaisons devront utiliser les mêmes données, les mêmes paramètres et des conditions compatibles.

---

## 8. Séparation des espaces de travail

### Proposition complémentaire

Les deux modes devraient disposer d'espaces de travail indépendants.

Exemple de structure conceptuelle :

```text
mon_projet_ia/
│
├── numpy/
│   ├── neuron.py
│   ├── network.py
│   └── training.py
│
├── pytorch/
│   ├── neuron.py
│   ├── network.py
│   └── training.py
│
└── tests/
```

Cette structure est illustrative et non définitive.

### Objectifs

- Préserver les deux implémentations.
- Éviter les écrasements accidentels.
- Permettre de passer d'un mode à l'autre.
- Faciliter les comparaisons.
- Autoriser une progression indépendante.

L'utilisateur pourrait terminer la version NumPy avant de commencer la version PyTorch, ou alterner entre les deux selon les règles pédagogiques retenues.

---

## 9. Vérification des contraintes des exercices

### Exemple

Un exercice demande :

> Implémente la rétropropagation avec NumPy, sans utiliser PyTorch.

L'application doit pouvoir vérifier :

1. Que le code fonctionne.
2. Que les résultats sont corrects.
3. Que les contraintes de l'exercice sont respectées.

### Vérifications envisageables

- Tests unitaires.
- Tests sur plusieurs entrées.
- Vérification des dimensions.
- Comparaison avec des résultats de référence.
- Vérification numérique des gradients.
- Analyse de certaines constructions du code.
- Contrôle des bibliothèques ou fonctionnalités interdites.

### Limite à anticiper

Une simple recherche de la chaîne `torch` dans le code ne constitue pas un contrôle fiable.

De même, les tests fonctionnels ne prouvent pas à eux seuls que l'apprenant a respecté toutes les contraintes de méthode.

Il faudra combiner plusieurs mécanismes de validation, sans prétendre pouvoir déduire automatiquement une compréhension réelle à partir du seul code exécuté.

---

## 10. Proposition de progression du giga exercice

### Projet A — Construire un réseau neuronal

**Étape 1 : Préparation des données**
- Charger un jeu de données.
- Comprendre les entrées et les sorties.
- Examiner les dimensions.
- Préparer les données pour l'entraînement.

**Étape 2 : Premier neurone**
- Implémenter les poids et le biais.
- Programmer le calcul d'une sortie.
- Tester différentes entrées.

**Étape 3 : Fonctions d'activation**
- Comprendre leur utilité.
- Implémenter plusieurs fonctions.
- Visualiser leur influence.

**Étape 4 : Première couche**
- Construire plusieurs neurones.
- Manipuler les matrices.
- Vérifier les dimensions.

**Étape 5 : Réseau multicouche**
- Assembler les couches.
- Programmer la propagation avant.
- Observer les activations intermédiaires.

**Étape 6 : Fonction de perte**
- Comparer prédictions et valeurs attendues.
- Calculer l'erreur.
- Comprendre le rôle de l'objectif d'entraînement.

**Étape 7 : Gradients**
- Comprendre la dérivation.
- Calculer les gradients nécessaires.
- Vérifier les résultats.

**Étape 8 : Rétropropagation**
- Propager les gradients.
- Comprendre la règle de la chaîne.
- Identifier l'influence des paramètres.

**Étape 9 : Entraînement**
- Mettre à jour les poids.
- Définir un taux d'apprentissage.
- Observer l'évolution de la perte.

**Étape 10 : Évaluation**
- Tester le réseau sur des données non vues.
- Analyser ses erreurs.
- Mesurer ses performances.

**Étape 11 : Implémentation PyTorch**
- Reproduire le modèle.
- Utiliser la différentiation automatique.
- Comparer les résultats.

**Étape 12 : Projet final**
- Entraîner un petit réseau neuronal fonctionnel.
- Réaliser des prédictions.
- Visualiser son fonctionnement.
- Présenter et expliquer son architecture.

Cette progression est une proposition initiale, à adapter selon le niveau des apprenants.

---

## 11. Projet avancé : construire un mini-modèle de langage

Après le premier réseau neuronal, un second grand projet pourrait être proposé.

### Objectif

Construire progressivement un petit modèle capable de prédire des tokens.

### Étapes envisageables

1. Préparer un corpus.
2. Construire un tokenizer pédagogique.
3. Créer un vocabulaire.
4. Encoder les textes en identifiants.
5. Construire une table d'embeddings.
6. Ajouter les informations de position.
7. Implémenter les mécanismes d'attention.
8. Construire un petit bloc Transformer.
9. Calculer les scores de sortie.
10. Définir une fonction de perte.
11. Entraîner le modèle.
12. Générer des tokens.
13. Décoder la séquence.
14. Évaluer les résultats.
15. Comparer les approches NumPy et PyTorch lorsque cela est pertinent.

### Précision

Ce projet vise un modèle de langage réduit à vocation pédagogique.

Il ne cherche pas à reproduire les performances ou les dimensions d'un LLM commercial.

L'entraînement d'un Transformer entièrement avec NumPy pourrait être coûteux et complexe ; le périmètre du projet devra être adapté aux ressources disponibles.

---

## 12. Connexion avec les animations scientifiques

### Proposition complémentaire

Le code de l'utilisateur pourrait alimenter les visualisations interactives imaginées dans la partie 2.

Par exemple :

1. L'utilisateur programme un neurone.
2. Il exécute son code.
3. L'application récupère les entrées, poids, biais et sorties.
4. Il ouvre une vue interactive.
5. Il observe les valeurs réellement produites par son implémentation.

### Visualisations possibles

- Architecture du réseau.
- Poids et biais.
- Activations.
- Propagation avant.
- Gradients.
- Évolution de la fonction de perte.
- Résultats des prédictions.
- Matrices d'attention pour les modèles compatibles.

### Principe

**La visualisation doit représenter les données réellement calculées par le programme de l'utilisateur, et non des valeurs fictives.**

Cela permettrait de relier directement l'apprentissage par programmation à l'apprentissage visuel.

L'intégration technique reste à concevoir.

---

## 13. Accompagnement pédagogique

Le parcours Développeur doit rester progressif malgré l'authenticité des exercices.

### Outils envisagés

- Consignes détaillées.
- Objectifs intermédiaires.
- Rappels théoriques.
- Documentation Python.
- Documentation NumPy.
- Documentation PyTorch.
- Indices graduels.
- Tests automatisés.
- Explications des erreurs.
- Visualisations.
- Comparaisons entre implémentations.

### Principe d'autonomie

L'application doit encourager l'utilisateur à écrire et comprendre son propre code.

Les aides peuvent expliquer un concept ou orienter vers une piste de résolution.

Elles ne doivent pas systématiquement fournir la solution complète.

L'utilisateur doit pouvoir progresser en expérimentant, en commettant des erreurs et en les corrigeant.

---

## 14. Décisions et propositions

### Décisions exprimées par le créateur

- Prévoir un parcours Développeur distinct du parcours Découverte.
- Permettre aux deux types d'utilisateurs de construire une IA ou une partie de réseau neuronal.
- Utiliser de véritables mécanismes et outils de programmation.
- Proposer un grand exercice continu, découpé en étapes.
- Commencer avec un éditeur Python vide.
- Fournir les fonctionnalités d'un véritable éditeur de code.
- Permettre de construire progressivement une IA.
- Rendre NumPy disponible nativement.
- Rendre PyTorch disponible nativement.
- Proposer une utilisation séparée avec PyTorch et sans PyTorch.

### Propositions complémentaires de l'assistant

- Prévoir des espaces de travail distincts pour les deux approches.
- Comparer les résultats NumPy et PyTorch.
- Utiliser PyTorch pour vérifier certains gradients.
- Ajouter des tests unitaires et des contraintes de méthode.
- Organiser le parcours autour d'un premier réseau neuronal puis d'un mini-modèle de langage.
- Connecter le code utilisateur aux animations scientifiques.
- Prévoir une exécution Python isolée.
- Introduire progressivement les outils de développement professionnels.

Ces propositions restent à valider.

---

## 15. Questions ouvertes

1. Les deux approches, NumPy et PyTorch, doivent-elles être proposées dès le premier exercice ou seulement à partir de certaines étapes ?
2. L'utilisateur peut-il commencer directement avec PyTorch ?
3. Les deux implémentations doivent-elles être obligatoires pour terminer un projet ?
4. Faut-il proposer des projets intermédiaires avant le giga exercice ?
5. Le code doit-il être exécuté localement, dans le navigateur ou sur un serveur ?
6. Comment sécuriser l'exécution des programmes ?
7. Comment conserver les projets et la progression ?
8. Quels outils de débogage intégrer ?
9. Comment relier le code utilisateur aux animations sans imposer une structure trop rigide ?
10. Comment organiser les tests sans empêcher les solutions alternatives valides ?
11. Comment gérer les dépendances et les versions de NumPy et PyTorch ?
12. Quels modèles peuvent être entraînés avec des ressources informatiques modestes ?

---

## 16. Vision à conserver

**Le parcours Développeur doit permettre de passer de la compréhension théorique à la construction réelle d'un système d'intelligence artificielle.**

L'utilisateur part d'un environnement Python et développe progressivement son modèle.

Il apprend d'abord à comprendre les opérations, puis à les assembler, à les entraîner, à les tester et à les améliorer.

NumPy et PyTorch sont disponibles nativement, mais utilisés dans deux approches distinctes afin de permettre à la fois la compréhension des mécanismes fondamentaux et la découverte des outils spécialisés du deep learning.

L'ambition est de proposer une expérience de développement authentique, progressive et vérifiable.

Cette partie complète les trois documents précédents et sera intégrée ultérieurement à la spécification générale du laboratoire pédagogique IA.

# Les idées à la con d'Alex

## Idée n° 1 — « Explique-moi ce qu'est une IA »
### Révision : mini-exercice de restitution sous forme de diaporama visuel

**Statut :** Concept précisé par le créateur.

**Nature :** Mini-exercice pédagogique utilisant un véritable éditeur visuel de diapositives simplifié.

**Public :** Parcours Découverte et parcours Développeur.

**Objectif principal :** Permettre à l'utilisateur de reconstruire et réexpliquer les mécanismes fondamentaux de l'intelligence artificielle.

---

### 1. Intention pédagogique

L'exercice repose sur un principe important de la mémorisation : être capable de récupérer, organiser et reformuler les connaissances que l'on vient d'acquérir.

L'utilisateur ne doit pas uniquement reconnaître les concepts lorsqu'ils lui sont présentés.

Il doit pouvoir retrouver leur rôle, leur organisation et leurs relations.

L'exercice mobilise notamment :

- Le rappel actif (*retrieval practice*).
- La restitution des connaissances.
- L'organisation hiérarchique des concepts.
- La reformulation.
- La construction de représentations mentales cohérentes.

**Le diaporama n'est pas la finalité : il sert de support visuel à la restitution des connaissances.**

---

### 2. Un véritable mini-diaporama

L'utilisateur doit pouvoir créer plusieurs diapositives, par exemple six ou sept, sans nombre définitivement imposé.

Chaque diapositive est une surface visuelle libre.

L'interface s'inspire des principes de PowerPoint, mais ne cherche pas à reproduire l'ensemble de ses fonctionnalités.

L'utilisateur peut construire une présentation complète en plaçant et en organisant des éléments graphiques.

Contrairement à un simple exercice de classement, les concepts ne sont pas limités à une liste verticale.

Ils peuvent être disposés librement dans l'espace.

**Exigence confirmée : le résultat doit être un diaporama visuel composé de plusieurs diapositives, et non une liste de lignes à déplacer.**

---

### 3. Interface de création

L'éditeur pourrait comprendre trois zones principales.

**Panneau latéral gauche — Diapositives**

- Affichage des miniatures.
- Ajout d'une diapositive.
- Suppression.
- Réorganisation.
- Navigation entre les pages.

**Zone centrale — Diapositive**

- Surface de création vierge.
- Déplacement libre des éléments.
- Redimensionnement.
- Organisation spatiale.
- Création de connexions.
- Affichage des concepts.

**Panneau latéral droit — Bibliothèque visuelle**

- Illustrations de données.
- Neurones.
- Réseaux neuronaux.
- Couches.
- Matrices.
- Tokens.
- Embeddings.
- Flèches.
- Symboles.
- Composants scientifiques adaptés au chapitre.

Cette disposition est une proposition d'interface, non une obligation architecturale.

---

### 4. Manipulation des éléments

L'utilisateur doit pouvoir :

1. Sélectionner un concept.
2. Le glisser sur une diapositive.
3. Le repositionner librement.
4. Modifier sa taille.
5. Le relier à un autre élément.
6. Réorganiser la disposition.
7. Passer à une autre diapositive.
8. Revenir modifier une diapositive précédente.

Les éléments doivent être visuels.

Par exemple, un neurone peut être représenté par un symbole graphique identifiable.

Un réseau peut être représenté par plusieurs neurones reliés.

Une donnée peut être représentée par une carte ou un bloc illustré.

Une connexion peut être représentée par une flèche.

L'utilisateur doit pouvoir produire un schéma cohérent sans devoir rédiger de longues explications.

---

### 5. Exemple de diaporama

**Consigne :**

« Explique visuellement comment construire et entraîner un petit réseau neuronal. »

L'utilisateur pourrait créer une présentation composée de plusieurs étapes.

**Diapositive 1 — Les données**

Représenter des données qui seront utilisées par le modèle.

**Diapositive 2 — L'architecture**

Placer les entrées, les neurones, les couches et les sorties.

**Diapositive 3 — La propagation avant**

Représenter la circulation des informations et le calcul d'une prédiction.

**Diapositive 4 — La fonction de perte**

Montrer la comparaison entre une prédiction et la valeur attendue.

**Diapositive 5 — Les gradients**

Représenter les mécanismes nécessaires au calcul des ajustements des paramètres.

**Diapositive 6 — L'entraînement**

Illustrer la mise à jour des paramètres et la répétition de la boucle d'apprentissage.

**Diapositive 7 — L'évaluation**

Montrer comment le modèle est testé sur des données non utilisées pendant l'entraînement.

Cette structure est un exemple pédagogique et non un modèle obligatoire à reproduire.

L'utilisateur doit pouvoir choisir sa propre organisation, dans la mesure où elle reste scientifiquement cohérente.

---

### 6. Hiérarchie des concepts

L'exercice ne doit pas uniquement vérifier un ordre chronologique.

L'utilisateur doit également comprendre les relations entre les concepts.

Exemples :

- Un réseau neuronal contient des couches.
- Une couche peut contenir plusieurs neurones.
- Les neurones manipulent des valeurs numériques.
- Les poids et biais sont des paramètres du modèle.
- La fonction de perte mesure une erreur selon un objectif défini.
- Les gradients interviennent dans l'optimisation.
- L'entraînement modifie les paramètres.
- L'inférence utilise le modèle pour produire des résultats.

Les diapositives doivent permettre de représenter ces relations de manière spatiale et graphique.

Certaines notions peuvent être présentées sur une même diapositive, tandis que d'autres nécessitent plusieurs pages.

---

### 7. Liberté de création et simplicité

Le système doit permettre une véritable composition visuelle sans devenir un logiciel de présentation généraliste.

Les fonctionnalités essentielles sont :

- Plusieurs diapositives.
- Des éléments graphiques.
- Le glisser-déposer.
- Le positionnement libre.
- Le redimensionnement.
- Les connexions.
- La navigation entre les diapositives.
- La validation pédagogique.

Les fonctionnalités avancées de PowerPoint ne sont pas nécessaires à l'objectif initial.

Il n'est notamment pas indispensable de proposer :

- Des transitions complexes.
- Des animations personnalisées.
- Des centaines de polices.
- Des effets graphiques sophistiqués.
- Un moteur complet de mise en page.
- Des outils de présentation professionnels.

L'éditeur doit être suffisamment libre pour permettre la restitution des connaissances, mais suffisamment simple pour rester un mini-exercice.

---

### 8. Validation pédagogique

La validation doit examiner les concepts représentés et leurs relations.

Elle ne doit pas juger principalement la qualité esthétique de la présentation.

Critères envisageables :

- Concepts essentiels présents.
- Hiérarchie cohérente.
- Relations scientifiques correctes.
- Enchaînement logique des mécanismes.
- Absence de contradictions importantes.
- Distinction entre entraînement et inférence lorsque nécessaire.

L'application doit accepter plusieurs organisations valides.

Une diapositive ne doit pas être considérée comme incorrecte simplement parce qu'un neurone se trouve à gauche plutôt qu'à droite.

**L'organisation graphique est libre ; les relations scientifiques doivent rester exactes.**

---

### 9. Différents niveaux d'assistance

L'exercice pourrait adapter la quantité d'aide disponible.

**Mode guidé**

Tous les concepts nécessaires sont proposés dans la bibliothèque visuelle.

L'utilisateur doit les sélectionner et les organiser.

**Mode semi-guidé**

Certains concepts sont fournis, mais l'utilisateur doit retrouver les éléments manquants.

**Mode autonome**

L'utilisateur construit son schéma avec une bibliothèque générale et un minimum d'indices.

Ces niveaux constituent des propositions complémentaires.

Ils ne doivent pas transformer le mini-exercice en un cursus indépendant.

---

### 10. Personnalisation visuelle

L'exercice doit rester compatible avec les thèmes de personnalisation définis précédemment.

Les illustrations et exemples peuvent varier selon les centres d'intérêt de l'utilisateur.

Cependant, les représentations scientifiques doivent conserver leur exactitude.

Les nombres, vecteurs, matrices, opérateurs et équations ne doivent pas être remplacés par des icônes décoratives lorsqu'ils sont nécessaires à la compréhension.

**Le thème change l'apparence des illustrations, jamais les mécanismes scientifiques.**

---

### 11. Place dans le parcours pédagogique

Cet exercice peut être proposé :

- À la fin d'un chapitre important.
- Après plusieurs notions liées.
- Avant un projet pratique.
- Après la construction d'un réseau neuronal.
- Lors d'une séance de révision.

Il peut également être répété après un certain délai pour favoriser la récupération des connaissances en mémoire.

L'exercice doit rester facultativement court, même lorsque plusieurs diapositives sont utilisées.

L'utilisateur ne doit pas avoir besoin de consacrer une heure à la création d'une présentation esthétique pour valider quelques concepts.

---

### 12. Différence avec les animations explicatives

L'application comporte désormais deux usages distincts du principe de diaporama.

**Diaporama explicatif de l'application**

L'application présente des animations interactives pour enseigner le fonctionnement de l'IA.

L'utilisateur observe, manipule et explore les mécanismes.

**Diaporama construit par l'utilisateur**

L'utilisateur crée lui-même une représentation visuelle des mécanismes appris.

Il doit retrouver les concepts, les organiser et montrer qu'il comprend leurs relations.

Ces deux fonctionnalités peuvent partager des composants graphiques, mais elles répondent à des objectifs pédagogiques différents.

---

### 13. Décisions confirmées par le créateur

- Conserver la section « Les idées à la con d'Alex ».
- Créer un exercice intitulé « Explique-moi ce qu'est une IA ».
- Faire de cet exercice un mini-exercice de restitution.
- Utiliser un véritable diaporama visuel.
- Permettre plusieurs diapositives, par exemple six ou sept.
- Proposer une interface simplifiée inspirée de PowerPoint.
- Permettre le glisser-déposer de concepts illustrés.
- Permettre une organisation libre des concepts.
- Évaluer prioritairement la hiérarchie et les relations entre les idées.
- Ne pas imposer la rédaction d'une présentation complète.
- Utiliser cet exercice pour renforcer la mémorisation par la restitution des connaissances.

### 14. Propositions complémentaires à valider

- Plusieurs niveaux d'assistance.
- Connexions graphiques entre les concepts.
- Vérification automatique des relations.
- Bibliothèque visuelle adaptée aux chapitres.
- Réutilisation des illustrations du moteur de scènes.
- Répétition de l'exercice lors de révisions.
- Conservation des présentations précédentes pour comparer la progression.

---

### Principe fondateur

**« Si tu as compris ce que tu viens d'apprendre, tu dois pouvoir en reconstruire les concepts essentiels et expliquer comment ils s'articulent. »**

Le mini-diaporama doit transformer cette idée en une expérience interactive, visuelle et accessible.

Il ne s'agit pas d'apprendre à utiliser PowerPoint.

Il s'agit d'apprendre à organiser, retrouver et réexpliquer les connaissances nécessaires à la compréhension de l'intelligence artificielle.

# Laboratoire pédagogique IA — Partie 6
## Clarification des parcours, socle mathématique et objectifs de réalisation

**Statut :** Complément au cahier des charges conceptuel  
**Date :** 15 octobre 2026  
**Périmètre :** Fonctionnement pédagogique, objectifs d'apprentissage et fonctionnalités attendues  
**Architecture technique :** Non définie — à discuter séparément

---

## 1. Clarification fondamentale du projet

Le laboratoire pédagogique IA doit permettre à différents profils d'utilisateurs de comprendre comment fonctionne l'intelligence artificielle et d'en construire une représentation ou une implémentation.

Deux parcours principaux sont prévus :

1. Le parcours Découverte, destiné aux personnes qui ne savent pas programmer.
2. Le parcours Développeur, destiné aux personnes souhaitant construire des modèles avec du véritable code Python.

Ces deux parcours poursuivent un objectif pédagogique commun, mais **ne sont pas soumis aux mêmes exigences techniques**.

Le parcours Découverte privilégie la compréhension des mécanismes par manipulation de composants visuels.

Le parcours Développeur privilégie l'implémentation effective des mécanismes étudiés.

L'application doit expliquer clairement cette distinction.

---

## 2. Parcours Découverte — Construire sans programmer

### 2.1. Public visé

Ce parcours s'adresse notamment :

- Aux personnes n'ayant jamais programmé.
- Aux personnes découvrant l'intelligence artificielle.
- Aux utilisateurs souhaitant comprendre les mécanismes généraux sans apprendre immédiatement Python.
- Aux personnes préférant une approche visuelle et interactive.

Aucune connaissance préalable en programmation ne doit être nécessaire.

### 2.2. Objectif

Permettre à l'utilisateur de comprendre comment différents composants peuvent être assemblés pour constituer un système d'intelligence artificielle.

L'apprentissage passe par :

- La manipulation.
- L'observation.
- L'expérimentation.
- La construction visuelle.
- La compréhension des relations entre concepts.
- La restitution des connaissances.

### 2.3. Construction à partir de composants préconfigurés

L'utilisateur doit pouvoir assembler des éléments graphiques représentant différents mécanismes.

Ces composants peuvent être préconfigurés.

Ils ne nécessitent pas obligatoirement l'exécution d'un véritable modèle d'apprentissage automatique.

Les composants pourraient représenter :

- Une entrée utilisateur.
- Un texte.
- Un traitement.
- Une étape de classification.
- Un ensemble de données.
- Une représentation de réseau neuronal.
- Une décision.
- Une sortie.
- Une réponse.

Le système doit permettre de relier visuellement ces éléments.

### 2.4. Utilisation de scénarios préécrits

**Décision exprimée par le créateur :**

Le résultat final d'un exercice visuel peut être entièrement prédéfini.

Il n'est pas obligatoire qu'une IA génère effectivement la réponse.

Le scénario peut utiliser des textes, des données et des résultats écrits à l'avance.

Cette approche permet de privilégier la compréhension de la structure d'un système plutôt que la complexité de son exécution.

### 2.5. Exemple : scénario consacré au voyage

Un utilisateur sélectionne le voyage comme centre d'intérêt.

L'application lui propose de construire visuellement un système répondant à une demande.

**Entrée prédéfinie :**

> Donne-moi 5 destinations où voyager demain.

L'utilisateur assemble les composants nécessaires pour représenter le traitement de cette demande.

La sortie pourrait contenir cinq destinations prédéfinies :

1. Italie.
2. Japon.
3. Portugal.
4. Canada.
5. Grèce.

Ces destinations sont des exemples fixes.

Elles ne sont pas produites par un modèle génératif.

Elles ne constituent pas des recommandations actualisées selon la météo, les transports ou les conditions de voyage.

Le rôle de l'utilisateur consiste à reconstruire une organisation conceptuelle cohérente.

### 2.6. Nature du système obtenu

Dans ce type d'exercice, l'utilisateur construit une **simulation pédagogique interactive**.

Le système peut présenter visuellement les étapes d'un traitement sans réellement effectuer toutes les opérations représentées.

Il ne faut pas présenter une réponse écrite en dur comme le résultat d'un apprentissage automatique ou d'une génération par modèle de langage.

L'application doit distinguer :

- Les éléments simulés.
- Les éléments préconfigurés.
- Les opérations réellement calculées.
- Les modèles réellement entraînés, lorsqu'ils existent.

**Principe de transparence : l'application ne doit jamais faire passer une simulation pour une IA réellement entraînée.**

### 2.7. Place des véritables calculs

Le recours à des scénarios préécrits n'interdit pas d'intégrer des opérations réellement exécutées.

Certains exercices peuvent utiliser :

- Des calculs numériques.
- Des règles conditionnelles.
- Des comparaisons.
- Des transformations de données.
- Des fonctions mathématiques simples.

Ces opérations peuvent être exécutées par des composants prédéfinis.

Cependant, leur présence ne doit pas être obligatoire dans tous les exercices.

### 2.8. Progression pédagogique

Le parcours pourrait évoluer progressivement :

**Niveau 1 — Découverte des concepts**

L'utilisateur découvre les éléments constitutifs d'un système.

**Niveau 2 — Assemblage**

Il relie les composants pour reproduire une organisation cohérente.

**Niveau 3 — Expérimentation**

Il modifie certains éléments et observe les conséquences prévues ou calculées.

**Niveau 4 — Construction autonome**

Il réalise un scénario avec moins d'assistance.

**Niveau 5 — Restitution**

Il explique visuellement le fonctionnement du système qu'il a construit.

Cette progression est une proposition pédagogique, non une structure définitivement validée.

---

## 3. Parcours Développeur — Programmer une véritable IA

### 3.1. Objectif

Le parcours Développeur doit permettre à l'utilisateur de construire réellement un petit modèle d'intelligence artificielle.

Contrairement au parcours Découverte, il ne suffit pas de simuler les mécanismes.

L'utilisateur doit écrire du code exécutable qui réalise effectivement les opérations attendues.

### 3.2. Exigences fondamentales

Le parcours doit permettre de :

- Programmer en Python.
- Manipuler des données.
- Réaliser des calculs numériques.
- Définir une architecture de modèle.
- Programmer la propagation avant.
- Définir une fonction de perte.
- Calculer les gradients selon les exercices.
- Modifier les paramètres du modèle.
- Entraîner le modèle.
- Évaluer ses performances.
- Produire de nouvelles prédictions.
- Sauvegarder et recharger son travail.

### 3.3. Le giga exercice

Le parcours repose sur un projet de programmation continu, découpé en étapes.

L'utilisateur commence avec un éditeur Python vide.

Chaque étape introduit un nouvel objectif.

Le code écrit est conservé et réutilisé dans les étapes suivantes.

L'objectif est d'aboutir à un programme fonctionnel et compréhensible.

L'application ne doit pas simplement fournir du code prêt à exécuter.

L'utilisateur doit être acteur de l'implémentation.

### 3.4. Environnement Python

L'éditeur doit offrir les fonctionnalités essentielles d'un environnement de développement :

- Édition de plusieurs fichiers.
- Coloration syntaxique.
- Indentation.
- Autocomplétion.
- Console.
- Exécution du code.
- Affichage des erreurs.
- Tests.
- Sauvegarde du projet.
- Documentation.
- Outils d'aide au débogage.

Le mode d'exécution technique reste à déterminer.

### 3.5. NumPy et PyTorch

Les deux bibliothèques doivent être disponibles nativement.

Deux approches d'implémentation sont prévues :

**Sans PyTorch**

L'utilisateur programme les mécanismes fondamentaux avec Python et NumPy.

**Avec PyTorch**

L'utilisateur utilise les fonctionnalités spécialisées de PyTorch pour construire et entraîner des modèles.

Ces approches doivent rester distinctes.

La disponibilité de PyTorch ne doit pas empêcher l'existence d'exercices où son utilisation est interdite.

### 3.6. Comparaison des implémentations

Une comparaison des deux approches pourra être proposée.

Elle pourrait porter sur :

- Les résultats numériques.
- Les gradients.
- Les paramètres.
- La fonction de perte.
- L'entraînement.
- La structure du code.
- Les fonctionnalités automatisées par PyTorch.

La comparaison constitue une proposition pédagogique complémentaire.

---

## 4. Définition d'une mini-IA réellement fonctionnelle

### 4.1. Objectif

Le projet n'a pas pour ambition de permettre aux apprenants de recréer ChatGPT, Claude ou un autre grand modèle commercial.

L'objectif est de construire de petits modèles authentiques, adaptés à l'apprentissage.

### 4.2. Critères minimaux pour un modèle entraînable

Pour qu'un projet soit présenté comme une mini-IA réellement entraînée, il doit satisfaire plusieurs conditions.

**Données**

Le modèle reçoit des données adaptées à une tâche identifiable.

**Architecture**

Le programme possède une structure de calcul cohérente.

**Prédiction**

Le modèle produit une sortie à partir de ses entrées.

**Apprentissage**

Une procédure d'entraînement ajuste effectivement ses paramètres à partir des données.

**Évaluation**

Le modèle peut être évalué sur des exemples distincts de ceux utilisés pour l'entraînement.

**Utilisation**

L'utilisateur peut fournir de nouvelles entrées et obtenir une prédiction calculée.

### 4.3. Critères complémentaires

Selon le projet, l'application pourrait également exiger :

- La sauvegarde des paramètres.
- Le rechargement du modèle.
- La reproductibilité d'une expérience.
- Le suivi de la perte.
- La visualisation des prédictions.
- L'explication de l'architecture.
- L'identification des limites du modèle.

### 4.4. Projets envisageables

**Projet A — Classification simple**

Construire un modèle capable de distinguer deux catégories.

**Projet B — Réseau neuronal multicouche**

Construire et entraîner un réseau sur un problème non linéaire.

**Projet C — Mini-modèle de langage**

Construire un modèle réduit capable de prédire le prochain caractère ou token à partir d'un corpus pédagogique.

Ces projets constituent des propositions.

### 4.5. Différenciation des résultats

L'application doit distinguer explicitement :

**Simulation conceptuelle :** les étapes ou les résultats sont préconfigurés.

**Système déterministe :** un programme exécute des règles explicites sans apprentissage.

**Modèle entraîné :** les paramètres sont ajustés à partir de données.

**Modèle génératif :** un modèle produit de nouvelles sorties selon ses mécanismes de génération.

Ces catégories ne sont pas nécessairement exclusives, mais elles évitent de confondre des démonstrations avec de véritables modèles d'apprentissage.

---

## 5. Socle pédagogique de mathématiques

### 5.1. Constat

La construction d'un réseau neuronal mobilise des notions mathématiques que tous les utilisateurs ne connaissent pas ou ne maîtrisent plus.

Le laboratoire doit donc proposer une documentation mathématique accessible.

### 5.2. Objectif

Permettre aux apprenants d'acquérir ou de retrouver les notions nécessaires à la compréhension des mécanismes d'IA.

Il ne s'agit pas d'imposer un cursus mathématique complet avant de commencer l'application.

L'apprentissage des mathématiques doit être progressif et relié aux besoins des exercices.

### 5.3. Bibliothèque mathématique

Une bibliothèque dédiée pourrait regrouper :

- Des cours.
- Des définitions.
- Des exemples.
- Des schémas.
- Des visualisations.
- Des exercices.
- Des corrections expliquées.
- Des références complémentaires.

Cette bibliothèque serait accessible indépendamment des parcours.

### 5.4. Mathématiques contextuelles

Lorsqu'un exercice introduit une notion mathématique, l'utilisateur doit pouvoir accéder au module correspondant.

Exemple :

L'utilisateur programme un neurone.

L'exercice introduit un produit scalaire.

Un lien lui permet d'ouvrir une explication du produit scalaire, de réaliser quelques exercices, puis de reprendre son programme.

Le parcours principal ne doit pas être perdu lorsqu'il consulte cette documentation.

---

## 6. Domaines mathématiques à couvrir

### 6.1. Arithmétique

Notions :

- Nombres entiers et décimaux.
- Fractions.
- Pourcentages.
- Puissances.
- Priorités opératoires.

Applications :

- Manipulation de paramètres.
- Calculs numériques.
- Interprétation de résultats.

### 6.2. Algèbre

Notions :

- Variables.
- Expressions.
- Équations.
- Fonctions.
- Représentations graphiques.

Applications :

- Fonctions d'activation.
- Fonctions de perte.
- Relations entre entrées et sorties.

### 6.3. Géométrie et géométrie analytique

Notions :

- Repères cartésiens.
- Coordonnées.
- Points.
- Vecteurs.
- Distances.
- Angles.
- Droites.
- Plans.

Applications :

- Représentation de données.
- Distances entre observations.
- Frontières de décision.
- Visualisation d'espaces vectoriels.

La géométrie doit être enseignée en priorité sous ses formes utiles à la compréhension des modèles.

### 6.4. Algèbre linéaire

Notions :

- Scalaires.
- Vecteurs.
- Matrices.
- Dimensions.
- Produit scalaire.
- Multiplication matricielle.
- Transposition.
- Normes.

Applications :

- Calcul des neurones.
- Propagation dans les couches.
- Embeddings.
- Attention.
- Manipulation des tenseurs.

### 6.5. Analyse

Notions :

- Variations de fonctions.
- Limites, lorsque nécessaires.
- Dérivées.
- Dérivées partielles.
- Règle de la chaîne.
- Gradients.

Applications :

- Optimisation.
- Rétropropagation.
- Entraînement des réseaux neuronaux.

### 6.6. Probabilités

Notions :

- Événements.
- Probabilités.
- Probabilités conditionnelles.
- Distributions.
- Variables aléatoires.

Applications :

- Classification probabiliste.
- Prédiction de tokens.
- Échantillonnage.
- Interprétation des sorties.

### 6.7. Statistiques

Notions :

- Moyenne.
- Médiane.
- Variance.
- Écart-type.
- Échantillons.
- Distributions.
- Corrélations.
- Mesures d'erreur.

Applications :

- Exploration des données.
- Normalisation.
- Évaluation.
- Analyse des performances.

### 6.8. Optimisation

Notions :

- Fonction objectif.
- Fonction de perte.
- Minimum.
- Descente de gradient.
- Taux d'apprentissage.
- Convergence.

Applications :

- Ajustement des paramètres.
- Entraînement.
- Analyse de la stabilité de l'apprentissage.

---

## 7. Exercices mathématiques

### 7.1. Principes

Les exercices doivent permettre de manipuler les notions plutôt que de seulement lire leur définition.

Ils doivent proposer une progression adaptée aux connaissances de l'utilisateur.

### 7.2. Formats envisageables

- Calculs à compléter.
- Questions de compréhension.
- Manipulation de vecteurs.
- Placement de points dans un repère.
- Visualisation de fonctions.
- Modification de paramètres.
- Reconstruction de formules.
- Exercices de dérivation.
- Interprétation de graphiques.
- Applications directes à un réseau neuronal.

### 7.3. Exemple : produit scalaire

L'utilisateur découvre deux vecteurs :

\[
\mathbf{x}=(2,3)
\]

\[
\mathbf{w}=(4,5)
\]

Il doit calculer :

\[
\mathbf{x}\cdot\mathbf{w}=2\times4+3\times5=23
\]

L'application peut ensuite montrer comment ce calcul intervient dans un neurone.

### 7.4. Exemple : descente de gradient

L'utilisateur observe une fonction de perte simplifiée.

Il peut modifier :

- Le point de départ.
- Le taux d'apprentissage.
- Le nombre d'itérations.

Une représentation graphique montre l'évolution des paramètres.

L'objectif est de comprendre l'influence des choix effectués.

---

## 8. Documentation Python et prérequis techniques

En complément des mathématiques, l'application pourrait proposer des rappels ciblés sur :

- Les variables.
- Les types.
- Les conditions.
- Les boucles.
- Les fonctions.
- Les listes.
- Les dictionnaires.
- Les classes.
- Les modules.
- Les exceptions.
- Les tableaux NumPy.
- Les dimensions et formes des tableaux.
- Les tenseurs PyTorch.

Ces ressources ne doivent pas transformer le laboratoire en formation Python généraliste.

Elles doivent accompagner les besoins du parcours Développeur.

---

## 9. Restitution des connaissances

### 9.1. Principe pédagogique

L'application doit encourager l'utilisateur à réexpliquer les concepts appris.

La capacité à retrouver et organiser les connaissances constitue un objectif pédagogique important.

### 9.2. Mini-diaporama visuel

L'exercice « Explique-moi ce qu'est une IA », défini dans la partie 5, doit être conservé.

Il permet de construire une présentation visuelle composée de plusieurs diapositives.

L'utilisateur dispose :

- D'une surface libre.
- De concepts illustrés.
- D'éléments à glisser-déposer.
- De connexions graphiques.
- De plusieurs diapositives.
- D'outils simples de composition.

Le but n'est pas de rédiger un long exposé.

Il doit reconstruire la hiérarchie et les relations entre les concepts étudiés.

### 9.3. Évaluation

La validation doit privilégier :

- La cohérence conceptuelle.
- La présence des notions essentielles.
- La justesse des relations.
- La compréhension des mécanismes.

La qualité esthétique ne constitue pas le critère principal.

### 9.4. Révisions

Des exercices de restitution pourraient être reproposés ultérieurement pour renforcer la mémorisation.

Le système de révision reste à définir.

---

## 10. Connexion entre programmation et visualisation

Le parcours Développeur pourrait permettre de visualiser les résultats réels de son code.

Par exemple :

1. L'utilisateur programme un réseau neuronal.
2. Il exécute son programme.
3. L'application récupère les valeurs nécessaires.
4. Une visualisation représente les opérations réalisées.
5. L'utilisateur examine les poids, activations et gradients.

Cette fonctionnalité doit être distinguée des simulations préconfigurées du parcours Découverte.

Dans le parcours Développeur, les valeurs présentées comme issues du programme doivent correspondre aux calculs réellement exécutés.

---

## 11. Personnalisation et centres d'intérêt

Les deux parcours doivent pouvoir exploiter les centres d'intérêt sélectionnés par l'utilisateur.

Exemples :

- Voyage.
- Football.
- Astronomie.
- Musique.
- Fantasy.
- Jeux vidéo.
- Sciences.
- Vie quotidienne.

Les centres d'intérêt peuvent modifier :

- Les exemples.
- Les illustrations.
- Les scénarios.
- Les jeux de données pédagogiques.
- Les éléments décoratifs.

Ils ne doivent pas modifier la vérité scientifique des mécanismes enseignés.

Les formules, matrices, vecteurs et valeurs numériques doivent conserver une représentation explicite et lisible.

---

## 12. Évaluation de la progression

### 12.1. Parcours Découverte

L'utilisateur doit progressivement être capable de :

- Identifier les principaux composants.
- Expliquer leur rôle.
- Les assembler dans une organisation cohérente.
- Distinguer une simulation d'un calcul réel.
- Reconstituer les étapes principales d'un mécanisme.
- Expliquer les relations entre les concepts.

### 12.2. Parcours Développeur

L'utilisateur doit progressivement être capable de :

- Écrire le code nécessaire.
- Comprendre les opérations réalisées.
- Corriger ses erreurs.
- Construire un modèle.
- Entraîner le modèle.
- Évaluer ses résultats.
- Utiliser le modèle sur de nouvelles données.
- Expliquer son fonctionnement.

### 12.3. Validation finale

Un objectif de validation du parcours Développeur pourrait être :

**Construire, entraîner, tester et expliquer un petit modèle sur un problème nouveau, sans reproduire mécaniquement une solution fournie.**

Cette exigence devra être adaptée au niveau du projet et aux compétences réellement enseignées.

---

## 13. Questions techniques volontairement ouvertes

Le créateur souhaite discuter des architectures possibles avant de fixer les spécifications techniques.

Les décisions suivantes restent donc ouvertes :

- Application web, application desktop ou solution hybride.
- Exécution de Python dans le navigateur ou sur un serveur.
- Architecture du moteur de visualisation.
- Choix de l'éditeur Python intégré.
- Isolation et sécurité du code utilisateur.
- Stockage des projets.
- Gestion des comptes.
- Gestion des dépendances.
- Gestion des ressources de calcul.
- Possibilité d'utilisation hors ligne.
- Synchronisation entre appareils.
- Architecture du moteur de blocs visuels.
- Architecture du moteur de diapositives.
- Intégration entre code Python et visualisations.
- Déploiement et maintenance.

Aucune de ces décisions ne doit être considérée comme validée à ce stade.

---

## 14. Décisions confirmées par le créateur

1. L'application vise les débutants et les développeurs.
2. Les deux publics doivent pouvoir construire quelque chose en rapport avec les mécanismes de l'IA.
3. Le parcours Découverte repose sur des composants visuels.
4. Les composants du parcours Découverte peuvent être préconfigurés.
5. Les entrées et les sorties d'un scénario peuvent être entièrement préécrites.
6. Le parcours Découverte n'a pas l'obligation d'exécuter un modèle génératif.
7. Le parcours Développeur doit utiliser du véritable Python.
8. Le parcours Développeur doit permettre de construire une véritable mini-IA fonctionnelle.
9. NumPy et PyTorch doivent être disponibles nativement.
10. Les exercices avec et sans PyTorch doivent être distincts.
11. Le parcours Développeur doit comporter un grand projet progressif.
12. L'application doit préserver l'exactitude des représentations mathématiques.
13. L'exercice de restitution par diaporama visuel doit être conservé.
14. Les choix d'architecture technique ne sont pas encore arrêtés.

---

## 15. Propositions complémentaires à valider

- Créer une bibliothèque mathématique complète mais progressive.
- Proposer des exercices mathématiques contextuels.
- Ajouter des rappels Python lorsque nécessaires.
- Définir des critères mesurables pour les mini-IA fonctionnelles.
- Distinguer explicitement simulation, système déterministe et modèle entraîné.
- Comparer les implémentations NumPy et PyTorch.
- Relier les résultats Python aux animations scientifiques.
- Proposer des révisions fondées sur le rappel actif.
- Adapter les scénarios aux centres d'intérêt.

---

## 16. Principe général à préserver

**Le laboratoire doit permettre à chacun de comprendre l'intelligence artificielle à son niveau, sans confondre représentation pédagogique et fonctionnement réel.**

Le débutant peut construire une simulation visuelle à partir de concepts et de scénarios préconfigurés.

Le développeur peut construire un modèle réellement exécutable, entraînable et évaluable.

Les deux approches contribuent à une même ambition : transformer des mécanismes abstraits en connaissances que l'utilisateur peut manipuler, comprendre, expliquer et, lorsqu'il programme, implémenter lui-même.

**La définition de l'architecture technique fera l'objet d'une discussion distincte avant son intégration au cahier des charges.**

# Laboratoire pédagogique IA — Partie 7
## Architecture desktop et environnement d'exécution local

**Date :** 15 octobre 2026  
**Statut :** Orientations confirmées et propositions techniques à discuter.

---

## 1. Format de l'application

### Décision du créateur

Le Laboratoire pédagogique IA doit être une véritable application à installer sur ordinateur.

L'application ne doit pas nécessiter l'ouverture manuelle d'une page dans un navigateur.

Elle doit disposer de sa propre fenêtre et pouvoir être lancée directement depuis un raccourci ou un fichier exécutable.

### Expérience attendue

L'utilisateur doit pouvoir :

- Installer l'application sur son ordinateur.
- La lancer par double-clic.
- Accéder directement à son interface.
- Utiliser les modules pédagogiques sans ouvrir de navigateur externe.
- Fermer l'application normalement.

Le lancement ne doit nécessiter aucune commande dans un terminal.

Aucune fenêtre de terminal ne doit apparaître lors d'une utilisation normale.

Les processus techniques nécessaires doivent être lancés automatiquement par l'application.

---

## 2. Langages de programmation

Le créateur ne souhaite pas imposer Python pour développer l'intégralité de l'application.

Les technologies doivent être choisies selon les besoins des différentes parties du logiciel.

En revanche, Python reste le langage prévu pour le parcours Développeur consacré à l'intelligence artificielle.

L'environnement doit permettre d'utiliser réellement :

- Python.
- NumPy.
- PyTorch.

Les exercices doivent pouvoir exécuter du véritable code et entraîner de petits modèles.

---

## 3. Architecture fonctionnelle envisagée

L'application pourrait être organisée en plusieurs composants indépendants.

### Interface utilisateur

Responsable de :

- La navigation.
- L'affichage des cours.
- Les paramètres.
- Les thèmes graphiques.
- Les animations.
- Les visualisations.
- Les éditeurs interactifs.

### Moteur pédagogique

Responsable de :

- La progression.
- Les exercices.
- Les consignes.
- Les évaluations.
- Les ressources mathématiques.
- La documentation.
- Les parcours Découverte et Développeur.

### Moteur visuel

Responsable de :

- La programmation par blocs.
- Les scénarios préconfigurés.
- Les animations scientifiques.
- Les interactions graphiques.
- La création de diaporamas pédagogiques.
- La représentation des mécanismes d'IA.

### Moteur Python

Responsable de :

- L'exécution du code des apprenants.
- L'utilisation de NumPy et PyTorch.
- L'entraînement des modèles.
- Les tests.
- La récupération des résultats.
- La communication avec les visualisations scientifiques.

### Stockage local

Responsable de :

- La progression.
- Les projets.
- Les fichiers Python.
- Les paramètres.
- Les préférences visuelles.
- Les résultats d'exercices.

Cette séparation est une proposition architecturale, pas encore une décision définitive.

---

## 4. Technologies desktop envisagées

### Option A — Tauri

Utiliser Tauri pour distribuer une application desktop possédant une interface développée avec des technologies web.

L'interface pourrait utiliser React et TypeScript.

Un processus Python indépendant serait chargé des exercices de programmation et des calculs d'IA.

Cette solution permettrait de construire des interfaces graphiques riches sans ouvrir de navigateur externe.

### Option B — Electron

Utiliser Electron pour construire une application desktop à partir de technologies web.

Un moteur Python local pourrait être intégré à l'application.

Cette solution dispose d'un écosystème important pour les interfaces complexes.

Elle peut toutefois nécessiter davantage de ressources système.

### Option C — PySide6 / Qt

Développer une application desktop principalement avec Python et Qt.

Cette solution permettrait une intégration directe avec le langage utilisé dans les exercices.

Cependant, elle n'est pas nécessairement la plus simple pour les animations et les éditeurs graphiques envisagés.

---

## 5. Orientation technique provisoire

L'architecture suivante constitue une candidate sérieuse :

**Tauri + React + TypeScript + moteur Python local.**

Elle pourrait permettre de combiner :

- Une application Windows autonome.
- Une interface graphique moderne.
- Des animations complexes.
- Un éditeur de code intégré.
- Des blocs interactifs.
- Des diaporamas visuels.
- Un environnement Python fonctionnel.

Cette architecture n'est pas encore définitivement retenue.

---

## 6. Exécution automatique du moteur Python

L'utilisateur ne doit pas avoir à lancer Python manuellement.

Lorsque l'application a besoin d'exécuter du code, elle doit pouvoir démarrer automatiquement son moteur Python.

Le processus peut fonctionner en arrière-plan sans afficher de terminal.

L'application doit gérer :

- Le démarrage du processus.
- La communication avec l'interface.
- L'exécution des scripts.
- La récupération des résultats.
- L'arrêt des calculs.
- La fermeture propre du processus.

L'utilisateur doit conserver la possibilité d'interrompre une exécution.

---

## 7. Distribution de Python et des bibliothèques

L'objectif est que les bibliothèques nécessaires soient disponibles sans installation manuelle préalable par l'apprenant.

Le programme d'installation pourrait inclure ou installer automatiquement un environnement Python compatible.

Les mécanismes exacts de distribution restent à déterminer.

Une attention particulière devra être portée :

- À la taille de l'installation.
- Aux versions de Python.
- Aux dépendances de NumPy.
- Aux dépendances de PyTorch.
- À la compatibilité des systèmes.
- Aux éventuels accélérateurs GPU.
- Aux mises à jour.

---

## 8. Sécurité des exercices Python

Le code écrit par les apprenants ne doit pas être exécuté directement dans le processus principal de l'interface.

Un mécanisme d'exécution séparé devra être prévu.

L'application doit pouvoir contrôler les ressources utilisées et arrêter les programmes problématiques.

Un simple processus séparé ne constitue cependant pas une isolation de sécurité complète.

Le niveau de protection nécessaire devra être déterminé selon le public et les usages.

---

## 9. Fonctionnement hors ligne

Le fonctionnement sans connexion Internet reste une question ouverte.

Plusieurs possibilités existent :

- Application entièrement utilisable hors ligne.
- Application principalement locale avec certaines fonctionnalités connectées.
- Application nécessitant une connexion pour des ressources spécifiques.

Ce choix devra être discuté avant de définir les mécanismes de distribution et de mise à jour.

---

## 10. Décisions confirmées

1. Le laboratoire sera prioritairement une application à installer sur PC.
2. Il doit s'ouvrir dans sa propre fenêtre.
3. Il ne doit pas ouvrir automatiquement une page dans un navigateur externe.
4. Son lancement doit être possible par double-clic.
5. Aucun terminal ne doit être nécessaire ou visible lors du lancement normal.
6. Python n'est pas imposé pour l'ensemble de l'application.
7. Le parcours Développeur doit utiliser du véritable Python.
8. NumPy et PyTorch doivent être disponibles dans l'environnement pédagogique.
9. Les décisions techniques détaillées restent à discuter.

---

## 11. Questions ouvertes

- Tauri ou Electron ?
- React et TypeScript pour l'interface ?
- Quel éditeur de code intégrer ?
- Comment distribuer Python et PyTorch ?
- Comment isoler l'exécution des programmes ?
- Quelle organisation pour les projets locaux ?
- L'application doit-elle fonctionner entièrement hors ligne ?
- Quels systèmes d'exploitation prendre en charge initialement ?
- Comment gérer les mises à jour ?

**Principe directeur : l'utilisateur doit avoir l'expérience d'une application desktop autonome, même si son interface utilise des technologies web et que ses exercices reposent sur un moteur Python séparé.**

## Sécurité et gestion des durées d'exécution Python

### Décision du créateur

L'application doit disposer d'un système de protection contre les exécutions excessivement longues, notamment les boucles infinies accidentelles.

Cependant, la durée maximale ne doit pas empêcher les utilisateurs du parcours Développeur d'entraîner de véritables modèles d'intelligence artificielle.

### Exigences

- Les programmes des apprenants doivent s'exécuter dans un processus indépendant de l'interface.
- Chaque exécution doit disposer d'une durée maximale.
- Les limites doivent être adaptées à la nature de l'exercice.
- Les entraînements prolongés doivent pouvoir bénéficier d'une durée définie avant leur lancement.
- L'utilisateur doit pouvoir interrompre une exécution à tout moment.
- L'application doit pouvoir arrêter un programme qui ne répond plus.
- Des limites de mémoire et de ressources doivent être prévues.
- L'arrêt d'un programme ne doit pas provoquer la fermeture de l'application.
- Les projets et fichiers de code doivent rester sauvegardés indépendamment du processus d'exécution.

### Entraînements prolongés

Pour les exercices impliquant l'entraînement d'un modèle, le système doit prévoir :

- Une durée maximale définie avant l'exécution.
- Un suivi du temps écoulé.
- Un avertissement avant l'expiration.
- La possibilité de prolonger l'exécution dans les limites autorisées.
- Un mécanisme de sauvegarde intermédiaire lorsque le programme le permet.
- Un arrêt contrôlé lorsque cela est possible.

### Distinction importante

Une exécution longue n'est pas nécessairement une exécution bloquée.

Le système ne doit pas considérer automatiquement qu'un entraînement est défectueux uniquement parce qu'il dure plusieurs minutes.

Inversement, une boucle infinie peut consommer peu de ressources et nécessite donc une limite temporelle indépendante.

### Questions ouvertes

- Quelles durées maximales appliquer selon les exercices ?
- Les utilisateurs peuvent-ils définir librement leurs limites ?
- Comment distinguer les entraînements guidés des programmes libres ?
- Quel niveau d'isolation retenir pour les processus Python ?
- Comment gérer les sauvegardes intermédiaires ?
- Comment surveiller les ressources CPU, RAM et GPU ?
- Comment gérer les programmes qui lancent plusieurs processus ?

Les valeurs définitives devront être déterminées lors de la conception technique et testées sur différentes configurations matérielles.

---

# Laboratoire pédagogique IA — Partie 8
## Clarification fondamentale : expérience ludique et programmation authentique

**Date :** 15 octobre 2026  
**Statut :** Clarification explicite du créateur, à appliquer à toutes les parties précédentes.  
**Portée :** Parcours Découverte, parcours Développeur, interface pédagogique, éditeur de code et moteur d'exécution.

## 1. Principe directeur — décision confirmée

**Les deux parcours doivent proposer une interface ludique, interactive, immersive et soignée.** Le caractère visuel de l'application n'est pas réservé aux personnes qui ne savent pas programmer. Inversement, l'authenticité du code dans le parcours Développeur n'impose pas une interface austère.

La distinction entre les parcours concerne **ce que l'apprenant construit et la façon dont il travaille**, et non le droit d'accéder à une expérience agréable, animée et interactive.

**Règle impérative : dans le parcours Développeur, l'exécution du programme Python doit rester une véritable exécution de code.** Il n'est ni nécessaire ni souhaité de transformer automatiquement cette exécution en animation décorative, en représentation de neurones ou en scène interactive. Cela n'interdit nullement les animations et les visualisations dans les cours, les explications, la navigation ou les exercices conceptuels.

## 2. Parcours Découverte

Public : personnes sans connaissances préalables en programmation ou en IA.

- Apprentissage par scènes interactives, animations, manipulation de concepts et assemblage de blocs.
- Construction de systèmes pédagogiques visuels, y compris des scénarios entièrement préconfigurés ou à réponses écrites à l'avance.
- Possibilité d'exécuter de véritables calculs simples lorsque cela sert la compréhension, sans obligation de construire un modèle d'IA réel.
- Signalement explicite des simulations, des réponses codées en dur et des simplifications ; ne jamais les présenter comme des résultats d'un modèle entraîné.
- Univers visuels et exemples personnalisables selon les centres d'intérêt, sans dénaturer les notations scientifiques.

## 3. Parcours Développeur : une expérience ludique autour d'un vrai environnement de programmation

Public : personnes souhaitant apprendre les mécanismes de l'IA en les implémentant réellement.

### 3.1. Cours et exploration des concepts

Le parcours Développeur peut et doit, lorsque c'est pédagogiquement pertinent, utiliser les mêmes atouts visuels que le parcours Découverte :

- Diaporamas interactifs, scènes animées, zooms sur les mécanismes et navigation non linéaire.
- Manipulation de poids, biais, fonctions d'activation, vecteurs et matrices dans des démonstrations pédagogiques.
- Explications mathématiques progressives, exemples thématiques, schémas, visualisations scientifiques et comparaisons.
- Interactions de compréhension avant ou après un exercice de code.
- Présentation personnalisable et plaisante, sans surcharge visuelle qui gêne la lecture du code.

Ces dispositifs servent **l'apprentissage du concept** ; ils ne remplacent pas la programmation demandée dans les exercices.

### 3.2. Exercices de programmation et « giga-exercice »

Lorsqu'une consigne demande de programmer, l'apprenant utilise un **véritable éditeur Python** et écrit son propre code.

- Exécution réelle du Python, avec NumPy ou PyTorch selon le mode et les contraintes de l'exercice.
- Affichage fidèle de la sortie standard, des exceptions, des traces d'erreur, des résultats et des tests.
- Possibilité d'arrêter le programme, de le relancer, de le déboguer et de conserver ses fichiers.
- Progression du giga-exercice par étapes, depuis le fichier vide jusqu'au modèle réellement entraîné, évalué, testé et réutilisable.
- Aucun remplacement du code par des blocs visuels pendant l'exercice de programmation.
- Aucune obligation de générer une animation du réseau ou des neurones à chaque exécution.
- Aucun affichage inventé pour donner l'illusion que le programme a appris ou produit un résultat.

**Les sorties visuelles produites volontairement par le programme de l'apprenant** (par exemple un graphique Matplotlib, un tableau ou une courbe de perte) restent naturellement possibles. Elles sont des résultats de programmation, pas des animations imposées par l'application.

### 3.3. Une interface agréable jusque dans l'espace de code

L'éditeur et son environnement peuvent conserver l'identité ludique de l'application : parcours de progression, objectifs clairement présentés, retours pédagogiques, navigation animée, personnalisation visuelle et interactions utiles. La lisibilité, la stabilité de l'éditeur et la fidélité de la console restent prioritaires.

Une animation de validation d'étape peut célébrer une réussite **après vérification** ; elle ne doit pas remplacer la preuve d'exécution, les tests ou les résultats réels.

## 4. Trois responsabilités à ne pas confondre

| Élément | Rôle | Ce qu'il ne doit pas faire |
|---|---|---|
| **Expérience pédagogique** | Cours, scènes, explications, simulations, manipulations et progression | Faire passer une simulation pour un modèle entraîné |
| **Environnement de programmation** | Éditeur, fichiers, console, tests, débogage, consignes et aide | Remplacer le Python de l'apprenant par un assemblage visuel obligatoire |
| **Moteur d'exécution Python** | Lancer le code réel, gérer les processus, recueillir les sorties et appliquer les protections | Inventer des résultats ou imposer une visualisation décorative du code exécuté |

Ces composants peuvent communiquer pour afficher des informations utiles (état d'exécution, durée, erreurs, progression déclarée par le programme), **sans qu'il soit nécessaire d'interpréter arbitrairement le code pour le convertir en animation scientifique**.

## 5. Exemple : le concept de neurone artificiel

1. **Cours interactif :** l'apprenant observe un neurone pédagogique, modifie les entrées, poids et biais et constate le résultat du calcul.
2. **Explication mathématique :** il examine la somme pondérée, la fonction d'activation et les équations standard.
3. **Exercice Développeur :** il implémente lui-même ces opérations en Python/NumPy ou PyTorch selon la consigne.
4. **Exécution :** le programme tourne réellement ; l'éditeur affiche les sorties, erreurs et résultats de tests.
5. **Validation :** des tests contrôlent la justesse de l'implémentation. La progression pédagogique peut être présentée de façon ludique, sans transformer l'exécution en animation fictive.

## 6. Protection des exécutions, sans pénaliser l'entraînement d'IA

Les exigences de la partie 7 et de sa section « Sécurité et gestion des durées d'exécution Python » restent applicables.

- Chaque programme utilisateur s'exécute dans un processus séparé de l'interface.
- L'utilisateur dispose d'un bouton **Arrêter** accessible durant l'exécution.
- Les exercices courts et les entraînements longs ne partagent pas obligatoirement le même délai maximal.
- Pour un entraînement, la durée maximale est définie **avant le lancement** selon l'exercice ou un réglage autorisé ; un avertissement et une prolongation contrôlée peuvent être proposés.
- Une durée longue ne prouve pas qu'un programme est bloqué ; une boucle infinie peut consommer peu de CPU.
- L'application surveille les ressources et peut interrompre progressivement, puis forcer l'arrêt si nécessaire.
- Les fichiers et projets sont sauvegardés indépendamment du processus exécuté.
- Les *checkpoints* d'entraînement ne sont garantis que si le programme ou l'exercice prend en charge leur création ; un arrêt forcé ne garantit pas la sauvegarde de l'état du modèle.
- Les durées exactes, seuils de mémoire et politiques CPU/GPU restent **à déterminer et à tester**, et ne sont pas arbitrairement figés dans le présent document.

## 7. Conséquences sur l'architecture

- Il n'est **pas nécessaire** de concevoir un moteur général convertissant automatiquement n'importe quel programme Python en animation de réseau neuronal.
- Le moteur de scènes interactives et le moteur Python peuvent rester distincts, tout en partageant certains contenus pédagogiques, jeux de données ou résultats explicitement produits.
- Les visualisations scientifiques des cours doivent être correctes et interactives, mais ne sont pas automatiquement liées au programme libre de l'apprenant.
- L'éditeur Python, la console et les tests sont de véritables outils de programmation intégrés dans une application dont l'expérience globale reste ludique.
- Cette clarification ne change pas la décision de développer une application PC installable, sans navigateur externe ni terminal visible au lancement normal.

## 8. Critères de validation de cette clarification

La conception respecte l'intention du créateur si :

1. Un utilisateur du parcours Développeur peut accéder à des cours visuels et interactifs aussi riches que ceux du parcours Découverte.
2. Un utilisateur du parcours Développeur peut écrire et exécuter du Python réel sans qu'une animation décorative ne soit requise pour obtenir ses résultats.
3. Les erreurs et sorties affichées correspondent au programme effectivement exécuté.
4. Un modèle présenté comme réellement entraîné a bien subi un entraînement effectif.
5. Une simulation à réponses préécrites est clairement identifiée comme telle.
6. Un entraînement long peut disposer d'une limite d'exécution adaptée et d'un arrêt manuel, sans bloquer l'interface.
7. L'identité ludique de l'application ne compromet ni la lisibilité du code ni la rigueur mathématique.

## 9. Statut et articulation avec les parties précédentes

Cette partie **clarifie et précise** les parties 1 à 7 sans effacer leurs idées. En cas d'ambiguïté, les décisions explicites suivantes prévalent :

- **Ludique et interactif pour les deux parcours.**
- **Code Python réel pour les exercices de programmation du parcours Développeur.**
- **Aucune animation décorative imposée à l'exécution du code.**
- **Simulations pédagogiques possibles et annoncées dans le parcours Découverte.**
- **Limites d'exécution adaptées aux entraînements réels.**

Les choix précis de framework desktop, de fonctionnement hors ligne, de distribution des dépendances et de seuils d'exécution restent ouverts tant qu'ils n'ont pas été validés explicitement.


---

# ANNEXE DE MISE À JOUR — décisions de navigation et validation novice (15 octobre 2026)

- La métaphore de ville isométrique 2D, même riche en bâtiments, a été **explicitement abandonnée** : elle ne correspond pas à la représentation souhaitée.
- Navigation choisie : **arbre technologique inspiré des jeux vidéo** ; graphe arborescent profond, éventuellement liens transversaux ; **non** un chemin unique façon Duolingo.
- Chaque nœud avancé peut correspondre à un sous-concept fin : fonctions d'activation, ReLU, biais, gradients, rétropropagation, etc.
- **Découverte** : ne montrer au départ que les notions majeures, les nœuds techniques restant accessibles sur demande via « Approfondir ». Cette simplification est une condition d'acceptation, pas un bonus.
- **Développeur** : profondeur technique et mathématique, sous-concepts détaillés, véritables ateliers Python ; mêmes ambitions d'interactivité pédagogique et de qualité visuelle.
- Les deux parcours utilisent un **référentiel conceptuel commun**, mais des vues et niveaux d'approfondissement distincts.
- Cours : mini-parties alternant explications, animations manipulables, flashcards recto-verso et exercices ; QCM et champs libres avec correction adaptée, sans comparaison naïve de chaînes pour les définitions ouvertes.
- **Priorité immédiate** : tests avec personnes n'ayant jamais codé. Le produit doit être compréhensible sans connaissance des IDE, terminaux ou bibliothèques Python.
- L'application est autonome hors ligne. Tauri v2 est la piste retenue sous réserve de validation technique.
- Racine de création explicitement demandée par le créateur : `C:\Users\apapi\L'atelier de Nairyx`.
