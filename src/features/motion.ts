/** Page-local choreography. Content remains visible without JavaScript. */
export function mountFeatureMotion(root: HTMLElement) {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new Set<Animation>();
  const play = (element: Element, frames: Keyframe[], delay = 0) => {
    if (preference.matches) return;
    const animation = element.animate(frames, {
      duration: 720,
      delay,
      easing: "cubic-bezier(.2,.75,.25,1)",
      fill: "backwards",
    });
    animations.add(animation);
    animation.onfinish = () => animations.delete(animation);
  };
  const groups = [
    ".f-title",
    ".f-component-art",
    ".f-sale-console",
    ".f-sale-story article",
    ".f-customer-record",
    ".f-finance-record",
  ];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        element.classList.add("f-arrived");
        if (element.matches(".f-component-art")) {
          [...element.children].forEach((child, i) =>
            play(
              child,
              [
                {
                  opacity: 1,
                  transform: `translateX(${i < 3 ? -22 : 22}px) scale(.9)`,
                },
                { opacity: 1, transform: "translateX(0) scale(1)" },
              ],
              i * 95,
            ),
          );
        } else {
          const children = element.matches(
            ".f-title, .f-finance-record, .f-customer-record",
          )
            ? [...element.children]
            : [element];
          children.forEach((child, i) =>
            play(
              child,
              [
                { opacity: 1, transform: "translateY(24px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              i * 75,
            ),
          );
        }
      }
    },
    { threshold: 0.15 },
  );
  root
    .querySelectorAll(groups.join(","))
    .forEach((element) => observer.observe(element));

  // Scroll draws the order's route independently from the visitor's transaction state.
  const story = root.querySelector<HTMLElement>(".f-sale-story");
  const diagrams = [
    ...root.querySelectorAll<HTMLElement>(".stage-line, .f-store-map"),
  ];
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  let frame = 0;
  const paint = () => {
    frame = 0;
    for (const diagram of diagrams) {
      const progress = preference.matches
        ? 1
        : clamp(
            (innerHeight * 0.88 - diagram.getBoundingClientRect().top) /
              (innerHeight * 0.48),
          );
      diagram.style.setProperty("--diagram-progress", String(progress));
      diagram
        .querySelectorAll<HTMLElement>(".stage-line-stage")
        .forEach((stage, index) => {
          stage.style.setProperty(
            "--stage-progress",
            String(clamp(progress * 3 - index)),
          );
        });
    }
    if (!story) return;
    const box = story.getBoundingClientRect();
    const progress = preference.matches
      ? 1
      : Math.max(0, Math.min(1, (innerHeight * 0.72 - box.top) / box.height));
    story.style.setProperty("--story-progress", String(progress));
    story.querySelectorAll("article").forEach((article) => {
      article.classList.toggle(
        "f-passed",
        preference.matches ||
          article.getBoundingClientRect().top < innerHeight * 0.72,
      );
    });
  };
  const update = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };
  const reduce = () => {
    if (preference.matches) {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }
    update();
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  preference.addEventListener("change", reduce);
  paint();
  return () => {
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    preference.removeEventListener("change", reduce);
  };
}
