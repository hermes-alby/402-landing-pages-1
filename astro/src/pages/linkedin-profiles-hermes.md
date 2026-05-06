---
layout: ../layouts/UseCasePage.astro
title: "LinkedIn Profile Enrichment for Hermes Agent · Pay Per Query | PayPerQ"
description: "Wire PayPerQ Contacts Enrich into Hermes Agent. Natural-language LinkedIn enrichment across 800M+ professionals, billed per verified profile via Lightning. No subscription, no SDK."
bodyClass: "page-linkedin"
themeColor: "#0b0b0c"
ogTitle: "LinkedIn Profile Enrichment for Hermes Agent — Pay Per Query"
ogDescription: "Verified emails, GitHub, Scholar, full LinkedIn data inside your Hermes Agent flows. One skill, one endpoint, billed per verified profile via Lightning."
schema:
  name: "PayPerQ LinkedIn Profile Enrichment for Hermes Agent"
  description: "Pay-per-query LinkedIn enrichment skill designed for Hermes Agent flows. Natural-language search across 800M+ professionals."
  mainEntityName: "PayPerQ Contacts Enrich for Hermes Agent"
  mainEntityDescription: "Hermes Agent skill that turns plain-English prompts into ranked, verified LinkedIn profiles, billed per call via Lightning."
  providerName: "PayPerQ"
hero:
  ghostNumber: "HERMES"
  eyebrow: "Hermes Agent · Pay-per-query · No subscription"
  title:
    lines:
      - "Hermes Agent,"
      - "wired for"
    highlight: "real contacts."
  lead: "Drop PayPerQ Contacts Enrich into your Hermes Agent flow as a single skill. Natural-language prompts in, ranked verified LinkedIn profiles out, billed per hit via Lightning. The shape of the call matches Hermes Agent's tool contract — declare it once, then forget it."
  actions:
    - label: "Wire it up"
      text: "Add to Hermes Agent"
      href: "#prompt"
      primary: true
    - label: "Inspect"
      text: "See the skill"
      href: "#endpoint"
      monoTag: "skill"
  meta:
    - "Hermes-native skill — one POST"
    - "From $0.04 per verified profile"
    - "Per-flow budget caps respected"
    - "No persistent API key required"
  promptLabel: "Hermes Agent flow"
  promptText: "Find senior Rust engineers in Berlin who shipped open-source compilers, with verified work emails. Return top 10."
  profile:
    initials: "MR"
    brand: "hermes"
    brandSuffix: "skill · payperq"
    status: "200 · 0.84s"
    name: "Maja Reinhardt"
    role: "Staff Compiler Engineer · Hyperion Labs"
    meta: "📍 Berlin, DE  ·  11y exp  ·  8.4k followers"
    rows:
      - label: "Work email"
        value: "m.reinhardt@hyperion.dev"
        verified: true
      - label: "Direct phone"
        value: "+49 30 ··· 41 92"
        verified: true
      - label: "GitHub"
        value: "@majareinhardt · 4.2k★"
      - label: "Google Scholar"
        value: "7 publications, h-index 5"
    tags:
      - "rust"
      - "llvm"
      - "compilers"
      - "open-source"
      - "de-en"
      - "staff+"
    footLeft: "1 of 23 matches · run by Hermes Agent"
    footRight: "Charged · ⚡ 412 sats · $0.04"
  resultLabel: "Hermes Agent skill result"
  resultMeta: "Enriched profile · JSON"
trust:
  items:
    - label: "Hermes spend per hit"
      stat: "$"
      statHighlight: "0.04"
      desc: "Charged only on a verified profile. Hermes Agent flow caps stop the skill cleanly."
    - label: "Coverage"
      stat: ""
      statHighlight: "800M+"
      desc: "Professionals indexed. 640M+ verified emails refreshed when Hermes calls the skill."
    - label: "Search quality"
      stat: ""
      statHighlight: "1187"
      statSuffix: "Elo"
      desc: "Top of the Pearch benchmark for natural-language people search — Hermes gets ranked, not random."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Add one skill to your Hermes Agent registry, paste the endpoint, ship. No vendor onboarding."
pipeline:
  eyebrow: "How Hermes Agent uses it"
  title:
    text: "One skill call. "
    highlight: "Verified contacts back."
  description: "Hermes Agent runs the planning loop; PayPerQ is the contact-data side of the call. Hermes expects skills to declare a clean input/output and a price per call — and that is exactly the shape of this endpoint."
  stages:
    - ix: "01 Plan"
      title: "Hermes Agent translates intent into a query."
      text: "Your flow reasons over the user's request and produces a one-sentence description of who to find. No prompt-engineering for boolean syntax."
    - ix: "02 Call"
      title: "Hermes hits one PayPerQ skill."
      text: "A single skill registration. Hermes passes the description, an optional limit, and an optional spend cap. Lightning settles per call when results return."
    - ix: "03 Use"
      title: "Hermes Agent consumes structured profiles."
      text: "Ranked JSON profiles flow back into the flow's state: name, role, verified email and phone, GitHub, Scholar, socials. Misses cost zero, so failed branches don't burn budget."
  foot:
    - label: "Best fit inside Hermes Agent"
      html: "Sales flows, recruiter bots, research agents — anywhere Hermes needs <b>fresh, verified contacts on demand</b>."
    - label: "Spend control"
      html: "Hermes Agent flow caps map 1:1 to PayPerQ's per-hit pricing. <b>Set a cap; the skill stops at the cap.</b>"
    - label: "Latency"
      html: "Median <b>0.8s</b> cached. <b>3–6s</b> for live agentic search. Hermes Agent can stream partial results."
benefits:
  eyebrow: "Why Hermes Agent + PayPerQ"
  title: "Designed for flow-level spend, not seat licensing."
  description: "Hermes Agent expects skills that declare cost and return structured data. Subscription enrichers force you to ignore both. PayPerQ ships exactly the shape Hermes Agent was built to consume."
  cards:
    - num: "01 / Native to Hermes Agent"
      title: "One skill to register."
      highlight: "That's the whole integration."
      text: "Register the endpoint in your Hermes Agent skill registry, declare the per-hit cost, and Hermes handles budget planning automatically. No middleware, no broker, no MCP wrapper to host."
      span: 3
      feature: true
    - num: "02 / Pay per flow run"
      title: "Hermes flows you only pay when they fire."
      highlight: "Idle runs cost zero."
      text: "Lightning micropayments mean a Hermes Agent flow that runs once a week costs the same per call as one that runs constantly. Scale flow fleets without flat-rate seat math."
      span: 3
      demo: |
        <div class="ln"><span class="gut">$</span><span><span class="kw">hermes</span> skill add payperq.enrich \</span></div>
        <div class="ln"><span class="gut"></span><span>  --endpoint api.payperq.io/v1/enrich \</span></div>
        <div class="ln"><span class="gut"></span><span>  --price-per-hit 0.04 --flow-budget 5.00</span></div>
        <div class="ln"><span class="gut"></span><span class="com"># Hermes stops the flow at the cap, no overage</span></div>
    - num: "03 / Verified, not stale"
      title: "Live data, every Hermes call."
      text: "Each enrichment pulls fresh signal so Hermes Agent isn't reasoning over a six-month-old DB row. Outreach plans built on this data don't bounce."
      span: 2
    - num: "04 / Structured for skill calls"
      title: "Ranked JSON, ready to use."
      text: "Hermes gets a clean shape: employment, email, phone, GitHub, Scholar, socials. No HTML scraping inside the flow, no glue code."
      span: 2
    - num: "05 / No persistent secret"
      title: "Lightning replaces the API key."
      text: "Hermes Agent can pay per call directly from a wallet, no long-lived API key to rotate or leak in flow logs."
      span: 2
useCases:
  eyebrow: "What Hermes Agent builders ship"
  title:
    text: "Real Hermes flows that "
    highlight: "rely on this skill."
  description: "Each pattern below is a single Hermes Agent flow with PayPerQ registered as one skill. The math works because the flow only spends when it actually finds a person."
  items:
    - who: "Hermes sales flow"
      title: "Outreach drafts from a one-line ICP."
      text: "A salesperson messages Hermes Agent a description of their ideal customer. The flow translates it into a query, calls PayPerQ, drafts personalized outreach per profile, and waits for human approval before sending."
      query: "Heads of RevOps at 200–800 person SaaS, hiring SDRs right now"
    - who: "Hermes recruiter bot"
      title: "Hyper-specific sourcing in one prompt."
      text: "Hermes Agent runs alongside a hiring manager and accepts criteria the way they'd describe candidates in a meeting. Each search burns ~$1; one good hire pays for thousands of flow runs."
      query: "Senior Rust devs in Berlin who shipped to a real-time compiler in the last year"
    - who: "Hermes research flow"
      title: "Auto-build target maps for any market."
      text: "A research-side Hermes Agent receives a market thesis, derives a list of target companies, then pulls verified founder/exec contacts. Results land in a doc with citations and per-profile spend logged."
      query: "Founders of B2B SaaS that closed seed in 2025"
    - who: "Hermes deal-disco bot"
      title: "Pipeline scouting on a schedule."
      text: "A scheduled Hermes flow watches funding announcements, pulls leadership contacts at fresh-funded companies, and drops a ranked list into your CRM each Monday. Pay per useful contact, not per platform seat."
      query: "VPs of Eng at companies that raised Series A in the last 14 days"
comparison:
  eyebrow: "Compared inside Hermes Agent"
  title: "Why flow builders pick this over <em>seat-based tools.</em>"
  description: "Hermes Agent is built around skills that report a price and return structured data. Subscription enrichers force you to wrap them in middleware and pretend per-seat pricing makes sense for a flow. PayPerQ doesn't."
  columns:
    us: "PayPerQ in Hermes Agent"
    a: "Subscription DB tools"
    b: "Credit-based enrichers"
  rows:
    - category: "Pricing model"
      us: "Per verified profile, per call"
      left: "Per seat / month"
      right: "Pre-purchased credit packs"
    - category: "Flow fit"
      us: "Native — skill reports cost"
      left: "Wrap in middleware"
      right: "Track credits in your code"
    - category: "Idle flow cost"
      us: "$0"
      left: "Full seat charge"
      right: "Credits expire"
    - category: "Query language"
      us: "Plain-English prompt"
      left: "Boolean / UI filters"
      right: "Filters + Chrome ext."
    - category: "Charged on miss"
      us: "No"
      left: "Yes (seat is fixed)"
      right: "Often yes"
    - category: "Setup in Hermes"
      us: "One skill registration"
      left: "Custom adapter required"
      right: "Custom adapter required"
flow:
  eyebrow: "Hermes Agent integration"
  title:
    text: "Four steps inside Hermes, "
    highlight: "then the flow runs."
  steps:
    - number: "01 Register"
      title: "Add the skill"
      text: "Register the PayPerQ endpoint as a single Hermes Agent skill. Declare its per-hit price so Hermes can plan around budget."
    - number: "02 Fund"
      title: "Plug a Lightning wallet"
      text: "Connect a wallet that Hermes Agent can spend from. Set a per-flow budget cap so a single run never blows past your limit."
    - number: "03 Prompt"
      title: "Describe who to find"
      text: "Your Hermes flow receives a goal, builds a one-sentence description, and calls the skill. No SDK, no auth juggling."
    - number: "04 Consume"
      title: "Use the structured profiles"
      text: "Ranked JSON profiles enter the Hermes Agent flow state. The flow drafts outreach, opens tickets, or hands off — whatever its goal is."
facts:
  eyebrow: "Hermes skill spec"
  title: "Wire it in once. Forget it's there."
  text: "Drop these values into Hermes Agent's skill registry and the flow is done with setup. Everything below maps directly to Hermes' skill manifest format."
  items:
    - label: "Skill endpoint"
      value: "POST api.ppq.ai/v1/data/api/clado/contacts-enrich"
    - label: "Auth"
      value: "Lightning per request — no API key needed"
    - label: "Input"
      value: "{ q: string, limit?: int, budget_usd?: float }"
    - label: "Output"
      value: "Ranked JSON profiles with verified email + phone"
    - label: "Per-hit price"
      value: "From $0.04 — declare in Hermes manifest"
    - label: "Spend control"
      value: "Hermes Agent flow caps enforced per run"
prompt:
  eyebrow: "Hermes Agent skill registration"
  title: "Drop this into your Hermes flow."
  text: "One skill, one endpoint, one price. Hermes Agent handles budget caps, retries, and result parsing. Replace the description and the flow is live."
  copyTarget: "hermes-prompt"
  buttonLabel: "Copy registration"
  code: |
    # Hermes Agent skill registration
    hermes skill add payperq.enrich \
      --endpoint https://api.ppq.ai/v1/data/api/clado/contacts-enrich \
      --method POST \
      --price-per-hit 0.04 \
      --pay-with lightning \
      --schema '{
        "q": "string  # natural-language description of the person",
        "limit": "int?  # max profiles to enrich",
        "budget_usd": "float?  # per-call spend cap"
      }'

    # In your Hermes Agent flow:
    # use payperq.enrich({ q: ICP_DESCRIPTION, limit: 25, budget_usd: 1.00 })
    # → returns ranked profiles with verified emails
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping seat licenses "
    highlight: "into your flows."
  text: "Register one skill, fund a few dollars in sats, and your Hermes Agent flow gets verified LinkedIn data on every relevant call. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Get an API key →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "Hermes Agent integration guide"
      href: "#endpoint"
  badges:
    - "Single Hermes skill"
    - "From $0.04 / verified profile"
    - "Lightning settles per run"
    - "Flow caps honored"
faq:
  eyebrow: "FAQ"
  title: "Hermes Agent specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with Hermes Agent builders, no SDR funnel."
  items:
    - question: "How does this register as a Hermes Agent skill?"
      answer: "It's a single POST endpoint with a typed body. You register it in Hermes the same way you'd register any HTTP skill — endpoint, schema, price-per-hit. Hermes Agent uses the price to plan flow budgets and to show the user what each run will cost before it fires."
      open: true
    - question: "Does Hermes Agent need a long-lived API key?"
      answer: "No. PayPerQ accepts Lightning-signed requests, so Hermes can pay per call from a wallet you connect. There's no shared secret to leak in flow logs or rotate every quarter."
    - question: "What happens when a Hermes flow hits its budget cap?"
      answer: "PayPerQ returns whatever it has resolved so far and stops. Hermes Agent treats this as a normal skill result so the flow can decide whether to ask the user for more budget or hand off with a partial answer."
    - question: "Can Hermes Agent call this concurrently across many flows?"
      answer: "Yes. 100 RPS per Lightning identity by default; we'll lift it on request. Concurrency-fair queueing means a noisy flow never starves another flow on the same key."
    - question: "How is this different from giving Hermes a Lusha or Apollo seat?"
      answer: "Subscriptions don't fit Hermes Agent's skill model. The skill can't report a true cost, so Hermes can't do real budget planning. PayPerQ reports an honest per-hit cost up front, which is what Hermes was designed to consume."
    - question: "Is the data compliant?"
      answer: "Yes. SOC 2 Type II, GDPR-aligned, opt-out registry honored, contractual restrictions on consumer-marketing use. Designed for B2B prospecting and recruiting flows."
footer:
  brand: "PayPerQ"
  suffix: "Contacts Enrich for Hermes Agent"
  tag: "© 2026 · Built for Hermes Agent · ⚡ Lightning native"
---
