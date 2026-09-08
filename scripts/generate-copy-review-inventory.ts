import {
  copy,
  diagramCopy,
  flow,
  metadata,
  nav,
  nodes,
  narrativeCopy,
  sections,
  ui,
  workflowNames,
  type BilingualText,
} from "../src/content";
import { writeFile } from "node:fs/promises";

type Row = {
  id: string;
  file: string;
  key_or_location: string;
  locale: string;
  surfaces_and_states: string;
  original: string;
  final: string;
  coverage_status: string;
  slop_finding: string;
  pattern_and_reason: string;
  repair: string;
  no_slop_verdict: string;
  exception_reason: string;
  verification_evidence: string;
};

const rows: Row[] = [];
const changes: Record<string, { original: string; reason: string; repair: string }> = {
  "top-eyebrow:en": {
    original: "Jizrak — connected commerce in one system",
    reason: "Formatting slop: decorative em dash in short copy.",
    repair: "Use two direct sentences.",
  },
  "top-eyebrow:ar": {
    original: "جِذرك — تجارة مترابطة في نظام واحد",
    reason: "Presentation: decorative dash in short copy.",
    repair: "Use two direct sentences.",
  },
  "top-headline:en": {
    original: "One commerce foundation for every Store you build.",
    reason: "Unnecessary second-person phrasing.",
    repair: "Name the scope directly.",
  },
  "top-headline:ar": {
    original: "أساس تجاري واحد لكل متجر تنشئه.",
    reason: "Literal second-person phrasing.",
    repair: "State the scope directly.",
  },
  "top-premise:en": {
    original: "Your idea stays yours. Jizrak connects the work behind it.",
    reason: "Vague metaphor: “work behind it.”",
    repair: "Use “work that supports it.”",
  },
  "top-premise:ar": {
    original: "تبقى فكرتك ملكاً لك. وتربط جِذرك العمليات التي تدعمها.",
    reason: "Translationese and an unnatural verb order.",
    repair: "Use a direct nominal opening and natural verb order.",
  },
  "sell-heading:ar": {
    original: "واجهة متجر تساعد العملاء على العثور على المنتجات وإتمام الشراء بثقة.",
    reason: "Unsupported reassurance: “بثقة” adds a generic outcome not stated by the English source.",
    repair: "Describe product discovery and checkout without the extra promise.",
  },
  "sell-detail-6:ar": {
    original: "سلة محفوظة خاصة بكل متجر وتعديل الكميات واكتشاف العروض المجمعة ومراجعة موثوقة لبنود السلة والمخزون والكوبونات.",
    reason: "Vague claim: “مراجعة موثوقة” does not identify what the system checks.",
    repair: "Name reconciliation of cart lines and stock against server data.",
  },
  "sell-detail-7:ar": {
    original: "دفع على مراحل بعناوين محفوظة أو جديدة وشحن حسب المحافظة والمنطقة وإعدادات الشحن والضريبة والدفع عند الاستلام عند تفعيله وإجماليات يحسبها الخادم وإنشاء الطلب كوحدة واحدة وحماية عند محاولة أكثر من عميل شراء آخر قطعة.",
    reason: "Terminology drift: “دفع على مراحل” describes staged payment rather than staged checkout.",
    repair: "Use “إتمام الشراء على مراحل” for the checkout flow.",
  },
  "identity-heading:ar": {
    original: "تحديد هوية كل متجر ولغته وقواعد البيع وظهوره في البحث.",
    reason: "Fragmented noun phrase in an action heading.",
    repair: "Use a direct imperative that names the store setup action.",
  },
  "operate-heading:ar": {
    original: "الصلاحيات اللازمة للمستخدمين مع حدود واضحة لكل متجر.",
    reason: "Verbless fragment hides the action the operator can take.",
    repair: "Use a direct action verb for granting permissions.",
  },
  "operate-body:ar": {
    original: "توفّر ملكية النشاط وصلاحيات كل متجر وحركات المخزون المنضبطة والأحداث القابلة للمراجعة والوسائط الخاصة وبنية استعادة المنصة المقيّدة أساساً أكثر أماناً، دون تقديم ادعاءات اعتماد غير مثبتة.",
    reason: "Unsupported superlative: “أساساً أكثر أماناً” makes a broad safety comparison without evidence.",
    repair: "State the operating boundaries and keep the certification disclaimer.",
  },
  "metadata.description:ar": {
    original: "نظام واحد لإدارة المتاجر بعلاماتها والكتالوج والطلبات والمخزون والمشتريات والعملاء والمالية ونقاط البيع، مصمم للتجارة في المنطقة.",
    reason: "Vague regional positioning: “التجارة في المنطقة” does not identify the supported audience.",
    repair: "Name Arab businesses directly, matching the product positioning.",
  },
  "connected-heading:en": {
    original: "Keep every Store connected as you grow.",
    reason: "The subject is ambiguous.",
    repair: "Name the Business as the thing that grows.",
  },
  "connected-heading:ar": {
    original: "ترابط تشغيلي يدعم نمو أعمالك.",
    reason: "Abstract promise without an action or clear subject.",
    repair: "Address the reader and name the Business.",
  },
  "connected-body:en": {
    original: "Catalog, orders, fulfilment, purchasing, suppliers, finance, and Store ledgers run on one Business foundation. Each Store stays separate.",
    reason: "The list cannot literally “run.”",
    repair: "Describe the shared foundation.",
  },
  "connected-body:ar": {
    original: "تعمل الكتالوجات والطلبات والتجهيز والمشتريات والموردون والمالية ودفاتر المتاجر على أساس تجاري واحد، مع بقاء كل متجر مستقلاً.",
    reason: "Translationese and inconsistent term for fulfilment.",
    repair: "Use a direct verb and “تنفيذ الطلبات.”",
  },
  "business-heading:ar": {
    original: "إدارة علامات متعددة مع استقلال عمليات كل متجر.",
    reason: "Fragmented noun phrase rather than an action-oriented heading.",
    repair: "Use a direct business action.",
  },
  "native-label:en": {
    original: "Built for commerce in the region.",
    reason: "Portable regional language.",
    repair: "Name Arab businesses.",
  },
  "native-label:ar": {
    original: "منظومة للتجارة في المنطقة.",
    reason: "Vague regional claim.",
    repair: "Name Arab businesses.",
  },
  "egp-label:en": {
    original: "Built for Egyptian commerce.",
    reason: "Unnecessary construction language.",
    repair: "Use the direct market statement.",
  },
  "egp-label:ar": {
    original: "مصمم للتجارة في مصر.",
    reason: "Literal passive translation.",
    repair: "Use the direct market statement.",
  },
};

function addPair(
  file: string,
  key: string,
  text: BilingualText,
  surface: string,
  coverage = "reviewed",
) {
  for (const locale of ["en", "ar"] as const) {
    const change = changes[`${text.id}:${locale}`];
    const protectedSlogan = text.id === "closing";
    const empty = !text[locale].trim();
    rows.push({
      id: `${text.id}:${locale}`,
      file,
      key_or_location: key,
      locale,
      surfaces_and_states: surface,
      original: change?.original ?? text[locale],
      final: text[locale],
      coverage_status: empty ? "empty-unused" : protectedSlogan ? "protected" : coverage,
      slop_finding: change ? "found" : empty ? "not assessed" : "none found",
      pattern_and_reason: change?.reason ?? "",
      repair: change?.repair ?? "",
      no_slop_verdict: protectedSlogan ? "protected" : empty ? "not assessed" : "pass",
      exception_reason: protectedSlogan
        ? "Approved slogan; preserve exactly."
        : empty
          ? "Structural placeholder; the corresponding component renders no content for this field."
          : "",
      verification_evidence: "Source audit; rendered locale and state checks.",
    });
  }
}

for (const section of sections) {
  for (const field of ["eyebrow", "heading", "body", "premise"] as const)
    addPair("src/content/landing.json", `${section.id}.${field}`, section[field], `${section.id} section`);
  section.details.forEach((detail) =>
    addPair("src/content/landing.json", `${section.id}.details.${detail.id}`, detail, `${section.id} detail disclosure or source inventory`),
  );
  section.groups?.forEach((group) => {
    addPair("src/content/landing.json", `${section.id}.groups.${group.id}.name`, group.name, "Features disclosure label");
    addPair("src/content/landing.json", `${section.id}.groups.${group.id}.inventory`, group.inventory, "Expanded features disclosure");
  });
}

for (const [key, value] of Object.entries(copy))
  addPair("src/content/index.ts", `copy.${key}`, value, "Shared component, control, link, notice, diagram, or footer");
nav.forEach((item) => addPair("src/content/index.ts", `nav.${item.id}`, item, "Header navigation"));
nodes.forEach((item) => addPair("src/content/index.ts", `nodes.${item.id}`, item, "Workflow and demo diagrams"));
flow.forEach((item) => addPair("src/content/index.ts", `flow.${item.id}`, item, "Inventory diagram"));
workflowNames.forEach((item) => addPair("src/content/index.ts", `workflowNames.${item.id}`, item, "Connected workflow key"));
addPair("src/content/index.ts", "diagramCopy.inventoryEquivalent", diagramCopy.inventoryEquivalent, "Inventory diagram caption");
diagramCopy.catalogSurfaces.forEach((item) =>
  addPair("src/content/index.ts", `diagramCopy.catalogSurfaces.${item.id}`, item, "Catalog diagram"),
);
for (const [key, value] of Object.entries(narrativeCopy)) {
  const items = Array.isArray(value) ? value : [value];
  items.forEach((item) =>
    addPair("src/content/index.ts", `narrativeCopy.${key}.${item.id}`, item, "Narrative flow, public product detail, or feature disclosure"),
  );
}

for (const locale of ["en", "ar"] as const) {
  rows.push({
    id: `metadata.title:${locale}`,
    file: "src/content/index.ts",
    key_or_location: `metadata.${locale}.title`,
    locale,
    surfaces_and_states: "Document title and social title after locale selection",
    original: metadata[locale].title,
    final: metadata[locale].title,
    coverage_status: "reviewed",
    slop_finding: "none found",
    pattern_and_reason: "",
    repair: "",
    no_slop_verdict: "pass",
    exception_reason: "",
    verification_evidence: "Source audit; metadata update test.",
  });
  rows.push({
    id: `metadata.description:${locale}`,
    file: "src/content/index.ts",
    key_or_location: `metadata.${locale}.description`,
    locale,
    surfaces_and_states: "Document description and social description after locale selection",
    original: changes[`metadata.description:${locale}`]?.original ?? metadata[locale].description,
    final: metadata[locale].description,
    coverage_status: "reviewed",
    slop_finding: changes[`metadata.description:${locale}`] ? "found" : "none found",
    pattern_and_reason: changes[`metadata.description:${locale}`]?.reason ?? "",
    repair: changes[`metadata.description:${locale}`]?.repair ?? "",
    no_slop_verdict: "pass",
    exception_reason: "",
    verification_evidence: "Source audit; metadata update test.",
  });
  for (const [key, text] of Object.entries(ui[locale].translation)) {
    rows.push({
      id: `ui.${key}:${locale}`,
      file: "src/content/index.ts",
      key_or_location: `ui.${locale}.translation.${key}`,
      locale,
      surfaces_and_states: "Header control, menu, live announcement, or screen-reader text",
      original: text,
      final: text,
      coverage_status: "reviewed",
      slop_finding: "none found",
      pattern_and_reason: "",
      repair: "",
      no_slop_verdict: "pass",
      exception_reason: key === "locale" ? "Names the destination language in the switcher." : "",
      verification_evidence: "Source audit; selected-language render test.",
    });
  }
}

addPair("src/routes/__root.tsx", "errorComponent.copy.error", copy.error, "Route error state");

for (const field of ["title", "description"] as const) {
  rows.push({
    id: `root.initial-metadata.${field}:en`,
    file: "src/routes/__root.tsx",
    key_or_location: `head().meta ${field}`,
    locale: "en",
    surfaces_and_states: "Initial prerender and no-JavaScript fallback",
    original: metadata.en[field],
    final: metadata.en[field],
    coverage_status: "reviewed",
    slop_finding: "none found",
    pattern_and_reason: "",
    repair: "",
    no_slop_verdict: "pass",
    exception_reason: "English prerendered fallback required by docs/decisions.md.",
    verification_evidence: "Source audit; built prerender inspection.",
  });
}

rows.push({
  id: "root-network.coordinate:universal",
  file: "src/components/RootNetwork.tsx",
  key_or_location: "diagram-coordinate.coord-start",
  locale: "universal",
  surfaces_and_states: "Decorative root-network coordinate",
  original: "J / 01",
  final: "01",
  coverage_status: "reviewed",
  slop_finding: "found",
  pattern_and_reason: "Unnecessary English letter in a locale-neutral decorative coordinate.",
  repair: "Keep the neutral sequence number.",
  no_slop_verdict: "pass",
  exception_reason: "Decorative, non-prose label.",
  verification_evidence: "Rendered Arabic and English diagram inspection.",
});

rows.push({
  id: "manifest.name:universal",
  file: "public/site.webmanifest",
  key_or_location: "name",
  locale: "universal",
  surfaces_and_states: "Installed application name",
  original: "Jizrak — جِذرك",
  final: "Jizrak — جِذرك",
  coverage_status: "reviewed",
  slop_finding: "none found",
  pattern_and_reason: "",
  repair: "",
  no_slop_verdict: "pass",
  exception_reason: "Universal product-name metadata; it is not page prose and cannot follow the runtime language preference.",
  verification_evidence: "Manifest source audit.",
});
rows.push({
  id: "manifest.short_name:universal",
  file: "public/site.webmanifest",
  key_or_location: "short_name",
  locale: "universal",
  surfaces_and_states: "Installed application short name",
  original: "Jizrak",
  final: "Jizrak",
  coverage_status: "reviewed",
  slop_finding: "none found",
  pattern_and_reason: "",
  repair: "",
  no_slop_verdict: "pass",
  exception_reason: "Universal product-name metadata; it is not page prose and cannot follow the runtime language preference.",
  verification_evidence: "Manifest source audit.",
});

const headers = Object.keys(rows[0]);
const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => quote(String(row[key as keyof Row]))).join(","))].join("\n");
await writeFile("docs/copy-review-inventory.csv", `${csv}\n`);
console.log(
  `Wrote ${rows.length} text entries: ${rows.filter((row) => row.locale === "en").length} English, ${rows.filter((row) => row.locale === "ar").length} Arabic, and ${rows.filter((row) => row.locale === "universal").length} universal; ${rows.filter((row) => row.coverage_status === "reviewed").length} reviewed, ${rows.filter((row) => row.coverage_status === "protected").length} protected, and ${rows.filter((row) => row.coverage_status === "empty-unused").length} empty-unused.`,
);
