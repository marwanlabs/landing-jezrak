import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const plex = "bf260093582f04622aacc1e9f9ca604d7ccd0c42";
const alexandria = "4fd1422be3488837c41fbdb84a77350f0f56a734";
const files = [
  [
    "Alexandria-source.ttf",
    `https://raw.githubusercontent.com/Gue3bara/Alexandria/${alexandria}/fonts/variable/Alexandria%5Bwght%5D.ttf`,
  ],
  [
    "licenses/Alexandria-OFL.txt",
    `https://raw.githubusercontent.com/Gue3bara/Alexandria/${alexandria}/OFL.txt`,
  ],
  [
    "licenses/IBM-Plex-OFL.txt",
    `https://raw.githubusercontent.com/IBM/plex/${plex}/LICENSE.txt`,
  ],
  ...["Regular", "Medium", "SemiBold"].flatMap((weight) => [
    [
      `IBMPlexSans-${weight}.woff2`,
      `https://raw.githubusercontent.com/IBM/plex/${plex}/packages/plex-sans/fonts/complete/woff2/IBMPlexSans-${weight}.woff2`,
    ],
    [
      `IBMPlexSansArabic-${weight}.woff2`,
      `https://raw.githubusercontent.com/IBM/plex/${plex}/packages/plex-sans-arabic/fonts/complete/woff2/IBMPlexSansArabic-${weight}.woff2`,
    ],
  ]),
];
mkdirSync("public/fonts/licenses", { recursive: true });
const manifest = await Promise.all(
  files.map(async ([path, url]) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    writeFileSync(`public/fonts/${path}`, bytes);
    return {
      path,
      url,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      bytes: bytes.length,
    };
  }),
);
writeFileSync(
  "public/fonts/manifest.json",
  JSON.stringify(
    {
      license: "SIL Open Font License 1.1",
      plexCommit: plex,
      alexandriaCommit: alexandria,
      files: manifest,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  manifest.map((file) => `${file.path}: ${file.bytes} bytes`).join("\n"),
);
