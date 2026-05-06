---
layout: ../layouts/UseCasePage.astro
title: "LinkedIn Profile Enrichment API · Pay Per Query, No Subscription | PayPerQ"
description: "Find and enrich LinkedIn profiles across 800M+ professionals with natural-language search. Pay per verified profile. No subscription, no credit packs, no contracts."
bodyClass: "page-linkedin"
themeColor: "#0b0b0c"
ogTitle: "LinkedIn Profile Enrichment API — Pay Per Query, No Subscription"
ogDescription: "Verified emails, GitHub, Scholar, and full LinkedIn data from 800M+ profiles. One endpoint, billed per verified profile. Built for agents."
schema:
  name: "PayPerQ LinkedIn Profile Enrichment API"
  description: "Pay-per-query LinkedIn profile search and enrichment API with natural-language search across 800M+ professionals."
  mainEntityName: "PayPerQ Contacts Enrich"
  mainEntityDescription: "Search and enrich LinkedIn profiles via natural-language queries; billed per verified profile."
  providerName: "PayPerQ"
hero:
  ghostNumber: "800M"
  eyebrow: "Pay-per-query · No subscription"
  title:
    lines:
      - "Find anyone."
      - "Pay only"
    highlight: "per result."
  lead: "PayPerQ Contacts Enrich is a natural-language people search and profile enrichment API across 800M+ professionals. Send a query, get verified emails and full profiles back — billed per call. No seats, no credit packs, no contracts."
  meta:
    - "Charged only on a hit"
    - "No monthly minimums"
  connection:
    agent:
      eyebrow: "Your AI agent"
      logo: "Logo"
      title: "Any agent"
    service:
      eyebrow: "PayPerQ"
      logo: "/logos/payperq.svg"
      title: "Contacts Enrich API"
trust:
  items:
    - label: "Coverage"
      stat: ""
      statHighlight: "800M+"
      desc: "Professional profiles indexed, with 640M+ verified emails refreshed on demand."
    - label: "Search quality"
      stat: ""
      statHighlight: "1187"
      statSuffix: "Elo"
      desc: "Top of the Pearch benchmark for natural-language people search."
    - label: "Time to first call"
      stat: "~"
      statHighlight: "2"
      statSuffix: "min"
      desc: "Sign up, grab a key, curl the endpoint. SOC 2 Type II, no sales call required."
useCases:
  eyebrow: "Who it's for"
  title:
    text: "Built for teams that need contact data "
    highlight: "without the overhead."
  description: "Four shapes of customer who benefit most. If you recognize your workflow, the math is in your favor."
  items:
    - who: "For sales development"
      title: "Build prospect lists by description, not filter."
      text: "Describe your ICP in a sentence and get verified emails and direct dials back. No annual contract you barely use during slow months — pay only the weeks you're actually building pipeline."
      query: "Heads of RevOps at 200–800 person SaaS, hiring SDRs right now"
    - who: "For technical recruiters"
      title: "Hyper-specific candidates, one API call."
      text: "Describe candidates the way you'd describe them to a hiring manager — experience, stack, signal — and get contact details back. Credits don't expire because there are no credits."
      query: "Senior Rust devs in Berlin who shipped to a real-time compiler in the last year"
    - who: "For SaaS builders"
      title: "Embed enrichment without an enterprise contract."
      text: "Drop the endpoint behind your product so your users get enriched leads on demand. Pay-per-query maps to your usage so billing stays clean — no negotiated minimum eating margin on free-tier users."
      query: "Founders of B2B SaaS that closed seed in 2025"
    - who: "For VC and research"
      title: "Discover operators by signal, not by network."
      text: "Find founders, executives, and domain experts by background — including academic and open-source credentials. Useful for talent mapping, due diligence, and sourcing technical hires before competitors do."
      query: "ML researchers leaving FAANG since Q1 with a Stanford PhD"
cta:
  eyebrow: "Start in two minutes"
  title:
    text: "Stop paying for a seat "
    highlight: "you barely use."
  text: "Get a key, connect a wallet, and your first enriched profile lands in under a minute. If you don't use the API for a month, you don't pay for the month. That's the entire deal."
  actions:
    - label: "Start"
      text: "Get an API key →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "Read the 3-min docs"
      href: "#endpoint"
  badges:
    - "Charged only on a hit"
    - "SOC 2 Type II"
faq:
  eyebrow: "FAQ"
  title: "The honest answers."
  description: "If something below doesn't cover your case, ping us — we answer directly, no SDR funnel."
  items:
    - question: "What does \"pay per query\" actually mean?"
      answer: "You're billed per verified profile returned. If a query produces zero matches, you're charged zero. If it returns ten, you're charged ten times the per-profile rate. There is no monthly fee, no minimum, and no seat. Settlement is at request completion."
      open: true
    - question: "Where does the data come from?"
      answer: "A combination of our own crawl, partner data, and live agentic verification. We index 800M+ professional profiles and 640M+ verified email records, then re-verify on demand to filter stale data before it reaches you."
    - question: "Do I need an x402 wallet?"
      answer: "Not strictly. You can fund your account with a card and we'll convert; or you can plug a wallet directly and pay per call with no balance. "
    - question: "Is this compliant?"
      answer: "Yes. SOC 2 Type II, GDPR-aligned data handling, opt-out registry, and contractual restrictions on consumer-marketing use. Enrichment is for B2B prospecting and recruiting workflows."
    - question: "How is this different from Apollo, ZoomInfo, Lusha?"
      answer: "Those are subscription products with seats, contracts, and dashboards. PayPerQ is one endpoint billed per call. If you live inside a CRM and need a UI, those are the right tools. If you live inside an agent, a script, or a SaaS, an API priced per result is a better shape."
    - question: "What's the rate limit?"
      answer: "100 RPS per key by default; we'll lift it on request. Concurrency-fair queueing means a noisy neighbor never starves your key."
footer:
  brand: "PayPerQ"
  suffix: "Contacts Enrich"
  tag: "© 2026 · Built for agents"
---
