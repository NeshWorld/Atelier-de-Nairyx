import { useId, useState } from "react";
import { neuron } from "../core/learning";
const format = (n: number) => Number(n.toFixed(2)).toLocaleString("fr-FR");
export default function NeuronLab() {
  const id = useId();
  const [x1, setX1] = useState(0.8),
    [x2, setX2] = useState(0.3),
    [w1, setW1] = useState(0.6),
    [w2, setW2] = useState(-0.4),
    [bias, setBias] = useState(0.1);
  const { sum, activation } = neuron(x1, x2, w1, w2, bias);
  const range = (
    label: string,
    name: string,
    value: number,
    setValue: (v: number) => void,
    min: number,
    max: number,
  ) => (
    <div className="neuron-control">
      <div>
        <label htmlFor={`${id}-${name}`}>{label}</label>
        <output htmlFor={`${id}-${name}`}>{format(value)}</output>
      </div>
      <input
        id={`${id}-${name}`}
        type="range"
        min={min}
        max={max}
        step="0.05"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <div className="range-labels">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
  return (
    <div className="neuron-lab interactive-lab">
      <div className="lab-heading">
        <div>
          <span className="eyebrow">UN CALCUL, EN DIRECT</span>
          <h3>À l’intérieur d’un neurone</h3>
        </div>
        <span className="lab-badge">Activation ReLU</span>
      </div>
      <p className="step-description">
        Ajustez les entrées, les poids et le biais. Le neurone additionne les
        contributions, puis sa fonction d’activation transforme le résultat.
      </p>
      <div
        className="neuron-diagram"
        role="img"
        aria-label={`Entrée 1 : ${format(x1)}, poids ${format(w1)}. Entrée 2 : ${format(x2)}, poids ${format(w2)}. Biais ${format(bias)}. Somme ${format(sum)}. Sortie ReLU ${format(activation)}.`}
      >
        <div className="diagram-inputs">
          <span>
            <small>Entrée x₁</small>
            <strong>{format(x1)}</strong>
          </span>
          <span>
            <small>Entrée x₂</small>
            <strong>{format(x2)}</strong>
          </span>
        </div>
        <div className="diagram-connections">
          <span>× {format(w1)}</span>
          <span>× {format(w2)}</span>
        </div>
        <div className="diagram-sum">
          <small>Somme + biais</small>
          <strong>Σ</strong>
          <span>{format(sum)}</span>
        </div>
        <span className="diagram-arrow" aria-hidden="true">
          →
        </span>
        <div className={`diagram-output${activation > 0 ? " activated" : ""}`}>
          <small>Sortie ReLU</small>
          <strong>{format(activation)}</strong>
          <span>{activation > 0 ? "Signal positif" : "Signal nul"}</span>
        </div>
      </div>
      <div className="neuron-controls">
        <div className="control-group">
          <h4>Les entrées</h4>
          {range("Entrée x₁", "x1", x1, setX1, -1, 1)}
          {range("Entrée x₂", "x2", x2, setX2, -1, 1)}
        </div>
        <div className="control-group">
          <h4>Les poids</h4>
          {range("Poids w₁", "w1", w1, setW1, -2, 2)}
          {range("Poids w₂", "w2", w2, setW2, -2, 2)}
        </div>
        <div className="control-group bias-group">
          <h4>Le biais</h4>
          {range("Biais b", "bias", bias, setBias, -2, 2)}
          <p>Le biais décale le seuil d’activation du neurone.</p>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setX1(0.8);
              setX2(0.3);
              setW1(0.6);
              setW2(-0.4);
              setBias(0.1);
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>
      <div className="equation-panel" aria-live="polite" aria-atomic="true">
        <span className="section-label">LE CALCUL DÉTAILLÉ</span>
        <p>
          <span>z = x₁ × w₁ + x₂ × w₂ + b</span>
          <br />
          {format(x1)} × ({format(w1)}) + {format(x2)} × ({format(w2)}) + (
          {format(bias)}) = <strong>{format(sum)}</strong>
        </p>
        <p className="activation-equation">
          ReLU(z) = max(0 ; {format(sum)}) ={" "}
          <strong>{format(activation)}</strong>
        </p>
      </div>
      <div className="lab-note">
        ReLU conserve une somme positive et remplace une somme négative par
        zéro. Ces paramètres sont réglés à la main ; aucun apprentissage n’est
        effectué ici.
      </div>
    </div>
  );
}
