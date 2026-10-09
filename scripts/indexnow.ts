/**
 * Tell IndexNow engines (Bing, Yandex, Naver, ...) which pages changed, after a deploy.
 * Submits the sitemap URLs whose lastmod is newer than the given date (all URLs when none).
 * The key file `assets/<KEY>.txt` proves ownership of cdviz.dev.
 *
 * Run after `mise run build:site` and the deploy: `mise run indexnow -- <since ISO date>`
 */
const KEY = "b9f08840b71645b289089dceb09e567c";
const HOST = "cdviz.dev";

const since = Bun.argv[2] ? new Date(Bun.argv[2]) : new Date(0);
const sitemap = await Bun.file(".vitepress/dist/sitemap.xml").text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)]
  .filter(([, , lastmod]) => new Date(lastmod) > since)
  .map(([, loc]) => loc);

if (urlList.length === 0) {
  console.log(`indexnow: no page changed since ${since.toISOString()}`);
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`indexnow: ${res.status} for ${urlList.length} URLs`);
if (!res.ok) process.exit(1);
