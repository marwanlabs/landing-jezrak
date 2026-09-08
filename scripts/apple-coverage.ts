import { isPublicDetail } from "../src/apple/publicContent";
import { candidateCopy } from "../src/apple/candidateContent";
import { writeFileSync } from "node:fs";
import {
  sections,
  copy,
  nav,
  nodes,
  flow,
  workflowNames,
  diagramCopy,
  narrativeCopy,
  ui,
  metadata,
  type BilingualText,
} from "../src/content";
type Entry = {
  id: string;
  locale: "en" | "ar";
  text: string;
  destination: string;
  state: string;
  reason?: string;
};
const entries: Entry[] = [];
function add(
  text: BilingualText,
  destination: string,
  state = "visible",
  reason?: string,
) {
  for (const locale of ["en", "ar"] as const)
    entries.push({
      id: text.id,
      locale,
      text: text[locale],
      destination,
      state,
      reason,
    });
}
for (const s of sections) {
  for (const key of ["eyebrow", "heading", "body", "premise"] as const) {
    const text = s[key];
    const overridden = s.id === "operate" && key === "body";
    const superseded = [
      "top",
      "connected",
      "sell",
      "catalog",
      "pos",
      "operate",
      "understand",
      "business",
    ].includes(s.id);
    add(
      text,
      `#${s.id}`,
      !text.en
        ? "excluded"
        : superseded
          ? "superseded"
          : overridden
            ? "excluded"
            : "visible",
      !text.en
        ? "Empty placeholder"
        : superseded
          ? "Replaced by candidate-owned chapter copy"
          : overridden
            ? "Replaced by operate-body-public"
            : undefined,
    );
  }
  for (const text of s.details) {
    const restricted = !isPublicDetail(text);
    add(
      text,
      `#${s.id}-details`,
      restricted || s.id === "features"
        ? "excluded"
        : s.id === "connected"
          ? "superseded"
          : "expanded",
      restricted
        ? "Internal-only operating detail"
        : s.id === "connected"
          ? "Replaced by the candidate-owned single-order journey"
          : s.id === "features"
            ? "Duplicate inventory: rendered using named feature groups and public group-17 override"
            : undefined,
    );
  }
  for (const group of s.groups ?? []) {
    add(group.name, `#${group.id}`);
    add(
      group.inventory,
      `#${group.id}`,
      group.id === "group-17" ? "excluded" : "expanded",
      group.id === "group-17" ? "Replaced by platform-public" : undefined,
    );
  }
}
const excluded: Record<string, string> = {
  rootSystem: "Root-artwork label; artwork deliberately replaced",
  currentStep:
    "Root sticky-workflow state; candidate shows every step together",
  close: "Unused source control label",
  error: "Application error fallback retained unchanged",
};
for (const [key, text] of Object.entries(copy))
  add(
    text,
    key === "closing"
      ? "#start"
      : key.startsWith("ledger") ||
          ["business", "location", "storeA", "storeB"].includes(key)
        ? "#business"
        : key === "detail"
          ? "details"
          : key === "rootLabel"
            ? "#top"
            : key === "native" || key === "stock" || key === "egp"
              ? "#connected"
              : key === "lockup"
                ? "footer"
                : key.endsWith("Pending")
                  ? key === "signPending"
                    ? "#sign-in"
                    : key === "demoPending"
                      ? "#demo"
                      : "#start"
                  : "header, footer, actions",
    excluded[key]
      ? "excluded"
      : key === "rootLabel"
        ? "superseded"
        : [
              "preview",
              "privacy",
              "terms",
              "startPending",
              "demoPending",
              "signPending",
            ].includes(key)
          ? "conditional"
          : ["native", "stock", "egp"].includes(key)
            ? "superseded"
            : "visible",
    excluded[key],
  );
for (const item of nav) add({ ...item, id: `nav-${item.id}` }, "header");
for (const item of nodes)
  add(
    item,
    "#top",
    "superseded",
    "Seven-capability hero explorer replaced by the candidate-owned Store visual",
  );
for (const item of workflowNames)
  add(
    item,
    "#connected",
    "superseded",
    "Replaced by the candidate-owned single-order journey",
  );
for (const item of flow) add(item, "#inventory");
for (const item of diagramCopy.catalogSurfaces)
  add(
    item,
    "#catalog",
    "superseded",
    "Consolidated into the candidate-owned selling chapter",
  );
add(diagramCopy.inventoryEquivalent, "#inventory");
const destinations: Record<string, string> = {
  sellFlow: "sell",
  purchasingFlow: "purchasing",
  ordersFlow: "orders",
  posFlow: "pos",
  customersFlow: "customers",
  understandFlow: "understand",
  operateBody: "operate",
  platform: "group-17",
};
for (const [key, value] of Object.entries(narrativeCopy))
  for (const item of Array.isArray(value) ? value : [value])
    add(
      item,
      `#${destinations[key]}`,
      ["sellFlow", "posFlow"].includes(key)
        ? "superseded"
        : key === "platform"
          ? "expanded"
          : "visible",
      ["sellFlow", "posFlow"].includes(key)
        ? "Consolidated into the candidate-owned selling chapter"
        : undefined,
    );
function addCandidateCopy(value: unknown, destination: string) {
  if (Array.isArray(value)) {
    for (const item of value) addCandidateCopy(item, destination);
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  if (
    typeof record.id === "string" &&
    typeof record.en === "string" &&
    typeof record.ar === "string"
  ) {
    add(record as BilingualText, destination);
    return;
  }
  for (const item of Object.values(record)) addCandidateCopy(item, destination);
}
addCandidateCopy(
  {
    eyebrow: candidateCopy.eyebrow,
    heading: candidateCopy.heading,
    body: candidateCopy.body,
    reassurance: candidateCopy.reassurance,
    visualLabel: candidateCopy.visualLabel,
    visualOrder: candidateCopy.visualOrder,
    visualStock: candidateCopy.visualStock,
    visualNote: candidateCopy.visualNote,
    visualProduct: candidateCopy.visualProduct,
    visualProductNote: candidateCopy.visualProductNote,
  },
  "#top",
);
addCandidateCopy(candidateCopy.orderJourney, "#connected");
addCandidateCopy(candidateCopy.sellChapter, "#sell");
addCandidateCopy(candidateCopy.operationsChapter, "#operate");
addCandidateCopy(candidateCopy.insightChapter, "#understand");
addCandidateCopy(candidateCopy.growthChapter, "#business");
addCandidateCopy(candidateCopy.faqChapter, "#faq");
for (const locale of ["en", "ar"] as const) {
  for (const [key, text] of Object.entries(ui[locale].translation))
    entries.push({
      id: `ui.${key}`,
      locale,
      text,
      destination: key.endsWith("Status") ? "preference live region" : "header",
      state: ["close", "current"].includes(key) ? "excluded" : "conditional",
      reason: ["close", "current"].includes(key)
        ? "Native disclosure replaces root toggle/current-section controls"
        : undefined,
    });
  for (const [key, text] of Object.entries(metadata[locale]))
    entries.push({
      id: `metadata.${key}`,
      locale,
      text,
      destination: "head",
      state: "metadata",
    });
  entries.push({
    id: "canonical-brand",
    locale,
    text: "Jizrak — جِذرك",
    destination: "footer",
    state: "visible",
  });
  entries.push({
    id: "copyright",
    locale,
    text: "© {current year} Jizrak — جِذرك",
    destination: "footer",
    state: "visible",
  });
}
writeFileSync(
  "docs/apple-content-coverage.json",
  JSON.stringify(
    {
      notes: [
        "Section title fields are source-only editorial names, never public copy.",
        "Exact duplicate strings may be consolidated.",
        "Conditional notices and links follow existing configuration.",
        "Excluded root decorative labels do not describe product capabilities.",
      ],
      entries,
    },
    null,
    2,
  ) + "\n",
);
