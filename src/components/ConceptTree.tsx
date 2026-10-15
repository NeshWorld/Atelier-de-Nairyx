import { useId, useState } from "react";
import type { Concept, Mode } from "../types";
import { visibleConcepts } from "../core/learning";

interface Props {
  concepts: Concept[];
  selectedId: string;
  completed: string[];
  mode: Mode;
  expanded: boolean;
  onSelect: (id: string) => void;
  onExpand: () => void;
}
export default function ConceptTree({
  concepts,
  selectedId,
  completed,
  mode,
  expanded,
  onSelect,
  onExpand,
}: Props) {
  const gridId = useId().replace(/:/g, "");
  const [branch, setBranch] = useState("all");
  const available = visibleConcepts(concepts, mode, expanded);
  const visible = available.filter(
    (c) => branch === "all" || c.branch === branch,
  );
  // Coordinates retain the authored layout even when filtering removes nodes.
  const essentialPositions: Record<string, { x: number; y: number }> = {
    tokens: { x: 20, y: 31 },
    neuron: { x: 20, y: 67 },
    training: { x: 50, y: 67 },
    models: { x: 80, y: 48 },
  };
  const point = (c: Concept) =>
    mode === "discovery" && !expanded && essentialPositions[c.id]
      ? essentialPositions[c.id]
      : { x: (c.x / 900) * 100, y: (c.y / 600) * 100 };
  return (
    <div className="concept-explorer">
      <div
        className="tree-filters"
        role="group"
        aria-label="Filtrer les domaines"
      >
        {[
          ["all", "Tout"],
          ["language", "Langage"],
          ["learning", "Apprentissage"],
          ["models", "Modèles"],
        ].map(([key, title]) => (
          <button
            type="button"
            className="tree-filter"
            key={key}
            aria-pressed={branch === key}
            onClick={() => setBranch(key)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="concept-scroll">
        <div
          className={`concept-canvas${mode === "discovery" && !expanded ? " essential-view" : ""}`}
          aria-label="Carte des concepts de l’intelligence artificielle"
        >
          <svg
            className="concept-links"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={gridId}
                width="3"
                height="4"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r=".075" fill="currentColor" />
              </pattern>
            </defs>
            <rect
              width="100"
              height="100"
              fill={`url(#${gridId})`}
              className="graph-grid"
            />
            {visible.flatMap((c) =>
              c.parentIds.map((pid) => {
                const parent = visible.find((p) => p.id === pid);
                if (!parent) return null;
                const a = point(parent),
                  b = point(c);
                return (
                  <path
                    key={`${pid}-${c.id}`}
                    className={`concept-link${c.id === selectedId || pid === selectedId ? " active" : ""}`}
                    d={`M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`}
                  />
                );
              }),
            )}
          </svg>
          {visible.map((c) => {
            const p = point(c),
              done = completed.includes(c.id);
            return (
              <button
                type="button"
                key={c.id}
                className={`concept-node branch-${c.branch}${c.id === selectedId ? " selected" : ""}${done ? " completed" : ""}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-pressed={c.id === selectedId}
                onClick={() => onSelect(c.id)}
              >
                <span className="node-topline">
                  <span className="node-status">
                    {done ? "✓ Terminé" : c.lessonId ? "À explorer" : "À venir"}
                  </span>
                  <span className="node-dot" />
                </span>
                <span className="node-title">{c.title}</span>
                <span className="node-subtitle">
                  {c.level === "essential"
                    ? "Notion essentielle"
                    : "Pour aller plus loin"}
                </span>
              </button>
            );
          })}
          {!visible.length && (
            <p className="empty-state">Aucune notion dans cette sélection.</p>
          )}
        </div>
      </div>
      <div className="tree-expand-row">
        <span>
          {visible.length} notion{visible.length > 1 ? "s" : ""} visible
          {visible.length > 1 ? "s" : ""}
        </span>
        {mode === "discovery" && (
          <button
            type="button"
            className="text-button"
            onClick={onExpand}
            aria-expanded={expanded}
          >
            {expanded ? "Revenir aux essentiels" : "Déployer l’arbre"}{" "}
            <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
