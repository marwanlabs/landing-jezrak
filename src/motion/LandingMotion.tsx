import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);
export function LandingMotion({
  scope,
  setStep,
}: {
  scope: RefObject<HTMLDivElement | null>;
  setStep: (step: number) => void;
}) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const media = gsap.matchMedia();
      const own = (selector: string) => {
        const elements = root.querySelectorAll(selector);
        elements.forEach((el) => el.setAttribute("data-motion-owned", ""));
        return elements;
      };
      const restore = () =>
        gsap.set(root.querySelectorAll("[data-motion-owned]"), {
          clearProps: "opacity,transform,strokeDasharray,strokeDashoffset",
        });
      let alive = true;
      const laterTweens: gsap.core.Tween[] = [];
      const animate = (
        target: gsap.TweenTarget,
        from: gsap.TweenVars,
        to: gsap.TweenVars,
      ) => {
        const tween = gsap.fromTo(target, from, to);
        laterTweens.push(tween);
        return tween;
      };
      try {
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const hero = own(".hero-reveal");
          const lines = own(".hero .network-lines path");
          const timeline = gsap.timeline({
            onComplete: () => {
              root.dataset.motionState = "ready";
            },
          });
          const heroWithinBudget =
            performance.now() - Number(root.dataset.motionStart || 0) < 400;
          if (heroWithinBudget)
            timeline.fromTo(
              hero,
              { opacity: 0, y: 12 },
              {
                opacity: 1,
                y: 0,
                duration: 0.42,
                stagger: 0.08,
                clearProps: "opacity,transform",
              },
            );
          if (heroWithinBudget)
            lines.forEach((line) => {
              const length = (line as SVGPathElement).getTotalLength();
              timeline.fromTo(
                line,
                { strokeDasharray: length, strokeDashoffset: length },
                {
                  strokeDashoffset: 0,
                  duration: 0.45,
                  clearProps: "strokeDasharray,strokeDashoffset",
                },
                0.35,
              );
            });
          if (!heroWithinBudget) root.dataset.motionState = "ready";
          root.querySelectorAll(".narrative-section").forEach((section) => {
            const target = section.querySelector(".reveal");
            if (!target) return;
            target.setAttribute("data-motion-owned", "");
            // Initial states are applied only at entrance, leaving delayed and no-script copy readable.
            ScrollTrigger.create({
              trigger: section,
              start: "top 85%",
              once: true,
              onEnter: () => {
                animate(
                  target,
                  { opacity: 0.7, y: 14 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.35,
                    clearProps: "opacity,transform",
                  },
                );
                const tracks = section.querySelectorAll(".ledger-track");
                tracks.forEach((el) =>
                  el.setAttribute("data-motion-owned", ""),
                );
                if (tracks.length)
                  animate(
                    tracks,
                    { scaleY: 0, transformOrigin: "top" },
                    {
                      scaleY: 1,
                      duration: 0.4,
                      stagger: 0.12,
                      clearProps: "transform,transformOrigin",
                    },
                  );
                const inventory = section.querySelectorAll(
                  ".inventory-flow-node",
                );
                inventory.forEach((el) =>
                  el.setAttribute("data-motion-owned", ""),
                );
                if (inventory.length)
                  animate(
                    inventory,
                    { scale: 0.97 },
                    {
                      scale: 1,
                      duration: 0.3,
                      stagger: 0.1,
                      clearProps: "transform",
                    },
                  );
              },
            });
          });
          const finalPath =
            root.querySelector<SVGPathElement>(".final-root path");
          if (finalPath) {
            finalPath.setAttribute("data-motion-owned", "");
            ScrollTrigger.create({
              trigger: root.querySelector("#start"),
              start: "top 85%",
              once: true,
              onEnter: () => {
                const length = finalPath.getTotalLength();
                animate(
                  finalPath,
                  { strokeDasharray: length, strokeDashoffset: length },
                  {
                    strokeDashoffset: 0,
                    duration: 0.6,
                    clearProps: "strokeDasharray,strokeDashoffset",
                  },
                );
              },
            });
          }
          const steps = [...root.querySelectorAll(".workflow-step")];
          const update = () => {
            let best = 0;
            let distance = Infinity;
            steps.forEach((element, i) => {
              const box = element.getBoundingClientRect();
              const delta = Math.abs(
                box.top + box.height / 2 - innerHeight / 2,
              );
              if (delta < distance) {
                distance = delta;
                best = i;
              }
            });
            setStep(best);
          };
          ScrollTrigger.create({
            trigger: root.querySelector("#connected"),
            start: "top center",
            end: "bottom center",
            onUpdate: update,
            onEnter: update,
            onEnterBack: update,
          });
          return () => timeline.kill();
        });
        if (matchMedia("(prefers-reduced-motion: reduce)").matches)
          root.dataset.motionState = "ready";
      } catch {
        restore();
        root.dataset.motionState = "ready";
      }
      const refresh = () => {
        if (alive)
          requestAnimationFrame(() => {
            if (alive) ScrollTrigger.refresh();
          });
      };
      const disclosure = (event: Event) => {
        const details = event.target as HTMLDetailsElement;
        const panel = details.querySelector(".disclosure-panel");
        if (panel && !matchMedia("(prefers-reduced-motion: reduce)").matches)
          animate(
            panel,
            { opacity: 0.65, y: 5 },
            {
              opacity: 1,
              y: 0,
              duration: 0.2,
              clearProps: "opacity,transform",
            },
          );
        refresh();
      };
      window.addEventListener("jizrak:reflow", refresh);
      root.addEventListener("jizrak:disclosure", disclosure);
      void document.fonts.ready.then(refresh);
      return () => {
        alive = false;
        laterTweens.forEach((tween) => tween.kill());
        media.revert();
        restore();
        window.removeEventListener("jizrak:reflow", refresh);
        root.removeEventListener("jizrak:disclosure", disclosure);
      };
    },
    { scope },
  );
  return null;
}
