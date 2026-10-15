# Contenu pédagogique du MVP

## Public et parcours

Ce prototype s’adresse à un adulte novice, sans prérequis de programmation. Deux parcours complets sont disponibles : « Du texte aux tokens » (8 à 12 minutes) et « Un neurone, pas à pas » (10 à 15 minutes). Les durées sont des estimations éditoriales, pas des mesures sur des participants.

Chaque cours explicite ses objectifs, introduit les notions progressivement, demande une prédiction avant manipulation, propose des cartes de rappel actif et termine par cinq QCM avec une explication. Pour utiliser une carte, formuler sa réponse avant d’afficher le verso ; la reconnaissance visuelle seule n’atteste pas de mémorisation. Un score de QCM renseigne uniquement sur ces items.

L’arbre contient quatre notions essentielles : tokens, neurone, apprentissage, modèles. Les deux dernières sont des repères explorables annoncés à venir. Huit notions avancées donnent un contexte et des prérequis : sous-mots, vocabulaire, plongements, paramètres, perte, gradient, attention et Transformer. Aucun cours complet n’est revendiqué pour ces repères.

## Choix de précision

- Les tokens ne sont assimilés ni aux mots ni aux caractères. Les sous-mots et leur découpage sont explicitement illustratifs.
- Les identifiants de tokens sont des clés arbitraires dans une table ; leur ordre numérique n’a pas de signification sémantique.
- Les exemples « robotique » → [« robot », « ique »] et identifiants [12, 84] sont fictifs. Ils ne représentent le vocabulaire d’aucun fournisseur.
- La conservation du texte inclut espaces, ponctuation et caractères accentués. Le simulateur de frontières n’est pas présenté comme un tokenizer de production.
- Le neurone calcule z = w₁x₁ + w₂x₂ + b puis y = max(0, z). ReLU n’est ni une valeur absolue, ni une sigmoïde, ni une conversion en probabilité.
- L’effet d’un poids dépend du signe de son entrée. Le biais subsiste quand les entrées sont nulles.
- Manipuler des paramètres n’est pas un entraînement automatique ; les cours distinguent calcul, paramètres, perte et procédure d’ajustement.

## Structure de l’arbre

Les coordonnées sont exprimées dans un espace 900 × 600. Les centres suivent quatre colonnes (115, 335, 555, 775) et trois rangées (110, 300, 490). Les liens parentIds structurent la découverte ; prerequisites décrit les connaissances recommandées ; relatedIds matérialise les passerelles. Les prérequis sont des recommandations éditoriales, pas des verrous de navigation ni des preuves de compétence.

L’arbre des parents et le graphe des prérequis sont acycliques. Les liens transverses peuvent être réciproques et ne portent pas de progression obligatoire. Les nœuds avancés ne possèdent pas de lessonId tant que leur cours n’existe pas.

## Protocole prévu pour un test novice

Ce protocole est à réaliser ; aucun test humain n’a été effectué ni résultat inventé.

1. Recruter 3 à 5 adultes volontaires découvrant ces notions. Expliquer le but du prototype, demander leur accord pour la prise de notes et éviter toute donnée personnelle inutile.
2. Avant le cours, demander « Qu’est-ce qu’un token ? » et « Que fait selon vous un neurone artificiel ? ». Noter les réponses sans les corriger et sans attribuer une note publique.
3. Leur confier une découverte libre de l’arbre puis demander de trouver et commencer un cours. Observer la compréhension des états disponible/à venir, de la progression et des liens entre notions.
4. Pour les tokens, demander une prédiction du nombre de fragments, un changement de frontière et une reconstitution exacte. Demander pourquoi un numéro de token n’indique pas son sens et si le simulateur donne les tokens exacts d’un modèle réel.
5. Pour le neurone, demander de calculer z puis y sur un exemple positif et négatif ; demander une sortie supérieure à 1, puis des entrées nulles avec biais négatif. Vérifier la séparation entre somme et activation.
6. Observer une carte de rappel actif et un QCM : la personne essaie-t-elle de répondre avant de révéler la carte ? Comprend-elle l’explication après une erreur ? Éviter de donner l’indice à sa place.
7. Demander une reformulation spontanée, puis un exemple nouveau sans copier le cours. Relever erreurs conceptuelles, termes opaques, blocages, durée et besoin d’aide.
8. Vérifier clavier seul, zoom texte, petite fenêtre et réduction des animations, avec des participants concernés si possible. Un audit technique préalable ne remplace pas leur retour.
9. Après 24 à 72 heures si les volontaires l’acceptent, reposer deux questions de transfert sans présenter les cartes. Comparer qualitativement les raisonnements, sans conclure à un effet causal sur un si petit échantillon.
10. Réviser les formulations qui provoquent les mêmes erreurs chez plusieurs personnes, puis refaire un test. Conserver des observations anonymisées et séparer faits observés, interprétations et hypothèses.

Indicateurs à relever : réalisation autonome des tâches, nature des erreurs avant/après, capacité à expliquer les limites de la simulation, compréhension des retours et besoins d’aide. Les seuils de validation seront définis avant une étude plus large. Les scores d’un petit groupe ne démontrent pas une efficacité pédagogique générale.

## Vérifications et limites

Les vérifications automatiques peuvent contrôler l’unicité des identifiants, les références entre nœuds, l’absence de cycles, les bornes des coordonnées, les bonnes réponses de QCM et la présence des deux cours. Elles ne vérifient pas la compréhension d’un apprenant.

Le MVP n’enseigne pas encore la tokenisation BPE ou Unigram, l’optimisation numérique, la rétropropagation, ni le fonctionnement détaillé d’un Transformer. La formule ReLU est réelle mais volontairement limitée à deux entrées. Les scénarios ne prétendent pas reproduire un modèle commercial ou ses coûts. Une interface réactive et un QCM réussi ne constituent ni un bilan de compétences, ni une preuve de rétention à long terme.
