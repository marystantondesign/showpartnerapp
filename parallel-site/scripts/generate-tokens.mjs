#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const snapshotPath = path.join(rootDir, "data", "figma-tokens.json");
const outPath = path.join(rootDir, "src", "styles", "tokens.css");

const shouldRefresh = process.argv.includes("--refresh");
const colorModeName = process.env.FIGMA_COLOR_MODE || "ERA";
const layoutModeName = process.env.FIGMA_LAYOUT_MODE || "ERA";

async function loadSnapshot() {
  return JSON.parse(await readFile(snapshotPath, "utf8"));
}

async function refreshFromFigma(snapshot) {
  const token = process.env.FIGMA_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY || snapshot.source.fileKey;
  if (!token) {
    console.warn("FIGMA_TOKEN not set — skipping live refresh, using committed snapshot.");
    return snapshot;
  }

  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    throw new Error(`Figma variables API returned ${res.status}: ${await res.text()}`);
  }
  const { meta } = await res.json();
  const collectionsById = meta.variableCollections;

  const findMode = (collection, modeName) => {
    const mode = collection.modes.find((m) => m.name === modeName);
    if (!mode) {
      throw new Error(
        `Mode "${modeName}" not found in collection "${collection.name}". Available: ${collection.modes.map((m) => m.name).join(", ")}`
      );
    }
    return mode.modeId;
  };

  const color = {};
  const radius = {};

  for (const variable of Object.values(meta.variables)) {
    const collection = collectionsById[variable.variableCollectionId];
    if (!collection) continue;

    if (collection.name === "Color") {
      const modeId = findMode(collection, colorModeName);
      const value = variable.valuesByMode[modeId];
      if (value && typeof value === "object" && "r" in value) {
        const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
        color[variable.name] = `#${toHex(value.r)}${toHex(value.g)}${toHex(value.b)}`;
      }
    }

    if (collection.name === "Layout") {
      const modeId = findMode(collection, layoutModeName);
      const value = variable.valuesByMode[modeId];
      if (typeof value === "number" && variable.name.startsWith("radius/")) {
        radius[variable.name.replace("radius/", "")] = value;
      }
    }
  }

  snapshot.color = { ...snapshot.color, ...color };
  snapshot.radius = { ...snapshot.radius, ...radius };
  snapshot.source.capturedAt = new Date().toISOString().slice(0, 10);
  snapshot.source.capturedVia = "Figma REST API /v1/files/:key/variables/local";
  await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n");
  return snapshot;
}

function cssVarName(prefix, key) {
  return `--${prefix}-${key.replace(/\//g, "-")}`;
}

function slug(key) {
  return key.replace(/^ERA\//, "").toLowerCase().replace(/\//g, "-");
}

function familySlug(fontFamily) {
  return fontFamily.toLowerCase().replace(/\s+/g, "-");
}

function buildCss(snapshot) {
  const lines = [];
  lines.push("/* GENERATED FILE — do not hand-edit. Run `npm run tokens` (or `tokens:refresh`) to regenerate. */");
  lines.push(`/* Source: Figma file ${snapshot.source.fileKey}, color mode "${colorModeName}", layout mode "${layoutModeName}". Captured ${snapshot.source.capturedAt}. */`);
  lines.push("");
  lines.push(":root {");

  for (const [key, value] of Object.entries(snapshot.color)) {
    lines.push(`  ${cssVarName("color", key)}: ${value};`);
  }
  lines.push("");
  for (const [key, value] of Object.entries(snapshot.radius)) {
    lines.push(`  --radius-${key}: ${value}px;`);
  }
  lines.push("");

  for (const [styleName, style] of Object.entries(snapshot.textStyles)) {
    const s = slug(styleName);
    lines.push(`  --text-${s}-font-family: var(--font-family-${familySlug(style.fontFamily)});`);
    lines.push(`  --text-${s}-font-weight: ${style.fontWeight};`);
    lines.push(`  --text-${s}-font-style: ${style.fontStyle};`);
    lines.push(`  --text-${s}-font-size: ${style.fontSize}px;`);
    lines.push(`  --text-${s}-line-height: ${style.lineHeight}px;`);
    lines.push(`  --text-${s}-letter-spacing: ${style.letterSpacing}px;`);
  }

  lines.push("}");
  lines.push("");

  for (const styleName of Object.keys(snapshot.textStyles)) {
    const s = slug(styleName);
    lines.push(`.text-${s} {`);
    lines.push(`  font-family: var(--text-${s}-font-family);`);
    lines.push(`  font-weight: var(--text-${s}-font-weight);`);
    lines.push(`  font-style: var(--text-${s}-font-style);`);
    lines.push(`  font-size: var(--text-${s}-font-size);`);
    lines.push(`  line-height: var(--text-${s}-line-height);`);
    lines.push(`  letter-spacing: var(--text-${s}-letter-spacing);`);
    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  let snapshot = await loadSnapshot();
  if (shouldRefresh) {
    snapshot = await refreshFromFigma(snapshot);
  }
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buildCss(snapshot));
  console.log(`Wrote ${path.relative(rootDir, outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
