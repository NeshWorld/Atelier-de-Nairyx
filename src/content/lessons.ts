import type { Lesson } from "../types";

export const lessons: Record<"tokenization" | "neuron", Lesson> = {
  tokenization: {
    id: "tokenization",
    title: "Du texte aux tokens",
    duration: "8 à 12 min",
    introduction:
      "Un modèle de langage ne reçoit pas directement des mots tels que nous les lisons. Une étape de préparation transforme le texte en une suite de tokens, puis en identifiants numériques. Découvrons ce passage sans prérequis en programmation.",
    objectives: [
      "Distinguer un token, un mot et un caractère.",
      "Expliquer le rôle d’un vocabulaire et d’un identifiant.",
      "Reconnaître ce qu’une simulation pédagogique permet de comprendre.",
    ],
    sections: [
      {
        title: "1. Un token est une unité de texte",
        body: "Un token peut représenter un mot entier, un fragment de mot, un signe de ponctuation ou un espace associé à un autre fragment. Selon le tokenizer, il peut aussi représenter des octets ou des unités spéciales. Un mot n’est donc pas toujours égal à un token. Le tokenizer est la procédure qui réalise ce découpage et son codage.",
      },
      {
        title: "2. Pourquoi découper en fragments ?",
        body: "Un vocabulaire limité ne peut pas contenir tous les mots, noms propres et variantes possibles. Des fragments réutilisables aident à représenter de nombreux textes. Exemple inventé : « robotique » pourrait être découpé en [« robot », « ique »]. Un autre tokenizer pourrait produire [« ro », « botique »]. Ce sont des illustrations : nous n’affirmons pas qu’un tokenizer réel choisirait ces fragments.",
      },
      {
        title: "3. Donner un numéro ne donne pas un sens",
        body: "Imaginons une table fictive : « robot » → 12 et « ique » → 84. Notre exemple devient [12, 84]. Ces identifiants servent à retrouver les entrées du vocabulaire. Le nombre 84 ne signifie ni « plus important » ni « plus proche du sens recherché » que 12. Un modèle associe ensuite ces identifiants à des vecteurs de nombres, appelés plongements ; l’identifiant seul ne décrit pas le sens.",
      },
      {
        title: "4. Les espaces et la ponctuation comptent",
        body: "Dans un texte, « Un robot. » contient aussi un espace et un point. Un découpage illustratif est [« Un », « robot précédé d’un espace », « . »]. Les conventions d’affichage varient selon les outils. Pour reconstituer exactement une phrase, il faut préserver ces caractères. Dans le laboratoire, observe le texte exact avant de poser ou de retirer des séparations.",
      },
      {
        title: "5. Expérimenter et formuler une hypothèse",
        body: "Dans le laboratoire, compare deux découpages d’un même texte et compte les morceaux. Prédis le résultat avant de changer une frontière. Vérifie ensuite que les morceaux, remis bout à bout, redonnent exactement le texte de départ. Les nombres affichés sont des identifiants pédagogiques. Ils ne permettent pas de calculer le coût ou la longueur de contexte d’un modèle commercial.",
      },
      {
        title: "6. Ce qu’il faut retenir",
        body: "Tokeniser prépare une représentation du texte ; cela ne constitue pas, à lui seul, une compréhension de ce texte. Le découpage dépend d’une méthode et d’un vocabulaire. Le laboratoire te laisse choisir des frontières pour rendre le principe visible : un tokenizer réel applique sa propre procédure. Tu peux maintenant expliquer pourquoi deux textes de même longueur en caractères peuvent avoir des nombres de tokens différents.",
      },
    ],
    flashcards: [
      {
        id: "tokens-card-unit",
        front:
          "Un token correspond-il toujours à un mot ? Explique avant de retourner la carte.",
        back: "Non. Il peut correspondre à un mot, un fragment, de la ponctuation ou d’autres unités selon le tokenizer. « robotique » pourrait, dans notre exemple fictif, avoir deux tokens.",
      },
      {
        id: "tokens-card-id",
        front:
          "Pourquoi le token numéro 84 n’est-il pas « plus significatif » que le numéro 12 ?",
        back: "Un identifiant est une clé dans une table. Sa valeur numérique n’est pas une mesure de sens. Le modèle utilise ensuite une représentation vectorielle associée à cette clé.",
      },
      {
        id: "tokens-card-exact",
        front:
          "Que faut-il vérifier après avoir découpé une phrase pour pouvoir la reconstituer ?",
        back: "La concaténation des fragments doit restituer le texte exact, y compris les espaces, accents et signes de ponctuation.",
      },
      {
        id: "tokens-card-real",
        front:
          "Le découpage choisi dans cette simulation prédit-il celui de tous les modèles ?",
        back: "Non. La simulation expose le principe. Un tokenizer réel applique une méthode et un vocabulaire précis, qui peuvent produire d’autres frontières et identifiants.",
      },
      {
        id: "tokens-card-subword",
        front: "À quoi servent des fragments plus petits que les mots ?",
        back: "Ils permettent de réutiliser un vocabulaire de taille limitée pour représenter de nombreux mots et variantes, au lieu d’une entrée distincte pour chaque mot possible.",
      },
    ],
    questions: [
      {
        id: "tokens-q-unit",
        prompt: "Quelle affirmation décrit correctement un token ?",
        options: [
          "C’est toujours un mot séparé par des espaces.",
          "Il peut être un mot, un fragment ou un signe, selon le tokenizer.",
          "C’est toujours une lettre.",
        ],
        correctIndex: 1,
        explanation:
          "Les tokens n’ont pas une taille linguistique fixe. Un mot peut être un token ou plusieurs ; un signe de ponctuation peut aussi être un token.",
      },
      {
        id: "tokens-q-id",
        prompt:
          "Dans notre table fictive, « robot » vaut 12. Que représente 12 ?",
        options: [
          "La longueur du mot.",
          "Le niveau d’intelligence du token.",
          "La clé permettant de retrouver ce token dans le vocabulaire.",
        ],
        correctIndex: 2,
        explanation:
          "L’identifiant sert au repérage dans le vocabulaire. Il ne mesure ni une longueur, ni une intelligence, ni une valeur de sens.",
      },
      {
        id: "tokens-q-split",
        prompt:
          "Dans l’exemple fictif [« robot », « ique »], combien de tokens représentent « robotique » ?",
        options: [
          "Un, puisqu’il n’y a qu’un mot.",
          "Deux, puisqu’il y a deux fragments.",
          "Neuf, puisqu’il y a neuf lettres.",
        ],
        correctIndex: 1,
        explanation:
          "On compte les unités du découpage choisi : ici deux. Le nombre de mots ou de caractères ne donne pas directement le nombre de tokens.",
      },
      {
        id: "tokens-q-space",
        prompt:
          "On enlève un espace en séparant les morceaux d’une phrase. Que peut-on conclure ?",
        options: [
          "Le texte reconstitué peut être différent du texte initial.",
          "Les espaces n’ont aucune importance.",
          "Le modèle comprendra nécessairement mieux.",
        ],
        correctIndex: 0,
        explanation:
          "Un espace est un caractère du texte. L’enlever peut modifier la phrase reconstituée. Aucun gain de compréhension ne découle automatiquement de ce changement.",
      },
      {
        id: "tokens-q-limits",
        prompt: "Que démontre le laboratoire de découpage manuel ?",
        options: [
          "Le coût exact d’un appel à tous les modèles.",
          "La manière dont on peut représenter un texte par des fragments et des identifiants.",
          "La procédure exacte de tous les tokenizers réels.",
        ],
        correctIndex: 1,
        explanation:
          "Le laboratoire montre une représentation pédagogique. Sans exécuter un tokenizer précis, on ne connaît ni ses frontières, ni ses identifiants, ni un coût réel.",
      },
    ],
  },
  neuron: {
    id: "neuron",
    title: "Un neurone, pas à pas",
    duration: "10 à 15 min",
    introduction:
      "Un neurone artificiel est un petit calcul paramétrable. Il combine des nombres, ajoute un biais, puis applique une fonction d’activation. Nous utiliserons deux entrées et une activation ReLU pour voir chaque opération.",
    objectives: [
      "Calculer une somme pondérée avec un biais.",
      "Prédire l’effet d’un poids ou d’un biais.",
      "Appliquer ReLU et distinguer calcul et apprentissage.",
    ],
    sections: [
      {
        title: "1. Les entrées sont des nombres",
        body: "Appelons x₁ et x₂ les deux entrées. Elles peuvent représenter des mesures ou des valeurs venues d’autres neurones. Dans ce laboratoire, nous choisissons simplement des nombres. Le neurone ne sait pas, par lui-même, ce que ces nombres désignent dans le monde.",
      },
      {
        title: "2. Un poids règle une contribution",
        body: "Chaque entrée est multipliée par un poids : w₁ × x₁ et w₂ × x₂. Avec une entrée positive, un poids positif ajoute une contribution positive ; un poids négatif ajoute une contribution négative. Attention au signe de l’entrée : augmenter un poids associé à une entrée négative fait diminuer la somme. Un poids nul annule la contribution de son entrée.",
      },
      {
        title: "3. Ajouter le biais",
        body: "La somme avant activation est z = w₁ × x₁ + w₂ × x₂ + b. Le biais b décale cette somme, même si les entrées sont nulles. Exemple : x₁ = 2, w₁ = 0,5, x₂ = 1, w₂ = −1 et b = 0,2. Alors z = 1 − 1 + 0,2 = 0,2. Le biais est un paramètre du calcul, pas un jugement ou un préjugé au sens courant.",
      },
      {
        title: "4. Appliquer ReLU",
        body: "Notre fonction d’activation est ReLU : y = max(0, z). Si z est positif, la sortie vaut z. Si z est négatif ou nul, la sortie vaut 0. Avec z = 0,2, on obtient y = 0,2 ; avec z = −0,8, on obtient y = 0. La sortie n’est pas une probabilité : elle peut dépasser 1. D’autres neurones peuvent utiliser d’autres fonctions d’activation.",
      },
      {
        title: "5. Prévoir, manipuler, expliquer",
        body: "Avant de déplacer un curseur, prédis le signe de z et la valeur de y. Essaie ensuite de rendre z négatif grâce au biais : la sortie ReLU reste à 0 pour toutes les valeurs négatives. Augmente encore le biais jusqu’à franchir 0 : la sortie commence alors à augmenter. Compare toujours la somme avant activation et la sortie après activation.",
      },
      {
        title: "6. Calculer n’est pas apprendre",
        body: "Déplacer soi-même les poids illustre leur effet, mais ce n’est pas un entraînement automatique. Pendant un apprentissage, une procédure compare des prédictions à des cibles, mesure une perte et ajuste les paramètres. Un seul neurone ne résume pas un réseau entier : plusieurs neurones et couches permettent de composer des transformations plus riches.",
      },
    ],
    flashcards: [
      {
        id: "neuron-card-sum",
        front:
          "Peux-tu écrire les deux étapes du calcul avant de retourner la carte ?",
        back: "D’abord z = w₁ × x₁ + w₂ × x₂ + b. Puis y = ReLU(z) = max(0, z). La somme et la sortie sont deux valeurs distinctes.",
      },
      {
        id: "neuron-card-negative",
        front: "Si la somme z vaut −3, que renvoie ReLU ? Et si z vaut 4 ?",
        back: "ReLU(−3) = 0 et ReLU(4) = 4. ReLU conserve les valeurs positives ; elle ne les limite pas à 1.",
      },
      {
        id: "neuron-card-bias",
        front:
          "Si les deux entrées valent zéro, quelle valeur reste avant l’activation ?",
        back: "La somme vaut le biais : z = b. La sortie vaut ensuite max(0, b).",
      },
      {
        id: "neuron-card-sign",
        front:
          "Avec une entrée x₁ négative, que fait une augmentation de w₁, toutes choses égales ?",
        back: "Elle diminue la somme z car la variation de w₁ est multipliée par une entrée négative. L’effet sur y dépend ensuite de ReLU.",
      },
      {
        id: "neuron-card-learning",
        front:
          "Est-ce que changer un poids à la main constitue un apprentissage automatique ?",
        back: "Non. Cela rend son effet observable. Un entraînement automatique suit une procédure d’ajustement fondée sur des exemples et un objectif.",
      },
    ],
    questions: [
      {
        id: "neuron-q-sum",
        prompt:
          "Avec x₁ = 2, w₁ = 0,5, x₂ = 1, w₂ = −1 et b = 0,2, quelle est la somme z ?",
        options: ["0,2", "2,2", "−1,2"],
        correctIndex: 0,
        explanation:
          "On multiplie avant d’additionner : 2 × 0,5 + 1 × (−1) + 0,2 = 1 − 1 + 0,2 = 0,2.",
      },
      {
        id: "neuron-q-relu",
        prompt: "Si z = −0,8, quelle est la sortie avec ReLU ?",
        options: ["−0,8", "0", "0,8"],
        correctIndex: 1,
        explanation:
          "ReLU prend le maximum entre 0 et z. Elle remplace donc −0,8 par 0 ; elle ne prend pas sa valeur absolue.",
      },
      {
        id: "neuron-q-range",
        prompt: "Si z = 2,5, quelle est la sortie avec ReLU ?",
        options: [
          "1, car une activation est toujours une probabilité.",
          "0, car z dépasse 1.",
          "2,5, car ReLU conserve une valeur positive.",
        ],
        correctIndex: 2,
        explanation:
          "ReLU(2,5) = max(0, 2,5) = 2,5. Cette activation ne normalise pas la sortie en probabilité.",
      },
      {
        id: "neuron-q-bias",
        prompt: "Les deux entrées sont nulles et b = −2. Quelles sont z et y ?",
        options: ["z = −2 et y = 0.", "z = 0 et y = −2.", "z = 0 et y = 0."],
        correctIndex: 0,
        explanation:
          "Les produits avec les entrées nulles valent 0, mais le biais reste : z = −2. L’activation donne ensuite y = max(0, −2) = 0.",
      },
      {
        id: "neuron-q-training",
        prompt:
          "Que manque-t-il à la manipulation manuelle des curseurs pour illustrer un entraînement automatique ?",
        options: [
          "Une couleur différente pour chaque poids.",
          "Une procédure qui ajuste les paramètres en fonction d’exemples et d’un objectif.",
          "Un plus grand nombre de décimales.",
        ],
        correctIndex: 1,
        explanation:
          "Les curseurs montrent le calcul. L’apprentissage exige en plus une procédure d’ajustement, par exemple à partir d’une perte qui compare prédictions et cibles.",
      },
    ],
  },
};
