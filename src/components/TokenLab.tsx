import { useEffect, useId, useState } from "react";
import { encodeTokens, tokenizeAt } from "../core/learning";

export default function TokenLab({
  onExercise,
}: {
  onExercise?: (valid: boolean) => void;
}) {
  const id = useId();
  const [phrase, setPhrase] = useState("Le chat observe la lune.");
  const [cuts, setCuts] = useState<number[]>([2, 3, 7, 8, 15, 16, 18, 19, 23]);
  const [guess, setGuess] = useState("");
  const [checked, setChecked] = useState(false);
  const chars = Array.from(phrase),
    tokens = phrase ? tokenizeAt(phrase, cuts) : [];
  const { vocabulary, ids } = encodeTokens(tokens);
  const valid =
    checked &&
    guess.trim() !== "" &&
    Number(guess) === vocabulary.length &&
    phrase.length > 0;
  useEffect(() => {
    onExercise?.(valid);
  }, [onExercise, valid]);
  function reset() {
    setChecked(false);
    setGuess("");
  }
  function toggle(n: number) {
    setCuts((prev) =>
      prev.includes(n) ? prev.filter((v) => v !== n) : [...prev, n],
    );
    reset();
  }
  return (
    <div className="token-lab interactive-lab">
      <div className="lab-heading">
        <div>
          <span className="eyebrow">MANIPULER · OBSERVER · COMPRENDRE</span>
          <h3>Une phrase, plusieurs découpages</h3>
        </div>
        <span className="lab-badge">Simulation pédagogique</span>
      </div>
      <label className="input-label" htmlFor={`${id}-phrase`}>
        Votre phrase
      </label>
      <textarea
        id={`${id}-phrase`}
        className="phrase-input"
        maxLength={180}
        rows={2}
        value={phrase}
        spellCheck={false}
        onChange={(e) => {
          setPhrase(e.target.value);
          setCuts([]);
          reset();
        }}
      />
      <div className="lab-instruction">
        <span className="instruction-number">01</span>
        <p>
          Ajoutez des séparations entre les caractères. Les espaces font aussi
          partie du texte.
        </p>
      </div>
      <div className="character-strip" aria-label="Découpage de la phrase">
        {chars.map((char, index) => (
          <span className="character-cell" key={index}>
            <span
              className={
                char === " " ? "character space-character" : "character"
              }
              title={char === " " ? "Espace" : char}
            >
              {char === " " ? "␣" : char === "\n" ? "↵" : char}
            </span>
            {index < chars.length - 1 && (
              <button
                type="button"
                className={`cut-button${cuts.includes(index + 1) ? " is-cut" : ""}`}
                aria-pressed={cuts.includes(index + 1)}
                aria-label={`${cuts.includes(index + 1) ? "Retirer" : "Ajouter"} une séparation après le caractère ${index + 1}`}
                onClick={() => toggle(index + 1)}
              >
                <span aria-hidden="true">
                  {cuts.includes(index + 1) ? "│" : "·"}
                </span>
              </button>
            )}
          </span>
        ))}
        {!chars.length && (
          <span className="muted">Écrivez une phrase pour commencer.</span>
        )}
      </div>
      <div className="button-row lab-presets">
        <button
          type="button"
          className="secondary-button"
          disabled={!chars.length}
          onClick={() => {
            setCuts(chars.slice(0, -1).map((_, i) => i + 1));
            reset();
          }}
        >
          Un token par caractère
        </button>
        <button
          type="button"
          className="text-button"
          disabled={!cuts.length}
          onClick={() => {
            setCuts([]);
            reset();
          }}
        >
          Tout regrouper
        </button>
      </div>
      <div className="token-output" aria-live="polite">
        <div className="output-heading">
          <span className="section-label">SÉQUENCE DE TOKENS</span>
          <span className="token-count">
            {tokens.length} token{tokens.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="token-list">
          {tokens.map((token, index) => (
            <span
              className={`token-chip token-color-${ids[index] % 4}`}
              key={index}
            >
              <code>{token.replace(/ /g, "␣").replace(/\n/g, "↵")}</code>
              <span>#{ids[index]}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="lab-note">
        Les identifiants sont attribués localement, par ordre d’apparition, à
        partir de 0. Ce découpage manuel aux frontières des points de code
        Unicode illustre le principe ; il ne reproduit pas le tokenizer d’un
        modèle réel.
      </div>
      <div className="vocab-exercise">
        <div className="lab-instruction">
          <span className="instruction-number">02</span>
          <div>
            <h4>Combien de tokens différents ?</h4>
            <p>
              Comptez les tokens uniques de votre séquence. Deux tokens
              exactement identiques partagent un identifiant et comptent une
              seule fois.
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setChecked(true);
          }}
        >
          <label className="input-label" htmlFor={`${id}-answer`}>
            Taille du vocabulaire de cette séquence
          </label>
          <div className="answer-row">
            <input
              id={`${id}-answer`}
              type="number"
              min="0"
              step="1"
              required
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
                setChecked(false);
              }}
              placeholder="Votre réponse"
            />
            <button type="submit" className="primary-button" disabled={!phrase}>
              Vérifier
            </button>
          </div>
        </form>
        {checked && (
          <p
            className={`feedback ${valid ? "success" : "error"}`}
            role="status"
          >
            {valid
              ? `Exact : ${vocabulary.length} token${vocabulary.length > 1 ? "s" : ""} unique${vocabulary.length > 1 ? "s" : ""} pour ${tokens.length} position${tokens.length > 1 ? "s" : ""} dans la séquence.`
              : "Regardez les identifiants : un même identifiant compte une seule fois. Réessayez."}
          </p>
        )}
      </div>
    </div>
  );
}
