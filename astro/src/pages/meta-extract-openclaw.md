---
layout: ../layouts/UseCasePage.astro
title: "URL Metadata Extraction for OpenClaw · Pay Per Call | Meta-Extract"
description: "Plug Meta-Extract into OpenClaw. Pull every metadata field from any URL — OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — billed per successful call via Lightning. No signup, no API key."
bodyClass: "page-meta-extract"
themeColor: "#0b0b0c"
ogTitle: "Meta-Extract for OpenClaw — Pay Per Call URL Metadata"
ogDescription: "OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — all in one OpenClaw tool call, billed per success via Lightning."
schema:
  name: "Meta-Extract for OpenClaw"
  description: "URL metadata extraction tool for OpenClaw agents — every metadata block in a single call, billed per success."
  mainEntityName: "Meta-Extract for OpenClaw"
  mainEntityDescription: "OpenClaw-ready endpoint that returns OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, and robots from any URL."
  providerName: "Strale"
hero:
  ghostNumber: "OPEN"
  eyebrow: "OpenClaw · Pay-per-call · No API key"
  title:
    lines:
      - "OpenClaw, meet"
      - "any URL on"
    highlight: "the internet."
  lead: "Drop Meta-Extract into your OpenClaw agent as a single tool call. URLs go in, structured metadata comes out — OG, Twitter Cards, JSON-LD, favicon, canonical, RSS feeds, robots — billed per success via Lightning. No SDK, no API key, no monthly seat for your agent to forget about."
  actions:
    - label: "Wire it up"
      text: "Add to OpenClaw"
      href: "#prompt"
      primary: true
    - label: "Inspect"
      text: "See the call"
      href: "#endpoint"
      monoTag: "tool"
  meta:
    - "Single OpenClaw tool — one POST"
    - "From €0.03 per successful call"
    - "Budget caps honored per run"
    - "No persistent API key required"
  promptLabel: "OpenClaw prompt"
  promptText: "For every URL the agent discovered today, extract OG, Twitter, JSON-LD, canonical, favicon. Cap spend at €1."
  profile:
    initials: "ST"
    brand: "openclaw"
    brandSuffix: "tool · meta-extract"
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
    footLeft: "1 URL · 7 metadata blocks · run by OpenClaw"
    footRight: "Charged · ⚡ 312 sats · €0.03"
  resultLabel: "OpenClaw tool result"
  resultMeta: "Structured metadata · JSON"
trust:
  items:
    - label: "OpenClaw spend per call"
      stat: "€"
      statHighlight: "0.03"
      desc: "Charged only on a successful extraction. OpenClaw budget caps cut off automatically."
    - label: "Coverage per call"
      stat: ""
      statHighlight: "7"
      statSuffix: "blocks"
      desc: "OG · Twitter · JSON-LD · favicon · canonical · RSS · robots — every block in one shape."
    - label: "Quality score"
      stat: ""
      statHighlight: "96"
      statSuffix: "/ 100 SQS"
      desc: "Independent service-quality score on completeness and consistency. OpenClaw gets stable JSON, every time."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Register one tool in OpenClaw, paste the endpoint, ship. No vendor onboarding."
pipeline:
  eyebrow: "How OpenClaw uses it"
  title:
    text: "One tool call. "
    highlight: "Every metadata block back."
  description: "OpenClaw orchestrates the agent loop; Meta-Extract is the URL-context side of the call. The two fit together because OpenClaw expects tools to declare a clear input/output and a price per call — and that is exactly the shape of this endpoint."
  stages:
    - ix: "01 Plan"
      title: "OpenClaw selects URLs to read."
      text: "Your agent reasons over a goal and surfaces URLs worth pulling context from. No prompt-engineering for HTML scraping, no parser library bloat in the agent runtime."
    - ix: "02 Call"
      title: "OpenClaw hits one Meta-Extract tool."
      text: "A single tool registration. OpenClaw passes the URL and an optional spend cap. Lightning settles per call when the response returns."
    - ix: "03 Use"
      title: "OpenClaw consumes structured metadata."
      text: "Every block in one stable shape: OG, Twitter, JSON-LD, favicon, canonical, RSS, robots. The agent decides whether to read the full page based on actual context. Failures cost zero so dead links don't burn budget."
  foot:
    - label: "Best fit inside OpenClaw"
      html: "Research agents, content curators, link-preview bots — anywhere OpenClaw needs <b>structured context from a URL</b> on demand."
    - label: "Spend control"
      html: "OpenClaw budget caps map 1:1 to Meta-Extract per-call pricing. <b>Set a cap; the tool stops at the cap.</b>"
    - label: "Latency"
      html: "Median <b>0.4s</b> for static pages. <b>1–3s</b> for slower upstreams. OpenClaw can stream partial results."
benefits:
  eyebrow: "Why OpenClaw + Meta-Extract"
  title: "Built for agentic spend, not seat licensing."
  description: "OpenClaw expects tools that declare cost and return structured data. Hosted scrapers force you to ignore both. Meta-Extract ships exactly the shape OpenClaw was designed for."
  cards:
    - num: "01 / Native to OpenClaw"
      title: "One tool to register."
      highlight: "That's the whole integration."
      text: "Register the endpoint as a tool, declare the per-call cost, and OpenClaw handles budget enforcement automatically. No middleware, no broker, no MCP server to host."
      span: 3
      feature: true
    - num: "02 / Pay per agent run"
      title: "OpenClaw runs you billed."
      highlight: "Idle runs cost zero."
      text: "Lightning micropayments mean an OpenClaw agent that runs once a week costs the same per call as one that runs constantly. Scale agent fleets without flat-rate seat math."
      span: 3
      demo: |
        <div class="ln"><span class="gut">$</span><span><span class="kw">openclaw</span> tool register meta.extract \</span></div>
        <div class="ln"><span class="gut"></span><span>  --endpoint api.strale.io/x402/meta-extract \</span></div>
        <div class="ln"><span class="gut"></span><span>  --price-per-call 0.03 --budget-per-run 5.00</span></div>
        <div class="ln"><span class="gut"></span><span class="com"># OpenClaw stops the agent at the cap, no overage</span></div>
    - num: "03 / Token-saving by design"
      title: "Read metadata before reading pages."
      text: "Agents that triage URLs by metadata before downloading full content burn fewer tokens. Meta-Extract is the cheap first call that decides whether the expensive call is worth it."
      span: 2
    - num: "04 / Stable schema for tool calls"
      title: "Every URL, one shape."
      text: "OpenClaw gets predictable JSON keys: og, twitter, jsonLd, favicon, canonical, feeds, robots. No branching on which fields a particular site happens to ship."
      span: 2
    - num: "05 / No persistent secret"
      title: "Lightning replaces the API key."
      text: "OpenClaw can pay per call directly from a wallet, no long-lived API key to rotate or leak in agent logs."
      span: 2
useCases:
  eyebrow: "What OpenClaw builders ship"
  title:
    text: "Real OpenClaw agents that "
    highlight: "rely on this tool."
  description: "Each pattern below is a single OpenClaw agent with Meta-Extract registered as one tool. The math works because the agent only spends when it actually gets usable metadata back."
  items:
    - who: "OpenClaw research agent"
      title: "Triage URLs before reading them."
      text: "A research-side OpenClaw agent receives a topic, discovers candidate URLs, and pulls metadata to decide which ones are worth a full read. Saves tokens on long runs and keeps the agent's context window focused on actually relevant pages."
      query: "Every URL the agent surfaced this hour — return type, datePublished, author"
    - who: "OpenClaw chat-app preview bot"
      title: "Render link previews on demand."
      text: "When a user pastes a URL into a chat surface, OpenClaw calls the tool, receives OG and Twitter Card data, and renders a rich preview card. No browser farm, no edge-case handling, no maintenance window when a publisher changes their HTML."
      query: "https://www.theverge.com/2026/3/12/ai-agents-replace-scrapers"
    - who: "OpenClaw SEO auditor"
      title: "Audit thousands of pages without infra."
      text: "An OpenClaw agent walks a sitemap, calls Meta-Extract per URL, and surfaces missing og:image tags, broken canonicals, or robots directives that contradict the indexing strategy. Pay per audited page, not per seat."
      query: "Every URL in sitemap.xml — flag missing og:image and bad canonicals"
    - who: "OpenClaw content monitor"
      title: "Watch competitor blogs at scale."
      text: "A scheduled OpenClaw agent pulls metadata from a list of competitor blogs every morning, detects new posts via JSON-LD datePublished, and pings the team with title + summary + canonical. The agent never reads the full page unless the metadata signals it's worth it."
      query: "Last 50 posts on competitor.com/blog — return JSON-LD type and datePublished"
comparison:
  eyebrow: "Compared inside OpenClaw"
  title: "Why agent builders pick this over <em>seat-based scrapers.</em>"
  description: "OpenClaw is built around tools that report a price and return structured data. Subscription scrapers force you to wrap them in middleware and pretend per-seat pricing makes sense for an agent. Meta-Extract doesn't."
  columns:
    us: "Meta-Extract in OpenClaw"
    a: "Subscription scrapers"
    b: "Self-hosted libraries"
  rows:
    - category: "Pricing model"
      us: "Per successful call"
      left: "Per seat / month"
      right: "Free + your infra cost"
    - category: "Agent fit"
      us: "Native — tool reports cost"
      left: "Wrap in middleware"
      right: "Track infra in your code"
    - category: "Idle agent cost"
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
    - category: "Setup in OpenClaw"
      us: "One tool registration"
      left: "Custom adapter required"
      right: "Custom adapter required"
flow:
  eyebrow: "OpenClaw integration"
  title:
    text: "Four steps inside OpenClaw, "
    highlight: "then the agent runs."
  steps:
    - number: "01 Register"
      title: "Add the tool"
      text: "Register the Meta-Extract endpoint as a single OpenClaw tool. Declare its per-call price so OpenClaw can plan around budget."
    - number: "02 Fund"
      title: "Plug a Lightning wallet"
      text: "Connect a wallet that OpenClaw can spend from. Set a per-run budget cap so the agent never blows past your limit."
    - number: "03 Call"
      title: "Pass a URL"
      text: "Your OpenClaw agent receives a goal, surfaces URLs worth reading, and calls the tool with each one. No SDK, no auth juggling."
    - number: "04 Consume"
      title: "Use the structured metadata"
      text: "Stable JSON enters OpenClaw's context. The agent triages, summarizes, or renders — whatever its goal is."
facts:
  eyebrow: "OpenClaw tool spec"
  title: "Wire it in once. Forget it's there."
  text: "Drop these values into OpenClaw's tool registration and the agent is done with setup. Everything below is documented in the OpenClaw tool manifest format."
  items:
    - label: "Tool endpoint"
      value: "POST api.strale.io/x402/meta-extract"
    - label: "Auth"
      value: "Lightning per request — no API key needed"
    - label: "Input"
      value: "{ url: string }"
    - label: "Output"
      value: "{ og, twitter, jsonLd, favicon, canonical, feeds, robots }"
    - label: "Per-call price"
      value: "From €0.03 — declare in OpenClaw manifest"
    - label: "Spend control"
      value: "OpenClaw budget caps enforced per run"
prompt:
  eyebrow: "OpenClaw tool registration"
  title: "Drop this into your OpenClaw agent."
  text: "One tool, one endpoint, one price. OpenClaw handles budget caps, retries, and result parsing. Replace the URL and you're live."
  copyTarget: "openclaw-meta-prompt"
  buttonLabel: "Copy registration"
  code: |
    # OpenClaw tool registration
    openclaw tool register meta.extract \
      --endpoint https://api.strale.io/x402/meta-extract \
      --method POST \
      --price-per-call 0.03 \
      --pay-with lightning \
      --schema '{
        "url": "string  # any public URL"
      }'

    # In your OpenClaw agent prompt:
    # "Use meta.extract on every candidate URL before deciding whether to
    #  read the full page. Cap spend at €1 per run."
cta:
  eyebrow: "OpenClaw-ready in two minutes"
  title:
    text: "Stop wrapping subscription scrapers "
    highlight: "into your agent."
  text: "Register one tool, fund a few sats, and your OpenClaw agent gets structured metadata on every URL it cares about. Idle runs cost zero. Failed extractions cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try the endpoint →"
      href: "#prompt"
      primary: true
    - label: "Docs"
      text: "OpenClaw integration guide"
      href: "#endpoint"
  badges:
    - "Single OpenClaw tool"
    - "From €0.03 per call"
    - "Lightning settles per run"
    - "Budget caps honored"
faq:
  eyebrow: "FAQ"
  title: "OpenClaw-specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with OpenClaw builders, no SDR funnel."
  items:
    - question: "How does this register as an OpenClaw tool?"
      answer: "It's a single POST endpoint with a typed body. You register it in OpenClaw the same way you'd register any HTTP tool — endpoint, schema, price-per-call. OpenClaw uses the price to enforce budget caps and to show the user what each agent run will cost before it runs."
      open: true
    - question: "Does OpenClaw need a long-lived API key?"
      answer: "No. Meta-Extract accepts x402 / Lightning-signed requests, so OpenClaw can pay per call from a wallet you connect. There's no shared secret to leak in agent logs or rotate every quarter."
    - question: "What happens when an OpenClaw run hits its budget cap?"
      answer: "Meta-Extract returns whatever it has resolved so far and the OpenClaw budget enforcement stops the next call. The agent treats this as a normal tool boundary and can ask for more budget or hand off with a partial answer."
    - question: "How does this save tokens for an OpenClaw agent?"
      answer: "Pulling metadata first lets the agent decide whether to fetch and read the full page. JSON-LD type, datePublished, og:description, and canonical URL are usually enough to triage. Skipping irrelevant pages compounds across long research runs."
    - question: "What about JavaScript-rendered pages?"
      answer: "Meta-Extract reads the initial HTML response. SPAs that defer all metadata to client-side JavaScript will return partial coverage. For most publishers, the server-rendered HTML carries everything the agent needs."
    - question: "How is this different from giving OpenClaw a subscription scraper?"
      answer: "Subscriptions don't fit OpenClaw's tool model. The tool can't report a true cost, so OpenClaw can't do real budget planning. Meta-Extract reports an honest per-call cost up front, which is what OpenClaw was designed to consume."
footer:
  brand: "Meta-Extract"
  suffix: "URL metadata for OpenClaw"
  tag: "© 2026 · Built for OpenClaw · ⚡ Lightning native"
---
