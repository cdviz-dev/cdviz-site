// Shared by the site build (config.mts), scripts/build-diagrams.ts and scripts/crosspost.ts:
// a ```mermaid fence is pre-rendered to assets/diagrams/mermaid/<hash>.{svg,png}.
import { createHash } from "node:crypto";

export const MERMAID_DIR = "diagrams/mermaid"; // relative to assets/ (publicDir)

export interface MermaidFence {
  code: string;
  hash: string;
  line: number; // 1-based line of the opening fence
}

export function mermaidHash(code: string): string {
  return createHash("sha256").update(code.trim()).digest("hex").slice(0, 12);
}

export function extractMermaid(markdown: string): MermaidFence[] {
  const fences: MermaidFence[] = [];
  const re = /^```mermaid[^\S\n]*\n([\s\S]*?)^```[^\S\n]*$/gm;
  for (const m of markdown.matchAll(re)) {
    const line = markdown.slice(0, m.index).split("\n").length;
    fences.push({ code: m[1], hash: mermaidHash(m[1]), line });
  }
  return fences;
}

// The theme lives in .vitepress/mermaid.config.json only. Returns the alt text (accTitle).
export function validateMermaid(code: string): string {
  if (/^\s*---/.test(code) || /%%\{\s*init/.test(code)) {
    throw new Error(
      "per-diagram config (front matter or %%{init}) is not allowed: the theme lives in .vitepress/mermaid.config.json",
    );
  }
  const title = code.match(/^\s*accTitle\s*:\s*(.+)$/m)?.[1].trim();
  if (!title) {
    throw new Error("missing `accTitle: <what the diagram shows>` (used as alt text)");
  }
  return title;
}
