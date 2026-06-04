# 402-landing-pages

Landing pages for Alby 402 services, hosted on GitHub Pages.

## Structure

- `astro/` — Astro app. Source pages live in `astro/src/pages/`; build output goes to `astro/dist/`.
- `static/` — plain HTML/CSS/JS pages deployed under `/x/` (see below).
- `services/`, `mpp-endpoints/`, `assets/`, `skills/` — service definitions and shared resources.
- `.github/workflows/pages.yml` — builds Astro into `/ai-tools/`, publishes `static/` under `/x/`, and deploys to GitHub Pages.

## Static pages

Plain HTML/CSS/JS pages deployed under the `/x/` path. The deploy workflow
builds Astro into `/ai-tools/` and publishes the contents of `static/` under
`/x/`. Anything in `static/` ships verbatim — no build step, no framework.

### Layout

```
static/
  css/      stylesheets
  js/       client-side JavaScript
  assets/   images, fonts, downloads
  <slug>/   one folder per page, containing index.html
```

A page at `static/foo/index.html` is served at `/x/foo/`.

Reference shared files with relative paths from the page (each page sits
one level deep under `static/`, so shared files are one directory up):

```html
<link rel="stylesheet" href="../css/site.css">
<script src="../js/site.js" defer></script>
<img src="../assets/logo.svg" alt="">
```

Static pages and the Astro build are published under separate paths (`/x/`
and `/ai-tools/`), so static slugs no longer collide with Astro routes. Pick
slugs that are unique among the other folders in `static/`.

### Prompt for creating a new static page

Use this when asking Claude to add a new static page:

> Create a new static page at `static/<slug>/index.html`.
>
> - Title: "<page title>"
> - Purpose: <one sentence describing what the page is for>
> - Sections: <list the sections / content you want>
>
> Requirements:
> - Plain HTML5, no framework, no build step. Use `<!doctype html>`,
>   `<html lang="en">`, `<meta charset="utf-8">`, a `<meta name="viewport"
>   content="width=device-width, initial-scale=1">` tag, and a `<title>`.
> - Link the shared stylesheet at `../css/site.css` and the shared script at
>   `../js/site.js` (use `defer`). Add page-specific CSS/JS only if needed,
>   placing it in `static/css/<slug>.css` or `static/js/<slug>.js` and
>   linking with a relative path (`../css/<slug>.css`, `../js/<slug>.js`).
> - Put any images, fonts, or downloads under `static/assets/` and reference
>   them with relative paths (e.g. `../assets/<file>`). Do not hotlink remote
>   assets.
> - Internal links to other static pages should be relative (`../other-page/`).
> - Pick a `<slug>` that is unique among the existing page folders in
>   `static/`. (Static pages deploy under `/x/`, separate from the Astro
>   app under `/ai-tools/`, so they no longer collide with Astro routes.)
> - Do not modify the Astro app under `astro/`, the workflow under
>   `.github/`, or files in `static/css/`, `static/js/`, `static/assets/`
>   that are already shared by other pages — add new files instead.
