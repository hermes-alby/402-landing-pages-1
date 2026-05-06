import { readdir, writeFile, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = fileURLToPath(new URL("../dist", import.meta.url));
const SITE_URL = (process.env.SITE_URL ?? "https://getalby.com/ai-tools").replace(/\/$/, "");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const today = new Date().toISOString().slice(0, 10);
const entries = [];
for await (const path of walk(distDir)) {
  if (extname(path) !== ".html") continue;
  const fileStat = await stat(path);
  const rel = path.slice(distDir.length + 1);
  // Map index.html → "" (the deploy root); other pages keep their .html filename
  const urlPath = basename(rel) === "index.html" ? rel.slice(0, -"index.html".length) : rel;
  entries.push({
    loc: `${SITE_URL}/${urlPath}`.replace(/\/$/, ""),
    lastmod: fileStat.mtime.toISOString().slice(0, 10),
  });
}

entries.sort((a, b) => a.loc.localeCompare(b.loc));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

await writeFile(join(distDir, "sitemap.xml"), xml);
console.log(`Wrote sitemap.xml with ${entries.length} entries (base: ${SITE_URL}, today: ${today}).`);
