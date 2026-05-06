---
layout: ../layouts/UseCasePage.astro
title: "URL Metadata Extraction for Hermes Agent · Pay Per Call | Meta-Extract"
description: "Wire Meta-Extract into Hermes Agent. Pull every metadata field from any URL — OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — billed per successful call. No signup, no SDK."
bodyClass: "page-meta-extract"
themeColor: "#0b0b0c"
ogTitle: "Meta-Extract for Hermes Agent — Pay Per Call URL Metadata"
ogDescription: "OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — all in one Hermes Agent skill call, billed per success."
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
  lead: "Drop Meta-Extract into your Hermes Agent flow as a single skill. URLs in, structured metadata out — OG, Twitter Cards, JSON-LD, favicon, canonical, RSS, robots — billed per success. The shape of the call matches Hermes Agent's skill contract — declare it once, then forget it."
  meta:
    - "Hermes-native skill — one POST"

    - "Per-flow budget caps respected"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "Hermes"
      title: "Hermes Agent"
    service:
      eyebrow: "Meta-Extract"
      logo: "M"
      title: "URL metadata API"
trust:
  items:
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
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping subscription scrapers "
    highlight: "into your flows."
  text: "Register one skill, connect a wallet, and your Hermes Agent flow gets structured metadata on every URL it cares about. Idle runs cost zero. Failed extractions cost zero. That's the entire deal."
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
      answer: "No. Meta-Extract accepts x402-signed requests, so Hermes can pay per call from a wallet you connect. There's no shared secret to leak in flow logs or rotate every quarter."
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
  tag: "© 2026 · Built for Hermes Agent"
---
