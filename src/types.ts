export type Mode = "discovery" | "developer";
export interface Concept {
  id: string;
  title: string;
  subtitle: string;
  branch: "language" | "learning" | "models";
  level: "essential" | "advanced";
  parentIds: string[];
  prerequisites: string[];
  relatedIds: string[];
  lessonId?: "tokenization" | "neuron";
  x: number;
  y: number;
}
export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
export interface Flashcard {
  id: string;
  front: string;
  back: string;
}
export interface Lesson {
  id: "tokenization" | "neuron";
  title: string;
  duration: string;
  introduction: string;
  objectives: string[];
  sections: { title: string; body: string }[];
  flashcards: Flashcard[];
  questions: Question[];
}
export interface LessonProgress {
  step: number;
  answers: Record<string, number>;
  cardIndex: number;
  exercisePassed?: boolean;
}
export interface Progress {
  version: 1;
  mode: Mode;
  activeConcept: string;
  completed: string[];
  lessons: Record<string, LessonProgress>;
  settings: { reducedMotion: boolean; textScale: number };
  code: string;
  updatedAt: string;
}
export interface PythonResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  truncated: boolean;
}
