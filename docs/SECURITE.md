# Sécurité : modèle de menace et limites

Données : progression, préférences, brouillon ; aucun identifiant ni secret nécessaire. Adversaires envisagés : code arbitraire collé dans un futur éditeur, exemples modifiés sur le disque, message IPC malformé, fichier de stockage corrompu, dépendance compromise.

## Surface effective du MVP

- Les cours exécutent uniquement des calculs pédagogiques JavaScript. Une segmentation illustrative n’est pas un tokenizer de modèle installé ; un neurone manipulé n’est pas un modèle entraîné.
- Le brouillon n’est pas exécuté. L’IPC autorise seulement tokens, neuron et error ; aucun chemin n’est transmis par le frontend.
- Aucun shell n’interprète le code, les arguments ou le chemin avec apostrophe. Le moteur refuse les entrées non conformes à son protocole.
- Le Job Object Windows vise la durée de vie de l’arbre de processus. Il ne restreint pas les droits fichiers/réseau de Python et n’est pas un bac à sable de sécurité.
- Le Python configuré et les scripts livrés sont du code de confiance local. Un utilisateur ou logiciel qui modifie ces fichiers peut modifier leur comportement. Aucun contrôle d’intégrité à l’exécution n’est promis.
- La CSP de production limite les ressources à l’application, les communications IPC et les styles intégrés nécessaires aux jauges ; aucun plugin shell, accès libre aux fichiers ou service distant n’est exposé.
- La sauvegarde est validée et munie d’un checksum pour corruption accidentelle ; ce checksum ne protège pas contre un attaquant local.
- Les dépendances JavaScript sont épinglées avec package-lock.json et intégrité npm. Un audit sans vulnérabilité connue ne constitue pas une preuve d’absence de vulnérabilité.

## Exigences avant exécution libre

Politique de confiance explicite ; étude et audit d’une isolation OS plus forte ; bornage de sortie ; annulation de tout l’arbre ; répertoire d’exercice choisi et contrôlé ; sauvegarde du code indépendante ; profils courts/tests/entraînements longs avec avertissement et extension ; limites ressources Windows vérifiées ; aucun téléchargement silencieux de bibliothèques ou de modèles ; dépendances CPU de base et GPU facultatives ; checkpoints uniquement si le code les produit.

Ne jamais annoncer la récupération automatique des poids après interruption arbitraire, l’isolement réseau/fichiers, la mesure GPU, une protection mémoire ou un IDE complet avant implémentation et test.

## Tests à isoler

Les tests du runner utilisent des fixtures contrôlées, des processus temporaires et aucun effacement de données utilisateur. Les scénarios destructifs, disque réellement plein et scripts malveillants ne doivent être exécutés que dans une machine virtuelle dédiée et autorisée. La matrice de tests indique explicitement les tests non effectués.
## Preuves natives ajoutées

Les six tests Rust incluent l’arrêt réel d’une fixture et de son descendant par le Job Object, les sorties réelles des trois exemples et le refus des sources non admises. Les deux tests du correctif de ressources Windows sont aussi exécutés. Ces preuves sont dans evidence/native-tests.txt. La fenêtre native a affiché stdout des tokens (code 0) et le traceback de l’exception (code 1). Le clic Stop interactif n’a pas été testé. Cargo.lock fige les résolutions Rust ; aucun audit de vulnérabilités Rust n’est déclaré réalisé. Les exécutables produits ne sont pas signés.
