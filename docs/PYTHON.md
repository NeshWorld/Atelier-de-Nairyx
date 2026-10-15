# Preuve moteur Python — exemples approuvés

Le moteur exécute réellement Python dans un processus séparé. La CLI n'accepte que trois exemples fixes : `tokens`, `neuron`, `error`. Aucun texte de code utilisateur ne lui est transmis pour exécution. Le découpage des tokens est une démonstration pédagogique explicite, pas le tokenizer d'un modèle de langage. Le neurone calcule réellement sa somme pondérée puis ReLU. L'exemple `error` lève volontairement une exception Python ; son traceback et son code de sortie sont authentiques.

## Runtime et dépendances constatés le 15 octobre 2026

Runtime testé : `C:\Users\apapi\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`, Python 3.12.14, Windows AMD64. NumPy 2.3.5 a été importé et un calcul `numpy.dot` a donné 0.19999999999999998. PyTorch (`torch`) est absent du runtime examiné (`find_spec` retourne None). Aucun paquet n'a été installé. Les exemples et leurs tests utilisent uniquement la bibliothèque standard ; NumPy n'est pas une exigence d'exécution.

## Appels reproductibles

Depuis `C:\Users\apapi\L'atelier de Nairyx` en PowerShell :

```powershell
$env:PYTHONDONTWRITEBYTECODE = '1'
$pythonRuntime = 'C:\Users\apapi\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
& $pythonRuntime -B .\engine\probe.py --example tokens
& $pythonRuntime -B .\engine\probe.py --example neuron
& $pythonRuntime -B .\engine\probe.py --example error
'{"example":"tokens","timeoutSeconds":3,"maxOutputBytes":32768}' | & $pythonRuntime -B .\engine\runner.py
& $pythonRuntime -B -m unittest discover -s .\engine -p test_engine.py -v
```

`runner.py` lit un unique objet JSON UTF-8 depuis stdin, jusqu'à EOF. Le parent doit écrire puis fermer stdin. Champs permis : `example` obligatoire, `timeoutSeconds` optionnel de 0.05 à 10 (défaut 3), `maxOutputBytes` optionnel entier de 256 à 65536 (défaut 32768, plafond pour chacun des deux flux). Toute clé inconnue, exemple différent, type invalide, JSON invalide ou requête de plus de 4096 octets est refusé. Aucun chemin ni commande venant du JSON n'est exécuté.

Une ligne JSON est rendue sur stdout :

```json
{"stdout":"sortie réelle","stderr":"erreur réelle","exitCode":0,"timedOut":false,"truncated":false}
```

Le code de sortie du runner vaut 0 pour une exécution traitée, y compris l'exemple volontairement en erreur ou le timeout. Le code de sortie de l'exemple est dans `exitCode`. Le runner sort avec 2 et `exitCode:null` pour une requête refusée ou une panne de préparation. Les sorties sont décodées en UTF-8, avec remplacement d'un caractère éventuellement coupé à la limite d'octets. `truncated` indique le dépassement d'au moins un flux. Deux lecteurs simultanés drainent les flux même après saturation afin d'éviter un blocage par remplissage de pipe.

## Contrôle des processus et intégration native

Sous Windows, le runner crée un Job Object avec `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE`, crée le probe fixe, l'affecte au Job et vérifie `IsProcessInJob` avant de lui envoyer la porte stdin `RUN`. Le probe attend cette porte avant l'exemple. En cas d'affectation impossible, l'exécution échoue ; elle ne continue pas sans contrôle. La fermeture du Job à la fin ou au timeout termine aussi les descendants. Le handle du Job n'est pas héritable. Sous POSIX, un groupe de processus dédié est créé puis terminé à la fin.

Pour `stop_python_demo`, le parent Rust doit posséder son propre Job Object englobant `runner.py`. Affecter runner au Job avant d'écrire sa requête JSON garantit qu'il attend encore stdin, donc ne lance pas probe avant l'affectation. Fermer le Job parent annule runner et son arbre. Un test exécute réellement le runner dans un Job parent puis son probe dans un Job imbriqué : combinaison validée sur cette machine. La preuve Python n'implémente pas à elle seule la commande Tauri d'annulation ; celle-ci appartient au parent natif.

Windows peut attribuer `exitCode:0` à un processus terminé par fermeture du Job. L'interface doit donc traiter `timedOut:true` avant d'interpréter `exitCode`. L'annulation native doit avoir son propre retour d'état ; elle ne doit pas afficher un succès à partir d'un code 0 seul.

Ces contrôles concernent la durée, les sorties et l'arbre des processus. Ils ne limitent pas les accès disque, réseau ou secrets du compte Windows et ne constituent pas une sandbox de sécurité. L'exécution de code libre reste désactivée. Les scénarios `_fixtures.py` sont fixes, bornés à trente secondes en l'absence de contrôle, et sont utilisés uniquement par les tests, jamais exposés par la CLI JSON.

## Vérification effectuée

Dix tests réels ont réussi sous Windows en 2.079 secondes depuis le staging autorisé, avec `-B` et `PYTHONDONTWRITEBYTECODE=1` : reconstruction exacte des tokens Unicode ; calcul du neurone ; stderr authentique et sortie non nulle ; timeout ; saturation simultanée stdout/stderr (163840 octets chacun, conservation de 1024 chacun) ; refus de types/options invalides ; protocole CLI JSON et volume de requête ; copie et exécution dans un chemin contenant apostrophe, espace et accent ; extinction d'un descendant après fermeture Job ; Jobs imbriqués parent/runner/probe. Les tests ne téléchargent rien. Les copies temporaires se trouvent sous `engine` et sont retirées à la fin du test.

Commande de test staging utilisée :

```powershell
& 'C:\Users\apapi\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -B -m unittest discover -s '.python-staging\engine' -p 'test_engine.py' -v
```

Après intégration, réexécuter la commande racine ci-dessus pour consigner la preuve dans l'emplacement final.

Preuve après intégration : les 10 tests ont été réexécutés depuis la racine finale et ont réussi en 2,372 s lors de la dernière exécution consignée (evidence/python-tests.txt). L’environnement consigné dans evidence/python-environment.json vérifie NumPy 2.3.5 avec un second calcul donnant environ 0,8 ; torch reste absent.

Le pont Rust a ensuite été compilé et éprouvé : six tests natifs réussis, dont Stop et extinction d’un descendant. Dans la fenêtre Windows, tokens renvoie la vraie sortie avec code 0 ; error affiche stderr et le traceback avec code 1. Preuves : evidence/native-tests.txt et evidence/native-ui-smoke.md.
