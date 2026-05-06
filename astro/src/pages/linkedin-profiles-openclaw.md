---
layout: ../layouts/UseCasePage.astro
title: "LinkedIn Profile Enrichment for OpenClaw · Pay Per Query | PayPerQ"
description: "Plug PayPerQ Contacts Enrich into OpenClaw. Natural-language LinkedIn search across 800M+ professionals, billed per verified profile via Lightning. No subscription, no API juggling."
bodyClass: "page-linkedin"
themeColor: "#0b0b0c"
ogTitle: "LinkedIn Profile Enrichment for OpenClaw — Pay Per Query"
ogDescription: "Verified emails, GitHub, Scholar, full LinkedIn data inside your OpenClaw agent. One tool, one endpoint, billed per verified profile via Lightning."
schema:
  name: "PayPerQ LinkedIn Profile Enrichment for OpenClaw"
  description: "Pay-per-query LinkedIn enrichment API designed for OpenClaw agents. Natural-language search across 800M+ professionals."
  mainEntityName: "PayPerQ Contacts Enrich for OpenClaw"
  mainEntityDescription: "OpenClaw-ready enrichment endpoint that turns plain-English prompts into ranked, verified LinkedIn profiles."
  providerName: "PayPerQ"
hero:
  ghostNumber: "OPEN"
  eyebrow: "OpenClaw · Pay-per-query · No subscription"
  title:
    lines:
      - "OpenClaw, meet"
      - "every prospect."
    highlight: "Paid per result."
  lead: "Drop PayPerQ Contacts Enrich into your OpenClaw agent as a single tool call. Plain-English prompts go in, ranked verified LinkedIn profiles come out, billed per hit via Lightning. No SDK, no API key wrangling, no monthly seat for your agent to forget about."
  actions:
    - label: "Wire it up"
      text: "Add to OpenClaw"
      href: "#prompt"
      primary: true
    - label: "Inspect"
      text: "See the call"
      href: "#endpoint"
      monoTag: "tool"
  meta:
    - "Single OpenClaw tool — one POST"
    - "From $0.04 per verified profile"
    - "Budget caps honored per run"
    - "No persistent API key required"
  promptLabel: "OpenClaw prompt"
  promptText: "Find senior Rust engineers in Berlin who shipped open-source compilers, with verified work emails. Cap spend at $1."
  profile:
    initials: "MR"
    brand: "openclaw"
    brandSuffix: "tool · payperq"
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
    footLeft: "1 of 23 matches · run by OpenClaw"
    footRight: "Charged · ⚡ 412 sats · $0.04"
  resultLabel: "OpenClaw tool result"
  resultMeta: "Enriched profile · JSON"
trust:
  items:
    - label: "OpenClaw spend per hit"
      stat: "$"
      statHighlight: "0.04"
      desc: "Charged only on a verified profile. OpenClaw budget caps cut off automatically."
    - label: "Coverage"
      stat: ""
      statHighlight: "800M+"
      desc: "Professionals indexed. 640M+ verified emails refreshed when your agent calls."
    - label: "Search quality"
      stat: ""
      statHighlight: "1187"
      statSuffix: "Elo"
      desc: "Top of the Pearch benchmark for natural-language people search — your agent gets ranked, not random."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Register one tool in OpenClaw, paste the endpoint, ship. No vendor onboarding."
pipeline:
  eyebrow: "How OpenClaw uses it"
  title:
    text: "One tool call. "
    highlight: "Verified contacts back."
  description: "OpenClaw orchestrates the agent loop; PayPerQ is the contact-data side of the call. The two fit together because OpenClaw expects tools to declare a clear input/output and a price per call — and that is exactly the shape of this endpoint."
  stages:
    - ix: "01 Plan"
      title: "OpenClaw turns the goal into a query."
      text: "Your agent reasons over the user's request and produces a one-sentence description of who to find. No prompt-engineering for boolean syntax."
    - ix: "02 Call"
      title: "OpenClaw hits one PayPerQ tool."
      text: "A single tool registration. OpenClaw passes the description, an optional limit, and an optional spend cap. Lightning settles per call when results return."
    - ix: "03 Use"
      title: "OpenClaw consumes structured profiles."
      text: "Ranked JSON profiles flow back into the agent's context: name, role, verified email and phone, GitHub, Scholar, socials. Misses cost zero so failed branches don't burn budget."
  foot:
    - label: "Best fit inside OpenClaw"
      html: "Sales agents, recruiter copilots, research bots — anywhere OpenClaw needs <b>fresh, verified contacts on demand</b>."
    - label: "Spend control"
      html: "OpenClaw budget caps map 1:1 to PayPerQ's per-hit pricing. <b>Set a cap; the tool stops at the cap.</b>"
    - label: "Latency"
      html: "Median <b>0.8s</b> cached. <b>3–6s</b> for live agentic search. OpenClaw can stream partial results."
benefits:
  eyebrow: "Why OpenClaw + PayPerQ"
  title: "Built for agentic spend, not seat licensing."
  description: "OpenClaw expects tools that declare cost and return structured data. Subscription enrichers force you to ignore both. PayPerQ ships exactly the shape OpenClaw was designed for."
  cards:
    - num: "01 / Native to OpenClaw"
      title: "One tool to register."
      highlight: "That's the whole integration."
      text: "Register the endpoint as a tool, declare the per-hit cost, and OpenClaw handles budget enforcement automatically. No middleware, no broker, no MCP server to host."
      span: 3
      feature: true
    - num: "02 / Pay per agent run"
      title: "OpenClaw runs you billed."
      highlight: "Idle runs cost zero."
      text: "Lightning micropayments mean an OpenClaw agent that runs once a week costs the same per call as one that runs constantly. Scale agent fleets without flat-rate seat math."
      span: 3
      demo: |
        <div class="ln"><span class="gut">$</span><span><span class="kw">openclaw</span> tool register payperq.enrich \</span></div>
        <div class="ln"><span class="gut"></span><span>  --endpoint api.payperq.io/v1/enrich \</span></div>
        <div class="ln"><span class="gut"></span><span>  --price-per-hit 0.04 --budget-per-run 5.00</span></div>
        <div class="ln"><span class="gut"></span><span class="com"># OpenClaw stops the agent at the cap, no overage</span></div>
    - num: "03 / Verified, not stale"
      title: "Live data, every OpenClaw call."
      text: "Each enrichment pulls fresh signal so OpenClaw isn't reasoning over a six-month-old DB row. Outreach plans built on this data don't bounce."
      span: 2
    - num: "04 / Structured for tool calls"
      title: "Ranked JSON, ready to consume."
      text: "OpenClaw gets a clean shape: employment, email, phone, GitHub, Scholar, socials. No HTML scraping inside the agent loop, no glue code."
      span: 2
    - num: "05 / No persistent secret"
      title: "Lightning replaces the API key."
      text: "OpenClaw can pay per call directly from a wallet, no long-lived API key to rotate or leak in agent logs."
      span: 2
useCases:
  eyebrow: "What OpenClaw builders ship"
  title:
    text: "Real OpenClaw agents that "
    highlight: "rely on this tool."
  description: "Each pattern below is a single OpenClaw agent with PayPerQ registered as one tool. The math works because the agent only spends when it actually finds a person."
  items:
    - who: "OpenClaw sales agent"
      title: "Self-driving prospecting from a Slack message."
      text: "A salesperson messages OpenClaw a description of their ICP. The agent translates it into a query, calls PayPerQ, drafts personalized outreach per profile, and waits for human approval before sending. No CRM seat, no list-building tool."
      query: "Heads of RevOps at 200–800 person SaaS, hiring SDRs right now"
    - who: "OpenClaw recruiter copilot"
      title: "Hyper-specific sourcing on demand."
      text: "OpenClaw runs alongside a hiring manager and accepts criteria the way they'd describe candidates in a meeting. Each search burns ~$1; one good hire pays for thousands of agent runs."
      query: "Senior Rust devs in Berlin who shipped to a real-time compiler in the last year"
    - who: "OpenClaw research bot"
      title: "Auto-build target maps for any market."
      text: "A research-side OpenClaw agent receives a market thesis, derives a list of target companies, then pulls verified founder/exec contacts. Results land in a doc with citations and per-profile spend logged."
      query: "Founders of B2B SaaS that closed seed in 2025"
    - who: "OpenClaw event scout"
      title: "Find attendees you actually want to meet."
      text: "Point OpenClaw at a conference page or speaker list, ask for adjacent practitioners, and have it return verified emails for warm pre-event outreach. Pay per useful contact, not per platform seat."
      query: "Speakers and attendees with 'platform engineering' titles at KubeCon EU"
comparison:
  eyebrow: "Compared inside OpenClaw"
  title: "Why agent builders pick this over <em>seat-based tools.</em>"
  description: "OpenClaw is built around tools that report a price and return structured data. Subscription enrichers force you to wrap them in middleware and pretend per-seat pricing makes sense for an agent. PayPerQ doesn't."
  columns:
    us: "PayPerQ in OpenClaw"
    a: "Subscription DB tools"
    b: "Credit-based enrichers"
  rows:
    - category: "Pricing model"
      us: "Per verified profile, per call"
      left: "Per seat / month"
      right: "Pre-purchased credit packs"
    - category: "Agent fit"
      us: "Native — tool reports cost"
      left: "Wrap in middleware"
      right: "Track credits in your code"
    - category: "Idle agent cost"
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
    - category: "Setup in OpenClaw"
      us: "One tool registration"
      left: "Custom adapter required"
      right: "Custom adapter required"
flow:
  eyebrow: "OpenClaw integration"
  title:
    text: "Four steps inside OpenClaw, "
    highlight: "then the agent runs."
  steps:
    - number: "01 Register"
      title: "Add the tool"
      text: "Register the PayPerQ endpoint as a single OpenClaw tool. Declare its per-hit price so OpenClaw can plan around budget."
    - number: "02 Fund"
      title: "Plug a Lightning wallet"
      text: "Connect a wallet that OpenClaw can spend from. Set a per-run budget cap so the agent never blows past your limit."
    - number: "03 Prompt"
      title: "Describe who to find"
      text: "Your OpenClaw agent receives a goal, builds a one-sentence description, and calls the tool. No SDK, no auth juggling."
    - number: "04 Consume"
      title: "Use the structured profiles"
      text: "Ranked JSON profiles enter OpenClaw's context. The agent drafts outreach, opens tickets, or hands off — whatever its goal is."
facts:
  eyebrow: "OpenClaw tool spec"
  title: "Wire it in once. Forget it's there."
  text: "Drop these values into OpenClaw's tool registration and the agent is done with setup. Everything below is documented in the OpenClaw tool manifest format."
  items:
    - label: "Tool endpoint"
      value: "POST api.ppq.ai/v1/data/api/clado/contacts-enrich"
    - label: "Auth"
      value: "Lightning per request — no API key needed"
    - label: "Input"
      value: "{ q: string, limit?: int, budget_usd?: float }"
    - label: "Output"
      value: "Ranked JSON profiles with verified email + phone"
    - label: "Per-hit price"
      value: "From $0.04 — declare in OpenClaw manifest"
    - label: "Spend control"
      value: "OpenClaw budget caps enforced per run"
prompt:
  eyebrow: "OpenClaw tool registration"
  title: "Drop this into your OpenClaw agent."
  text: "One tool, one endpoint, one price. OpenClaw handles budget caps, retries, and result parsing. Replace the description and you're live."
  copyTarget: "openclaw-prompt"
  buttonLabel: "Copy registration"
  code: |
    # OpenClaw tool registration
    openclaw tool register payperq.enrich \
      --endpoint https://api.ppq.ai/v1/data/api/clado/contacts-enrich \
      --method POST \
      --price-per-hit 0.04 \
      --pay-with lightning \
      --schema '{
        "q": "string  # natural-language description of the person",
        "limit": "int?  # max profiles to enrich",
        "budget_usd": "float?  # per-call spend cap"
      }'

    # In your OpenClaw agent prompt:
    # "Use payperq.enrich to find {ICP_DESCRIPTION}. Cap spend at $1.
    #  Return ranked profiles with verified emails."
cta:
  eyebrow: "OpenClaw-ready in two minutes"
  title:
    text: "Stop wrapping seat licenses "
    highlight: "into your agent."
  text: "Register one tool, fund a few dollars in sats, and your OpenClaw agent gets verified LinkedIn data on every relevant call. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
  actions:
    - label: "Start"
      text: "Get an API key →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "OpenClaw integration guide"
      href: "#endpoint"
  badges:
    - "Single OpenClaw tool"
    - "From $0.04 / verified profile"
    - "Lightning settles per run"
    - "Budget caps honored"
faq:
  eyebrow: "FAQ"
  title: "OpenClaw-specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with OpenClaw builders, no SDR funnel."
  items:
    - question: "How does this register as an OpenClaw tool?"
      answer: "It's a single POST endpoint with a typed body. You register it in OpenClaw the same way you'd register any HTTP tool — endpoint, schema, price-per-hit. OpenClaw uses the price to enforce budget caps and to show the user what each agent run will cost before it runs."
      open: true
    - question: "Does OpenClaw need a long-lived API key?"
      answer: "No. PayPerQ accepts Lightning-signed requests, so OpenClaw can pay per call from a wallet you connect. There's no shared secret to leak in agent logs or rotate every quarter."
    - question: "What happens when an OpenClaw run hits its budget cap?"
      answer: "PayPerQ returns whatever it has resolved so far and stops. OpenClaw treats this as a normal tool result so the agent can decide whether to ask the user for more budget or hand off with a partial answer."
    - question: "Can OpenClaw call this concurrently across many agents?"
      answer: "Yes. 100 RPS per Lightning identity by default; we'll lift it on request. Concurrency-fair queueing means a noisy agent never starves another agent on the same key."
    - question: "How is this different from giving OpenClaw a Lusha or Apollo seat?"
      answer: "Subscriptions don't fit OpenClaw's tool model. The tool can't report a true cost, so OpenClaw can't do real budget planning. PayPerQ reports an honest per-hit cost up front, which is what OpenClaw was designed to consume."
    - question: "Is the data compliant?"
      answer: "Yes. SOC 2 Type II, GDPR-aligned, opt-out registry honored, contractual restrictions on consumer-marketing use. Designed for B2B prospecting and recruiting agents."
footer:
  brand: "PayPerQ"
  suffix: "Contacts Enrich for OpenClaw"
  tag: "© 2026 · Built for OpenClaw · ⚡ Lightning native"
---
