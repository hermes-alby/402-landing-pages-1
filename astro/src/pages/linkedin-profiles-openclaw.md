---
layout: ../layouts/UseCasePage.astro
title: "LinkedIn Profile Enrichment for OpenClaw · Pay Per Query | PayPerQ"
description: "Plug PayPerQ Contacts Enrich into OpenClaw. Natural-language LinkedIn search across 800M+ professionals, billed per verified profile. No subscription, no API juggling."
bodyClass: "page-linkedin"
themeColor: "#0b0b0c"
ogTitle: "LinkedIn Profile Enrichment for OpenClaw — Pay Per Query"
ogDescription: "Verified emails, GitHub, Scholar, full LinkedIn data inside your OpenClaw agent. One tool, one endpoint, billed per verified profile."
schema:
  name: "PayPerQ LinkedIn Profile Enrichment for OpenClaw"
  description: "Pay-per-query LinkedIn enrichment API designed for OpenClaw agents. Natural-language search across 800M+ professionals."
  mainEntityName: "PayPerQ Contacts Enrich for OpenClaw"
  mainEntityDescription: "OpenClaw-ready enrichment endpoint that turns plain-English prompts into ranked, verified LinkedIn profiles."
  providerName: "PayPerQ"
hero:
  ghostNumber: "OPEN"
  eyebrow: "OpenClaw · Pay-per-query · No subscription"
  title:
    lines:
      - "OpenClaw, meet"
      - "every prospect."
    highlight: "Paid per result."
  lead: "Drop PayPerQ Contacts Enrich into your OpenClaw agent as a single tool call. Plain-English prompts go in, ranked verified LinkedIn profiles come out, billed per hit. No SDK, no API key wrangling, no monthly seat for your agent to forget about."
  meta:
    - "Single OpenClaw tool — one POST"

    - "Budget caps honored per run"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "OpenClaw"
      title: "OpenClaw"
    service:
      eyebrow: "PayPerQ"
      logo: "P"
      title: "Contacts Enrich API"
trust:
  items:
    - label: "Coverage"
      stat: ""
      statHighlight: "800M+"
      desc: "Professionals indexed. 640M+ verified emails refreshed when your agent calls."
    - label: "Search quality"
      stat: ""
      statHighlight: "1187"
      statSuffix: "Elo"
      desc: "Top of the Pearch benchmark for natural-language people search — your agent gets ranked, not random."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Register one tool in OpenClaw, paste the endpoint, ship. No vendor onboarding."
useCases:
  eyebrow: "What OpenClaw builders ship"
  title:
    text: "Real OpenClaw agents that "
    highlight: "rely on this tool."
  description: "Each pattern below is a single OpenClaw agent with PayPerQ registered as one tool. The math works because the agent only spends when it actually finds a person."
  items:
    - who: "OpenClaw sales agent"
      title: "Self-driving prospecting from a Slack message."
      text: "A salesperson messages OpenClaw a description of their ICP. The agent translates it into a query, calls PayPerQ, drafts personalized outreach per profile, and waits for human approval before sending. No CRM seat, no list-building tool."
      query: "Heads of RevOps at 200–800 person SaaS, hiring SDRs right now"
    - who: "OpenClaw recruiter copilot"
      title: "Hyper-specific sourcing on demand."
      text: "OpenClaw runs alongside a hiring manager and accepts criteria the way they'd describe candidates in a meeting. Searches are agent-affordable; one good hire pays for thousands of runs."
      query: "Senior Rust devs in Berlin who shipped to a real-time compiler in the last year"
    - who: "OpenClaw research bot"
      title: "Auto-build target maps for any market."
      text: "A research-side OpenClaw agent receives a market thesis, derives a list of target companies, then pulls verified founder/exec contacts. Results land in a doc with citations and per-profile spend logged."
      query: "Founders of B2B SaaS that closed seed in 2025"
    - who: "OpenClaw event scout"
      title: "Find attendees you actually want to meet."
      text: "Point OpenClaw at a conference page or speaker list, ask for adjacent practitioners, and have it return verified emails for warm pre-event outreach. Pay per useful contact, not per platform seat."
      query: "Speakers and attendees with 'platform engineering' titles at KubeCon EU"
cta:
  eyebrow: "OpenClaw-ready in two minutes"
  title:
    text: "Stop wrapping seat licenses "
    highlight: "into your agent."
  text: "Register one tool, connect a wallet, and your OpenClaw agent gets verified LinkedIn data on every relevant call. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Get an API key →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "OpenClaw integration guide"
      href: "#endpoint"
  badges:
    - "Single OpenClaw tool"

    - "Budget caps honored"
faq:
  eyebrow: "FAQ"
  title: "OpenClaw-specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with OpenClaw builders, no SDR funnel."
  items:
    - question: "How does this register as an OpenClaw tool?"
      answer: "It's a single POST endpoint with a typed body. You register it in OpenClaw the same way you'd register any HTTP tool — endpoint, schema, price-per-hit. OpenClaw uses the price to enforce budget caps and to show the user what each agent run will cost before it runs."
      open: true
    - question: "Does OpenClaw need a long-lived API key?"
      answer: "No. PayPerQ accepts x402-signed requests, so OpenClaw can pay per call from a wallet you connect. There's no shared secret to leak in agent logs or rotate every quarter."
    - question: "What happens when an OpenClaw run hits its budget cap?"
      answer: "PayPerQ returns whatever it has resolved so far and stops. OpenClaw treats this as a normal tool result so the agent can decide whether to ask the user for more budget or hand off with a partial answer."
    - question: "Can OpenClaw call this concurrently across many agents?"
      answer: "Yes. 100 RPS per key by default; we'll lift it on request. Concurrency-fair queueing means a noisy agent never starves another agent on the same key."
    - question: "How is this different from giving OpenClaw a Lusha or Apollo seat?"
      answer: "Subscriptions don't fit OpenClaw's tool model. The tool can't report a true cost, so OpenClaw can't do real budget planning. PayPerQ reports an honest per-hit cost up front, which is what OpenClaw was designed to consume."
    - question: "Is the data compliant?"
      answer: "Yes. SOC 2 Type II, GDPR-aligned, opt-out registry honored, contractual restrictions on consumer-marketing use. Designed for B2B prospecting and recruiting agents."
footer:
  brand: "PayPerQ"
  suffix: "Contacts Enrich for OpenClaw"
  tag: "© 2026 · Built for OpenClaw"
---
