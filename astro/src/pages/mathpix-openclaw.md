---
layout: ../layouts/UseCasePage.astro
title: "Mathpix API for OpenClaw · Pay Per Call, Math OCR"
description: "Plug Mathpix OCR into OpenClaw. Image-to-LaTeX, PDF-to-Markdown, equation, table, and chemistry recognition — billed per call. No signup, no monthly plan, no API key."
bodyClass: "page-mathpix"
themeColor: "#0b0b0c"
ogTitle: "Mathpix API for OpenClaw — Pay Per Call OCR"
ogDescription: "Full Mathpix OCR inside your OpenClaw agent. One tool, billed per call, no API key wrangling."
schema:
  name: "Mathpix via Locus for OpenClaw"
  description: "Math and document OCR tool for OpenClaw agents — full Mathpix accuracy billed per call via x402."
  mainEntityName: "Mathpix via Locus for OpenClaw"
  mainEntityDescription: "OpenClaw-ready endpoint that converts images, PDFs, and handwriting into LaTeX, MathML, and Mathpix Markdown."
  providerName: "Locus"
hero:
  ghostNumber: "OPEN"
  eyebrow: "OpenClaw · Pay-per-call · No subscription"
  title:
    lines:
      - "OpenClaw, read"
      - "every equation"
    highlight: "in real time."
  lead: "Drop Mathpix via Locus into your OpenClaw agent as a single tool call. Images and PDFs go in, LaTeX, MathML, and Mathpix Markdown come back, billed per call. Full Mathpix accuracy with no Snip plan, no Convert API quota, and no API key."
  meta:
    - "Single OpenClaw tool — one POST"
    - "LaTeX · MathML · Markdown · DOCX"
    - "Per-run budget caps honored"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "/logos/openclaw.svg"
      title: "OpenClaw"
    service:
      eyebrow: "Mathpix"
      logo: "/logos/mathpix.png"
      title: "Math & Document OCR"
trust:
  items:
    - label: "STEM coverage"
      stat: ""
      statHighlight: "Math+Chem"
      desc: "Equations, matrices, displayed math, chemistry structures, and structured tables — OpenClaw reads inputs that break general OCR."
    - label: "Output formats"
      stat: ""
      statHighlight: "6+"
      desc: "LaTeX, MathML, Mathpix Markdown, HTML, DOCX, CSV — return whichever shape the next tool expects."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Register one tool in OpenClaw, declare per-call cost, ship. No Mathpix account, no plan-tier negotiation."
useCases:
  eyebrow: "What OpenClaw builders ship"
  title:
    text: "Real OpenClaw agents that "
    highlight: "rely on this tool."
  description: "Each pattern below is a single OpenClaw agent with Mathpix via Locus registered as one tool. The math works because the agent only spends when it actually processes a page."
  items:
    - who: "OpenClaw research agent"
      title: "Read papers, return structured math."
      text: "An autonomous research agent ingests scientific PDFs, calls the Mathpix tool page-by-page, and produces a structured Markdown document with equations preserved. No human-managed Mathpix subscription, no rotating API key in agent logs."
      query: "Convert all 38 pages of this conference paper to Mathpix Markdown"
    - who: "OpenClaw tutoring agent"
      title: "Photo of homework → clean LaTeX."
      text: "A tutoring or homework-help agent accepts a photo of a student's handwritten work, calls the Mathpix tool, and returns clean LaTeX the next step can render. Per-call billing keeps each interaction cheap; idle days cost zero."
      query: "Photo of a handwritten integral → clean LaTeX"
    - who: "OpenClaw ingestion agent"
      title: "Backfill a PDF corpus."
      text: "A scheduled OpenClaw agent walks a directory of technical PDFs, calls the tool on each page, and pushes structured output to a search index. Per-call billing means the spend tracks the corpus exactly — no monthly quota to over-provision."
      query: "Walk this 1,200-PDF corpus and emit one Mathpix Markdown file per paper"
    - who: "OpenClaw accessibility agent"
      title: "Make scientific content reflowable."
      text: "An accessibility agent runs textbook scans through the tool to produce MathML and semantic HTML for screen readers. The agent only spends on pages it actually processes."
      query: "Scanned chemistry textbook chapter → MathML + accessible HTML"
cta:
  eyebrow: "OpenClaw-ready in two minutes"
  title:
    text: "Stop wrapping Mathpix plans "
    highlight: "into your agent."
  text: "Register one tool, connect a wallet, and your OpenClaw agent gets full Mathpix accuracy on every relevant call. Idle runs cost zero. Page-quota math goes away. That's the entire deal."
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
    - "Full Mathpix accuracy"
    - "Budget caps honored"
    - "MCP + x402 native"
faq:
  eyebrow: "FAQ"
  title: "OpenClaw-specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with OpenClaw builders, no SDR funnel."
  items:
    - question: "How does this register as an OpenClaw tool?"
      answer: "It's a standard POST endpoint with a typed body — image or PDF in, LaTeX or Markdown out. You register it in OpenClaw the same way you'd register any HTTP tool — endpoint, schema, per-call price. OpenClaw uses the price to enforce budget caps and to show the user what each run will cost."
      open: true
    - question: "Does OpenClaw need a Mathpix account or API key?"
      answer: "No. The gateway accepts x402-signed requests, so OpenClaw can pay per call from a wallet you connect. No Mathpix account is created, and there's no shared API key to rotate or leak in agent logs."
    - question: "What happens when an OpenClaw run hits its budget cap?"
      answer: "The tool returns whatever pages it has resolved so far and OpenClaw stops issuing new calls. The agent treats this as a normal tool boundary and can ask the user for more budget or hand off the partial result."
    - question: "Can OpenClaw call this concurrently across many agents?"
      answer: "Yes. Per-key rate limits apply with concurrency-fair queueing — a noisy agent never starves another agent on the same key. Practical limits scale with the underlying Mathpix infrastructure."
    - question: "How is this different from giving OpenClaw a Mathpix Convert API plan?"
      answer: "Convert API plans are sized in monthly page quotas, which don't fit OpenClaw's per-call cost model. The tool couldn't report a true per-call cost, so OpenClaw couldn't do real budget planning. The gateway reports an honest per-call cost up front."
    - question: "Is the accuracy the same as Mathpix direct?"
      answer: "Yes. The gateway proxies Mathpix's engine directly, so equation, table, handwriting, and chemistry accuracy match exactly."
footer:
  brand: "Mathpix"
  suffix: "Math & document OCR for OpenClaw"
  tag: "© 2026 · Built for OpenClaw"
---
