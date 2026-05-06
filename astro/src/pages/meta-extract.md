---
layout: ../layouts/UseCasePage.astro
title: "URL Metadata Extraction API · Open Graph, JSON-LD, Twitter Cards | Meta-Extract"
description: "Extract every metadata field from any URL in one call — Open Graph, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots. Pay €0.03 per call via Lightning. No signup, no API key."
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
  lead: "Meta-Extract pulls Open Graph, Twitter Cards, JSON-LD, favicons, canonical URLs, RSS feeds, and robots directives from any URL in a single request. No scraper to maintain, no signup, no monthly bill — just €0.03 per call via Lightning. Built for developers and AI agents that refuse subscriptions."
  actions:
    - label: "Start"
      text: "Send a URL"
      href: "#prompt"
      primary: true
    - label: "Try"
      text: "See the response"
      href: "#endpoint"
      monoTag: "curl"
  meta:
    - "From €0.03 per call"
    - "No signup, no API key"
    - "Charged only on a successful response"
    - "MCP + x402 ready"
  promptLabel: "Request"
  promptText: "Extract every metadata field from https://stripe.com/blog/open-source-retool — return OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots."
  profile:
    initials: "ST"
    brand: "meta-extract"
    brandSuffix: "extract"
    status: "200 · 0.42s"
    name: "Stripe Blog"
    role: "Open-source Retool Internals · Stripe Inc."
    meta: "🌐 stripe.com/blog/open-source-retool  ·  HTML 200 OK  ·  EN"
    rows:
      - label: "og:title"
        value: "How we open-sourced Retool"
        verified: true
      - label: "og:image"
        value: "stripe.com/img/blog/retool@2x.png"
        verified: true
      - label: "JSON-LD type"
        value: "BlogPosting · author + datePublished"
      - label: "Canonical"
        value: "stripe.com/blog/open-source-retool"
    tags:
      - "open-graph"
      - "twitter-card"
      - "json-ld"
      - "favicon"
      - "canonical"
      - "rss"
    footLeft: "1 URL · 7 metadata blocks"
    footRight: "Charged · ⚡ 312 sats · €0.03"
  resultLabel: "Result"
  resultMeta: "Structured metadata · JSON"
trust:
  items:
    - label: "Per call"
      stat: "€"
      statHighlight: "0.03"
      desc: "Per successful extraction, settled via Lightning. Failures cost zero. No seats, no minimums."
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
pipeline:
  eyebrow: "What it does"
  title:
    text: "A metadata API your "
    highlight: "agent can actually use."
  description: "Most metadata services force you to stitch together OG scrapers, JSON-LD parsers, and feed discovery libraries — then negotiate a subscription on top. Meta-Extract returns every block in one structured response, billed per call. Drop it in, pay per URL, walk away."
  stages:
    - ix: "01 Send"
      title: "Pass any URL."
      text: "One body field. No headers to wrangle, no API key to rotate, no allow-list to negotiate. Public URLs work out of the box."
    - ix: "02 Extract"
      title: "Every metadata block, in parallel."
      text: "OG tags, Twitter Cards, JSON-LD, favicon, canonical, RSS feeds, and robots directives are pulled from the initial HTML response and parsed in parallel."
    - ix: "03 Return"
      title: "One JSON shape, charged on success."
      text: "Each block is returned in a stable schema your agent can rely on. Failed extractions return an error and cost zero — you pay only when you get usable data back."
  foot:
    - label: "Best fit"
      html: "Link-preview features, SEO audit pipelines, AI research agents, content aggregators — anywhere you need <b>structured context from a URL</b> on demand."
    - label: "Pricing rule"
      html: "Per successful extraction, settled via Lightning at completion. <b>Failed responses are not charged.</b>"
    - label: "Latency"
      html: "Median <b>0.4s</b> for static pages. <b>1–3s</b> for slower upstreams. JS-only metadata is best-effort."
benefits:
  eyebrow: "Why it converts"
  title: "Everything you need to read a URL, nothing else."
  description: "Five capabilities, scoped to the metadata problem. No browser farm, no rendering layer, no analytics stack — just clean structured data your code can use, priced like an API call should be."
  cards:
    - num: "01 / Complete extraction"
      title: "OG, Twitter, JSON-LD."
      highlight: "All in one shape."
      text: "Stop chaining three libraries to read one page. Meta-Extract returns every metadata block in a single normalized JSON response, so the consumer is always one call away from any field it cares about."
      span: 3
      feature: true
    - num: "02 / Pay per call"
      title: "One URL, one charge."
      highlight: "That's it."
      text: "Lightning micropayments mean zero commitment, no monthly minimum, no expiring credits. Scale from 1 URL to a million without changing plans — or paying when you're not running."
      span: 3
      demo: |
        <div class="ln"><span class="gut">$</span><span><span class="kw">curl</span> -X POST api.strale.io/x402/meta-extract \</span></div>
        <div class="ln"><span class="gut"></span><span>  -d <span class="str">'{ "url": "https://stripe.com/blog/post" }'</span></span></div>
        <div class="ln"><span class="gut"></span><span class="com"># charged on success · 312 sats · €0.03</span></div>
    - num: "03 / No signup, no key"
      title: "Public from the first request."
      text: "There's no account to create and no key to rotate. The first curl in your terminal works the same as the millionth one in production."
      span: 2
    - num: "04 / Stable schema"
      title: "Every URL, one shape."
      text: "OG, Twitter, JSON-LD, favicon, canonical, RSS, robots — all returned under predictable keys so your agent doesn't have to branch on which fields a particular site happens to ship."
      span: 2
    - num: "05 / Agent-native rails"
      title: "MCP + x402, day one."
      text: "Native MCP server registration plus x402 micropayments. Autonomous agents discover, call, and pay for the service without a human setting up an account."
      span: 2
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
comparison:
  eyebrow: "Compared"
  title: "A different shape from <em>everything else</em> in the category."
  description: "Hosted scrapers gate behind subscriptions and partial extraction. Self-hosted libraries push maintenance onto your team. Meta-Extract is the middle option that should always have existed."
  columns:
    us: "Meta-Extract"
    a: "Subscription scrapers"
    b: "Self-hosted libraries"
  rows:
    - category: "Pricing"
      us: "€0.03 per successful call"
      left: "$9–$99 / month"
      right: "Free + your infra cost"
    - category: "Setup"
      us: "Curl from minute one"
      left: "Signup + API key + plan"
      right: "Install + run + maintain"
    - category: "Coverage per call"
      us: "OG · Twitter · JSON-LD · favicon · canonical · RSS · robots"
      left: "Often only OG"
      right: "One library per format"
    - category: "Charged on failure?"
      us: "No"
      left: "Yes (request counts toward quota)"
      right: "Your time is the cost"
    - category: "Maintenance"
      us: "Zero"
      left: "Vendor lock-in"
      right: "On you"
    - category: "Agent fit"
      us: "MCP + x402 native"
      left: "REST only"
      right: "Code only"
flow:
  eyebrow: "Payment flow"
  title:
    text: "Three steps, "
    highlight: "then it just works."
  steps:
    - number: "01 Connect"
      title: "Open a wallet"
      text: "Plug a Lightning wallet that pays per request. No account creation, no email verification, no credit card."
    - number: "02 Send"
      title: "POST a URL"
      text: "One endpoint, one body field: the URL you want metadata for. Optional flags constrain which blocks you want back."
    - number: "03 Receive"
      title: "Structured metadata"
      text: "Every block in one JSON object: OG, Twitter, JSON-LD, favicon, canonical, RSS, robots. Charged only on success."
    - number: "04 Repeat"
      title: "Scale at request shape"
      text: "Run one URL or a million. Concurrency-fair queueing. The cost line scales with calls, not seats."
facts:
  eyebrow: "Endpoint"
  title: "One URL. One body field. Honest defaults."
  text: "Everything an agent or developer needs to call the API correctly on the first try. No hidden flags, no rate-limit surprises buried in a contract."
  items:
    - label: "Endpoint"
      value: "POST api.strale.io/x402/meta-extract"
    - label: "Auth"
      value: "x402 / Lightning per request — no API key needed"
    - label: "Input"
      value: "{ url: string } — optional fields filter blocks"
    - label: "Output"
      value: "Stable JSON: og · twitter · jsonLd · favicon · canonical · feeds · robots"
    - label: "Cost"
      value: "From €0.03 per successful call · failures cost zero"
    - label: "Service quality score"
      value: "96 / 100 SQS — completeness and schema stability"
prompt:
  eyebrow: "Try it"
  title: "Send your first URL."
  text: "Replace the URL, run it, get structured metadata back. The body is one field — no SDK, no auth dance."
  copyTarget: "meta-prompt"
  buttonLabel: "Copy curl"
  code: |
    curl -X POST https://api.strale.io/x402/meta-extract \
      -H "Content-Type: application/json" \
      -d '{
        "url": "https://stripe.com/blog/open-source-retool"
      }'

    # Response: { og, twitter, jsonLd, favicon, canonical, feeds, robots }
    # Charged only on success · Lightning settlement on completion
cta:
  eyebrow: "Start in one minute"
  title:
    text: "Stop maintaining a scraper "
    highlight: "for one tag."
  text: "Open a Lightning wallet, run one curl, and your first metadata response lands in under a second. No URL goes through human onboarding. If you don't call the API for a month, you don't pay for the month. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try a request →"
      href: "#prompt"
      primary: true
    - label: "Docs"
      text: "Read the schema"
      href: "#endpoint"
  badges:
    - "From €0.03 per call"
    - "~312 sats per success"
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
      answer: "Correct. Authentication is per-request via x402 / Lightning. Open a wallet, sign the request, get the metadata back. Nothing to onboard, nothing to rotate."
    - question: "How much does each request cost?"
      answer: "€0.03 per successful extraction. Failures cost zero. No monthly minimum, no tiered pricing, no overage. You pay per useful response."
    - question: "What about JavaScript-rendered pages?"
      answer: "Meta-Extract reads the initial HTML response. Pages that ship metadata only via client-side JavaScript will return whatever the server-rendered HTML contains. For most publishers, that's everything you need; for SPAs that defer all metadata to the runtime, expect partial coverage."
    - question: "Can AI agents call this autonomously?"
      answer: "Yes. The endpoint supports MCP discovery (Claude, Cursor, Windsurf) and x402 micropayments, so an autonomous agent can find it, call it, and pay for it without a human creating an account first."
    - question: "How is this different from Peekalink, OpenGraph.io, or LinkPreview?"
      answer: "Those are subscription products that mostly extract Open Graph tags. Meta-Extract returns every metadata block in one shape, charges per successful call, and works without an account. If you're already paying $9–$99/month for partial coverage, the math flips."
footer:
  brand: "Meta-Extract"
  suffix: "URL metadata, structured"
  tag: "© 2026 · Built for agents · ⚡ Lightning native"
---
