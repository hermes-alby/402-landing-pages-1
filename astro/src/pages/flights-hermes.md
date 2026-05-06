---
layout: ../layouts/UseCasePage.astro
title: "Flight Data API for Hermes Agent · Pay Per Call | FlightAPI"
description: "Wire FlightAPI into Hermes Agent. Real-time fares from 700+ airlines, plus tracking and schedules, billed per call. No signup, no GDS contract, no SDK."
bodyClass: "page-flights"
themeColor: "#0b0b0c"
ogTitle: "FlightAPI for Hermes Agent — Pay Per Call Flight Data"
ogDescription: "Real-time fares from 700+ airlines inside your Hermes Agent flows. One skill, one endpoint, billed per call."
schema:
  name: "FlightAPI for Hermes Agent"
  description: "Real-time flight data skill for Hermes Agent flows — fares from 700+ airlines, billed per call."
  mainEntityName: "FlightAPI for Hermes Agent"
  mainEntityDescription: "Hermes Agent skill that returns real-time fares, status, and schedules from 700+ airlines and OTAs."
  providerName: "FlightAPI"
hero:
  ghostNumber: "HERMES"
  eyebrow: "Hermes Agent · Pay-per-call · No GDS contract"
  title:
    lines:
      - "Hermes Agent,"
      - "wired for"
    highlight: "every airline."
  lead: "Drop FlightAPI into your Hermes Agent flow as a single skill. Routes go in, ranked fares from 700+ airlines and OTAs come out, billed per search. The shape of the call matches Hermes Agent's skill contract — declare it once, then forget it."
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
      eyebrow: "FlightAPI"
      logo: "F"
      title: "Flight data API"
trust:
  items:
    - label: "Carrier coverage"
      stat: ""
      statHighlight: "700+"
      desc: "Airlines and OTAs aggregated in one call. Your flow sees the same breadth as a metasearch site."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Add one skill to your Hermes Agent registry, paste the endpoint, ship. No GDS contract, no vendor onboarding."
    - label: "Agent-native rails"
      stat: ""
      statHighlight: "MCP"
      statSuffix: "+ x402"
      desc: "Native MCP and x402 — Hermes discovers, calls, and pays without a long-lived API key."
useCases:
  eyebrow: "What Hermes Agent builders ship"
  title:
    text: "Real Hermes flows that "
    highlight: "rely on this skill."
  description: "Each pattern below is a single Hermes Agent flow with FlightAPI registered as one skill. The math works because the flow only spends when it actually returns useful fares."
  items:
    - who: "Hermes travel-planning flow"
      title: "End-to-end trip plans from a one-line goal."
      text: "A user messages \"book me to Tokyo in June, cheap.\" The Hermes flow runs round-trip and one-way searches, narrows by total cost and flight time, and presents top options. No human-managed GDS credentials anywhere in the chain."
      query: "Round-trip BER → HND in June, optimize for total cost under 14h flight time"
    - who: "Hermes deal-watcher"
      title: "Scheduled fare drops with zero idle cost."
      text: "A scheduled Hermes flow watches popular routes on cron. When fares drop below threshold, it pushes alerts via Slack or email. Days without a hit cost zero, so leaving a fleet of watchers running is cheap."
      query: "Watch BER → BCN for round-trip fares under €120 in the next 60 days"
    - who: "Hermes corporate-travel analyst"
      title: "Benchmark every booked route."
      text: "Feed historical employee routes through the flow. Hermes queries FlightAPI for the same dates, surfaces where the booked fare was 20%+ above the lowest available, and produces a savings report — without paying a TMC for the same insight."
      query: "Last 12 months of company travel — flag overpaid routes vs current fares"
    - who: "Hermes disruption responder"
      title: "Auto-rebook when flights break."
      text: "A Hermes flow watches active flights. On delay or cancellation, it queries FlightAPI for alternates same calendar day, presents 3 options ranked by arrival time + price, and waits for human approval to book."
      query: "If LH401 cancels, find next 3 alternates BER → ZRH same calendar day"
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping GDS contracts "
    highlight: "into your flows."
  text: "Register one skill, connect a wallet, and your Hermes Agent flow gets fares from 700+ airlines on every relevant call. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try the endpoint →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "Hermes Agent integration guide"
      href: "#"
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
      answer: "No. FlightAPI accepts x402-signed requests, so Hermes can pay per call from a wallet you connect. There's no shared secret to leak in flow logs or rotate every quarter."
    - question: "What happens when a Hermes flow hits its budget cap?"
      answer: "FlightAPI returns whatever it has resolved so far and Hermes stops the next call. The flow can decide whether to ask the user for more budget or hand off with the fares it has."
    - question: "Can the flow book flights through this?"
      answer: "Not directly — this skill is read-only flight data (prices, status, schedules). For booking, your Hermes flow should hand off to your booking surface (carrier site, OTA, internal travel system). The API gives the flow the inputs; the human-approved action does the booking."
    - question: "How is this different from giving Hermes an Amadeus seat?"
      answer: "Amadeus requires enterprise contracts and significant onboarding. The skill can't report a true per-call cost, so Hermes can't do real budget planning. FlightAPI reports an honest per-call cost up front, which is what Hermes was designed to consume."
    - question: "Can Hermes call this concurrently across many flows?"
      answer: "Yes. Per-key rate limits apply with concurrency-fair queueing — a noisy flow never starves another flow on the same key."
footer:
  brand: "FlightAPI"
  suffix: "Flight data for Hermes Agent"
  tag: "© 2026 · Built for Hermes Agent"
---
