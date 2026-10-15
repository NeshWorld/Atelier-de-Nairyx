# Correctif reproductible : apostrophe dans le chemin Windows

La première compilation native a échoué avec RC2135. tauri-winres 0.3.6 échappait une apostrophe par `\'`, y compris dans le nom du fichier icône. Le compilateur RC interprétait alors le chemin `L'atelier de Nairyx` comme un autre chemin contenant une barre supplémentaire.

Le projet reste dans la racine imposée. Une copie locale de tauri-winres 0.3.6 est conservée sous src-tauri/vendor/tauri-winres avec sa licence MIT et ses informations de provenance. Le patch Cargo remplace uniquement cette dépendance. Dans src/helpers.rs, une apostrophe reste un caractère littéral dans les chaînes RC entre guillemets doubles. L’échappement des guillemets doubles, antislashs et caractères de contrôle est conservé.

Le test apostrophe_and_accents_remain_valid_in_rc_paths couvre un chemin contenant espaces, apostrophe et accents. Les deux tests de cette dépendance sont intégrés au workspace Rust. Les six tests de l’application et ces deux tests ont été exécutés avec succès ; preuve : evidence/native-tests.txt.

Commande reproductible :

```powershell
cargo test --manifest-path src-tauri/Cargo.toml --locked --workspace --lib -- --include-ignored
```

Le correctif est local ; aucun correctif amont ou PR publique n’est prétendu. Le retirer seulement après vérification d’une version amont corrigeant le même problème dans la vraie racine Windows.

La configuration appDirectoriesOverride utilise .local/app-data près de l’exécutable pour le profil WebView et les données de cette édition portable. useLocalToolsDir conserve les outils de packaging dans target/.tauri. Aucune redirection silencieuse du projet ailleurs n’est utilisée.