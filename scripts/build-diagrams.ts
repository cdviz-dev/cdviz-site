// Pre-render ```mermaid fences (src/**/*.md) with the shared CDviz theme to SVG,
// then render every diagram SVG to PNG (for hosts that reject SVG when cross-posting).
// Needs chromium: set CHROME_PATH if it is not /usr/bin/chromium.
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import puppeteer, { type Page } from "puppeteer-core";
import { extractMermaid, MERMAID_DIR, validateMermaid } from "../.vitepress/mermaid.ts";

const root = join(import.meta.dir, "..");
const outDir = join(root, "assets/diagrams");
const mermaidDir = join(root, "assets", MERMAID_DIR);
const config = await Bun.file(join(root, ".vitepress/mermaid.config.json")).json();
const font = Buffer.from(
  await Bun.file(join(root, "assets/fonts/Excalifont-Regular.woff2")).arrayBuffer(),
).toString("base64");
const fontFace = `@font-face{font-family:"Excalifont";src:url(data:font/woff2;base64,${font}) format("woff2");}`;
// SVGs drawn with currentColor take the brand orange; background is the brand dark
const pageCss = `${fontFace} body{margin:0;background:#0e151b;color:#f29107;} #wrap{display:inline-block;padding:32px;background:#0e151b;}`;

const pngSources = [
  { dir: mermaidDir, out: mermaidDir },
  // the Vue components set fill="currentColor" on the root <svg>: do the same
  {
    dir: join(root, "components/diagrams"),
    out: outDir,
    skip: ["Empty.svg"],
    css: "#wrap>svg{fill:currentColor}",
  },
  { dir: join(root, "assets/architectures"), out: outDir },
  { dir: join(root, "assets/quickstart"), out: outDir },
];
// animated diagrams (GSAP in the matching .vue) stack all their layers: show the final frame
const finalFrameCss: Record<string, string> = {
  "Sdlc.svg": "#apps{display:none!important}",
};

function isStale(src: string, dst: string): boolean {
  return !existsSync(dst) || statSync(dst).mtimeMs < statSync(src).mtimeMs;
}

async function renderMermaid(page: Page, code: string): Promise<string> {
  await page.setContent(`<html><head><style>${pageCss}</style></head><body></body></html>`);
  await page.addScriptTag({ path: join(root, "node_modules/mermaid/dist/mermaid.min.js") });
  const svg = await page.evaluate(
    async (code, config) => {
      await document.fonts.load('18px "Excalifont"');
      // @ts-ignore mermaid is a global loaded by addScriptTag
      mermaid.initialize(config);
      // @ts-ignore
      const { svg } = await mermaid.render("cdviz", code);
      return svg as string;
    },
    code,
    config,
  );
  // fixed size from the viewBox (mermaid emits width="100%"), and embed the font:
  // an SVG loaded by <img> can not use the page fonts
  const [, , w, h] = svg
    .match(/viewBox="([^"]+)"/)![1]
    .split(/\s+/)
    .map(Number);
  return svg
    .replace(/<svg([^>]*?) width="100%"/, `<svg$1 width="${Math.ceil(w)}" height="${Math.ceil(h)}"`)
    .replace(/ style="max-width:[^"]*"/, "")
    .replace(/(<svg[^>]*>)/, `$1<style>${fontFace}</style>`);
}

async function renderPng(page: Page, svgPath: string, pngPath: string, css = "") {
  const svg = (await Bun.file(svgPath).text()).replace(/<\?xml[^>]*\?>/, "");
  const extraCss = css + (finalFrameCss[basename(svgPath)] ?? "");
  await page.setContent(
    `<html><head><style>${pageCss}${extraCss}</style></head><body><div id="wrap">${svg}</div></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  const wrap = (await page.$("#wrap"))!;
  await wrap.screenshot({ path: pngPath as `${string}.png` });
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/chromium",
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 4000, height: 2000, deviceScaleFactor: 2 });
  mkdirSync(mermaidDir, { recursive: true });

  const used = new Set<string>();
  let errors = 0;
  for await (const file of new Bun.Glob("src/**/*.md").scan(root)) {
    for (const fence of extractMermaid(await Bun.file(join(root, file)).text())) {
      used.add(fence.hash);
      const svgPath = join(mermaidDir, `${fence.hash}.svg`);
      if (existsSync(svgPath)) continue;
      try {
        validateMermaid(fence.code);
        await Bun.write(svgPath, await renderMermaid(page, fence.code));
        console.log(`svg  ${file}:${fence.line} -> assets/${MERMAID_DIR}/${fence.hash}.svg`);
      } catch (e) {
        console.error(`${file}:${fence.line}: ${(e as Error).message}`);
        errors++;
      }
    }
  }
  for (const f of readdirSync(mermaidDir)) {
    if (!used.has(f.replace(/\.(svg|png)$/, "")))
      console.warn(`orphan (no page uses it): assets/${MERMAID_DIR}/${f}`);
  }

  for (const { dir, out, skip = [], css } of pngSources) {
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".svg") && !skip.includes(f))) {
      const pngPath = join(out, `${basename(f, ".svg")}.png`);
      if (!isStale(join(dir, f), pngPath)) continue;
      await renderPng(page, join(dir, f), pngPath, css);
      console.log(`png  ${pngPath.slice(root.length + 1)}`);
    }
  }
  if (errors) process.exitCode = 1;
} finally {
  await browser.close();
}
