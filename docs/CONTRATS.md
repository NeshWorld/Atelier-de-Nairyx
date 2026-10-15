# Contrats du MVP — Laboratoire pédagogique IA

Racine : C:\Users\apapi\L'atelier de Nairyx. Aucun autre projet ne doit être modifié.
Stack : Tauri v2 / React / TypeScript / Vite. Interface de découverte autonome hors ligne.

## Propriétaires
- Principal : package.json, configuration, src/App.tsx, src/main.tsx, src/core/*, src/types.ts, src-tauri/*, tests/*, scripts/*, intégration et documentation finale.
- Agent interface : src/components/* et src/styles.css uniquement.
- Agent pédagogie : src/content/* et docs/PEDAGOGIE.md uniquement.
- Agent moteur : engine/* et docs/PYTHON.md uniquement.

## Modèle TypeScript (défini par le principal dans src/types.ts)
Mode = 'discovery' | 'developer'.
Concept = { id:string; title:string; subtitle:string; branch:'language'|'learning'|'models'; level:'essential'|'advanced'; parentIds:string[]; prerequisites:string[]; relatedIds:string[]; lessonId?:'tokenization'|'neuron'; x:number; y:number }.
Question = { id:string; prompt:string; options:string[]; correctIndex:number; explanation:string }.
Flashcard = { id:string; front:string; back:string }.
Lesson = { id:'tokenization'|'neuron'; title:string; duration:string; introduction:string; objectives:string[]; sections:{title:string;body:string}[]; flashcards:Flashcard[]; questions:Question[] }.
Progress version 1 : { version:1; mode:Mode; activeConcept:string; completed:string[]; lessons:Record<string,{step:number;answers:Record<string,number>;cardIndex:number}>; settings:{reducedMotion:boolean;textScale:number}; code:string; updatedAt:string }.

## Exports attendus du contenu
src/content/concepts.ts : concepts:Concept[]. Les nœuds essentiels sont tokens, neuron, training, models. tokens et neuron sont jouables, les autres sont annoncés à venir et restent explorables sans faux cours.
src/content/lessons.ts : lessons:Record<'tokenization'|'neuron',Lesson>.

## Exports attendus de l'interface
src/components/ConceptTree.tsx : default ConceptTree(props:{concepts:Concept[];selectedId:string;completed:string[];mode:Mode;expanded:boolean;onSelect:(id:string)=>void;onExpand:()=>void}). Graphe SVG avec boutons HTML accessibles, repli progressif, responsive.
src/components/TokenLab.tsx : default TokenLab(props:{onExercise?:(valid:boolean)=>void}). Phrase exacte, séparateurs aux frontières de caractères Unicode, tokens et identifiants pédagogiques ; ne pas prétendre utiliser un tokenizer réel.
src/components/NeuronLab.tsx : default NeuronLab(). Curseurs entrées/poids/biais, somme pondérée puis ReLU réelle, équation lisible.
src/styles.css : styles globaux, classes du parent décrites ci-dessous.

## Classes du parent pour styles
.app-shell, .sidebar, .brand, .brand-mark, .brand-name, .sidebar-nav, .nav-item[aria-current], .sidebar-bottom, .offline-indicator, .main-area, .topbar, .breadcrumb, .topbar-actions, .mode-switch, .mode-switch button[aria-pressed], .workspace, .page-header, .eyebrow, .page-title, .page-lead, .progress-pill, .explorer-layout, .tree-panel, .panel-heading, .tree-help, .detail-panel, .detail-kicker, .detail-title, .detail-description, .meta-row, .primary-button, .secondary-button, .text-button, .button-row, .lesson-layout, .lesson-sidebar, .lesson-steps, .step-button[aria-current], .lesson-content, .lesson-card, .step-heading, .step-description, .flashcard, .flashcard-front, .flashcard-back, .question-block, .question-option[aria-checked], .feedback, .success, .error, .notice, .settings-card, .field-row, .code-editor, .console-output, .toast, .empty-state, .completion-card, .mobile-brand, .skip-link, .section-label, .detail-objectives, .progress-track, .progress-fill, .course-progress, .stat-value, .stat-label, .coming-soon, .search-field.
Direction artistique : bibliothèque de connaissances sombre bleu nuit, accent menthe/vert et ivoire, arbre avec liens fins et nœuds lisibles, typographie système sans CDN. Fenêtre 1440x960 mais utilisable à 800px et petite fenêtre. Pas d'emojis décoratifs ni d'accumulation d'icônes.

## Protocole Python de faisabilité
UI appelle invoke('run_python_demo',{source:string}) -> Promise<{stdout:string;stderr:string;exitCode:number|null;timedOut:boolean;truncated:boolean}> ; invoke('stop_python_demo') -> void.
Ce MVP exécute uniquement des exemples approuvés ('tokens','neuron','error'), aucun code libre tant que contrôle d'arbre de processus non validé. L'éditeur futur conserve son code sans promettre une exécution disponible.
engine/probe.py : CLI Python standard --example tokens|neuron|error, stdout et stderr authentiques. engine/test_engine.py unittest (pas de dépendance externe). Préparer runner.py de processus séparé CLI JSON stdio, bornage et gestion Windows Job Object si possible, sans affirmer isolement de sécurité.
