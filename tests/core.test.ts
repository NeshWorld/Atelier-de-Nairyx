import { describe, expect, it } from "vitest";
import { concepts } from "../src/content/concepts";
import { lessons } from "../src/content/lessons";
import {
  encodeTokens,
  grade,
  neuron,
  tokenizeAt,
  validateGraph,
  visibleConcepts,
} from "../src/core/learning";
import {
  freshProgress,
  loadProgress,
  saveProgress,
  STORAGE_KEYS,
  validProgress,
} from "../src/core/storage";
describe("Graphe de concepts", () => {
  it("a des identifiants stables et des liens valides sans cycle", () =>
    expect(validateGraph(concepts)).toEqual([]));
  it("ne montre que quatre essentiels au début", () => {
    const shown = visibleConcepts(concepts, "discovery", false);
    expect(shown).toHaveLength(4);
    expect(shown.every((c) => c.level === "essential")).toBe(true);
  });
  it("montre les avancés sur demande et en développeur", () => {
    expect(visibleConcepts(concepts, "discovery", true)).toHaveLength(
      concepts.length,
    );
    expect(visibleConcepts(concepts, "developer", false)).toHaveLength(
      concepts.length,
    );
  });
  it("détecte références brisées, doublons et cycles", () => {
    expect(validateGraph([concepts[0], concepts[0]])).toContain(
      "Identifiant dupliqué",
    );
    expect(
      validateGraph([{ ...concepts[0], parentIds: ["absent"] }]),
    ).toContain("Référence inconnue: absent");
    expect(
      validateGraph([{ ...concepts[0], parentIds: [concepts[0].id] }]).some(
        (e) => e.startsWith("Cycle:"),
      ),
    ).toBe(true);
  });
  it("filtre 1000 nœuds sans changer les prérequis conseillés", () => {
    const big = Array.from({ length: 1000 }, (_, i) => ({
      ...concepts[0],
      id: `node-${i}`,
      level: i % 5 ? ("advanced" as const) : ("essential" as const),
    }));
    expect(visibleConcepts(big, "discovery", false)).toHaveLength(200);
  });
});
describe("Calculs pédagogiques et évaluation", () => {
  it("conserve exactement le texte, accents, espaces et emoji", () => {
    const text = "Été 🐈 !";
    expect(tokenizeAt(text, [1, 3, 4, 5]).join("")).toBe(text);
  });
  it("ignore séparations invalides et doublons", () =>
    expect(tokenizeAt("abcd", [-1, 2, 2, 99, 1.1])).toEqual(["ab", "cd"]));
  it("encode à vocabulaire fixe et préserve les répétitions", () =>
    expect(encodeTokens(["a", "b", "a"])).toEqual({
      vocabulary: ["a", "b"],
      ids: [0, 1, 0],
    }));
  it("calcule la somme pondérée puis ReLU", () => {
    expect(neuron(2, 1, 0.5, -0.3, 0.1).activation).toBeCloseTo(0.8);
    expect(neuron(1, 1, -2, -1, 0)).toEqual({ sum: -3, activation: 0 });
  });
  it.each(Object.values(lessons))(
    "évalue le cours $id sans comparaison textuelle",
    (lesson) => {
      const correct = Object.fromEntries(
        lesson.questions.map((q) => [q.id, q.correctIndex]),
      );
      expect(grade(lesson.questions, {}).passed).toBe(false);
      expect(grade(lesson.questions, correct).passed).toBe(true);
      const incorrect = { ...correct, [lesson.questions[0].id]: -1 };
      expect(grade(lesson.questions, incorrect).answered).toBe(false);
    },
  );
  it.each(Object.values(lessons))(
    "a des questions et flashcards cohérentes pour $id",
    (l) => {
      expect(l.flashcards.length).toBeGreaterThan(1);
      expect(l.questions.length).toBeGreaterThan(1);
      expect(new Set(l.questions.map((q) => q.id)).size).toBe(
        l.questions.length,
      );
      for (const q of l.questions) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(20);
      }
    },
  );
});
describe("Sauvegarde et récupération", () => {
  it("crée un état vierge versionné", () => {
    const loaded = loadProgress(localStorage);
    expect(loaded.progress.version).toBe(1);
    expect(loaded.blocked).toBe(false);
  });
  it("reprend progression, étape, réponses, préférences et code", () => {
    const p = freshProgress();
    p.completed = ["tokenization"];
    p.code = "print(42)";
    p.settings.textScale = 1.3;
    p.lessons.tokenization = {
      step: 3,
      cardIndex: 1,
      answers: { q: 2 },
      exercisePassed: true,
    };
    saveProgress(localStorage, p);
    expect(loadProgress(localStorage).progress).toEqual(p);
  });
  it("alterne deux copies et conserve la précédente", () => {
    const p = freshProgress();
    saveProgress(localStorage, p);
    saveProgress(localStorage, { ...p, completed: ["neuron"] });
    expect(STORAGE_KEYS.every((k) => localStorage.getItem(k))).toBe(true);
    expect(loadProgress(localStorage).sequence).toBe(2);
  });
  it("récupère la copie valide après corruption de la plus récente", () => {
    const p = freshProgress();
    saveProgress(localStorage, p);
    saveProgress(localStorage, { ...p, completed: ["neuron"] });
    localStorage.setItem(STORAGE_KEYS[0], "{broken");
    const loaded = loadProgress(localStorage);
    expect(loaded.progress).toEqual(p);
    expect(loaded.message).toContain("récupérée");
  });
  it("ne détruit pas deux copies illisibles", () => {
    STORAGE_KEYS.forEach((k) => localStorage.setItem(k, "corrompu"));
    expect(loadProgress(localStorage).blocked).toBe(true);
    expect(() => saveProgress(localStorage, freshProgress())).toThrow();
    expect(localStorage.getItem(STORAGE_KEYS[0])).toBe("corrompu");
  });
  it("résiste à un quota plein en préservant la copie précédente", () => {
    const p = freshProgress();
    saveProgress(localStorage, p);
    const full = {
      getItem: localStorage.getItem.bind(localStorage),
      setItem() {
        throw new Error("QuotaExceededError");
      },
    };
    expect(() => saveProgress(full, p)).toThrow("Quota");
    expect(loadProgress(localStorage).progress).toEqual(p);
  });
  it("signale un stockage inaccessible", () =>
    expect(
      loadProgress({
        getItem() {
          throw new Error("Denied");
        },
      }).blocked,
    ).toBe(true));
  it("rejette versions futures, niveaux invalides et code trop volumineux", () => {
    const p = freshProgress();
    expect(validProgress({ ...p, version: 2 })).toBe(false);
    expect(
      validProgress({
        ...p,
        lessons: { tokens: { step: -1, answers: {}, cardIndex: 0 } },
      }),
    ).toBe(false);
    expect(validProgress({ ...p, code: "a".repeat(100001) })).toBe(false);
  });
});
