import { useEffect, useRef } from "react";
import type { Stage } from "./StageFlow";
import { BilingualBlock } from "./BilingualBlock";

export function StageLine({
  stages,
  label,
}: {
  stages: Stage[];
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className="stage-line" role="group" aria-label={label}>
      <div className="stage-line-track">
        {stages.map((stage, index) => (
          <div key={stage.id} className="stage-line-stage">
            <BilingualBlock inline text={stage.label} />
            <span className="stage-line-marker" aria-hidden="true">
              <span className="stage-line-dot" />
              <span className="stage-line-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
