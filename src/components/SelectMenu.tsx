import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SelectOption = { value: string; label: string; disabled?: boolean };

type SelectMenuProps = {
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  value: string;
};

export function SelectMenu({ ariaLabel, className = "", disabled = false, invalid = false, onValueChange, options, value }: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const activeIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selected = options[activeIndex];

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [open]);

  const select = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onValueChange(option.value);
    setOpen(false);
  };
  const nextEnabledIndex = (start: number, direction: 1 | -1) => {
    for (let offset = 1; offset <= options.length; offset += 1) {
      const index = (start + direction * offset + options.length) % options.length;
      if (!options[index]?.disabled) return index;
    }
    return start;
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      select(nextEnabledIndex(activeIndex, event.key === "ArrowDown" ? 1 : -1));
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const candidates = event.key === "Home" ? options : [...options].reverse();
      const candidate = candidates.find((option) => !option.disabled);
      if (candidate) select(options.indexOf(candidate));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((isOpen) => !isOpen);
    }
  };

  return (
    <div className={`select-menu ${className}`} ref={root} data-open={open || undefined}>
      <button type="button" className="select-menu-trigger" aria-label={`${ariaLabel}: ${selected?.label || ""}`} aria-expanded={open} aria-haspopup="listbox" aria-controls={open ? listId : undefined} aria-invalid={invalid || undefined} disabled={disabled} onClick={() => setOpen((isOpen) => !isOpen)} onKeyDown={onKeyDown}>
        <span className="select-menu-value">{selected?.label}</span>
        <ChevronDown className="select-menu-icon" size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="select-menu-popover" id={listId} role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => (
            <button type="button" key={option.value} role="option" tabIndex={-1} className="select-menu-option" aria-selected={option.value === value} disabled={option.disabled} onClick={() => select(index)}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
