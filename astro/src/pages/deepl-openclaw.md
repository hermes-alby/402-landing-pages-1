---
layout: ../layouts/UseCasePage.astro
title: "DeepL API for OpenClaw · Pay Per Call, Pro-Tier Translation"
description: "Plug DeepL Pro–tier translation into OpenClaw. 30+ languages, formality control, document mode — billed per call. No signup, no monthly plan, no API key."
bodyClass: "page-deepl"
themeColor: "#0b0b0c"
ogTitle: "DeepL API for OpenClaw — Pay Per Call Translation"
ogDescription: "DeepL Pro translation inside your OpenClaw agent. One tool, billed per call, no API key wrangling."
schema:
  name: "DeepL via Locus for OpenClaw"
  description: "Translation tool for OpenClaw agents — DeepL Pro–grade quality across 30+ languages, billed per call via x402."
  mainEntityName: "DeepL via Locus for OpenClaw"
  mainEntityDescription: "OpenClaw-ready endpoint that translates text and documents with DeepL's professional engine."
  providerName: "Locus"
hero:
  ghostNumber: "OPEN"
  eyebrow: "OpenClaw · Pay-per-call · No subscription"
  title:
    lines:
      - "OpenClaw, speak"
      - "every"
    highlight: "language."
  lead: "Drop DeepL via Locus into your OpenClaw agent as a single tool call. Source text and a target language go in, DeepL Pro–grade translations come back, billed per call. The same engine that consistently outperforms Google Translate on European languages — exposed as one tool, with no monthly plan, no prepaid character blocks, no API key."
  meta:
    - "Single OpenClaw tool — one POST"
    - "30+ languages, DeepL Pro quality"
    - "Per-run budget caps honored"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "/logos/openclaw.svg"
      title: "OpenClaw"
    service:
      eyebrow: "DeepL"
      logo: "/logos/deepl.svg"
      title: "Translation API"
trust:
  items:
    - label: "Languages"
      stat: ""
      statHighlight: "30+"
      desc: "OpenClaw can translate between any pair of DeepL's 30+ supported languages."
    - label: "Quality benchmarks"
      stat: "#"
      statHighlight: "1"
      desc: "DeepL ranks first in 65% of language pairs in independent benchmarks — OpenClaw gets that quality on every call."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Register one tool in OpenClaw, declare per-call cost, ship. No DeepL account, no plan negotiation."
useCases:
  eyebrow: "What OpenClaw builders ship"
  title:
    text: "Real OpenClaw agents that "
    highlight: "rely on this tool."
  description: "Each pattern below is a single OpenClaw agent with DeepL via Locus registered as one tool. The math works because the agent only spends when it actually translates something."
  items:
    - who: "OpenClaw multilingual support agent"
      title: "Inbox in any language."
      text: "OpenClaw watches a support inbox, detects language, translates inbound messages to the operator's language, and translates replies back — all through one tool call with formality control. Per-call billing aligns with ticket volume; quiet weeks cost less."
      query: "Translate inbound message to English; draft reply in original language with formal register"
    - who: "OpenClaw content-localization bot"
      title: "Multi-language posts on demand."
      text: "An OpenClaw agent receives a blog post or marketing copy and produces translations for the languages the team ships in, with brand-glossary terms preserved. The agent only spends when content actually needs translating."
      query: "Translate this post to German, French, Spanish, Japanese — keep brand terms from glossary"
    - who: "OpenClaw research agent"
      title: "Read the world's docs."
      text: "A research-side OpenClaw agent finds a non-English source, translates relevant sections, and uses them in its analysis. No human-managed DeepL account anywhere in the chain — the agent self-onboards via MCP and pays per call."
      query: "Fetch this page, translate the conclusion section to English, summarize"
    - who: "OpenClaw doc-translation agent"
      title: "Whole documents, formatting preserved."
      text: "Hand OpenClaw a Word, PDF, PowerPoint, or HTML doc and it returns the translated file with the original layout intact. Useful for tech writers, legal teams, and any workflow where copy-paste-then-fix would lose structure."
      query: "Translate this 12-page PDF to French, preserve formatting, use brand glossary"
cta:
  eyebrow: "OpenClaw-ready in two minutes"
  title:
    text: "Stop wrapping DeepL plans "
    highlight: "into your agent."
  text: "Register one tool, connect a wallet, and your OpenClaw agent can translate anything on demand. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try the endpoint →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "OpenClaw integration guide"
      href: "#"
  badges:
    - "Single OpenClaw tool"
    - "DeepL Pro quality"
    - "Budget caps honored"
    - "MCP + x402 native"
faq:
  eyebrow: "FAQ"
  title: "OpenClaw-specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with OpenClaw builders, no SDR funnel."
  items:
    - question: "How does this register as an OpenClaw tool?"
      answer: "It's a standard POST endpoint with a typed body. You register it in OpenClaw the same way you'd register any HTTP tool — endpoint, schema, per-call price. OpenClaw uses the price to enforce budget caps and to show the user what each agent run will cost before it runs."
      open: true
    - question: "Does OpenClaw need a DeepL account or API key?"
      answer: "No. The gateway accepts x402-signed requests, so OpenClaw can pay per call from a wallet you connect. No DeepL account is created, and there's no shared API key to rotate or leak in agent logs."
    - question: "What happens when an OpenClaw run hits its budget cap?"
      answer: "The tool returns whatever translations have completed so far and OpenClaw stops issuing new calls. The agent treats this as a normal tool boundary and can ask for more budget or hand off the partial result."
    - question: "Can OpenClaw call this in parallel for many strings?"
      answer: "Yes. Each translation is independent — OpenClaw can fire off N requests and collect them concurrently. Per-key rate limits apply with concurrency-fair queueing so a noisy agent never starves another agent on the same key."
    - question: "How is this different from giving OpenClaw a DeepL API Pro account?"
      answer: "Subscriptions don't fit OpenClaw's tool model. The tool can't report a true per-call cost, so OpenClaw can't do real budget planning. The gateway reports an honest per-call cost up front, which is what OpenClaw was designed to consume. Plus there's no $5.49/month subscription floor and no prepaid character blocks."
    - question: "Does formality and glossary control work?"
      answer: "Yes. The full DeepL feature set is exposed: formality control (where supported), glossary IDs for brand terminology, and document translation that preserves layout."
footer:
  brand: "DeepL"
  suffix: "Translation for OpenClaw"
  tag: "© 2026 · Built for OpenClaw"
---
