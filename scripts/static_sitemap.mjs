import { readdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Generates static/sitemap.xml listing every static page.
// Static pages are deployed under /x (see .github/workflows/pages.yml),
// so a page at static/<slug>/index.html is served at <SITE_URL>/<slug>/.
// Run after adding or removing a static page:  node scripts/static_sitemap.mjs

const staticDir = fileURLToPath(new URL("../static", import.meta.url));
const SITE_URL = (process.env.STATIC_SITE_URL ?? "https://getalby.com/x").replace(/\/$/, "");

const entries = [];
for (const entry of await readdir(staticDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const indexPath = join(staticDir, entry.name, "index.html");
  let fileStat;
  try {
    fileStat = await stat(indexPath);
  } catch {
    continue; // not a page folder (e.g. css/, js/, assets/)
  }
  entries.push({
    loc: `${SITE_URL}/${entry.name}/`,
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

await writeFile(join(staticDir, "sitemap.xml"), xml);
console.log(`Wrote static/sitemap.xml with ${entries.length} entries (base: ${SITE_URL}).`);
