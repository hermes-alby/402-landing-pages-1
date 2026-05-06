---
layout: ../layouts/UseCasePage.astro
title: "URL Metadata Extraction for Hermes Agent · Pay Per Call | Meta-Extract"
description: "Wire Meta-Extract into Hermes Agent. Pull every metadata field from any URL — OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — billed per successful call via Lightning. No signup, no SDK."
bodyClass: "page-meta-extract"
themeColor: "#0b0b0c"
ogTitle: "Meta-Extract for Hermes Agent — Pay Per Call URL Metadata"
ogDescription: "OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — all in one Hermes Agent skill call, billed per success via Lightning."
schema:
  name: "Meta-Extract for Hermes Agent"
  description: "URL metadata extraction skill for Hermes Agent flows — every metadata block in a single call, billed per success."
  mainEntityName: "Meta-Extract for Hermes Agent"
  mainEntityDescription: "Hermes Agent skill that returns OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, and robots from any URL."
  providerName: "Strale"
hero:
  ghostNumber: "HERMES"
  eyebrow: "Hermes Agent · Pay-per-call · No API key"
  title:
    lines:
      - "Hermes Agent,"
      - "wired for"
    highlight: "any URL."
  lead: "Drop Meta-Extract into your Hermes Agent flow as a single skill. URLs in, structured metadata out — OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — billed per success via Lightning. The shape of the call matches Hermes Agent's skill contract — declare it once, then forget it."
  actions:
    - label: "Wire it up"
      text: "Add to Hermes Agent"
      href: "#prompt"
      primary: true
    - label: "Inspect"
      text: "See the skill"
      href: "#endpoint"
      monoTag: "skill"
  meta:
    - "Hermes-native skill — one POST"
    - "From €0.03 per successful call"
    - "Per-flow budget caps respected"
    - "No persistent API key required"
  promptLabel: "Hermes Agent flow"
  promptText: "For every URL the flow surfaced this hour, extract OG, Twitter, JSON-LD, canonical, favicon. Stop at €1 per run."
  profile:
    initials: "ST"
    brand: "hermes"
    brandSuffix: "skill · meta-extract"
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
    footLeft: "1 URL · 7 metadata blocks · run by Hermes Agent"
    footRight: "Charged · ⚡ 312 sats · €0.03"
  resultLabel: "Hermes Agent skill result"
  resultMeta: "Structured metadata · JSON"
trust:
  items:
    - label: "Hermes spend per call"
      stat: "€"
      statHighlight: "0.03"
      desc: "Charged only on a successful extraction. Hermes Agent flow caps stop the skill cleanly."
    - label: "Coverage per call"
      stat: ""
      statHighlight: "7"
      statSuffix: "blocks"
      desc: "OG · Twitter · JSON-LD · favicon · canonical · RSS · robots — every block in one shape."
    - label: "Quality score"
      stat: ""
      statHighlight: "96"
      statSuffix: "/ 100 SQS"
      desc: "Independent service-quality score on completeness and consistency. Hermes gets stable JSON, every time."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Add one skill to your Hermes Agent registry, paste the endpoint, ship. No vendor onboarding."
pipeline:
  eyebrow: "How Hermes Agent uses it"
  title:
    text: "One skill call. "
    highlight: "Every metadata block back."
  description: "Hermes Agent runs the planning loop; Meta-Extract is the URL-context side of the call. Hermes expects skills to declare a clean input/output and a price per call — and that is exactly the shape of this endpoint."
  stages:
    - ix: "01 Plan"
      title: "Hermes Agent picks URLs to read."
      text: "Your flow reasons over a goal and surfaces URLs worth pulling context from. No prompt-engineering for HTML scraping, no parser libraries inside the flow runtime."
    - ix: "02 Call"
      title: "Hermes hits one Meta-Extract skill."
      text: "A single skill registration. Hermes passes the URL and an optional spend cap. Lightning settles per call when the response returns."
    - ix: "03 Use"
      title: "Hermes Agent consumes structured metadata."
      text: "Every block in one stable shape: OG, Twitter, JSON-LD, favicon, canonical, RSS, robots. The flow decides whether to read the full page based on actual context. Failures cost zero so dead links don't burn budget."
  foot:
    - label: "Best fit inside Hermes Agent"
      html: "Research flows, content monitors, link-preview bots — anywhere Hermes needs <b>structured context from a URL</b> on demand."
    - label: "Spend control"
      html: "Hermes Agent flow caps map 1:1 to Meta-Extract per-call pricing. <b>Set a cap; the skill stops at the cap.</b>"
    - label: "Latency"
      html: "Median <b>0.4s</b> for static pages. <b>1–3s</b> for slower upstreams. Hermes Agent can stream partial results."
benefits:
  eyebrow: "Why Hermes Agent + Meta-Extract"
  title: "Designed for flow-level spend, not seat licensing."
  description: "Hermes Agent expects skills that declare cost and return structured data. Hosted scrapers force you to ignore both. Meta-Extract ships exactly the shape Hermes Agent was built to consume."
  cards:
    - num: "01 / Native to Hermes Agent"
      title: "One skill to register."
      highlight: "That's the whole integration."
      text: "Register the endpoint in your Hermes Agent skill registry, declare the per-call cost, and Hermes handles budget planning automatically. No middleware, no broker, no MCP wrapper to host."
      span: 3
      feature: true
    - num: "02 / Pay per flow run"
      title: "Hermes flows you only pay when they fire."
      highlight: "Idle runs cost zero."
      text: "Lightning micropayments mean a Hermes Agent flow that runs once a week costs the same per call as one that runs constantly. Scale flow fleets without flat-rate seat math."
      span: 3
      demo: |
        <div class="ln"><span class="gut">$</span><span><span class="kw">hermes</span> skill add meta.extract \</span></div>
        <div class="ln"><span class="gut"></span><span>  --endpoint api.strale.io/x402/meta-extract \</span></div>
        <div class="ln"><span class="gut"></span><span>  --price-per-call 0.03 --flow-budget 5.00</span></div>
        <div class="ln"><span class="gut"></span><span class="com"># Hermes stops the flow at the cap, no overage</span></div>
    - num: "03 / Token-saving by design"
      title: "Read metadata before reading pages."
      text: "Flows that triage URLs by metadata before downloading full content burn fewer tokens. Meta-Extract is the cheap first call that decides whether the expensive call is worth it."
      span: 2
    - num: "04 / Stable schema for skills"
      title: "Every URL, one shape."
      text: "Hermes gets predictable JSON keys: og, twitter, jsonLd, favicon, canonical, feeds, robots. No branching on which fields a particular site happens to ship."
      span: 2
    - num: "05 / No persistent secret"
      title: "Lightning replaces the API key."
      text: "Hermes Agent can pay per call directly from a wallet, no long-lived API key to rotate or leak in flow logs."
      span: 2
useCases:
  eyebrow: "What Hermes Agent builders ship"
  title:
    text: "Real Hermes flows that "
    highlight: "rely on this skill."
  description: "Each pattern below is a single Hermes Agent flow with Meta-Extract registered as one skill. The math works because the flow only spends when it actually gets usable metadata back."
  items:
    - who: "Hermes research flow"
      title: "Triage URLs before reading them."
      text: "A research-side Hermes flow receives a topic, discovers candidate URLs, and pulls metadata to decide which ones are worth a full read. Saves tokens on long runs and keeps the flow's state focused on actually relevant pages."
      query: "Every URL the flow surfaced this hour — return type, datePublished, author"
    - who: "Hermes link-preview bot"
      title: "Render rich previews on demand."
      text: "When a user pastes a URL into a chat surface, Hermes calls the skill, receives OG and Twitter Card data, and renders a rich preview card. No browser farm, no edge-case handling, no maintenance window when a publisher changes their HTML."
      query: "https://www.theverge.com/2026/3/12/ai-agents-replace-scrapers"
    - who: "Hermes SEO auditor"
      title: "Audit thousands of pages without infra."
      text: "A Hermes Agent flow walks a sitemap, calls Meta-Extract per URL, and surfaces missing og:image tags, broken canonicals, or robots directives that contradict the indexing strategy. Pay per audited page, not per seat."
      query: "Every URL in sitemap.xml — flag missing og:image and bad canonicals"
    - who: "Hermes content monitor"
      title: "Watch competitor publications at scale."
      text: "A scheduled Hermes flow pulls metadata from a list of competitor blogs every morning, detects new posts via JSON-LD datePublished, and pings the team with title + summary + canonical. The flow never reads the full page unless metadata signals it's worth it."
      query: "Last 50 posts on competitor.com/blog — return JSON-LD type and datePublished"
comparison:
  eyebrow: "Compared inside Hermes Agent"
  title: "Why flow builders pick this over <em>seat-based scrapers.</em>"
  description: "Hermes Agent is built around skills that report a price and return structured data. Subscription scrapers force you to wrap them in middleware and pretend per-seat pricing makes sense for a flow. Meta-Extract doesn't."
  columns:
    us: "Meta-Extract in Hermes Agent"
    a: "Subscription scrapers"
    b: "Self-hosted libraries"
  rows:
    - category: "Pricing model"
      us: "Per successful call"
      left: "Per seat / month"
      right: "Free + your infra cost"
    - category: "Flow fit"
      us: "Native — skill reports cost"
      left: "Wrap in middleware"
      right: "Track infra in your code"
    - category: "Idle flow cost"
      us: "€0"
      left: "Full seat charge"
      right: "Server bill regardless"
    - category: "Coverage per call"
      us: "OG · Twitter · JSON-LD · favicon · canonical · RSS · robots"
      left: "Often only OG"
      right: "One library per format"
    - category: "Charged on miss"
      us: "No"
      left: "Yes (counts toward quota)"
      right: "Your time is the cost"
    - category: "Setup in Hermes"
      us: "One skill registration"
      left: "Custom adapter required"
      right: "Custom adapter required"
flow:
  eyebrow: "Hermes Agent integration"
  title:
    text: "Four steps inside Hermes, "
    highlight: "then the flow runs."
  steps:
    - number: "01 Register"
      title: "Add the skill"
      text: "Register the Meta-Extract endpoint as a single Hermes Agent skill. Declare its per-call price so Hermes can plan around budget."
    - number: "02 Fund"
      title: "Plug a Lightning wallet"
      text: "Connect a wallet that Hermes Agent can spend from. Set a per-flow budget cap so a single run never blows past your limit."
    - number: "03 Call"
      title: "Pass a URL"
      text: "Your Hermes flow receives a goal, surfaces URLs worth reading, and calls the skill with each one. No SDK, no auth juggling."
    - number: "04 Consume"
      title: "Use the structured metadata"
      text: "Stable JSON enters the Hermes Agent flow state. The flow triages, summarizes, or renders — whatever its goal is."
facts:
  eyebrow: "Hermes skill spec"
  title: "Wire it in once. Forget it's there."
  text: "Drop these values into Hermes Agent's skill registry and the flow is done with setup. Everything below maps directly to Hermes' skill manifest format."
  items:
    - label: "Skill endpoint"
      value: "POST api.strale.io/x402/meta-extract"
    - label: "Auth"
      value: "Lightning per request — no API key needed"
    - label: "Input"
      value: "{ url: string }"
    - label: "Output"
      value: "{ og, twitter, jsonLd, favicon, canonical, feeds, robots }"
    - label: "Per-call price"
      value: "From €0.03 — declare in Hermes manifest"
    - label: "Spend control"
      value: "Hermes Agent flow caps enforced per run"
prompt:
  eyebrow: "Hermes Agent skill registration"
  title: "Drop this into your Hermes flow."
  text: "One skill, one endpoint, one price. Hermes Agent handles budget caps, retries, and result parsing. Replace the URL and the flow is live."
  copyTarget: "hermes-meta-prompt"
  buttonLabel: "Copy registration"
  code: |
    # Hermes Agent skill registration
    hermes skill add meta.extract \
      --endpoint https://api.strale.io/x402/meta-extract \
      --method POST \
      --price-per-call 0.03 \
      --pay-with lightning \
      --schema '{
        "url": "string  # any public URL"
      }'

    # In your Hermes Agent flow:
    # use meta.extract({ url: candidate_url })
    # → returns { og, twitter, jsonLd, favicon, canonical, feeds, robots }
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping subscription scrapers "
    highlight: "into your flows."
  text: "Register one skill, fund a few sats, and your Hermes Agent flow gets structured metadata on every URL it cares about. Idle runs cost zero. Failed extractions cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try the endpoint →"
      href: "#prompt"
      primary: true
    - label: "Docs"
      text: "Hermes Agent integration guide"
      href: "#endpoint"
  badges:
    - "Single Hermes skill"
    - "From €0.03 per call"
    - "Lightning settles per run"
    - "Flow caps honored"
faq:
  eyebrow: "FAQ"
  title: "Hermes Agent specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with Hermes Agent builders, no SDR funnel."
  items:
    - question: "How does this register as a Hermes Agent skill?"
      answer: "It's a single POST endpoint with a typed body. You register it in Hermes the same way you'd register any HTTP skill — endpoint, schema, price-per-call. Hermes Agent uses the price to plan flow budgets and to show the user what each run will cost before it fires."
      open: true
    - question: "Does Hermes Agent need a long-lived API key?"
      answer: "No. Meta-Extract accepts x402 / Lightning-signed requests, so Hermes can pay per call from a wallet you connect. There's no shared secret to leak in flow logs or rotate every quarter."
    - question: "What happens when a Hermes flow hits its budget cap?"
      answer: "Meta-Extract returns whatever it has resolved so far and Hermes flow enforcement stops the next call. The flow can decide whether to ask the user for more budget or hand off with a partial answer."
    - question: "How does this save tokens for a Hermes flow?"
      answer: "Pulling metadata first lets the flow decide whether to fetch and read the full page. JSON-LD type, datePublished, og:description, and canonical URL are usually enough to triage. Skipping irrelevant pages compounds across long research runs."
    - question: "What about JavaScript-rendered pages?"
      answer: "Meta-Extract reads the initial HTML response. SPAs that defer all metadata to client-side JavaScript will return partial coverage. For most publishers, the server-rendered HTML carries everything the flow needs."
    - question: "How is this different from giving Hermes a subscription scraper?"
      answer: "Subscriptions don't fit Hermes Agent's skill model. The skill can't report a true cost, so Hermes can't do real budget planning. Meta-Extract reports an honest per-call cost up front, which is what Hermes was designed to consume."
footer:
  brand: "Meta-Extract"
  suffix: "URL metadata for Hermes Agent"
  tag: "© 2026 · Built for Hermes Agent · ⚡ Lightning native"
---
