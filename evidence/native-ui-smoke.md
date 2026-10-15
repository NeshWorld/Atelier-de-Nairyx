# Vérification interactive native — 15 octobre 2026

Application contrôlée : C:\Users\apapi\L'atelier de Nairyx\Laboratoire pedagogique IA.exe (release). Automatisation avec le skill computer-use et @oai/sky. Le créateur a explicitement autorisé la reprise après une interruption volontaire. Le serveur d’aperçu avait été arrêté avant le premier lancement natif ; la fenêtre charge http://tauri.localhost/ et dispose de ses ressources embarquées.

Observations réelles dans la fenêtre :

- Tokens et identifiants : sortie Unicode avec la phrase « L'atelier apprend avec l’IA : bonjour ! », tokens et identifiants, code de sortie 0.
- Exception Python volontaire : stderr, traceback RuntimeError et code de sortie 1 ; retour à la commande Exécuter disponible.
- Brouillon initial conservé et complété par le commentaire `# Test de reprise native : 15 octobre 2026`.
- Première fermeture avec Alt+F4 : une nouvelle observation list_windows ne retourne plus de fenêtre de cet exécutable. Lancement direct du même exécutable : nouvelle fenêtre ; le commentaire du brouillon est présent.
- Cours Du texte aux tokens : ouverture puis sélection de Manipuler, étape 2 sur 5.
- Deuxième fermeture Alt+F4 : disparition de la fenêtre confirmée. Deuxième lancement direct : nouvelle fenêtre, commande Reprendre l’exploration ; elle rouvre l’étape 2 sur 5, Manipuler.

Les identifiants de fenêtres observés passent de 265520 à 60164300 puis 76417348. Après le premier redémarrage, un clic par index a rencontré « coordinate input geometry is unavailable » ; une nouvelle sélection/activation/capture de fenêtre a permis de poursuivre. Aucun plantage de l’application n’a été observé pendant ces deux cycles. L’application a été laissée ouverte à la fin des essais.

Ces observations complètent les 49 tests automatisés ; elles ne sont pas comptées comme tests automatisés supplémentaires. Les captures ont été inspectées dans la conversation ; aucun fichier PNG natif n’est prétendu enregistré. Le commentaire de contrôle reste dans le brouillon de ce profil de test.

Limites : lancement par le chemin explicite via sky, pas double-clic dans l’Explorateur ; fermeture normale, pas crash injecté ; pas de cours natif terminé intégralement ; pas de clic Stop pendant un calcul ; pas de mesure de fuite de processus ; pas de changement du DPI Windows ; pas d’installation NSIS ni de machine propre déconnectée. L’arrêt du backend avec un descendant est couvert séparément par les tests Rust.

Le créateur a ensuite signalé un crash de son PC. Ce signalement n’établit ni la cause du crash, ni une réussite de récupération après panne. Après reprise, les empreintes SHA-256 des deux livrables ont été relues et correspondent exactement à evidence/windows-artifacts.json. Aucun diagnostic système hors du dossier n’a été entrepris.
