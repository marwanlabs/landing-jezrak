import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const source = readFileSync(process.argv[2], "utf8").replace(/\r/g, "");
const ids = [
  "header",
  "top",
  "connected",
  "business",
  "sell",
  "catalog",
  "inventory",
  "purchasing",
  "orders",
  "pos",
  "customers",
  "understand",
  "identity",
  "operate",
  "features",
  "demo",
  "start",
  "footer",
];
const sections = [
  ...source.matchAll(
    /^### 6\.(\d+) ([^\n]+)\n([\s\S]*?)(?=^### 6\.|^## 7\.)/gm,
  ),
].map((match) => {
  const id = ids[Number(match[1]) - 1];
  const raw = match[3];
  function paired(field) {
    const result = { id: `${id}-${field}`, en: "", ar: "" };
    for (const [language, locale] of [
      ["English", "en"],
      ["Arabic", "ar"],
    ]) {
      const found = raw.match(
        new RegExp(
          `\\*\\*${language} ${field}:\\*\\* *(?:\x60([^\x60]+)\x60|\\n+> ([^\\n]+))`,
          "i",
        ),
      );
      result[locale] = found?.[1] || found?.[2] || "";
    }
    return result;
  }
  const rows = raw
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim()),
    )
    .filter(
      (c) =>
        c[0] && !/^[- ]+$/.test(c[0]) && !["English", "Group"].includes(c[0]),
    );
  return {
    id,
    title: match[2],
    eyebrow: paired("eyebrow"),
    heading: paired("heading").en ? paired("heading") : paired("headline"),
    body: paired("body").en ? paired("body") : paired("introduction"),
    premise: paired("premise"),
    details: rows.map((row, i) => ({
      id: `${id}-detail-${i + 1}`,
      en: row[0],
      ar: row[1],
    })),
    ...(id === "features"
      ? {
          groups: rows.map((row, i) => ({
            id: `group-${i + 1}`,
            name: {
              id: `group-${i + 1}-name`,
              en: row[0].split(" / ")[0],
              ar: row[0].split(" / ")[1],
            },
            inventory: {
              id: `group-${i + 1}-inventory`,
              en: row[1],
              ar: row[2],
            },
          })),
        }
      : {}),
  };
});
mkdirSync("src/content", { recursive: true });
writeFileSync(
  "src/content/landing.json",
  JSON.stringify(sections, null, 2) + "\n",
);
mkdirSync("docs", { recursive: true });
writeFileSync("docs/build-plan.md", source);
console.log(
  sections
    .map(
      (s) =>
        `${s.id}: ${s.heading.en || "(chrome)"} — ${s.details.length} details`,
    )
    .join("\n"),
);
