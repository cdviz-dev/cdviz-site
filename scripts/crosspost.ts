// Export a page as plain Markdown for cross-posting (dev.to, Medium, Hashnode...):
// absolute links, PNG diagrams, inlined snippets, no VitePress or Vue syntax.
// Usage: bun run scripts/crosspost.ts src/blog/<post>.md  →  dist-crosspost/<slug>.md
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, posix, relative } from "node:path";
import { extractMermaid, MERMAID_DIR, validateMermaid } from "../.vitepress/mermaid.ts";

const SITE = "https://cdviz.dev";
const root = join(import.meta.dir, "..");
const srcDir = join(root, "src");
const file = process.argv[2];
if (!file) throw new Error("usage: bun run scripts/crosspost.ts <src/...md>");
const pagePath = join(process.cwd(), file);
const rel = relative(srcDir, pagePath);
const where = (line: number) => `src/${rel}:${line}`;

// page URL, same rules as cleanUrls: drop `.md`, `index` → directory
const toUrlPath = (p: string) => "/" + p.replace(/\.md$/, "").replace(/(^|\/)index$/, "$1");
const pageUrl = SITE + toUrlPath(rel);

const collectorVersion = readFileSync(join(root, ".vitepress/config.mts"), "utf8").match(
  /COLLECTOR_VERSION = "([^"]+)"/,
)![1];
const raw = readFileSync(pagePath, "utf8").replaceAll("%%COLLECTOR_VERSION%%", collectorVersion);
const [, fm = "", body0] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [, "", raw];
const meta = (fm ? Bun.YAML.parse(fm) : {}) as Record<string, unknown>;
const lineOffset = fm ? fm.split("\n").length + 2 : 0;

const missingPng: string[] = [];
function png(urlPath: string): string {
  if (!existsSync(join(root, "assets", urlPath))) missingPng.push(urlPath);
  return SITE + urlPath;
}

function absoluteLink(target: string): string {
  if (/^(https?:|mailto:|#)/.test(target)) return target;
  const [path, hash = ""] = target.split("#");
  const abs = path.startsWith("/") ? path : posix.join(posix.dirname("/" + rel), path);
  if (/\.svg$/.test(abs)) return png(`/diagrams/${basename(abs, ".svg")}.png`);
  const url = /\.md$/.test(abs) ? toUrlPath(abs.slice(1)) : abs;
  return SITE + url + (hash ? `#${hash}` : "");
}

// `<<< path#region{lang:opts}`: `@/` is srcDir, otherwise relative to the page
function snippet(spec: string, line: number): string {
  const m = spec.match(/^(.+?)(?:#([\w-]+))?(?:\{(\w+)[^}]*\})?$/)!;
  const [, path, region, lang] = m;
  const abs = path.startsWith("@/") ? join(srcDir, path.slice(2)) : join(dirname(pagePath), path);
  if (!existsSync(abs)) throw new Error(`${where(line)}: snippet not found: ${path}`);
  let code = readFileSync(abs, "utf8");
  if (region) {
    const lines = code.split("\n");
    const start = lines.findIndex((l) => new RegExp(`#\\s*region ${region}\\b`).test(l));
    const end = lines.findIndex((l) => new RegExp(`#\\s*endregion ${region}\\b`).test(l));
    if (start < 0 || end < 0) throw new Error(`${where(line)}: region not found: ${region}`);
    const regionLines = lines.slice(start + 1, end);
    const indent = Math.min(
      ...regionLines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length),
    );
    code = regionLines.map((l) => l.slice(indent)).join("\n");
  }
  const ext = abs.split(".").pop()!;
  return "```" + (lang ?? (ext === "txt" ? "text" : ext)) + "\n" + code.trimEnd() + "\n```";
}

// Vue blocks first (they span lines), then line by line outside code fences
let body = body0
  .replace(/<script\b[\s\S]*?<\/script>\n?/g, "")
  .replace(/<style\b[\s\S]*?<\/style>\n?/g, "");
for (const fence of extractMermaid(body).reverse()) {
  const alt = validateMermaid(fence.code);
  body = body.replace(
    "```mermaid\n" + fence.code + "```",
    `![${alt}](${png(`/${MERMAID_DIR}/${fence.hash}.png`)})`,
  );
}
// diagram components → PNG; any other component fails (outside code fences only)
let seen = "";
body = body
  .split(/(^```[\s\S]*?^```[^\S\n]*$)/m)
  .map((part, i) => {
    const prefix = seen;
    seen += part;
    if (i % 2) return part;
    return part.replace(
      /<([A-Z]\w*)\b([^>]*?)(?:\/>|>[\s\S]*?<\/\1>)/g,
      (_, name: string, attrs: string, offset: number) => {
        if (!existsSync(join(root, "components/diagrams", `${name}.svg`))) {
          const line = lineOffset + (prefix + part.slice(0, offset)).split("\n").length;
          throw new Error(`${where(line)}: no Markdown export for <${name}>`);
        }
        const alt = attrs.match(/aria-label="([^"]*)"/)?.[1] ?? name;
        return `![${alt}](${png(`/diagrams/${name}.png`)})`;
      },
    );
  })
  .join("");

const out: string[] = [];
let inCode = false;
let container: { indent: string } | null = null;
body.split("\n").forEach((l, i) => {
  const line = lineOffset + i + 1;
  if (/^\s*```/.test(l)) inCode = !inCode;
  if (!inCode) {
    const open = l.match(/^(\s*):::\s*(\w+)\s*(.*)$/);
    if (open && !container) {
      const [, indent, kind, title] = open;
      container = { indent };
      out.push(`${indent}> **${title || kind[0].toUpperCase() + kind.slice(1)}**`, `${indent}>`);
      return;
    }
    if (/^\s*:::\s*$/.test(l) && container) {
      container = null;
      return;
    }
    const snip = l.match(/^(\s*)<<<\s+(\S+)/);
    if (snip) l = snippet(snip[2], line).replace(/^/gm, snip[1]);
    l = l.replace(/(\]\()([^)\s]+)/g, (_, p, t) => p + absoluteLink(t));
    l = l.replace(/\b(href|src)="(\/[^"]*)"/g, (_, a, t) => `${a}="${absoluteLink(t)}"`);
  }
  if (container) {
    const { indent } = container;
    l = l
      .split("\n")
      .map((x) => `${indent}> ${x.startsWith(indent) ? x.slice(indent.length) : x}`.trimEnd())
      .join("\n");
  }
  out.push(l);
});

const front = [
  "---",
  ...["title", "description"].filter((k) => meta[k]).map((k) => `${k}: ${JSON.stringify(meta[k])}`),
  ...(Array.isArray(meta.tags) ? [`tags: ${JSON.stringify(meta.tags)}`] : []),
  `canonical_url: ${pageUrl}`,
  "---",
];
const md = `${front.join("\n")}\n${out.join("\n").trim()}\n\n---\n\n_Originally published at [${pageUrl.replace("https://", "")}](${pageUrl})._\n`;
const dest = join(
  root,
  "dist-crosspost",
  `${basename(rel, ".md") === "index" ? basename(dirname(rel)) : basename(rel, ".md")}.md`,
);
await Bun.write(dest, md);
console.log(`${relative(root, dest)}  (canonical: ${pageUrl})`);
for (const p of missingPng)
  console.warn(`warning: ${p} does not exist locally, run \`mise run build:diagrams\``);
