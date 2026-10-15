import type { Progress, LessonProgress } from "../types";
export const STORAGE_KEYS = ["nairyx.progress.a", "nairyx.progress.b"] as const;
export const defaultCode =
  "# Votre brouillon est sauvegardé localement.\n# Exécution libre prévue dans un prochain incrément.\nimport math\n\nprint(max(0, 2 * 0.5 + 1 * -0.3 + 0.1))\n";
export function freshProgress(): Progress {
  return {
    version: 1,
    mode: "discovery",
    activeConcept: "tokens",
    completed: [],
    lessons: {},
    settings: {
      reducedMotion:
        typeof matchMedia === "function" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches,
      textScale: 1,
    },
    code: defaultCode,
    updatedAt: new Date().toISOString(),
  };
}
function checksum(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
function record(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
export function validProgress(v: unknown): v is Progress {
  if (
    !record(v) ||
    v.version !== 1 ||
    !["discovery", "developer"].includes(v.mode as string) ||
    typeof v.activeConcept !== "string" ||
    !Array.isArray(v.completed) ||
    !v.completed.every((i) => typeof i === "string") ||
    !record(v.lessons) ||
    !record(v.settings) ||
    typeof v.code !== "string" ||
    v.code.length > 100000 ||
    typeof v.updatedAt !== "string"
  )
    return false;
  if (
    typeof v.settings.reducedMotion !== "boolean" ||
    typeof v.settings.textScale !== "number" ||
    ![1, 1.15, 1.3].includes(v.settings.textScale)
  )
    return false;
  return Object.values(v.lessons).every(
    (l) =>
      record(l) &&
      Number.isInteger(l.step) &&
      Number(l.step) >= 0 &&
      Number(l.step) <= 4 &&
      Number.isInteger(l.cardIndex) &&
      Number(l.cardIndex) >= 0 &&
      Number(l.cardIndex) < 100 &&
      (l.exercisePassed === undefined ||
        typeof l.exercisePassed === "boolean") &&
      record(l.answers) &&
      Object.values(l.answers).every(
        (a) => Number.isInteger(a) && Number(a) >= 0 && Number(a) < 100,
      ),
  );
}
interface Envelope {
  sequence: number;
  payload: string;
  checksum: string;
}
function decode(
  raw: string | null,
): { sequence: number; progress: Progress } | null {
  try {
    if (!raw || raw.length > 500000) return null;
    const e = JSON.parse(raw) as Envelope;
    if (
      !Number.isSafeInteger(e.sequence) ||
      e.sequence < 0 ||
      typeof e.payload !== "string" ||
      checksum(e.payload) !== e.checksum
    )
      return null;
    const p: unknown = JSON.parse(e.payload);
    return validProgress(p) ? { sequence: e.sequence, progress: p } : null;
  } catch {
    return null;
  }
}
export interface Loaded {
  progress: Progress;
  message: string;
  blocked: boolean;
  sequence: number;
}
export function loadProgress(storage: Pick<Storage, "getItem">): Loaded {
  try {
    const raw = STORAGE_KEYS.map((k) => storage.getItem(k));
    const candidates = raw
      .map(decode)
      .filter((v): v is NonNullable<typeof v> => !!v)
      .sort((a, b) => b.sequence - a.sequence);
    if (candidates.length)
      return {
        progress: candidates[0].progress,
        message: raw.some((r) => r && !decode(r))
          ? "Une sauvegarde endommagée a été ignorée. Votre copie valide a été récupérée."
          : "",
        blocked: false,
        sequence: candidates[0].sequence,
      };
    const corrupt = raw.some(Boolean);
    return {
      progress: freshProgress(),
      message: corrupt
        ? "Les sauvegardes sont illisibles ou utilisent une autre version. Elles sont conservées. Exportez-les avant de réinitialiser."
        : "",
      blocked: corrupt,
      sequence: 0,
    };
  } catch {
    return {
      progress: freshProgress(),
      message:
        "Le stockage local est indisponible. La progression reste uniquement dans cette session.",
      blocked: true,
      sequence: 0,
    };
  }
}
export function saveProgress(
  storage: Pick<Storage, "getItem" | "setItem">,
  progress: Progress,
): void {
  if (!validProgress(progress)) throw new Error("Progression invalide");
  const loaded = loadProgress(storage);
  if (loaded.blocked) throw new Error(loaded.message);
  const sequence = loaded.sequence + 1,
    payload = JSON.stringify(progress);
  storage.setItem(
    STORAGE_KEYS[sequence % 2],
    JSON.stringify({ sequence, payload, checksum: checksum(payload) }),
  );
}
export function lessonProgress(progress: Progress, id: string): LessonProgress {
  return progress.lessons[id] ?? { step: 0, answers: {}, cardIndex: 0 };
}
