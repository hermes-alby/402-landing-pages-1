---
layout: ../layouts/UseCasePage.astro
title: "Mathpix API · Pay Per Call, Math and Document OCR"
description: "Convert images, PDFs, and handwriting into LaTeX, MathML, and Mathpix Markdown — billed per call. Full Mathpix accuracy, no Convert API plan, no signup, no API key."
bodyClass: "page-mathpix"
themeColor: "#0b0b0c"
ogTitle: "Mathpix API — Pay Per Call, No Subscription"
ogDescription: "Image-to-LaTeX, PDF-to-Markdown, handwriting and chemistry OCR. Full Mathpix accuracy billed per request. Built for AI agents and developers."
schema:
  name: "Mathpix via Locus"
  description: "Pay-per-call gateway to Mathpix's STEM-grade OCR API. Image, PDF, handwriting, equation, table, and chemistry recognition with LaTeX, MathML, and Markdown output."
  mainEntityName: "Mathpix via Locus"
  mainEntityDescription: "Full Mathpix OCR billed per call via x402 — no subscription, no API key."
  providerName: "Locus"
hero:
  ghostNumber: "LaTeX"
  eyebrow: "Pay-per-call · Full Mathpix accuracy · No subscription"
  title:
    lines:
      - "Every equation,"
      - "every page,"
    highlight: "one call."
  lead: "Mathpix via Locus is a pay-per-call gateway to Mathpix's STEM-grade OCR — printed and handwritten math, chemistry structures, tables, and full document layout, returned as LaTeX, MathML, Mathpix Markdown, HTML, or DOCX. Send an image or a PDF, get the structured output back, walk away. No Snip plan, no Convert API quota, no API key."
  meta:
    - "LaTeX · MathML · Markdown · DOCX · HTML"
    - "Equations, tables, chemistry, handwriting"
    - "No signup, no API key"
    - "MCP + x402 native"
  connection:
    agent:
      eyebrow: "Your AI agent"
      logo: "Logo"
      title: "Any agent"
    service:
      eyebrow: "Mathpix"
      logo: "/logos/mathpix.png"
      title: "Math & Document OCR"
trust:
  items:
    - label: "STEM coverage"
      stat: ""
      statHighlight: "Math+Chem"
      desc: "Printed and handwritten equations, matrices, displayed math, chemistry structures (SMILES, ChemDraw), and structured tables — the Mathpix specialty."
    - label: "Output formats"
      stat: ""
      statHighlight: "6+"
      desc: "LaTeX, MathML, Mathpix Markdown, HTML, DOCX, CSV — pick the shape your pipeline needs."
    - label: "Reliability"
      stat: ""
      statHighlight: "Mathpix"
      statSuffix: "engine"
      desc: "Same engine that powers Snip, Overleaf integrations, and major textbook publishers. Production-ready, no vendor evaluation."
useCases:
  eyebrow: "Who it's for"
  title:
    text: "Built for teams that need math OCR "
    highlight: "without the plan-tier math."
  description: "Four shapes of customer who benefit most. If you recognize your workflow, the per-call model is in your favor."
  items:
    - who: "For AI agent builders"
      title: "Read math like any other tool call."
      text: "MCP discovery and x402 payment let an autonomous research, tutoring, or document-processing agent self-onboard at runtime. The agent sends an image or a PDF page, gets LaTeX or Markdown back, and moves on — no human-managed Mathpix subscription anywhere in the loop."
      query: "Convert this scanned physics paper to Mathpix Markdown — preserve equations and tables"
    - who: "For EdTech and tutoring apps"
      title: "Photo-to-LaTeX without a Snip plan."
      text: "Homework helpers, note-taking apps, and tutoring tools convert student photos of equations and handwritten work into LaTeX or structured Markdown. Per-call billing maps cleanly to per-user usage — bursts during exam season scale linearly instead of hitting a quota cliff."
      query: "Photo of a handwritten integral → clean LaTeX, ready to render"
    - who: "For research and document pipelines"
      title: "Backfill PDFs without a Convert API tier."
      text: "Ingestion pipelines for academic papers, patents, and technical PDFs use the endpoint to extract equations, tables, and references. Evaluate accuracy with a tiny spend, then scale only if the output works. No upfront page-quota commitment."
      query: "Extract all equations and tables from a 200-page conference proceedings PDF"
    - who: "For accessibility and publishing tools"
      title: "Make scientific content readable everywhere."
      text: "Tools that re-flow scientific content for screen readers, e-readers, and digital textbooks run pages through the gateway to produce semantic LaTeX and MathML. The endpoint becomes a primitive: one call returns the structured content, billed at the rate the product actually generates."
      query: "Scanned chemistry textbook chapter → MathML + accessible HTML"
cta:
  eyebrow: "Start in two minutes"
  title:
    text: "Stop guessing your way "
    highlight: "up the page-quota ladder."
  text: "Connect a wallet, send an image or a PDF, and the LaTeX lands a moment later. If you don't process anything for a month, you don't pay for the month. Same engine Mathpix ships in Snip and the Convert API, billed per request instead. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try a request →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "Read the schema"
      href: "#"
  badges:
    - "Full Mathpix accuracy"
    - "No signup, no API key"
    - "MCP + x402 native"
    - "LaTeX · MathML · Markdown"
faq:
  eyebrow: "FAQ"
  title: "The honest answers."
  description: "If something below doesn't cover your case, ping us — we answer directly, no SDR funnel."
  items:
    - question: "What does the gateway accept and return?"
      answer: "Send an image (PNG, JPG) or a PDF (page or whole document). Get back LaTeX, MathML, Mathpix Markdown, HTML, DOCX, or CSV — the same outputs as the Mathpix Convert API, with full equation, table, and chemistry support."
      open: true
    - question: "Is the OCR different from Mathpix's direct API?"
      answer: "No. The gateway proxies Mathpix's engine, so accuracy, format support, and edge-case handling (handwriting, displayed math, chemistry, tables) match exactly. The only difference is the access shape: per-call billing instead of monthly quotas."
    - question: "Do I need a Mathpix account or API key?"
      answer: "No. Authentication is per-request via x402. Connect a wallet, sign the request, get the result. No Snip subscription, no Convert API plan, no key to rotate."
    - question: "How does this compare to going direct on Mathpix?"
      answer: "Direct Mathpix is split between a Snip subscription (individual/team), a Convert API plan with monthly page quotas, and enterprise contracts. The gateway charges per call instead, which fits better when volume is bursty, when you're evaluating accuracy, or when an autonomous agent needs to call without a billing-entity-owned key."
    - question: "Can autonomous AI agents use this?"
      answer: "Yes — that's a primary design point. The endpoint supports MCP discovery and x402 payment, so an agent can find it, call it, pay for it, and consume the output without a human creating an account."
    - question: "What about handwriting and chemistry?"
      answer: "Both are core Mathpix strengths and both ship through the gateway unchanged. Handwritten equations return clean LaTeX; chemistry structures return SMILES/MOL formats. This is the workload general-purpose OCR fails on, which is exactly why Mathpix exists."
footer:
  brand: "Mathpix"
  suffix: "Math & document OCR"
  tag: "© 2026 · Built for agents"
---
