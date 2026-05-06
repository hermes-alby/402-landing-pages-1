---
layout: ../layouts/UseCasePage.astro
title: "LinkedIn Profile Enrichment for Hermes Agent · Pay Per Query | PayPerQ"
description: "Wire PayPerQ Contacts Enrich into Hermes Agent. Natural-language LinkedIn enrichment across 800M+ professionals, billed per verified profile. No subscription, no SDK."
bodyClass: "page-linkedin"
themeColor: "#0b0b0c"
ogTitle: "LinkedIn Profile Enrichment for Hermes Agent — Pay Per Query"
ogDescription: "Verified emails, GitHub, Scholar, full LinkedIn data inside your Hermes Agent flows. One skill, one endpoint, billed per verified profile."
schema:
  name: "PayPerQ LinkedIn Profile Enrichment for Hermes Agent"
  description: "Pay-per-query LinkedIn enrichment skill designed for Hermes Agent flows. Natural-language search across 800M+ professionals."
  mainEntityName: "PayPerQ Contacts Enrich for Hermes Agent"
  mainEntityDescription: "Hermes Agent skill that turns plain-English prompts into ranked, verified LinkedIn profiles, billed per call."
  providerName: "PayPerQ"
hero:
  ghostNumber: "HERMES"
  eyebrow: "Hermes Agent · Pay-per-query · No subscription"
  title:
    lines:
      - "Hermes Agent,"
      - "wired for"
    highlight: "real contacts."
  lead: "Drop PayPerQ Contacts Enrich into your Hermes Agent flow as a single skill. Natural-language prompts in, ranked verified LinkedIn profiles out, billed per hit. The shape of the call matches Hermes Agent's tool contract — declare it once, then forget it."
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
      eyebrow: "PayPerQ"
      logo: "P"
      title: "Contacts Enrich API"
trust:
  items:
    - label: "Coverage"
      stat: ""
      statHighlight: "800M+"
      desc: "Professionals indexed. 640M+ verified emails refreshed when Hermes calls the skill."
    - label: "Search quality"
      stat: ""
      statHighlight: "1187"
      statSuffix: "Elo"
      desc: "Top of the Pearch benchmark for natural-language people search — Hermes gets ranked, not random."
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
  description: "Each pattern below is a single Hermes Agent flow with PayPerQ registered as one skill. The math works because the flow only spends when it actually finds a person."
  items:
    - who: "Hermes sales flow"
      title: "Outreach drafts from a one-line ICP."
      text: "A salesperson messages Hermes Agent a description of their ideal customer. The flow translates it into a query, calls PayPerQ, drafts personalized outreach per profile, and waits for human approval before sending."
      query: "Heads of RevOps at 200–800 person SaaS, hiring SDRs right now"
    - who: "Hermes recruiter bot"
      title: "Hyper-specific sourcing in one prompt."
      text: "Hermes Agent runs alongside a hiring manager and accepts criteria the way they'd describe candidates in a meeting. Searches are flow-affordable; one good hire pays for thousands of runs."
      query: "Senior Rust devs in Berlin who shipped to a real-time compiler in the last year"
    - who: "Hermes research flow"
      title: "Auto-build target maps for any market."
      text: "A research-side Hermes Agent receives a market thesis, derives a list of target companies, then pulls verified founder/exec contacts. Results land in a doc with citations and per-profile spend logged."
      query: "Founders of B2B SaaS that closed seed in 2025"
    - who: "Hermes deal-disco bot"
      title: "Pipeline scouting on a schedule."
      text: "A scheduled Hermes flow watches funding announcements, pulls leadership contacts at fresh-funded companies, and drops a ranked list into your CRM each Monday. Pay per useful contact, not per platform seat."
      query: "VPs of Eng at companies that raised Series A in the last 14 days"
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping seat licenses "
    highlight: "into your flows."
  text: "Register one skill, connect a wallet, and your Hermes Agent flow gets verified LinkedIn data on every relevant call. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Get an API key →"
      href: "#"
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
      answer: "It's a single POST endpoint with a typed body. You register it in Hermes the same way you'd register any HTTP skill — endpoint, schema, price-per-hit. Hermes Agent uses the price to plan flow budgets and to show the user what each run will cost before it fires."
      open: true
    - question: "Does Hermes Agent need a long-lived API key?"
      answer: "No. PayPerQ accepts x402-signed requests, so Hermes can pay per call from a wallet you connect. There's no shared secret to leak in flow logs or rotate every quarter."
    - question: "What happens when a Hermes flow hits its budget cap?"
      answer: "PayPerQ returns whatever it has resolved so far and stops. Hermes Agent treats this as a normal skill result so the flow can decide whether to ask the user for more budget or hand off with a partial answer."
    - question: "Can Hermes Agent call this concurrently across many flows?"
      answer: "Yes. 100 RPS per key by default; we'll lift it on request. Concurrency-fair queueing means a noisy flow never starves another flow on the same key."
    - question: "How is this different from giving Hermes a Lusha or Apollo seat?"
      answer: "Subscriptions don't fit Hermes Agent's skill model. The skill can't report a true cost, so Hermes can't do real budget planning. PayPerQ reports an honest per-hit cost up front, which is what Hermes was designed to consume."
    - question: "Is the data compliant?"
      answer: "Yes. SOC 2 Type II, GDPR-aligned, opt-out registry honored, contractual restrictions on consumer-marketing use. Designed for B2B prospecting and recruiting flows."
footer:
  brand: "PayPerQ"
  suffix: "Contacts Enrich for Hermes Agent"
  tag: "© 2026 · Built for Hermes Agent"
---
