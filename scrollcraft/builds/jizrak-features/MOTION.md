# Feature journey motion refinement

Self-authored under the existing explicit creative delegation. The requested change adds animation to the existing feature guide; its grammar, content, merchant audience, and transaction signature remain the same.

The feeling curve remains ownership, preparedness, clarity, confidence, and possibility. The sale is the peak: a scroll-drawn connector follows the narrative while explicit clicks alone change the order and stock. The preparation beat assembles components in sequence. Financial rows settle into place; the location branches draw toward two stores. Opening brand planes arrive independently. Detail drawers and native disclosure panels enter briefly.

Animation is page-local, leaving the ScrollCraft engine unchanged. Entrances run once per mount, animate transforms and opacity, and leave semantic content visible without scripting. Reduced motion skips Web Animations and CSS animation; changing the preference cancels active entrances. Event listeners, observers, and animations are cleaned up on route exit.

Verification: production review build, TypeScript, and focused ESLint passed. The final browser report in `lab/motion-verified/report.json` passes desktop, phone, compact Arabic, dark Arabic, reduced motion, transaction controls, dialogs, and no-JavaScript disclosure. All 30 section accessibility scans and five drawer scans have zero violations. Initial reports in `lab/motion` and `lab/motion-final` exposed transient contrast loss; all content entrances now retain full opacity. The desktop scroll contact sheet and final desktop/mobile frames were visually inspected. The sale remains the strongest change, followed by a quieter records section and the expanding store diagram. No real-device test was performed.
