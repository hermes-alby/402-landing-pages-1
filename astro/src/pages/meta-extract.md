---
layout: ../layouts/UseCasePage.astro
title: "URL Metadata Extraction API · Open Graph, JSON-LD, Twitter Cards | Meta-Extract"
description: "Extract every metadata field from any URL in one call — Open Graph, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots. Pay per call. No signup, no API key."
bodyClass: "page-meta-extract"
themeColor: "#0b0b0c"
ogTitle: "URL Metadata Extraction API — One Call, Every Field"
ogDescription: "OG tags, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — all from one URL, billed per call. No signup, no API key, no subscription."
schema:
  name: "Meta-Extract URL Metadata API"
  description: "Pay-per-call API that extracts every metadata field from any URL — OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — in a single structured response."
  mainEntityName: "Meta-Extract"
  mainEntityDescription: "Extracts complete URL metadata with x402 micropayments. No signup, no API key, no subscription."
  providerName: "Strale"
hero:
  ghostNumber: "META"
  eyebrow: "Pay-per-call · No signup · No API key"
  title:
    lines:
      - "Every meta tag,"
      - "from any URL,"
    highlight: "in one call."
  lead: "Meta-Extract pulls Open Graph, Twitter Cards, JSON-LD, favicons, canonical URLs, RSS feeds, and robots directives from any URL in a single request. No scraper to maintain, no signup, no monthly bill — pay per call. Built for developers and AI agents that refuse subscriptions."
  meta:
    - "No signup, no API key"
    - "Charged only on a successful response"
    - "MCP + x402 ready"
  connection:
    agent:
      eyebrow: "Your AI agent"
      logo: "Logo"
      title: "Any agent"
    service:
      eyebrow: "Meta-Extract"
      logo: "/logos/meta-extract.svg"
      title: "URL metadata API"
trust:
  items:
    - label: "Coverage"
      stat: ""
      statHighlight: "7"
      statSuffix: "blocks"
      desc: "Open Graph, Twitter Cards, JSON-LD, favicon, canonical, RSS feeds, robots — all returned in one shape."
    - label: "Quality score"
      stat: ""
      statHighlight: "96"
      statSuffix: "/ 100 SQS"
      desc: "Independent service-quality score on completeness and consistency of returned metadata."
    - label: "Time to first call"
      stat: "~"
      statHighlight: "60"
      statSuffix: "sec"
      desc: "Open a terminal, paste curl, hit a URL. No account, no key, no onboarding."
useCases:
  eyebrow: "Who it's for"
  title:
    text: "Built for teams that need URL context "
    highlight: "without the overhead."
  description: "Five concrete shapes of customer who benefit most. If you recognize your workflow, the math is in your favor."
  items:
    - who: "For chat & messaging apps"
      title: "Render link previews without a scraper team."
      text: "When a user pastes a URL, call the API and you get title, description, image, and favicon back — everything you need to render a rich preview card. No browser farm, no edge cases, no maintenance window when a publisher changes their HTML."
      query: "https://www.theverge.com/2026/3/12/ai-agents-replace-scrapers"
    - who: "For SEO & content teams"
      title: "Audit metadata across thousands of pages."
      text: "Feed your sitemap through the API and surface missing og:image tags, broken canonical URLs, conflicting Twitter Card types, or robots directives that contradict your indexing strategy. Pay only for the pages you actually audit."
      query: "Every URL in sitemap.xml — flag missing og:image and bad canonicals"
    - who: "For AI research agents"
      title: "Decide what to read before reading it."
      text: "Have your agent extract structured metadata from a URL first — title, type, author, publish date, description — and use that to decide whether to spend tokens on the full page. Massive savings on long research runs."
      query: "Every URL my agent discovered today, return type + datePublished + author"
    - who: "For social schedulers"
      title: "Show an accurate preview before publishing."
      text: "Pull OG and Twitter Card data for any URL the user adds to a post, then render exactly how it will appear on each platform. Catch the missing image or wrong title before you embarrass the brand at 9am."
      query: "https://acme.com/blog/launching-v3 — return OG and Twitter Card preview"
cta:
  eyebrow: "Start in one minute"
  title:
    text: "Stop maintaining a scraper "
    highlight: "for one tag."
  text: "Open an x402 wallet, run one curl, and your first metadata response lands in under a second. No URL goes through human onboarding. If you don't call the API for a month, you don't pay for the month. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try a request →"
      href: "#prompt"
      primary: true
    - label: "Docs"
      text: "Read the schema"
      href: "#endpoint"
  badges:
    - "No signup, no API key"
    - "MCP + x402 native"
faq:
  eyebrow: "FAQ"
  title: "The honest answers."
  description: "If something below doesn't cover your case, ping us — we answer directly, no SDR funnel."
  items:
    - question: "What metadata blocks does the API extract?"
      answer: "Open Graph tags, Twitter Card tags, JSON-LD structured data, favicon URLs, canonical URL, RSS/Atom feed links, and robots directives — all from a single request, returned under predictable JSON keys."
      open: true
    - question: "Do I really not need an account or API key?"
      answer: "Correct. Authentication is per-request via x402. Open a wallet, sign the request, get the metadata back. Nothing to onboard, nothing to rotate."
    - question: "How much does each request cost?"
      answer: "Per successful extraction. Failures cost zero. No monthly minimum, no tiered pricing, no overage. You pay per useful response."
    - question: "What about JavaScript-rendered pages?"
      answer: "Meta-Extract reads the initial HTML response. Pages that ship metadata only via client-side JavaScript will return whatever the server-rendered HTML contains. For most publishers, that's everything you need; for SPAs that defer all metadata to the runtime, expect partial coverage."
    - question: "Can AI agents call this autonomously?"
      answer: "Yes. The endpoint supports MCP discovery (Claude, Cursor, Windsurf) and x402 micropayments, so an autonomous agent can find it, call it, and pay for it without a human creating an account first."
    - question: "How is this different from Peekalink, OpenGraph.io, or LinkPreview?"
      answer: "Those are subscription products that mostly extract Open Graph tags. Meta-Extract returns every metadata block in one shape, charges per successful call, and works without an account. If you're already paying subscription tiers for partial coverage, the math flips."
footer:
  brand: "Meta-Extract"
  suffix: "URL metadata, structured"
  tag: "© 2026 · Built for agents"
---
