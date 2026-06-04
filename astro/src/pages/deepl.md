---
layout: ../layouts/UseCasePage.astro
title: "DeepL API Pricing Alternative · Pay Per Call Translation"
description: "Use DeepL API translation and DeepL Write per call instead of a monthly API Pro floor. Compare the pay-per-call option for agents, apps, and localization workflows."
bodyClass: "page-deepl"
themeColor: "#0b0b0c"
ogTitle: "DeepL API Pricing Alternative — Pay Per Call Translation"
ogDescription: "DeepL API translation and writing polish billed per request, with no monthly plan, prepaid block, or long-lived API key."
schema:
  name: "DeepL via Locus"
  description: "Pay-per-call gateway to DeepL's professional translation and DeepL Write APIs. 30+ languages with formality, glossary, and document mode."
  mainEntityName: "DeepL via Locus"
  mainEntityDescription: "DeepL Pro–grade translation billed per call via x402 — no monthly subscription, no API key."
  providerName: "Locus"
hero:
  ghostNumber: "30+"
  eyebrow: "DeepL API pricing alternative · Pay-per-call · No subscription"
  title:
    lines:
      - "DeepL API"
      - "pricing,"
    highlight: "per call."
  lead: "DeepL via Locus is a pay-per-call alternative for DeepL API translation and DeepL Write. Translate text or documents across 30+ languages with formality control, glossary support, and rephrasing — without a $5.49/month API Pro floor, prepaid character blocks, or a long-lived API key in agent logs."
  meta:
    - "30+ languages, DeepL Pro quality"
    - "Formality control + glossary support"
    - "Document mode (Word, PDF, PPTX, HTML)"
    - "MCP + x402 native"
  connection:
    agent:
      eyebrow: "Your AI agent"
      logo: "Logo"
      title: "Any agent"
    service:
      eyebrow: "DeepL"
      logo: "/logos/deepl.svg"
      title: "Translation API"
trust:
  items:
    - label: "Languages"
      stat: ""
      statHighlight: "30+"
      desc: "Translate between any pair of DeepL's 30+ supported languages — German, French, Spanish, Japanese, Chinese, and more."
    - label: "Quality benchmarks"
      stat: "#"
      statHighlight: "1"
      desc: "DeepL ranks first in 65% of language pairs in independent translation-quality benchmarks like Intento."
    - label: "Time to first call"
      stat: "~"
      statHighlight: "60"
      statSuffix: "sec"
      desc: "Connect a wallet, POST your first text, get a Pro-grade translation back. No signup, no plan, no key."
useCases:
  eyebrow: "Who it's for"
  title:
    text: "Built for teams that need professional translation "
    highlight: "without the subscription math."
  description: "Four shapes of customer who benefit most. If you recognize your workflow, the per-call model is in your favor."
  items:
    - who: "For AI agent builders"
      title: "Translation as just another tool call."
      text: "A multilingual support agent, research bot, or content-curation agent translates inline as a tool call — no human-managed DeepL account, no API key rotation. MCP discovery and x402 payment let the agent self-onboard at runtime; per-call billing keeps spend tied to actual translation volume."
      query: "Translate this support reply from English to German with formal register"
    - who: "For SaaS and content tools"
      title: "Localize without enterprise contracts."
      text: "A CMS, marketing tool, or chat product offers translation features without negotiating a DeepL API Pro plan. Per-call pricing maps cleanly to per-user usage — free-tier traffic doesn't burn a flat-rate plan and high-volume customers scale linearly."
      query: "Auto-translate this blog post into German, French, Spanish, and Japanese"
    - who: "For localization and documentation teams"
      title: "Translate whole documents on demand."
      text: "Tech writers and localization engineers translate Markdown, Word, PDF, and HTML docs with DeepL's format-preserving document mode. Glossary support keeps brand terminology consistent. Pay only for the docs that actually need translation in a given sprint."
      query: "Translate this 12-page PDF user guide to French, preserve formatting, use brand glossary"
    - who: "For customer support and operations"
      title: "Multilingual inbox, on-the-fly."
      text: "Inbound multilingual messages get translated to a support agent's language and replies translated back, all routed through one endpoint with formality control. Per-call billing aligns spend with ticket volume — quiet weeks cost less, viral support moments scale without plan upgrades."
      query: "Detect language, translate inbound message, generate formal reply in original language"
cta:
  eyebrow: "Start in two minutes"
  title:
    text: "Stop paying a monthly floor "
    highlight: "to translate."
  text: "Connect a wallet, POST your first string, and get a Pro-grade translation back instantly. If you don't translate for a month, you don't pay for the month. Same data DeepL ships at the Pro tier, billed per request instead. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try a translation →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "Read the schema"
      href: "#"
  badges:
    - "DeepL Pro quality"
    - "30+ languages"
    - "No signup, no API key"
    - "MCP + x402 native"
faq:
  eyebrow: "FAQ"
  title: "The honest answers."
  description: "If something below doesn't cover your case, ping us — we answer directly, no SDR funnel."
  items:
    - question: "Is the translation quality the same as DeepL Pro?"
      answer: "Yes. The gateway proxies DeepL's Pro API directly, so output matches the model that consistently ranks first in European-language benchmarks against Google Translate, Microsoft Translator, and Amazon Translate."
      open: true
    - question: "Which features are exposed?"
      answer: "Text translation across 30+ languages, formality control (formal/informal register, supported on a subset of languages including German, French, Spanish, Japanese), glossary support for brand terms, and document translation that preserves Word, PDF, PowerPoint, and HTML formatting. DeepL Write rephrasing endpoints are exposed too."
    - question: "Do I need a DeepL account or API key?"
      answer: "No. Authentication is per-request via x402. Connect a wallet, sign the request, get the translation back. No signup form, no key to rotate, no shared secret in agent logs."
    - question: "How does this compare to DeepL API Pro pricing?"
      answer: "DeepL API Pro requires a $5.49/month subscription floor plus per-character billing. The gateway charges per call instead, which fits better for light or experimental usage, for SaaS embedding where translation volume is variable, and for autonomous agents that need translation as a tool call without a billing-entity-owned API key."
    - question: "Is there a DeepL API free tier?"
      answer: "Use DeepL's own free tier when it fits your product and account model. This page is for teams and agents that want Pro-quality API access as an on-demand paid call instead of managing a DeepL account, API key, and monthly floor."
    - question: "Can autonomous AI agents use this?"
      answer: "Yes — that's a primary design point. The endpoint supports MCP discovery and x402 payment, so an autonomous agent can find it, call it, pay for it, and consume the result without a human creating an account."
    - question: "What about data privacy?"
      answer: "The gateway forwards requests to DeepL's API, which processes text under DeepL's data-protection terms (GDPR-aligned, no training on customer text on Pro/API access). Don't send content you wouldn't be comfortable sending to DeepL directly."
footer:
  brand: "DeepL"
  suffix: "Translation"
  tag: "© 2026 · Built for agents"
---
