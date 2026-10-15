# Laboratoire pédagogique IA — incrément 0.1

Projet créé dans `C:\Users\apapi\L'atelier de Nairyx` le 15 octobre 2026.

**État : application Windows compilée et ouverte dans sa propre fenêtre ; exécutable et installateur produits.** Rust et Microsoft C++ Build Tools ont été installés avec l’autorisation du créateur. Les tests natifs et deux cycles de fermeture/réouverture ont réussi sur ce poste. La validation de distribution sur machine propre et les essais avec des novices restent à réaliser.

Pour ouvrir le laboratoire, double-cliquer sur `Laboratoire pedagogique IA.exe` à la racine de ce dossier (8,6 Mio). Aucun serveur de développement ni navigateur externe à démarrer. Conserver le dossier du projet pour les ressources et la configuration Python de cette édition. L’installateur `Installer-Laboratoire-IA-0.1.0.exe` (209 Mio) est également disponible ; son installation sur une machine propre n’a pas été testée. Les exécutables ne sont pas signés.

## Ce qui fonctionne dans l’interface

- Arbre non linéaire : quatre notions essentielles, huit ramifications facultatives, domaines et recherche dans la vue approfondie ; aucun cours verrouillé par un prérequis.
- Cours « Du texte aux tokens » : explications, séparations manipulables entre caractères, tokens et identifiants illustratifs, cinq cartes retournables, exercice de vocabulaire et cinq QCM expliqués.
- Cours « Un neurone, pas à pas » : entrées, poids, biais, calcul de la somme et ReLU reliés aux curseurs, cartes, calcul numérique et QCM.
- Carnet, reprise des étapes, sauvegarde de la progression et du brouillon Python, récupération d’une copie valide, messages d’erreur et export des données.
- Préférences de texte et d’animations, clavier et focus visible. Aucun CDN, compte, télémétrie ou appel cloud pour les cours.
- Exemples Python réels en processus séparés : tokens, neurone et exception volontaire. Le moteur et le pont natif sont testés ; les sorties tokens et exception ont aussi été vérifiées dans la fenêtre Windows.

La tokenisation est explicitement pédagogique ; elle n’est pas celle d’un tokenizer de modèle réel. Les curseurs calculent une fonction ; ils n’entraînent pas un modèle. Le brouillon est conservé mais n’est pas exécutable librement dans cet incrément. NumPy est présent dans le runtime de faisabilité du poste ; PyTorch est absent et aucun environnement autonome n’est encore distribué.

## Vérifications

49 tests automatisés réussis : 26 Vitest, 10 Python, 5 scénarios Playwright, 6 Rust natifs et 2 du correctif de ressources Windows. Compilations TypeScript / Vite et Tauri release avec installateur NSIS réussies. Audit axe sans violation sur les écrans contrôlés. Voir `docs/MATRICE-TESTS.md`, les rapports JSON/TXT et les captures sous `evidence`.

Les tests Playwright contrôlent l’interface web de développement dans un Chromium portable, pas une fenêtre native. Les tests hors réseau portent sur l’usage après chargement ; le lancement et l’installation desktop déconnectés restent à prouver. Deux cycles natifs de fermeture/réouverture ont vérifié le brouillon et la reprise à l’étape « Manipuler » ; voir `evidence/native-ui-smoke.md`. Aucun test avec un participant novice n’a été inventé.

## Examiner l’aperçu en développement

Node.js et les dépendances sont déjà disponibles sur ce poste.

```powershell
Set-Location -LiteralPath "C:\Users\apapi\L'atelier de Nairyx"
npm.cmd run dev
```

L’aperçu est à `http://127.0.0.1:1420`. Ce serveur de développement ne remplace pas la livraison desktop. Sa progression est séparée de celle de l’application native.

## Reconstruire l’application Windows

Suivre les [prérequis officiels Tauri](https://v2.tauri.app/start/prerequisites/) : Rust cible MSVC et Microsoft C++ Build Tools avec SDK Windows. Aucun script du projet ne les installe silencieusement. Ces prérequis sont maintenant installés sur ce poste. Après une installation sur un autre poste, ouvrir un terminal avec le PATH actualisé.

```powershell
Set-Location -LiteralPath "C:\Users\apapi\L'atelier de Nairyx"
npm.cmd run tauri info
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build.ps1
```

Les fichiers construits se trouvent dans `src-tauri\target\release\laboratoire-pedagogique-ia.exe` et `src-tauri\target\release\bundle\nsis`. Le script copie aussi les livrables avec leurs noms lisibles à la racine. `Lancer.vbs` ouvre l’exécutable sans console. Les tailles et empreintes SHA-256 sont consignées dans `evidence/windows-artifacts.json`. Le profil WebView2 et la progression de cette édition sont sous `.local/app-data` près de l’exécutable ; conserver ce dossier pour conserver ses données.

L’installateur produit embarque l’installeur WebView2 hors ligne. La construction initiale nécessite ses téléchargements ; cette stratégie doit encore être testée sur machine propre. Voir la [distribution Windows Tauri](https://v2.tauri.app/distribute/windows-installer/).

Pour la faisabilité Python, le chemin propre à ce poste est dans `.local/python-path.txt`, non redistribué. Pour le remplacer volontairement :

```powershell
.\scripts\configure-python.ps1 -PythonPath "C:\chemin\vers\python.exe"
```

## Reproduire les tests

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run test:e2e
$env:PYTHONDONTWRITEBYTECODE = '1'
$pythonRuntime = (Get-Content -LiteralPath .\.local\python-path.txt -Raw).Trim()
& $pythonRuntime -B -m unittest discover -s engine -p test_engine.py -v
```

Playwright utilise son navigateur portable sous `.local/browsers`, déjà téléchargé ici. Sur un autre poste, installer explicitement les dépendances et ce navigateur :

```powershell
npm.cmd ci --ignore-scripts --cache .npm-cache
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.local\browsers'
npm.cmd exec -- playwright install chromium --only-shell
```

Les téléchargements servent à construire et tester ; ils ne sont pas exécutés lors d’un cours. Les versions JavaScript et intégrités sont dans package-lock.json ; licences dans docs/DEPENDANCES.json. `src-tauri/Cargo.lock` est généré et utilisé avec `--locked`. Le correctif local tauri-winres, sa licence MIT et sa justification sont conservés ; voir `docs/CORRECTIF-CHEMIN-WINDOWS.md`. Pour reproduire les huit tests Rust, utiliser `scripts/test-native.ps1` avec le Python configuré.

## Documents

- `docs/ARCHITECTURE.md` : décisions, stockage et interfaces.
- `docs/PEDAGOGIE.md` : rigueur scientifique et protocole novice.
- `docs/PYTHON.md` : protocole, contrôles et preuves du moteur.
- `docs/SECURITE.md` : menace, permissions et limites.
- `docs/MATRICE-TESTS.md` : résultats réels et tests non exécutés.
- `docs/DEFAUTS.md` : blocages et défauts.
- `docs/BACKLOG.md` : suite, dont vrai IDE, NumPy / PyTorch CPU, entraînements longs et giga-exercice.
- `docs/SPECIFICATION-ORIGINALE.md` : document fourni, conservé pour traçabilité.