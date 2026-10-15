# Suite priorisée

1. Terminer la qualification desktop : clic Stop interactif, double-clic Explorateur, boucle de cours complète dans la fenêtre native, installation NSIS sur machine propre. Déjà réalisés : compilation release/NSIS, 8 tests Rust, sorties Python via IPC et deux fermetures/réouvertures avec reprise.
2. Faire tester la boucle complète à des personnes n’ayant jamais codé avec le protocole PEDAGOGIE.md. Noter les hésitations avant d’étendre la bibliothèque.
3. Tester hors ligne avant lancement sur machine propre, WebView2 compris ; comparer 100 / 125 / 150 % de mise à l’échelle Windows, reprise après fermeture brutale, quotas et permissions.
4. Distribuer un environnement Python CPU autonome, NumPy et PyTorch : versions figées, licences, provenance, intégrité et taille mesurée. GPU facultatif séparé.
5. Exécution libre, vrai éditeur, console incrémentale, tests pédagogiques, projets et fichiers. Audit d’isolation OS et limites ressources, entraînements longs avec budget choisi et extension.
6. Giga-exercice de l’éditeur vide au modèle entraîné, évalué, sauvegardé et rechargé ; checkpoints uniquement pris en charge par le code.
7. Étendre progressivement le graphe profond (gradients, rétropropagation, attention), filtres et navigation zoom/pan si les tests le justifient. Tests de performance sur machine modeste et grands graphes.
8. Thèmes et exemples personnalisables, migrations documentées et reprise robuste à chaque évolution de schéma.