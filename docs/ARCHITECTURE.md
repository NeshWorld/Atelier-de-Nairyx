# Architecture et décisions — incrément 0.1

## ADR 001 : conserver Tauri v2, React, TypeScript

La cible est Windows desktop. Vite sert uniquement au développement et aux tests d’interface. La distribution finale doit embarquer dist dans Tauri ; aucun serveur ni navigateur externe ne sera requis au lancement. Rust/MSVC et le SDK sont installés avec autorisation ; la release Tauri et le NSIS sont construits. Le lancement direct dans une fenêtre propre a été observé sans serveur de développement.

## ADR 002 : un référentiel, deux profondeurs

Le graphe typé src/content/concepts.ts contient identifiants, parents, prérequis conseillés, relations, branche, visibilité et contenu. Quatre concepts essentiels sont montrés par défaut ; les branches avancées sont facultatives. Aucun prérequis ne verrouille un cours. Les deux cours effectifs sont tokenisation et neurone ; les autres branches sont annoncées à venir.

Les contenus pédagogiques sont éditables dans src/content/lessons.ts. Les schémas TypeScript et les tests contrôlent les références, l’absence de cycle et les questions. Il n’existe pas de générateur de cours ni de LLM.

## ADR 003 : progression transactionnelle à deux emplacements

Progression version 1, réponses aux QCM, étape, exercice, préférences et brouillon Python sont sérialisés dans localStorage de l’origine de la fenêtre. Deux emplacements alternent avec un numéro de séquence et une somme de contrôle non cryptographique. Chaque setItem constitue une écriture atomique du navigateur ; la copie précédente est conservée. La récupération privilégie la copie valide la plus récente et signale une corruption. Deux copies illisibles ou d’une version inconnue bloquent l’écriture : l’interface propose l’export et une réinitialisation explicite.

Ceci n’est pas une sauvegarde hors disque ni une garantie contre une panne matérielle. La migration depuis une version historique inexistante n’est pas inventée. Une future version devra ajouter sa migration sans réinitialisation implicite. Les données du serveur de développement sont distinctes de celles de la fenêtre native.

## ADR 004 : Python en processus indépendant, MVP limité

Le pont Tauri n’accepte que trois identifiants fixes, jamais du code ou une commande shell. Les arguments sont structurés. Le runner Python attend sa requête sur stdin ; Rust affecte d’abord le processus à un Job Object Windows avec kill-on-close, puis libère la requête. Le runner contrôle aussi son processus d’exercice. Les sorties stdout/stderr sont bornées et l’exécution travaille dans le répertoire moteur. La commande native s’exécute sur un thread de travail pour ne pas bloquer l’interface.

Le bouton Arrêter et la fermeture normale de la fenêtre demandent la terminaison du Job Object. La mort du processus hôte ferme les handles du Job Object. Les six tests natifs incluent un arrêt réel avec descendant, les exemples et les refus ; la sortie tokens et le traceback ont aussi été contrôlés via IPC dans la fenêtre. Le clic Stop interactif pendant une démonstration courte reste non éprouvé.

La limite de dix secondes concerne uniquement trois démonstrations fixes courtes ; elle ne constitue pas une politique d’entraînement. L’exécution libre, les profils d’entraînement longs, extension, limites RAM/CPU et GPU seront un incrément distinct.

## ADR 005 : distribution locale et hors ligne

Aucun CDN, police distante, compte, télémétrie ou appel cloud n’est requis par le frontend. Le NSIS produit inclut WebView2 offlineInstaller : la construction a téléchargé l’installeur pour l’intégrer, mais l’installation cible doit pouvoir l’utiliser sans réseau. Cette stratégie reste à tester sur machine propre.

La découverte ne dépend pas de Python. Le chemin de faisabilité Python du poste est dans .local/python-path.txt (non distribué). L’empaquetage d’un Python autonome, NumPy et PyTorch demeure un livrable ultérieur ; le produit actuel ne doit pas être présenté comme un IDE Python complet.
Le profil natif utilise `appDirectoriesOverride: ".local/app-data"` près de l’exécutable. Deux fermetures/réouvertures ont préservé le brouillon et l’étape de cours. L’exécutable mesure 8 989 696 octets, le NSIS 218 870 418 octets. Les empreintes sont dans evidence/windows-artifacts.json. Un correctif local MIT de tauri-winres préserve les apostrophes dans les chemins de ressources Windows ; ses deux tests font partie du workspace Rust (voir CORRECTIF-CHEMIN-WINDOWS.md).
