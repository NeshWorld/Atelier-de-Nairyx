# Défauts, limitations et blocages

| ID | Gravité | Reproduction | État |
|---|---|---|---|
| ENV-01 | Résolu | Rust/MSVC/SDK initialement absents | Prérequis installés avec autorisation ; release et NSIS compilés |
| NAT-01 | Validation partielle | Fenêtre native et pont Python | 6 tests natifs réussis ; tokens/erreur vérifiés dans la fenêtre ; 2 fermetures/réouvertures avec reprise. Clic Stop interactif et double-clic Explorateur non éprouvés |
| DIST-01 | Bloquant distribution | Aucune installation sur machine propre déconnectée | Ouvert ; NSIS construit avec WebView2 hors ligne ; installation propre non testée |
| DEV-01 | Exigence produit différée | Brouillon non exécutable librement ; torch absent ; Python autonome non livré | Backlog ferme, annoncé dans l’interface |
| QA-01 | Validation produit | Aucun testeur novice réel ni scaling DPI Windows natif | Protocole prêt ; non exécuté |
| ENV-02 | Outil de test | Edge système se ferme avant création de page avec Playwright | Chromium de test portable utilisé dans le projet ; limitation Edge conservée en preuve |
| UI-01 | Lisibilité | À 800 px, le quatrième essentiel dépassait le cadre interne | Corrigé ; quatre boîtes contrôlées visibles, capture et E2E |
| UI-02 | Confort | Agrandir le texte peut allonger le menu au-delà de la fenêtre | Menu rendu défilable ; texte conservé |
| NATIVE-STOP | Fiabilité | Course entre Stop et sortie du runner | Vérification cancelled ajoutée après attente ; contrôle d’erreur Windows ajouté ; test natif réel Stop + descendant réussi ; clic interactif Stop non éprouvé |

Limites assumées : carte approfondie défilable dans une petite fenêtre ; sélections aux points de code Unicode (pas aux graphèmes) ; ID pédagogiques réattribués localement ; reprise entre origines aperçu/natif non partagée ; export disponible, import encore absent. Les fichiers temporaires de transfert des sous-agents n’ont pas remplacé la racine de projet.
Le crash PC signalé après les essais n’a pas été diagnostiqué : aucune cause attribuée à l’application. Les empreintes des deux exécutables sont inchangées après le signalement.
