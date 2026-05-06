import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

// Astro emits absolute asset URLs starting with "/" (e.g. /_astro/foo.css).
// Rewrite them to be relative so the build can be deployed at any path.

const distDir = fileURLToPath(new URL("../dist", import.meta.url));

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let count = 0;
for await (const path of walk(distDir)) {
  if (extname(path) !== ".html") continue;
  const original = await readFile(path, "utf8");
  const rewritten = original
    .replace(/(href|src)="\/_astro\//g, '$1="_astro/')
    .replace(/(href|src)="\/favicon\.ico/g, '$1="favicon.ico');
  if (rewritten !== original) {
    await writeFile(path, rewritten);
    count += 1;
  }
}
console.log(`Rewrote absolute asset paths in ${count} HTML file(s).`);
