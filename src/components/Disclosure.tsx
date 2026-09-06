import { useState, useEffect, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { BilingualBlock } from "./BilingualBlock";
import type { BilingualText } from "../content";
export function Disclosure({
  id,
  label,
  children,
  index,
}: {
  id: string;
  label: BilingualText;
  children: ReactNode;
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  return (
    <details
      className="disclosure"
      onToggle={(event) => {
        setOpen(event.currentTarget.open);
        if (event.currentTarget.open)
          event.currentTarget.dispatchEvent(
            new CustomEvent("jizrak:disclosure", { bubbles: true }),
          );
      }}
    >
      <summary
        aria-expanded={enhanced ? open : undefined}
        aria-controls={`${id}-panel`}
      >
        {index !== undefined && (
          <span className="disclosure-number">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <BilingualBlock inline text={label} />
        <Plus className="disclosure-icon" size={20} aria-hidden="true" />
      </summary>
      <div id={`${id}-panel`} className="disclosure-panel">
        {children}
      </div>
    </details>
  );
}
