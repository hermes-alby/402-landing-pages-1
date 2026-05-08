---
layout: ../layouts/UseCasePage.astro
title: "DeepL API for Hermes Agent · Pay Per Call, Pro-Tier Translation"
description: "Wire DeepL Pro–tier translation into Hermes Agent. 30+ languages, formality control, document mode — billed per call. No signup, no monthly plan, no API key."
bodyClass: "page-deepl"
themeColor: "#0b0b0c"
ogTitle: "DeepL API for Hermes Agent — Pay Per Call Translation"
ogDescription: "DeepL Pro translation inside your Hermes Agent flow. One skill, billed per call, no API key wrangling."
schema:
  name: "DeepL via Locus for Hermes Agent"
  description: "Translation skill for Hermes Agent flows — DeepL Pro–grade quality across 30+ languages, billed per call via x402."
  mainEntityName: "DeepL via Locus for Hermes Agent"
  mainEntityDescription: "Hermes Agent skill that translates text and documents with DeepL's professional engine."
  providerName: "Locus"
hero:
  ghostNumber: "HERMES"
  eyebrow: "Hermes Agent · Pay-per-call · No subscription"
  title:
    lines:
      - "Hermes Agent,"
      - "speak every"
    highlight: "language."
  lead: "Drop DeepL via Locus into your Hermes Agent flow as a single skill. Source text and a target language go in, DeepL Pro–grade translations come back, billed per call. The same engine that consistently outperforms Google Translate on European languages — exposed as one skill, with no monthly plan, no prepaid character blocks, no API key."
  meta:
    - "Hermes-native skill — one POST"
    - "30+ languages, DeepL Pro quality"
    - "Per-flow budget caps respected"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "/logos/hermes.png"
      title: "Hermes Agent"
    service:
      eyebrow: "DeepL"
      logo: "/logos/deepl.svg"
      title: "Translation API"
trust:
  items:
    - label: "Languages"
      stat: ""
      statHighlight: "30+"
      desc: "Hermes can translate between any pair of DeepL's 30+ supported languages."
    - label: "Quality benchmarks"
      stat: "#"
      statHighlight: "1"
      desc: "DeepL ranks first in 65% of language pairs in independent benchmarks — Hermes gets that quality on every call."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Add one skill to your Hermes Agent registry, declare per-call cost, ship. No DeepL account, no plan negotiation."
useCases:
  eyebrow: "What Hermes Agent builders ship"
  title:
    text: "Real Hermes flows that "
    highlight: "rely on this skill."
  description: "Each pattern below is a single Hermes Agent flow with DeepL via Locus registered as one skill. The math works because the flow only spends when it actually translates something."
  items:
    - who: "Hermes multilingual support flow"
      title: "Inbox in any language."
      text: "A Hermes flow watches a support inbox, detects language, translates inbound messages to the operator's language, and translates replies back — all through one skill call with formality control. Per-call billing aligns with ticket volume; quiet weeks cost less."
      query: "Translate inbound message to English; draft reply in original language with formal register"
    - who: "Hermes content-localization flow"
      title: "Multi-language posts on demand."
      text: "A Hermes flow receives a blog post or marketing copy and produces translations for the languages the team ships in, with brand-glossary terms preserved. The flow only spends when content actually needs translating."
      query: "Translate this post to German, French, Spanish, Japanese — keep brand terms from glossary"
    - who: "Hermes research flow"
      title: "Read the world's docs."
      text: "A research-side Hermes flow finds a non-English source, translates relevant sections, and uses them in its analysis. No human-managed DeepL account anywhere in the chain — the flow self-onboards via MCP and pays per call."
      query: "Fetch this page, translate the conclusion section to English, summarize"
    - who: "Hermes doc-translation flow"
      title: "Whole documents, formatting preserved."
      text: "Hand Hermes a Word, PDF, PowerPoint, or HTML doc and it returns the translated file with the original layout intact. Useful for tech writers, legal teams, and any workflow where copy-paste-then-fix would lose structure."
      query: "Translate this 12-page PDF to French, preserve formatting, use brand glossary"
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping DeepL plans "
    highlight: "into your flows."
  text: "Register one skill, connect a wallet, and your Hermes Agent flow can translate anything on demand. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
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
    - "DeepL Pro quality"
    - "Flow caps honored"
    - "MCP + x402 native"
faq:
  eyebrow: "FAQ"
  title: "Hermes Agent specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with Hermes Agent builders, no SDR funnel."
  items:
    - question: "How does this register as a Hermes Agent skill?"
      answer: "It's a standard POST endpoint with a typed body. You register it in Hermes the same way you'd register any HTTP skill — endpoint, schema, per-call price. Hermes Agent uses the price to plan flow budgets and to show the user what each run will cost before it fires."
      open: true
    - question: "Does Hermes Agent need a DeepL account or API key?"
      answer: "No. The gateway accepts x402-signed requests, so Hermes can pay per call from a wallet you connect. No DeepL account is created, and there's no shared API key to rotate or leak in flow logs."
    - question: "What happens when a Hermes flow hits its budget cap?"
      answer: "The skill returns whatever translations have completed so far and Hermes stops issuing new calls. The flow can decide whether to ask the user for more budget or hand off the partial result."
    - question: "Can Hermes call this in parallel for many strings?"
      answer: "Yes. Each translation is independent — Hermes can fire off N requests and collect them concurrently. Per-key rate limits apply with concurrency-fair queueing so a noisy flow never starves another flow on the same key."
    - question: "How is this different from giving Hermes a DeepL API Pro account?"
      answer: "Subscriptions don't fit Hermes Agent's skill model. The skill can't report a true per-call cost, so Hermes can't do real budget planning. The gateway reports an honest per-call cost up front, which is what Hermes was designed to consume. Plus there's no $5.49/month subscription floor and no prepaid character blocks."
    - question: "Does formality and glossary control work?"
      answer: "Yes. The full DeepL feature set is exposed: formality control (where supported), glossary IDs for brand terminology, and document translation that preserves layout."
footer:
  brand: "DeepL"
  suffix: "Translation for Hermes Agent"
  tag: "© 2026 · Built for Hermes Agent"
---
