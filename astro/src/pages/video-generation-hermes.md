---
layout: ../layouts/UseCasePage.astro
title: "Video Generation API for Hermes Agent · Kling 2.1 Pro, Pay Per Call | PayPerQ"
description: "Wire PayPerQ Video Generation into Hermes Agent. Cinematic 1080p Kling 2.1 Pro video from a single async skill, billed per generation. No signup, no API key, no monthly seat."
bodyClass: "page-video-generation"
themeColor: "#0b0b0c"
ogTitle: "Video Generation API for Hermes Agent — Kling 2.1 Pro, Pay Per Call"
ogDescription: "Cinematic 1080p text-to-video and image-to-video inside your Hermes Agent flow. One async skill, billed per call."
schema:
  name: "PayPerQ Video Generation for Hermes Agent"
  description: "AI video generation skill for Hermes Agent flows — Kling 2.1 Pro 1080p output via a single async submit-and-poll endpoint."
  mainEntityName: "PayPerQ Video Generation for Hermes Agent"
  mainEntityDescription: "Hermes Agent skill that turns prompts and images into Kling 2.1 Pro video, billed per call."
  providerName: "PayPerQ"
hero:
  ghostNumber: "HERMES"
  eyebrow: "Hermes Agent · Pay-per-call · No subscription"
  title:
    lines:
      - "Hermes Agent,"
      - "render the"
    highlight: "shot."
  lead: "Drop PayPerQ Video Generation into your Hermes Agent flow as a single async skill. Prompts and images go in, cinematic 1080p Kling 2.1 Pro MP4s come back, billed per generation. The submit-and-poll shape matches Hermes Agent's contract for long-running skills — declare it once, then forget it."
  meta:
    - "Hermes-native skill — submit + poll"
    - "Kling 2.1 Pro under the hood"
    - "Per-flow budget caps respected"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "/logos/hermes.png"
      title: "Hermes Agent"
    service:
      eyebrow: "PayPerQ"
      logo: "/logos/payperq.svg"
      title: "Video Generation API"
trust:
  items:
    - label: "Output quality"
      stat: ""
      statHighlight: "1080p"
      desc: "Hermes gets native 1080p MP4 from Kling 2.1 Pro — looks filmed, not stitched."
    - label: "Generation modes"
      stat: ""
      statHighlight: "T2V"
      statSuffix: "+ I2V"
      desc: "Text-to-video and image-to-video via the same Hermes skill. First-frame conditioning supported."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Add one async skill to your Hermes Agent registry, declare per-call cost, ship. No vendor onboarding."
useCases:
  eyebrow: "What Hermes Agent builders ship"
  title:
    text: "Real Hermes flows that "
    highlight: "render their own video."
  description: "Each pattern below is a single Hermes Agent flow with PayPerQ Video Generation registered as one async skill. The math works because the flow only spends when it actually produces a usable clip."
  items:
    - who: "Hermes creative flow"
      title: "Brief to b-roll, autonomously."
      text: "A user hands Hermes Agent a marketing brief. The flow drafts shot descriptions, fires off generations in parallel, polls each job, and assembles the finished clips into a deliverable. No human-managed Kling or Runway account anywhere in the chain — and no per-seat charge for a flow that runs once a week."
      query: "Generate 6 hero shots for a Q3 sneaker drop, each 5s, neon city backdrop"
    - who: "Hermes product-video bot"
      title: "Catalog photos into motion at scale."
      text: "A scheduled Hermes flow walks new SKUs in the catalog, calls the skill with each product photo, and produces a turntable or lifestyle clip per item. Image-to-video with first-frame conditioning keeps the product faithful; per-call billing keeps the cost line aligned with catalog growth."
      query: "Animate this kitchen-mixer photo into a 5s countertop scene with steam rising"
    - who: "Hermes social-content flow"
      title: "Daily reels, generated on a cron."
      text: "Hermes watches a content brief, picks the day's angle, generates a 6-second clip, captions it, and posts. Days you don't post cost zero; days you post a lot scale linearly. No flat-rate seat math eating margin on quiet weeks."
      query: "A 6-second cinematic clip of a vintage Porsche pulling onto a coastal road at golden hour"
    - who: "Hermes rendering flow"
      title: "Variations on demand for human review."
      text: "A Hermes flow generates dozens of takes from a single brief — different camera angles, lighting, talent — and presents them ranked for human review before approval. Cheap exploration, expensive only when humans actually pick a winner."
      query: "10 variations of the same 4s hero shot, vary camera angle and lighting only"
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping video subscriptions "
    highlight: "into your flows."
  text: "Register one async skill, connect a wallet, and your Hermes Agent flow gets cinematic 1080p video on every relevant call. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Get an API key →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "Hermes Agent integration guide"
      href: "#"
  badges:
    - "Single Hermes skill"
    - "Async submit-and-poll"
    - "Kling 2.1 Pro under the hood"
    - "Flow caps honored"
faq:
  eyebrow: "FAQ"
  title: "Hermes Agent specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with Hermes Agent builders, no SDR funnel."
  items:
    - question: "How does this register as a Hermes Agent skill?"
      answer: "It's an async POST endpoint with a typed body and a polling endpoint for status. You register both in Hermes the same way you'd register any long-running HTTP skill — endpoint, schema, per-call price. Hermes Agent handles the polling loop and surfaces the resulting video URL back into the flow's state."
      open: true
    - question: "Does Hermes Agent need a long-lived API key?"
      answer: "No. The endpoint accepts x402-signed requests, so Hermes can pay per call from a wallet you connect. There's no shared secret to rotate or leak in flow logs."
    - question: "What happens when a Hermes flow hits its budget cap?"
      answer: "The skill returns whatever generations have already completed and Hermes stops issuing new submissions. The flow can decide whether to ask the user for more budget or hand off the partial deliverable."
    - question: "Can Hermes run many generations in parallel?"
      answer: "Yes. Each submission is independent — Hermes can fire off N generations and poll them concurrently. Per-key rate limits apply with concurrency-fair queueing so a noisy flow never starves another flow on the same key."
    - question: "How is this different from giving Hermes a Kling or Runway seat?"
      answer: "Subscriptions don't fit Hermes Agent's skill model. The skill can't report a true per-call cost, so Hermes can't do real budget planning. PayPerQ Video Generation reports an honest per-call cost up front, which is what Hermes was designed to consume."
    - question: "What about content rights?"
      answer: "Generated outputs follow Kling 2.1 Pro's commercial-use terms. Don't generate content that infringes third-party rights or violates the model's safety policy; the endpoint enforces standard content filters before returning a video."
footer:
  brand: "PayPerQ"
  suffix: "Video Generation for Hermes Agent"
  tag: "© 2026 · Built for Hermes Agent"
---
