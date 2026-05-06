---
layout: ../layouts/UseCasePage.astro
title: "LinkedIn Profile Enrichment API · Pay Per Query, No Subscription | PayPerQ"
description: "Find and enrich LinkedIn profiles across 800M+ professionals with natural-language search. Pay per verified profile via Lightning. No subscription, no credit packs, no contracts."
bodyClass: "page-linkedin"
themeColor: "#0b0b0c"
ogTitle: "LinkedIn Profile Enrichment API — Pay Per Query, No Subscription"
ogDescription: "Verified emails, GitHub, Scholar, and full LinkedIn data from 800M+ profiles. One endpoint, billed per verified profile via Lightning. Built for agents."
schema:
  name: "PayPerQ LinkedIn Profile Enrichment API"
  description: "Pay-per-query LinkedIn profile search and enrichment API with natural-language search across 800M+ professionals."
  mainEntityName: "PayPerQ Contacts Enrich"
  mainEntityDescription: "Search and enrich LinkedIn profiles via natural-language queries; billed per verified profile via Lightning micropayments."
  providerName: "PayPerQ"
hero:
  ghostNumber: "800M"
  eyebrow: "Pay-per-query · No subscription"
  title:
    lines:
      - "Find anyone."
      - "Pay only"
    highlight: "per result."
  lead: "PayPerQ Contacts Enrich is a natural-language people search and profile enrichment API across 800M+ professionals. Send a query, get verified emails and full profiles back — billed per call via Lightning. No seats, no credit packs, no contracts."
  actions:
    - label: "Start"
      text: "Get an API key"
      href: "#start"
      primary: true
    - label: "Try"
      text: "Try a query"
      href: "#prompt"
      monoTag: "curl"
  meta:
    - "From $0.04 / verified profile"
    - "Lightning settlement, sub-second"
    - "Charged only on a hit"
    - "No monthly minimums"
  promptLabel: "Prompt"
  promptText: "Senior Rust engineers in Berlin who've shipped open-source compilers, with a verified work email."
  profile:
    initials: "MR"
    brand: "payperq"
    brandSuffix: "enrich"
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
    footLeft: "1 of 23 matches"
    footRight: "Charged · ⚡ 412 sats · $0.04"
  resultLabel: "Result"
  resultMeta: "Enriched profile · JSON"
trust:
  items:
    - label: "Pay only on a hit"
      stat: "$"
      statHighlight: "0.04"
      desc: "Per verified profile, settled via Lightning. Misses cost zero. No seats, no minimums."
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
pipeline:
  eyebrow: "What it does"
  title:
    text: "A people-search API your "
    highlight: "agent can actually use."
  description: "Most enrichment vendors sell seats and dashboards. PayPerQ sells a single endpoint and walks away. Drop it into a workflow, pay per call, never sign a contract. The interface is intentionally narrow so the trade-off is obvious: this is for focused result extraction, not for replacing your CRM."
  stages:
    - ix: "01 Describe"
      title: "You write a sentence, not a filter tree."
      text: "Plain-English intent. No boolean syntax, no Sales Navigator, no Chrome extension hovering on top of someone else's UI."
    - ix: "02 Resolve"
      title: "An agent searches 800M+ profiles in real time."
      text: "The model interprets intent, expands signals, and re-verifies fresh data each call — no replaying a six-month-old DB row."
    - ix: "03 Return"
      title: "Verified profiles, charged only on a hit."
      text: "One JSON object per match: employer, role, verified email and phone, GitHub, Scholar, socials. Misses cost zero."
  foot:
    - label: "Best fit"
      html: "Sales prospecting agents, recruiter copilots, and SaaS products that need fresh contact data <b>only when a workflow asks for it</b>."
    - label: "Pricing rule"
      html: "Per verified profile, settled via Lightning at completion. <b>Unmatched and stale records are not charged.</b>"
    - label: "Latency"
      html: "Median <b>0.8s</b> for cached profiles. <b>3–6s</b> for fully live agentic search. Streaming supported."
benefits:
  eyebrow: "Why it converts"
  title: "Everything you need to find and enrich a real human, nothing else."
  description: "Five capabilities, scoped to the contact-discovery problem. No CRM, no dialer, no inbox — just clean data your stack can use, priced like an API call should be."
  cards:
    - num: "01 / Natural language search"
      title: "Describe who you want."
      highlight: "Skip the boolean."
      text: "The model interprets intent, not keywords. \"Heads of supply chain at mid-market apparel brands in Germany\" resolves to a ranked list, no Sales Navigator gymnastics required."
      span: 3
      feature: true
    - num: "02 / Pay per query"
      title: "One call, one charge."
      highlight: "That's it."
      text: "Lightning micropayments mean zero commitment, no monthly minimum, no expiring credits. Scale from 1 query to 10,000 without changing plans — or paying when you're not running."
      span: 3
      demo: |
        <div class="ln"><span class="gut">$</span><span><span class="kw">curl</span> -X POST api.payperq.io/v1/enrich \</span></div>
        <div class="ln"><span class="gut"></span><span>  -d <span class="str">'{ "q": "VPs of Eng at Series B fintechs" }'</span></span></div>
        <div class="ln"><span class="gut"></span><span class="com"># charged on completion · 412 sats · $0.04</span></div>
    - num: "03 / Verified, not stale"
      title: "Live data, every call."
      text: "Each enrichment pulls fresh signal — current employer, current email — instead of replaying a six-month-old DB row."
      span: 2
    - num: "04 / One unified profile"
      title: "LinkedIn, Git, Scholar — one shape."
      text: "One call returns the whole picture: employment, verified email, GitHub, Scholar, X — merged into a single JSON object ready for your CRM."
      span: 2
    - num: "05 / Developer first"
      title: "REST in. JSON out."
      text: "No SDK to install, no webhooks to wire. Works with any language, any platform. Auth is a single header, billing is a single endpoint."
      span: 2
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
comparison:
  eyebrow: "Compared"
  title: "A different shape from <em>everything else</em> on the shelf."
  description: "Subscription tools assume you'll burn enough credits each month to justify the seat. PayPerQ doesn't. The trade-off shows up cleanly when you put the categories side-by-side."
  columns:
    us: "PayPerQ Enrich"
    a: "Subscription DB tools"
    b: "Credit-based enrichers"
  rows:
    - category: "Pricing"
      us: "~$0.04 per verified profile"
      left: "$49–$2k+ / month, per seat"
      right: "Pre-purchased credit packs"
    - category: "Commitment"
      us: "None — per call"
      left: "Annual contract typical"
      right: "Monthly, credits expire"
    - category: "Query language"
      us: "Plain English"
      left: "Boolean filters / UI"
      right: "Filters + Chrome ext."
    - category: "Charged on miss?"
      us: "No"
      left: "Yes (seat is fixed)"
      right: "Often yes"
    - category: "Data freshness"
      us: "Live agentic crawl per call"
      left: "Indexed DB, weeks stale"
      right: "Mixed"
    - category: "Time to first call"
      us: "~2 min — key + curl"
      left: "Sales call required"
      right: "Signup + onboarding"
flow:
  eyebrow: "Payment flow"
  title:
    text: "Four steps, "
    highlight: "then it just works."
  steps:
    - number: "01 Connect"
      title: "Get an API key"
      text: "Sign up with email or wallet. No credit card; no minimums. The dashboard hands you a key immediately."
    - number: "02 Fund"
      title: "Top up with Lightning"
      text: "Send sats to your endpoint balance, or connect a wallet that pays per request. Set a budget cap so the agent stays inside its lane."
    - number: "03 Query"
      title: "POST a description"
      text: "One endpoint, one body field: describe who you're looking for. Optional fields constrain region, seniority, count."
    - number: "04 Receive"
      title: "Verified profiles back"
      text: "Enriched JSON profiles, ranked by match. Charged only for verified hits. Refund automatically issued for stale rows."
facts:
  eyebrow: "Endpoint"
  title: "One URL. One body field. Honest defaults."
  text: "Everything an agent needs to call the API correctly on the first try. No hidden flags, no rate-limit surprises buried in a sales contract."
  items:
    - label: "Endpoint"
      value: "POST api.ppq.ai/v1/data/api/clado/contacts-enrich"
    - label: "Auth"
      value: "Lightning per request · API key optional"
    - label: "Input"
      value: "Natural-language query (q) · optional filters"
    - label: "Output"
      value: "Ranked JSON profiles · verified email + phone"
    - label: "Cost"
      value: "From $0.04 per verified profile · charged only on a hit"
    - label: "Rate limit"
      value: "100 RPS per key by default · concurrency-fair"
prompt:
  eyebrow: "Try it"
  title: "Send your first query."
  text: "Replace the description, set a budget cap, and run. The body is one field — no SDK, no auth dance."
  copyTarget: "linkedin-prompt"
  buttonLabel: "Copy curl"
  code: |
    curl -X POST https://api.ppq.ai/v1/data/api/clado/contacts-enrich \
      -H "Content-Type: application/json" \
      -d '{
        "q": "Senior Rust engineers in Berlin who shipped open-source compilers, with a verified work email",
        "limit": 25,
        "budget_usd": 1.00
      }'

    # Response: ranked JSON profiles
    # Charged only for verified hits · Lightning settlement on completion
cta:
  eyebrow: "Start in two minutes"
  title:
    text: "Stop paying for a seat "
    highlight: "you barely use."
  text: "Get a key, fund a few dollars in sats, and your first enriched profile lands in under a minute. If you don't use the API for a month, you don't pay for the month. That's the entire deal."
  actions:
    - label: "Start"
      text: "Get an API key →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "Read the 3-min docs"
      href: "#endpoint"
  badges:
    - "From $0.04 / verified profile"
    - "~412 sats per hit"
    - "Charged only on a hit"
    - "SOC 2 Type II"
faq:
  eyebrow: "FAQ"
  title: "The honest answers."
  description: "If something below doesn't cover your case, ping us — we answer directly, no SDR funnel."
  items:
    - question: "What does \"pay per query\" actually mean?"
      answer: "You're billed per verified profile returned. If a query produces zero matches, you're charged zero. If it returns ten, you're charged ten times the per-profile rate. There is no monthly fee, no minimum, and no seat. Settlement is via Lightning at request completion."
      open: true
    - question: "Where does the data come from?"
      answer: "A combination of our own crawl, partner data, and live agentic verification. We index 800M+ professional profiles and 640M+ verified email records, then re-verify on demand to filter stale data before it reaches you."
    - question: "Do I need a Lightning wallet?"
      answer: "Not strictly. You can fund your account with a card and we'll convert; or you can plug a wallet directly and pay per call with no balance. Lightning is the rail; the on-ramp is your call."
    - question: "Is this compliant?"
      answer: "Yes. SOC 2 Type II, GDPR-aligned data handling, opt-out registry, and contractual restrictions on consumer-marketing use. Enrichment is for B2B prospecting and recruiting workflows."
    - question: "How is this different from Apollo, ZoomInfo, Lusha?"
      answer: "Those are subscription products with seats, contracts, and dashboards. PayPerQ is one endpoint billed per call. If you live inside a CRM and need a UI, those are the right tools. If you live inside an agent, a script, or a SaaS, an API priced per result is a better shape."
    - question: "What's the rate limit?"
      answer: "100 RPS per key by default; we'll lift it on request. Concurrency-fair queueing means a noisy neighbor never starves your key."
footer:
  brand: "PayPerQ"
  suffix: "Contacts Enrich"
  tag: "© 2026 · Built for agents · ⚡ Lightning native"
---
