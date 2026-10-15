import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { LessonProgress, Progress, PythonResult } from "./types";
import { concepts } from "./content/concepts";
import { lessons } from "./content/lessons";
import { grade } from "./core/learning";
import {
  freshProgress,
  lessonProgress,
  loadProgress,
  saveProgress,
  STORAGE_KEYS,
} from "./core/storage";
import ConceptTree from "./components/ConceptTree";
import TokenLab from "./components/TokenLab";
import NeuronLab from "./components/NeuronLab";

type View = "explore" | "lesson" | "notebook" | "developer" | "settings";
const steps = [
  "Comprendre",
  "Manipuler",
  "Mémoriser",
  "S’entraîner",
  "Se tester",
];
function Icon({ kind }: { kind: "tree" | "book" | "code" | "settings" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      {kind === "tree" ? (
        <>
          <path d="M12 3v7M5 14v-4h14v4M12 10v8" />
          <circle cx="12" cy="3" r="2" />
          <circle cx="5" cy="17" r="2" />
          <circle cx="12" cy="20" r="2" />
          <circle cx="19" cy="17" r="2" />
        </>
      ) : kind === "book" ? (
        <>
          <path d="M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v14c-4-1-7 0-9 2-2-2-5-3-9-2Z" />
        </>
      ) : kind === "code" ? (
        <>
          <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-5 2 2-14" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="m10 3 4 0 1 3 3 1 3 2-1 4-2 2-1 3-3 3-4-1-2-2-3-1-2-3 1-4 2-2 1-3Z" />
        </>
      )}
    </svg>
  );
}
function download(name: string, value: string) {
  const url = URL.createObjectURL(
    new Blob([value], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function App() {
  const initial = useRef<ReturnType<typeof loadProgress> | null>(null);
  if (!initial.current)
    initial.current = loadProgress({
      getItem: (key) => window.localStorage.getItem(key),
    });
  const [progress, setProgress] = useState<Progress>(initial.current.progress);
  const [view, setView] = useState<View>("explore");
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState(initial.current.message);
  const [storageBlocked, setStorageBlocked] = useState(initial.current.blocked);
  const [flipped, setFlipped] = useState(false);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [neuronAnswer, setNeuronAnswer] = useState("");
  const [exerciseFeedback, setExerciseFeedback] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [running, setRunning] = useState(false);
  const [pythonResult, setPythonResult] = useState<PythonResult | null>(null);
  const [pythonError, setPythonError] = useState("");
  const [example, setExample] = useState("tokens");
  const active =
    concepts.find((c) => c.id === progress.activeConcept) ?? concepts[0];
  const lesson = active.lessonId ? lessons[active.lessonId] : null;
  const lp = lessonProgress(progress, lesson?.id ?? "");
  const currentStep = Math.min(lp.step, 4);
  const card = lesson?.flashcards[lp.cardIndex % lesson.flashcards.length];
  const native = "__TAURI_INTERNALS__" in window;
  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * progress.settings.textScale}px`;
    document.documentElement.dataset.reduceMotion = String(
      progress.settings.reducedMotion,
    );
    if (!storageBlocked) {
      try {
        saveProgress(localStorage, progress);
      } catch (e) {
        setNotice(
          `Sauvegarde impossible : ${e instanceof Error ? e.message : "stockage indisponible"}`,
        );
      }
    }
  }, [progress, storageBlocked]);
  function patch(update: Partial<Progress>) {
    setProgress((p) => ({
      ...p,
      ...update,
      updatedAt: new Date().toISOString(),
    }));
  }
  const updateLesson = useCallback(
    (update: Partial<LessonProgress>) => {
      if (!lesson) return;
      setProgress((p) => ({
        ...p,
        lessons: {
          ...p.lessons,
          [lesson.id]: { ...lessonProgress(p, lesson.id), ...update },
        },
        updatedAt: new Date().toISOString(),
      }));
    },
    [lesson],
  );
  const onTokenExercise = useCallback(
    (valid: boolean) => updateLesson({ exercisePassed: valid }),
    [updateLesson],
  );
  function select(id: string) {
    patch({ activeConcept: id });
    setChecked(false);
    setFinished(false);
    setFlipped(false);
  }
  function openLesson() {
    if (!lesson) return;
    setView("lesson");
    setChecked(false);
    setFinished(false);
    setExerciseFeedback("");
  }
  function changeStep(step: number) {
    updateLesson({ step });
    setChecked(false);
    setFinished(false);
    setFlipped(false);
    setExerciseFeedback("");
  }
  async function runPython() {
    setRunning(true);
    setPythonError("");
    setPythonResult(null);
    try {
      setPythonResult(
        await invoke<PythonResult>("run_python_demo", { source: example }),
      );
    } catch (e) {
      setPythonError(String(e));
    } finally {
      setRunning(false);
    }
  }
  const results = lesson ? grade(lesson.questions, lp.answers) : null;
  const nav = [
    { id: "explore", text: "Arbre des savoirs", icon: "tree" },
    { id: "notebook", text: "Mon carnet", icon: "book" },
    { id: "developer", text: "Atelier Python", icon: "code" },
  ] as const;
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Aller au contenu
      </a>
      <aside className="sidebar" aria-label="Navigation principale">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView("explore");
          }}
          aria-label="Laboratoire pédagogique IA, accueil"
        >
          <span className="brand-mark">
            <Icon kind="tree" />
          </span>
          <span className="brand-name">
            L’atelier<span>de Nairyx</span>
          </span>
        </a>
        <div className="section-label">LE LABORATOIRE</div>
        <nav className="sidebar-nav">
          {nav.map((n) => (
            <button
              key={n.id}
              className="nav-item"
              aria-current={
                view === n.id || (n.id === "explore" && view === "lesson")
                  ? "page"
                  : undefined
              }
              onClick={() => setView(n.id)}
            >
              <Icon kind={n.icon} />
              {n.text}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="section-label">À VOTRE RYTHME</span>
          <p>
            Une idée à explorer.
            <br />
            Une expérience à essayer.
          </p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Cours terminés"
            aria-valuenow={progress.completed.length}
            aria-valuemin={0}
            aria-valuemax={2}
          >
            <span
              className="progress-fill"
              style={{
                width: `${Math.min(100, (progress.completed.length / 2) * 100)}%`,
              }}
            />
          </div>
          <span className="course-progress">
            {progress.completed.length} / 2 cours terminés
          </span>
        </div>
        <div className="sidebar-bottom">
          <button
            className="nav-item"
            aria-current={view === "settings" ? "page" : undefined}
            onClick={() => setView("settings")}
          >
            <Icon kind="settings" />
            Préférences
          </button>
          <div className="offline-indicator">
            <span />
            Local · sans compte
          </div>
          <div className="sidebar-version">
            Laboratoire pédagogique IA · v0.1
          </div>
        </div>
      </aside>
      <main className="main-area" id="main-content" tabIndex={-1}>
        <header className="topbar">
          <div className="breadcrumb">
            <span>Laboratoire pédagogique IA</span>
            <span aria-hidden="true">/</span>
            <strong>
              {view === "explore"
                ? "Exploration"
                : view === "lesson"
                  ? lesson?.title
                  : view === "settings"
                    ? "Préférences"
                    : view === "developer"
                      ? "Atelier Python"
                      : "Mon carnet"}
            </strong>
          </div>
          <div className="topbar-actions">
            <span className="local-tag">Données sur cet appareil</span>
          </div>
        </header>
        <div className="workspace">
          {notice && (
            <div className="notice" role="status">
              {notice}
              <button
                className="text-button"
                onClick={() => setNotice("")}
                aria-label="Masquer le message"
              >
                Fermer
              </button>
            </div>
          )}
          {view === "explore" && (
            <>
              <div className="page-header">
                <div>
                  <p className="eyebrow">COMPRENDRE EN EXPÉRIMENTANT</p>
                  <h1 className="page-title">Les idées prennent racine.</h1>
                  <p className="page-lead">
                    Explorez les mécanismes de l’IA, une découverte à la fois.
                    <br />
                    Choisissez une notion. Manipulez. Faites le lien.
                  </p>
                </div>
                <div className="mode-switch" aria-label="Parcours">
                  <button
                    aria-pressed={progress.mode === "discovery"}
                    onClick={() =>
                      patch({
                        mode: "discovery",
                        activeConcept:
                          active.level === "advanced" && !expanded
                            ? "tokens"
                            : active.id,
                      })
                    }
                  >
                    Découverte
                  </button>
                  <button
                    aria-pressed={progress.mode === "developer"}
                    onClick={() => patch({ mode: "developer" })}
                  >
                    Développeur
                  </button>
                </div>
              </div>
              <div className="explorer-layout">
                <section className="tree-panel" aria-label="Arbre des concepts">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">
                        VOTRE TERRAIN D’EXPLORATION
                      </span>
                      <h2>L’arbre des savoirs</h2>
                    </div>
                    <span className="progress-pill">
                      {progress.mode === "discovery" && !expanded
                        ? "4 notions essentielles"
                        : "Vue approfondie"}
                    </span>
                  </div>
                  <div className="tree-toolbar">
                    <p className="tree-help">
                      {progress.mode === "discovery"
                        ? "Aucun prérequis. Commencez où vous voulez."
                        : "Les prérequis sont des conseils : chaque branche reste accessible."}
                    </p>
                    {(expanded || progress.mode === "developer") && (
                      <label className="search-field">
                        <span className="sr-only">Rechercher une notion</span>
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Rechercher une notion…"
                        />
                      </label>
                    )}
                  </div>
                  <ConceptTree
                    concepts={
                      search
                        ? concepts.filter((c) =>
                            c.title
                              .toLocaleLowerCase("fr")
                              .includes(search.toLocaleLowerCase("fr")),
                          )
                        : concepts
                    }
                    selectedId={active.id}
                    completed={progress.completed.map(
                      (id) => concepts.find((c) => c.lessonId === id)?.id ?? id,
                    )}
                    mode={progress.mode}
                    expanded={expanded}
                    onSelect={select}
                    onExpand={() => {
                      setExpanded(!expanded);
                      setSearch("");
                      if (
                        expanded &&
                        active.level === "advanced" &&
                        progress.mode === "discovery"
                      )
                        select("tokens");
                    }}
                  />
                  <div className="tree-footer">
                    <span>
                      <i className="legend-dot available" />À explorer
                    </span>
                    <span>
                      <i className="legend-dot done" />
                      Terminé
                    </span>
                    <span>Chaque branche est une nouvelle piste.</span>
                  </div>
                </section>
                <aside
                  className="detail-panel"
                  aria-label="Notion sélectionnée"
                >
                  <p className="detail-kicker">
                    {active.branch === "language"
                      ? "01 · LANGAGE"
                      : active.branch === "learning"
                        ? "02 · APPRENTISSAGE"
                        : "03 · MODÈLES"}
                  </p>
                  <div className="concept-emblem" aria-hidden="true">
                    {active.branch === "language" ? (
                      <span>
                        ab<span className="emblem-cut">|</span>c
                      </span>
                    ) : (
                      <Icon kind="tree" />
                    )}
                  </div>
                  <h2 className="detail-title">{active.title}</h2>
                  <p className="detail-description">{active.subtitle}</p>
                  {lesson ? (
                    <>
                      <div className="meta-row">
                        <span>{lesson.duration}</span>
                        <span>Interactif</span>
                        <span>Sans code</span>
                      </div>
                      <hr />
                      <h3 className="section-label">
                        CE QUE VOUS ALLEZ DÉCOUVRIR
                      </h3>
                      <ul className="detail-objectives">
                        {lesson.objectives.map((o) => (
                          <li key={o}>{o}</li>
                        ))}
                      </ul>
                      <button className="primary-button" onClick={openLesson}>
                        {progress.completed.includes(lesson.id)
                          ? "Revoir le cours"
                          : progress.lessons[lesson.id]
                            ? "Reprendre l’exploration"
                            : "Commencer l’exploration"}{" "}
                        <span aria-hidden="true">→</span>
                      </button>
                      <p className="detail-footnote">
                        Votre progression se sauvegarde ici, automatiquement.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="coming-soon">
                        Cette branche sera développée dans un prochain chapitre.
                      </p>
                      <p>
                        Vous pouvez déjà explorer les liens et revenir aux deux
                        expériences disponibles.
                      </p>
                    </>
                  )}
                  {active.prerequisites.length > 0 && (
                    <div className="related-concepts">
                      <span className="section-label">POUR FAIRE LE LIEN</span>
                      {active.prerequisites.map((id) => (
                        <button
                          key={id}
                          className="text-button"
                          onClick={() => select(id)}
                        >
                          {concepts.find((c) => c.id === id)?.title} ↗
                        </button>
                      ))}
                    </div>
                  )}
                </aside>
              </div>
              <p className="exploration-caption">
                Un laboratoire pour apprendre, pas un modèle qui répond à votre
                place.
              </p>
            </>
          )}
          {view === "lesson" && lesson && (
            <>
              <div className="page-header">
                <div>
                  <button
                    className="text-button"
                    onClick={() => setView("explore")}
                  >
                    ← Retour à l’arbre
                  </button>
                  <h1 className="page-title">{lesson.title}</h1>
                  <p className="page-lead">
                    {lesson.duration} · Une expérience guidée, à votre rythme.
                  </p>
                </div>
                <span className="progress-pill">
                  Étape {currentStep + 1} sur 5
                </span>
              </div>
              <div className="lesson-layout">
                <aside className="lesson-sidebar">
                  <ol className="lesson-steps">
                    {steps.map((s, i) => (
                      <li key={s}>
                        <button
                          className="step-button"
                          aria-current={i === currentStep ? "step" : undefined}
                          onClick={() => changeStep(i)}
                        >
                          <span>{String(i + 1).padStart(2, "0")}</span>
                          {s}
                        </button>
                      </li>
                    ))}
                  </ol>
                  <p className="detail-footnote">
                    Vous pouvez revenir à chaque étape librement.
                  </p>
                </aside>
                <section
                  className="lesson-content"
                  aria-label={steps[currentStep]}
                >
                  {finished ? (
                    <div className="completion-card" role="status">
                      <p className="eyebrow">UNE NOUVELLE CONNEXION</p>
                      <h2>
                        Vous avez exploré {lesson.title.toLocaleLowerCase("fr")}
                        .
                      </h2>
                      <p>
                        Manipulation et évaluation terminées. Retrouvez ce cours
                        à tout moment dans votre carnet.
                      </p>
                      <button
                        className="primary-button"
                        onClick={() => setView("explore")}
                      >
                        Retourner à l’arbre →
                      </button>
                    </div>
                  ) : (
                    <>
                      {currentStep === 0 && (
                        <div className="lesson-card">
                          <p className="eyebrow">01 · COMPRENDRE</p>
                          <h2 className="step-heading">
                            Une idée, avant de commencer.
                          </h2>
                          <p className="step-description">
                            {lesson.introduction}
                          </p>
                          {lesson.sections.map((s) => (
                            <div className="lesson-section" key={s.title}>
                              <h3>{s.title}</h3>
                              <p>{s.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {currentStep === 1 && (
                        <div className="lesson-card">
                          <p className="eyebrow">02 · MANIPULER</p>
                          <h2 className="step-heading">
                            À vous de faire varier les choses.
                          </h2>
                          {lesson.id === "tokenization" ? (
                            <TokenLab />
                          ) : (
                            <NeuronLab />
                          )}
                        </div>
                      )}
                      {currentStep === 2 && card && (
                        <div className="lesson-card">
                          <p className="eyebrow">03 · MÉMORISER</p>
                          <h2 className="step-heading">
                            Essayez de répondre de mémoire.
                          </h2>
                          <p className="step-description">
                            Cherchez votre réponse, puis retournez la carte pour
                            la comparer. Aucune formulation exacte n’est exigée.
                          </p>
                          <button
                            className={`flashcard ${flipped ? "is-flipped" : ""}`}
                            aria-label={
                              flipped
                                ? "Afficher la question"
                                : "Retourner la carte pour révéler la réponse"
                            }
                            onClick={() => setFlipped(!flipped)}
                          >
                            <span className="eyebrow">
                              {flipped ? "LA RÉPONSE" : "À VOUS DE JOUER"}
                            </span>
                            <span
                              className={
                                flipped ? "flashcard-back" : "flashcard-front"
                              }
                            >
                              {flipped ? card.back : card.front}
                            </span>
                            <span className="flashcard-hint">
                              {flipped
                                ? "Cliquer pour revoir la question"
                                : "Cliquer pour retourner"}{" "}
                              ↻
                            </span>
                          </button>
                          <div className="button-row">
                            <button
                              className="secondary-button"
                              onClick={() => {
                                updateLesson({
                                  cardIndex:
                                    (lp.cardIndex +
                                      lesson.flashcards.length -
                                      1) %
                                    lesson.flashcards.length,
                                });
                                setFlipped(false);
                              }}
                            >
                              Carte précédente
                            </button>
                            <span>
                              {(lp.cardIndex % lesson.flashcards.length) + 1} /{" "}
                              {lesson.flashcards.length}
                            </span>
                            <button
                              className="secondary-button"
                              onClick={() => {
                                updateLesson({
                                  cardIndex:
                                    (lp.cardIndex + 1) %
                                    lesson.flashcards.length,
                                });
                                setFlipped(false);
                              }}
                            >
                              Carte suivante
                            </button>
                          </div>
                        </div>
                      )}
                      {currentStep === 3 && (
                        <div className="lesson-card">
                          <p className="eyebrow">04 · S’ENTRAÎNER</p>
                          <h2 className="step-heading">
                            Une petite expérience, en autonomie.
                          </h2>
                          {lesson.id === "tokenization" ? (
                            <TokenLab onExercise={onTokenExercise} />
                          ) : (
                            <>
                              <p>
                                Calculez la sortie de ReLU pour x₁ = 2, w₁ =
                                0,5, x₂ = 1, w₂ = −0,3 et b = 0,1.
                              </p>
                              <p>
                                Rappel : z = x₁w₁ + x₂w₂ + b, puis ReLU(z) =
                                max(0, z).
                              </p>
                              <label className="field-row">
                                Votre résultat
                                <input
                                  aria-label="Votre résultat"
                                  inputMode="decimal"
                                  value={neuronAnswer}
                                  onChange={(e) => {
                                    setNeuronAnswer(e.target.value);
                                    setExerciseFeedback("");
                                  }}
                                />
                              </label>
                              <button
                                className="secondary-button"
                                onClick={() => {
                                  const text = neuronAnswer
                                    .trim()
                                    .replace(",", ".");
                                  const valid =
                                    text !== "" &&
                                    Number.isFinite(Number(text)) &&
                                    Math.abs(Number(text) - 0.8) < 0.001;
                                  updateLesson({ exercisePassed: valid });
                                  setExerciseFeedback(
                                    valid
                                      ? "Exact : 1 − 0,3 + 0,1 = 0,8. ReLU conserve ce résultat positif."
                                      : "Reprenez les deux produits, ajoutez le biais, puis comparez le résultat à zéro.",
                                  );
                                }}
                              >
                                Vérifier mon calcul
                              </button>
                              {exerciseFeedback && (
                                <p className="feedback" role="status">
                                  {exerciseFeedback}
                                </p>
                              )}
                            </>
                          )}
                          {lp.exercisePassed && (
                            <p className="feedback success" role="status">
                              Exercice réussi. Vous pouvez passer à
                              l’évaluation.
                            </p>
                          )}
                        </div>
                      )}
                      {currentStep === 4 && (
                        <div className="lesson-card">
                          <p className="eyebrow">05 · SE TESTER</p>
                          <h2 className="step-heading">
                            Les idées sont-elles bien reliées ?
                          </h2>
                          <p className="step-description">
                            Choisissez une réponse par question. Vous pourrez
                            réessayer avec les explications.
                          </p>
                          {lesson.questions.map((q, i) => (
                            <fieldset className="question-block" key={q.id}>
                              <legend>
                                {i + 1}. {q.prompt}
                              </legend>
                              {q.options.map((o, j) => (
                                <label
                                  className="question-option"
                                  key={o}
                                  data-checked={lp.answers[q.id] === j}
                                >
                                  <input
                                    type="radio"
                                    name={q.id}
                                    checked={lp.answers[q.id] === j}
                                    onChange={() => {
                                      updateLesson({
                                        answers: { ...lp.answers, [q.id]: j },
                                      });
                                      setChecked(false);
                                    }}
                                  />
                                  {o}
                                </label>
                              ))}
                              {checked && (
                                <p
                                  className={`feedback ${lp.answers[q.id] === q.correctIndex ? "success" : "error"}`}
                                >
                                  {lp.answers[q.id] === q.correctIndex
                                    ? "Correct. "
                                    : "À revoir. "}
                                  {q.explanation}
                                </p>
                              )}
                            </fieldset>
                          ))}
                          {!lp.exercisePassed && (
                            <p className="notice">
                              Terminez aussi le mini-exercice de l’étape 4 pour
                              valider ce cours.
                            </p>
                          )}
                          <button
                            className="primary-button"
                            disabled={!results?.answered}
                            onClick={() => {
                              setChecked(true);
                              if (results?.passed && lp.exercisePassed) {
                                patch({
                                  completed: [
                                    ...new Set([
                                      ...progress.completed,
                                      lesson.id,
                                    ]),
                                  ],
                                });
                                setFinished(true);
                              }
                            }}
                          >
                            Vérifier mes réponses
                          </button>
                          {checked && results && !finished && (
                            <p role="status" className="feedback">
                              {results.correct} / {results.total} réponses
                              correctes.
                              {results.passed && !lp.exercisePassed
                                ? " Revenez à l’étape 4 pour terminer votre exercice."
                                : " Relisez les explications et essayez à nouveau."}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="button-row lesson-navigation">
                        <button
                          className="secondary-button"
                          disabled={currentStep === 0}
                          onClick={() => changeStep(currentStep - 1)}
                        >
                          ← Précédent
                        </button>
                        <span>{steps[currentStep]}</span>
                        <button
                          className="primary-button"
                          disabled={currentStep === 4}
                          onClick={() => changeStep(currentStep + 1)}
                        >
                          Continuer →
                        </button>
                      </div>
                    </>
                  )}
                </section>
              </div>
            </>
          )}
          {view === "notebook" && (
            <>
              <div className="page-header">
                <div>
                  <p className="eyebrow">VOS TRACES D’EXPLORATION</p>
                  <h1 className="page-title">Mon carnet</h1>
                  <p className="page-lead">
                    Reprenez le fil d’une idée. Chaque pas reste enregistré sur
                    cet appareil.
                  </p>
                </div>
                <span className="progress-pill">
                  {progress.completed.length} / 2 cours terminés
                </span>
              </div>
              <div className="notebook-grid">
                {Object.values(lessons).map((l) => (
                  <article className="settings-card" key={l.id}>
                    <span className="eyebrow">
                      {progress.completed.includes(l.id)
                        ? "TERMINÉ"
                        : progress.lessons[l.id]
                          ? "EN COURS"
                          : "À EXPLORER"}
                    </span>
                    <h2>{l.title}</h2>
                    <p>{l.introduction}</p>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        select(concepts.find((c) => c.lessonId === l.id)!.id);
                        setView("lesson");
                      }}
                    >
                      {progress.completed.includes(l.id)
                        ? "Revoir"
                        : "Reprendre"}{" "}
                      →
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
          {view === "developer" && (
            <>
              <div className="page-header">
                <div>
                  <p className="eyebrow">PARCOURS DÉVELOPPEUR · PROTOTYPE</p>
                  <h1 className="page-title">L’atelier Python</h1>
                  <p className="page-lead">
                    Des calculs réels. Une console fidèle. Les premières
                    fondations.
                  </p>
                </div>
              </div>
              <div className="notice">
                Le moteur de ce MVP lance seulement trois exemples fixes dans un
                processus Python séparé. L’éditeur libre et les environnements
                NumPy / PyTorch restent à intégrer.
              </div>
              <div className="developer-grid">
                <section className="settings-card">
                  <h2>Éprouver le moteur local</h2>
                  <p>
                    Ces exemples sont écrits à l’avance ; leurs sorties sont
                    calculées par Python au moment du lancement.
                  </p>
                  <label className="field-row">
                    Exemple
                    <select
                      value={example}
                      onChange={(e) => setExample(e.target.value)}
                      disabled={running}
                    >
                      <option value="tokens">Tokens et identifiants</option>
                      <option value="neuron">Calcul d’un neurone</option>
                      <option value="error">Exception Python volontaire</option>
                    </select>
                  </label>
                  <div className="button-row">
                    <button
                      className="primary-button"
                      disabled={!native || running}
                      onClick={runPython}
                    >
                      {running ? "Calcul en cours…" : "Exécuter l’exemple"}
                    </button>
                    <button
                      className="secondary-button"
                      disabled={!running}
                      onClick={() => {
                        invoke("stop_python_demo").catch((e) =>
                          setPythonError(String(e)),
                        );
                      }}
                    >
                      Arrêter
                    </button>
                  </div>
                  {!native && (
                    <p className="notice">
                      L’exécution Python est accessible dans la fenêtre desktop
                      Tauri. Cet aperçu d’interface ne dispose pas du pont
                      natif.
                    </p>
                  )}
                  {pythonError && (
                    <p role="alert" className="feedback error">
                      {pythonError}
                    </p>
                  )}
                  <pre
                    className="console-output"
                    aria-label="Console Python"
                    aria-live="polite"
                  >
                    {pythonResult
                      ? `${pythonResult.stdout}${pythonResult.stderr ? `\n[stderr]\n${pythonResult.stderr}` : ""}\n[code de sortie : ${pythonResult.exitCode ?? "arrêté"}]${pythonResult.timedOut ? "\nTemps limite atteint." : ""}${pythonResult.truncated ? "\nSortie tronquée." : ""}`
                      : "La sortie réelle du programme apparaîtra ici."}
                  </pre>
                </section>
                <section className="settings-card">
                  <h2>Votre brouillon Python</h2>
                  <p>
                    Ce code est sauvegardé. Son exécution libre sera disponible
                    dans un prochain incrément.
                  </p>
                  <label className="sr-only" htmlFor="code">
                    Brouillon Python
                  </label>
                  <textarea
                    id="code"
                    className="code-editor"
                    spellCheck={false}
                    value={progress.code}
                    onChange={(e) =>
                      patch({ code: e.target.value.slice(0, 100000) })
                    }
                  />
                  <p className="detail-footnote">
                    Aucun modèle n’est entraîné par cet écran. Un processus
                    séparé ne constitue pas un bac à sable de sécurité.
                  </p>
                </section>
              </div>
            </>
          )}
          {view === "settings" && (
            <>
              <div className="page-header">
                <div>
                  <p className="eyebrow">UN LABORATOIRE À VOTRE MESURE</p>
                  <h1 className="page-title">Préférences</h1>
                  <p className="page-lead">
                    L’essentiel pour explorer confortablement.
                  </p>
                </div>
              </div>
              <section className="settings-card">
                <h2>Confort de lecture</h2>
                <label className="field-row">
                  Taille du texte
                  <select
                    value={progress.settings.textScale}
                    onChange={(e) =>
                      patch({
                        settings: {
                          ...progress.settings,
                          textScale: Number(e.target.value),
                        },
                      })
                    }
                  >
                    <option value={1}>Standard</option>
                    <option value={1.15}>Grande</option>
                    <option value={1.3}>Très grande</option>
                  </select>
                </label>
                <label className="field-row">
                  <span>Réduire les animations</span>
                  <input
                    type="checkbox"
                    checked={progress.settings.reducedMotion}
                    onChange={(e) =>
                      patch({
                        settings: {
                          ...progress.settings,
                          reducedMotion: e.target.checked,
                        },
                      })
                    }
                  />
                </label>
              </section>
              <section className="settings-card">
                <h2>Vos données locales</h2>
                <p>
                  Progression, préférences et brouillon restent sur cet
                  appareil. Aucun compte ni connexion n’est nécessaire pour les
                  cours.
                </p>
                <div className="button-row">
                  <button
                    className="secondary-button"
                    onClick={() =>
                      download(
                        "laboratoire-progression.json",
                        JSON.stringify(progress, null, 2),
                      )
                    }
                  >
                    Exporter ma progression
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() =>
                      download(
                        "laboratoire-sauvegardes-brutes.json",
                        JSON.stringify(
                          STORAGE_KEYS.map((k) => ({
                            key: k,
                            value: localStorage.getItem(k),
                          })),
                          null,
                          2,
                        ),
                      )
                    }
                  >
                    Exporter les sauvegardes brutes
                  </button>
                  <button
                    className="text-button"
                    onClick={() => setConfirmReset(true)}
                  >
                    Réinitialiser la progression
                  </button>
                </div>
                {confirmReset && (
                  <div className="notice" role="alert">
                    <p>
                      La progression et le brouillon seront supprimés de cet
                      appareil. Exportez-les d’abord si vous souhaitez les
                      conserver.
                    </p>
                    <button
                      className="secondary-button"
                      onClick={() => setConfirmReset(false)}
                    >
                      Annuler
                    </button>
                    <button
                      className="primary-button"
                      onClick={() => {
                        try {
                          STORAGE_KEYS.forEach((k) =>
                            localStorage.removeItem(k),
                          );
                          setProgress(freshProgress());
                          setStorageBlocked(false);
                          setNotice("Progression réinitialisée.");
                          setConfirmReset(false);
                        } catch {
                          setNotice(
                            "Réinitialisation impossible : stockage inaccessible.",
                          );
                        }
                      }}
                    >
                      Confirmer la réinitialisation
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
        <footer className="app-footer">
          <span>LABORATOIRE PÉDAGOGIQUE IA</span>
          <span>Explorer pour comprendre.</span>
        </footer>
      </main>
    </div>
  );
}
