import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";
import { lessons } from "../src/content/lessons";
import { freshProgress, saveProgress, loadProgress } from "../src/core/storage";
it("ouvre le cours et retourne une carte", () => {
  render(<App />);
  fireEvent.click(
    screen.getByRole("button", { name: /Commencer l’exploration/ }),
  );
  fireEvent.click(screen.getByRole("button", { name: /03.*Mémoriser/ }));
  expect(
    screen.getByText(lessons.tokenization.flashcards[0].front),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Retourner la carte/ }));
  expect(
    screen.getByText(lessons.tokenization.flashcards[0].back),
  ).toBeInTheDocument();
});
it("réussit une évaluation préparée après exercice et sauvegarde la réussite", () => {
  const p = freshProgress();
  p.lessons.tokenization = {
    step: 4,
    cardIndex: 0,
    answers: Object.fromEntries(
      lessons.tokenization.questions.map((q) => [q.id, q.correctIndex]),
    ),
    exercisePassed: true,
  };
  saveProgress(localStorage, p);
  render(<App />);
  fireEvent.click(
    screen.getByRole("button", { name: /Reprendre l’exploration/ }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Vérifier mes réponses" }),
  );
  expect(screen.getByText(/UNE NOUVELLE CONNEXION/)).toBeInTheDocument();
  expect(loadProgress(localStorage).progress.completed).toContain(
    "tokenization",
  );
});
it("ne termine pas un cours sans exercice réussi", () => {
  const p = freshProgress();
  p.lessons.tokenization = {
    step: 4,
    cardIndex: 0,
    answers: Object.fromEntries(
      lessons.tokenization.questions.map((q) => [q.id, q.correctIndex]),
    ),
  };
  saveProgress(localStorage, p);
  render(<App />);
  fireEvent.click(
    screen.getByRole("button", { name: /Reprendre l’exploration/ }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Vérifier mes réponses" }),
  );
  expect(loadProgress(localStorage).progress.completed).toEqual([]);
  expect(screen.getByText(/Revenez à l’étape 4/)).toBeInTheDocument();
});
it("sauvegarde le brouillon sans prétendre exécuter le Python dans l’aperçu", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Atelier Python" }));
  expect(
    screen.getByRole("button", { name: "Exécuter l’exemple" }),
  ).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Brouillon Python"), {
    target: { value: "print(123)" },
  });
  expect(loadProgress(localStorage).progress.code).toBe("print(123)");
});
it("valide le calcul du neurone avec virgule et tolérance", () => {
  const p = freshProgress();
  p.activeConcept = "neuron";
  p.lessons.neuron = { step: 3, answers: {}, cardIndex: 0 };
  saveProgress(localStorage, p);
  render(<App />);
  fireEvent.click(
    screen.getByRole("button", { name: /Reprendre l’exploration/ }),
  );
  fireEvent.change(screen.getByLabelText("Votre résultat"), {
    target: { value: "0,8001" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Vérifier mon calcul" }));
  expect(
    loadProgress(localStorage).progress.lessons.neuron.exercisePassed,
  ).toBe(true);
});
