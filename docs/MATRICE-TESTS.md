# Matrice de tests — 15 octobre 2026

Exécution réelle sur ce poste Windows. « Réussi » correspond à une exécution ; « non exécuté » n’est pas une réussite. Les preuves navigateur ne démontrent pas une intégration desktop.

| Cas | Risque | Procédure | Résultat / preuve | Statut |
|---|---|---|---|---|
| Compilation frontend | Interface non construisible | npm run build | TypeScript + Vite ; evidence/frontend-build.txt | Réussi |
| Graphe et profondeur | Référence cassée, cycle, surcharge novice | npm test ; références, doublons, cycles, quatre essentiels, vue avancée | Sous-ensemble des 26 tests ; evidence/unit-results.json | Réussi |
| Grand graphe, filtre | Régression du filtre | Filtrage synthétique de 1000 nœuds en test unitaire | 200 essentiels sélectionnés ; aucun benchmark de fluidité | Réussi limité au filtre |
| Calculs et correction | Notion scientifique ou résultat erroné | Reconstruction Unicode, vocabulaire, ReLU, QCM et validation numérique avec virgule | evidence/unit-results.json | Réussi |
| Progression | Perte des réponses, étape, code ou préférences | Deux slots alternés, reprise et sauvegarde ; quota refusé simulé | evidence/unit-results.json | Réussi |
| Corruption | Effacement silencieux | Corrompre copie récente puis deux copies ; vérifier restauration ou blocage | Copie valide reprise ; copies illisibles conservées | Réussi |
| Erreurs de stockage | Crash de l’interface | Stockage inaccessible / état invalide simulés | Message et état de session ; tests unitaires | Réussi |
| Boucle tokenisation | Cours incomplet | Déplacer frontière au clavier, compter vocabulaire, répondre aux cinq QCM, recharger | evidence/e2e-results.json ; evidence/cours-termine.png | Réussi dans navigateur |
| Boucle neurone | Manipulation décorative sans calcul | Changer curseur au clavier, retourner carte avec Entrée, calculer, répondre, recharger | evidence/e2e-results.json | Réussi dans navigateur |
| Réseau après chargement | Ressource distante cachée | Bloquer demandes externes ; couper réseau du contexte navigateur puis naviguer dans cours | Aucune demande externe dans scénario contrôlé ; interactions disponibles | Réussi dans navigateur après chargement |
| Lecture et petite fenêtre | Texte coupé, largeur débordante | 1440, 1000, 800 px ; agrandissement 130 % ; contrôle des boîtes des quatre nœuds | Captures evidence/arbre-*.png | Réussi sur tailles testées |
| Accessibilité automatique | Contraste / noms / ARIA manquants | Axe WCAG 2 A/AA et 2.1 AA sur arbre, labo tokens, préférences et atelier | Aucune violation dans les écrans contrôlés ; rapport E2E | Réussi, audit limité |
| Python réel | Sortie inventée ou erreur perdue | unittest probe/runner ; stdout, traceback stderr, calculs et exitCode | 10 tests, evidence/python-tests.txt | Réussi |
| Arbre Python | Processus enfant orphelin | Fixture bornée crée descendant ; timeout ferme Job, vérifier enfant arrêté | Tests Windows avec Job Object, y compris Jobs imbriqués | Réussi moteur Python |
| Flux saturés | Blocage de pipe / mémoire | Émettre 163840 octets par flux et plafonner à 1024 par flux | Deux flux drainés et tronqués, sans blocage | Réussi |
| Entrées moteur | Code libre, chemin ou JSON non admis | Types invalides, options inconnues, chemin ../, requête >4096 octets | Refus et retour structuré | Réussi |
| Chemins Windows | Espaces, apostrophe, accents | Tests depuis vraie racine et copie temporaire nommée « preuve l’été » | Exécution Python réussie ; build frontend dans vraie racine | Réussi pour composants testés |
| Audit dépendances JS | Vulnérabilité connue | npm audit --json | 0 vulnérabilité déclarée ; evidence/npm-audit.json | Réussi à la date de l’audit |
| Compilation native et packaging | Aucun exécutable utilisable | npm run desktop:build -- -- --locked | Release et NSIS produits ; evidence/windows-artifacts.json ; tauri-info-after-install.txt | Réussi sur ce poste |
| Pont Rust–Python / Stop | Erreur ou annulation incorrecte | Tests réels tokens, neurone, stderr, refus IPC, Stop avec descendant | 6 tests natifs ; evidence/native-tests.txt | Réussi backend natif |
| Ressources Windows | Apostrophe invalide dans chemin RC | Tests du correctif tauri-winres et compilation dans la racine imposée | 2 tests ; evidence/native-tests.txt ; docs/CORRECTIF-CHEMIN-WINDOWS.md | Réussi |
| IPC dans la fenêtre native | Sortie ou erreur perdue entre interface et moteur | Exécuter tokens puis exception volontaire | stdout avec code 0 ; traceback stderr avec code 1 ; evidence/native-ui-smoke.md | Réussi ; clic Stop interactif non éprouvé |
| Lancement direct, fermeture native et reprise | Démarrage impossible ou perte réelle | Exécutable lancé directement ; deux fermetures Alt+F4 et deux réouvertures | Brouillon conservé ; cours repris à l’étape 2/5 ; evidence/native-ui-smoke.md | Réussi sur ce poste ; double-clic Explorateur et cours complet natif non éprouvés |
| Installation / lancement hors ligne | Dépendance réseau au démarrage | NSIS et WebView2 sur VM propre déconnectée avant lancement | Installateur produit avec WebView2 hors ligne ; aucune VM propre déconnectée testée | Non exécuté |
| DPI Windows | Chevauchement sous scaling OS | Fenêtre native à 100/125/150 % et tailles écran | Tests CSS ne remplacent pas tests DPI OS | Non exécuté |
| Crash natif / arrêt OS / disque plein | Perte de données réelle | VM dédiée ; crash, permissions et manque d’espace réels | Simulations stockage couvertes, panne système non testée | Non exécuté |
| Performance globale | Lenteur, charge ou fuite de processus | Mesures native, grand graphe rendu, machine modeste, CPU/RAM/GPU | Aucun benchmark global, aucune mesure GPU | Non exécuté |
| Exécution libre et entraînements | Droits utilisateur exposés, entraînement interrompu | Isolation OS, profils longs, extension et checkpoints | Fonctionnalités non implémentées ; aucun entraînement prétendu | Non exécuté — backlog |
| Test novice humain | Parcours incompréhensible | Protocole docs/PEDAGOGIE.md avec personne n’ayant jamais codé | Aucun participant sollicité | Non exécuté |

La suite E2E est exécutée dans Chromium portable ; Edge système se fermait immédiatement avant tout chargement. La preuve de cette limitation est conservée dans evidence/e2e-edge-launch-failure.json. Elle n’est pas comptée comme un échec de l’application corrigé.

La compilation native est validée et 49 tests automatisés ont réussi. Les anciens journaux d’échec avant installation des prérequis sont historiques. Les validations de machine propre, de DPI OS et avec des novices restent ouvertes. Ce résultat ne constitue pas une certification complète de sécurité ou d’accessibilité. Le crash du PC signalé ensuite par le créateur n’a pas fait l’objet d’un diagnostic et n’est pas compté comme un test de résistance réussi ; les deux livrables ont conservé leurs empreintes SHA-256 après ce signalement.