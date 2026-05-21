# 402-landing-pages

Landing pages for Alby 402 services, hosted on GitHub Pages.

## Structure

- `astro/` — Astro app. Source pages live in `astro/src/pages/`; build output goes to `astro/dist/`.
- `static/` — plain HTML/CSS/JS pages served alongside the Astro site (see below).
- `services/`, `mpp-endpoints/`, `assets/`, `skills/` — service definitions and shared resources.
- `.github/workflows/pages.yml` — builds Astro, merges `static/` on top, and deploys to GitHub Pages.

## Static pages

Plain HTML/CSS/JS pages served alongside the Astro site. The deploy workflow
builds Astro into `astro/dist/`, then copies the contents of `static/` over
the top before publishing. Anything in `static/` ships verbatim — no build
step, no framework.

### Layout

```
static/
  css/      stylesheets
  js/       client-side JavaScript
  assets/   images, fonts, downloads
  <slug>/   one folder per page, containing index.html
```

A page at `static/foo/index.html` is served at `/foo/`.

Reference shared files with absolute paths from the page:

```html
<link rel="stylesheet" href="/css/site.css">
<script src="/js/site.js" defer></script>
<img src="/assets/logo.svg" alt="">
```

Static files are copied over the Astro build, so a `static/<slug>/` will
shadow an Astro route at the same path — pick slugs that do not collide with
anything under `astro/src/pages/`.

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
> - Link the shared stylesheet at `/css/site.css` and the shared script at
>   `/js/site.js` (use `defer`). Add page-specific CSS/JS only if needed,
>   placing it in `static/css/<slug>.css` or `static/js/<slug>.js` and
>   linking with an absolute path (`/css/<slug>.css`, `/js/<slug>.js`).
> - Put any images, fonts, or downloads under `static/assets/` and reference
>   them with absolute paths (e.g. `/assets/<file>`). Do not hotlink remote
>   assets.
> - All internal links must be absolute (`/some-page/`), not relative.
> - Pick `<slug>` so it does not collide with an Astro route under
>   `astro/src/pages/` — static files are copied over the Astro build and
>   would shadow them.
> - Do not modify the Astro app under `astro/`, the workflow under
>   `.github/`, or files in `static/css/`, `static/js/`, `static/assets/`
>   that are already shared by other pages — add new files instead.
