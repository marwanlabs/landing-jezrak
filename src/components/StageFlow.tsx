import { useEffect, useId, useRef, useState } from "react";
import { BilingualBlock } from "./BilingualBlock";
import { usePreferences } from "../app/preferences";
import type { BilingualText } from "../content";

export type StageFlowMode = "active-rail" | "operational-story";

export type Stage = {
  id: string;
  label: BilingualText;
  description?: BilingualText;
};

type StageFlowProps = {
  stages: Stage[];
  mode: StageFlowMode;
  className?: string;
  label?: string;
  markerStyle?: "line" | "circle";
  showPanel?: boolean;
};

function StageMarker({ index, label, markerStyle = "line" }: { index: number; label: BilingualText; markerStyle?: "line" | "circle" }) {
  return (
    <span className={`stage-flow-marker stage-flow-marker-${markerStyle}`} aria-hidden="true">
      {markerStyle === "circle" && <span className="stage-flow-dot" />}
      <span className="stage-flow-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="stage-flow-marker-label">
        <BilingualBlock inline text={label} />
      </span>
    </span>
  );
}

function OperationalStory({ stages }: { stages: Stage[] }) {
  return (
    <ol className="stage-flow-list">
      {stages.map((stage, index) => (
        <li className="stage-flow-item" key={stage.id}>
          <StageMarker index={index} label={stage.label} />
          <div className="stage-flow-content">
            <BilingualBlock text={stage.label} className="stage-flow-label" />
            {stage.description && (
              <BilingualBlock
                text={stage.description}
                className="stage-flow-description"
              />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function ActiveRail({ stages, label, markerStyle, showPanel = true }: { stages: Stage[]; label?: string; markerStyle?: "line" | "circle"; showPanel?: boolean }) {
  const { locale } = usePreferences();
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const safeSelected = Math.min(selected, Math.max(stages.length - 1, 0));
  const current = stages[safeSelected];

  useEffect(() => {
    if (selected !== safeSelected) setSelected(safeSelected);
  }, [safeSelected, selected]);

  if (!current) return null;

  const select = (index: number, focus = false) => {
    setSelected(index);
    if (focus) tabs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const rtl = locale === "ar";
    let next = safeSelected;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else if (event.key === "ArrowRight") next = rtl ? safeSelected - 1 : safeSelected + 1;
    else if (event.key === "ArrowLeft") next = rtl ? safeSelected + 1 : safeSelected - 1;
    else return;
    event.preventDefault();
    const wrapped = (next + stages.length) % stages.length;
    select(wrapped, true);
  };

  return (
    <div className="stage-flow-rail">
      <div
        className="stage-flow-tabs"
        role={showPanel ? "tablist" : "group"}
        aria-label={label}
        aria-orientation="horizontal"
        data-compact={!showPanel}
      >
        {stages.map((stage, index) => {
          const tabId = `${baseId}-tab-${stage.id}`;
          const panelId = `${baseId}-panel-${stage.id}`;
          return (
            <button
              key={stage.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              id={tabId}
              type="button"
              role={showPanel ? "tab" : undefined}
              aria-selected={showPanel ? safeSelected === index : undefined}
              aria-pressed={!showPanel ? safeSelected === index : undefined}
              aria-controls={showPanel ? panelId : undefined}
              tabIndex={safeSelected === index ? 0 : -1}
              className="stage-flow-tab"
              data-marker={markerStyle}
              data-active={safeSelected === index}
              onClick={() => select(index)}
              onKeyDown={onKeyDown}
            >
              <StageMarker index={index} label={stage.label} markerStyle={markerStyle} />
              <BilingualBlock inline text={stage.label} />
            </button>
          );
        })}
      </div>
      {showPanel && <div
        key={current.id}
        id={`${baseId}-panel-${current.id}`}
        className="stage-flow-panel"
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        tabIndex={0}
      >
        <span className="stage-flow-current">
          <BilingualBlock inline text={current.label} />
        </span>
        {current.description ? (
          <BilingualBlock text={current.description} />
        ) : (
          <BilingualBlock text={current.label} />
        )}
      </div>}
    </div>
  );
}

export function StageFlow({
  stages,
  mode,
  className = "",
  label,
  markerStyle = "line",
  showPanel = true,
}: StageFlowProps) {
  return (
    <div
      className={`stage-flow stage-flow-${mode} ${className}`.trim()}
      data-stage-flow={mode}
    >
      {mode === "active-rail" ? (
        <ActiveRail stages={stages} label={label} markerStyle={markerStyle} showPanel={showPanel} />
      ) : (
        <OperationalStory stages={stages} />
      )}
    </div>
  );
}
