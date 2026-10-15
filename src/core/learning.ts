import type { Concept, Mode, Question } from "../types";
export function visibleConcepts(
  concepts: Concept[],
  mode: Mode,
  expanded: boolean,
): Concept[] {
  return concepts.filter(
    (c) => mode === "developer" || expanded || c.level === "essential",
  );
}
export function validateGraph(concepts: Concept[]): string[] {
  const errors: string[] = [];
  const ids = new Set(concepts.map((c) => c.id));
  if (ids.size !== concepts.length) errors.push("Identifiant dupliqué");
  const map = new Map(concepts.map((c) => [c.id, c]));
  const done = new Set<string>();
  const visiting = new Set<string>();
  const visit = (id: string) => {
    if (visiting.has(id)) {
      errors.push(`Cycle: ${id}`);
      return;
    }
    if (done.has(id)) return;
    visiting.add(id);
    for (const p of map.get(id)?.parentIds ?? []) if (map.has(p)) visit(p);
    visiting.delete(id);
    done.add(id);
  };
  for (const c of concepts) {
    if (!c.title.trim() || !Number.isFinite(c.x) || !Number.isFinite(c.y))
      errors.push(`Nœud invalide: ${c.id}`);
    for (const id of [...c.parentIds, ...c.prerequisites, ...c.relatedIds])
      if (!ids.has(id)) errors.push(`Référence inconnue: ${id}`);
    visit(c.id);
  }
  return [...new Set(errors)];
}
export function grade(questions: Question[], answers: Record<string, number>) {
  const correct = questions.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;
  return {
    correct,
    total: questions.length,
    passed: questions.length > 0 && correct === questions.length,
    answered: questions.every(
      (q) =>
        Number.isInteger(answers[q.id]) &&
        answers[q.id] >= 0 &&
        answers[q.id] < q.options.length,
    ),
  };
}
export function tokenizeAt(text: string, cuts: number[]): string[] {
  const chars = Array.from(text);
  const boundaries = [
    0,
    ...new Set(
      cuts.filter((c) => Number.isInteger(c) && c > 0 && c < chars.length),
    ),
  ].sort((a, b) => a - b);
  return boundaries.map((p, i) =>
    chars.slice(p, boundaries[i + 1] ?? chars.length).join(""),
  );
}
export function encodeTokens(tokens: string[]) {
  const vocabulary = [...new Set(tokens)];
  return { vocabulary, ids: tokens.map((t) => vocabulary.indexOf(t)) };
}
export function neuron(
  x1: number,
  x2: number,
  w1: number,
  w2: number,
  bias: number,
) {
  const sum = x1 * w1 + x2 * w2 + bias;
  return { sum, activation: Math.max(0, sum) };
}
