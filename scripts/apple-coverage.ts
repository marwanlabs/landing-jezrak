import { isPublicDetail } from "../src/apple/publicContent";
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
    add(
      text,
      `#${s.id}`,
      !text.en ? "excluded" : overridden ? "excluded" : "visible",
      !text.en
        ? "Empty placeholder"
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
          ? "visible"
          : "expanded",
      restricted
        ? "Internal-only operating detail"
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
      : [
            "preview",
            "privacy",
            "terms",
            "startPending",
            "demoPending",
            "signPending",
          ].includes(key)
        ? "conditional"
        : "visible",
    excluded[key],
  );
for (const item of nav) add({ ...item, id: `nav-${item.id}` }, "header");
for (const item of nodes) add(item, "#top");
for (const item of workflowNames) add(item, "#connected");
for (const item of flow) add(item, "#inventory");
for (const item of diagramCopy.catalogSurfaces) add(item, "#catalog");
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
      key === "platform" ? "expanded" : "visible",
    );
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
