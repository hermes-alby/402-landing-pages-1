---
layout: ../layouts/UseCasePage.astro
title: "Mathpix API for Hermes Agent · Pay Per Call, Math OCR"
description: "Wire Mathpix OCR into Hermes Agent. Image-to-LaTeX, PDF-to-Markdown, equation, table, and chemistry recognition — billed per call. No signup, no monthly plan, no API key."
bodyClass: "page-mathpix"
themeColor: "#0b0b0c"
ogTitle: "Mathpix API for Hermes Agent — Pay Per Call OCR"
ogDescription: "Full Mathpix OCR inside your Hermes Agent flow. One skill, billed per call, no API key wrangling."
schema:
  name: "Mathpix via Locus for Hermes Agent"
  description: "Math and document OCR skill for Hermes Agent flows — full Mathpix accuracy billed per call via x402."
  mainEntityName: "Mathpix via Locus for Hermes Agent"
  mainEntityDescription: "Hermes Agent skill that converts images, PDFs, and handwriting into LaTeX, MathML, and Mathpix Markdown."
  providerName: "Locus"
hero:
  ghostNumber: "HERMES"
  eyebrow: "Hermes Agent · Pay-per-call · No subscription"
  title:
    lines:
      - "Hermes Agent,"
      - "reading math"
    highlight: "on every page."
  lead: "Drop Mathpix via Locus into your Hermes Agent flow as a single skill. Images and PDFs go in, LaTeX, MathML, and Mathpix Markdown come back, billed per call. The shape of the call matches Hermes Agent's skill contract — declare it once, then forget it."
  meta:
    - "Hermes-native skill — one POST"
    - "LaTeX · MathML · Markdown · DOCX"
    - "Per-flow budget caps respected"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "/logos/hermes.png"
      title: "Hermes Agent"
    service:
      eyebrow: "Mathpix"
      logo: "/logos/mathpix.png"
      title: "Math & Document OCR"
trust:
  items:
    - label: "STEM coverage"
      stat: ""
      statHighlight: "Math+Chem"
      desc: "Equations, matrices, displayed math, chemistry structures, and structured tables — Hermes reads the inputs general OCR breaks on."
    - label: "Output formats"
      stat: ""
      statHighlight: "6+"
      desc: "LaTeX, MathML, Mathpix Markdown, HTML, DOCX, CSV — return whichever shape the downstream flow step expects."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Add one skill to your Hermes Agent registry, declare per-call cost, ship. No Mathpix account, no plan negotiation."
useCases:
  eyebrow: "What Hermes Agent builders ship"
  title:
    text: "Real Hermes flows that "
    highlight: "rely on this skill."
  description: "Each pattern below is a single Hermes Agent flow with Mathpix via Locus registered as one skill. The math works because the flow only spends when it actually processes a page."
  items:
    - who: "Hermes research flow"
      title: "Read papers, return structured math."
      text: "An autonomous research flow ingests scientific PDFs, calls the Mathpix skill page-by-page, and produces a structured Markdown document with equations preserved. No human-managed Mathpix subscription, no rotating API key in flow logs."
      query: "Convert all 38 pages of this conference paper to Mathpix Markdown"
    - who: "Hermes tutoring flow"
      title: "Photo of homework → clean LaTeX."
      text: "A tutoring or homework-help flow accepts a photo of a student's handwritten work, calls the Mathpix skill, and returns clean LaTeX the next flow step can render. Per-call billing keeps each interaction cheap; idle days cost zero."
      query: "Photo of a handwritten integral → clean LaTeX"
    - who: "Hermes ingestion pipeline"
      title: "Backfill a PDF corpus."
      text: "A scheduled Hermes flow walks a directory of technical PDFs, calls the skill on each page, and pushes structured output to a search index. Per-call billing means the spend tracks the corpus exactly — no monthly quota to over-provision."
      query: "Walk this 1,200-PDF corpus and emit one Mathpix Markdown file per paper"
    - who: "Hermes accessibility flow"
      title: "Make scientific content reflowable."
      text: "An accessibility flow runs textbook scans through the skill to produce MathML and semantic HTML for screen readers. The flow only spends on pages it actually processes."
      query: "Scanned chemistry textbook chapter → MathML + accessible HTML"
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping Mathpix plans "
    highlight: "into your flows."
  text: "Register one skill, connect a wallet, and your Hermes Agent flow gets full Mathpix accuracy on every relevant call. Idle runs cost zero. Page-quota math goes away. That's the entire deal."
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
    - "Full Mathpix accuracy"
    - "Flow caps honored"
    - "MCP + x402 native"
faq:
  eyebrow: "FAQ"
  title: "Hermes Agent specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with Hermes Agent builders, no SDR funnel."
  items:
    - question: "How does this register as a Hermes Agent skill?"
      answer: "It's a standard POST endpoint with a typed body — image or PDF in, LaTeX or Markdown out. You register it in Hermes the same way you'd register any HTTP skill — endpoint, schema, per-call price. Hermes uses the price to plan flow budgets and to show what each run will cost before it fires."
      open: true
    - question: "Does Hermes Agent need a Mathpix account or API key?"
      answer: "No. The gateway accepts x402-signed requests, so Hermes can pay per call from a wallet you connect. No Mathpix account is created, and there's no shared API key to rotate or leak in flow logs."
    - question: "What happens when a Hermes flow hits its budget cap?"
      answer: "The skill returns whatever pages it has resolved so far and Hermes stops issuing new calls. The flow can decide whether to ask the user for more budget or hand off with a partial result."
    - question: "Can Hermes call this concurrently across many flows?"
      answer: "Yes. Per-key rate limits apply with concurrency-fair queueing — a noisy flow never starves another flow on the same key. Practical limits scale with the underlying Mathpix infrastructure."
    - question: "How is this different from giving Hermes a Mathpix Convert API plan?"
      answer: "Convert API plans are sized in monthly page quotas, which don't fit Hermes Agent's per-call cost model. The skill couldn't report a true per-call cost, so Hermes couldn't do real budget planning. The gateway reports an honest per-call cost up front."
    - question: "Is the accuracy the same as Mathpix direct?"
      answer: "Yes. The gateway proxies Mathpix's engine directly, so equation, table, handwriting, and chemistry accuracy match exactly."
footer:
  brand: "Mathpix"
  suffix: "Math & document OCR for Hermes Agent"
  tag: "© 2026 · Built for Hermes Agent"
---
