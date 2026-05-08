## Service

### Description
DeepL via Locus is a pay-per-call gateway to DeepL's professional translation and DeepL Write APIs — high-quality machine translation across 30+ languages, with formality control, glossary support, and document translation that preserves formatting. Calls go through Locus's micropayment proxy, so developers and AI agents get DeepL Pro-tier output without the $5.49/month subscription, character-block prepayment, or API key rotation.

### USPs
- **DeepL Pro quality, no monthly plan:** Same translations as DeepL's Pro API — higher fidelity than Google Translate on European languages — billed per request.
- **No signup, no API key:** x402 / pay-per-request authentication, so an autonomous agent can translate without a human-managed DeepL account.
- **Agent-native rails:** MCP-discoverable and x402-priced, designed to drop into AI workflows that need translation as just another tool call.

### Keywords
- DeepL API
- pay-per-call translation API
- AI agent translation
- machine translation API
- DeepL Write API
- text rephrasing API
- multilingual content API

### Eyebrow Text
The pay-as-you-go way for AI agents and developers to call DeepL's translation engine without a subscription.

### Headline
Professional Translation API That Helps Developers and Agents Localize Content Without a Monthly Plan

### Subheadline
DeepL via Locus lets developers, content tools, and AI agents translate between 30+ languages with DeepL Pro–tier quality — so they can ship multilingual features without committing to a DeepL API Pro subscription, prepaying character blocks, or wrapping translation behind enterprise contracts.

### Key Benefit Bullets
- Translate 30+ languages with DeepL Pro–grade quality
- Use DeepL Write to rephrase, formalize, or shorten copy
- Skip subscription tiers and prepaid character packs
- Plug into AI agents via MCP and x402, no API key
- Document translation that preserves Word, PDF, PowerPoint, HTML formatting


## Core Benefits Section

### Headline
Everything You Need to Translate and Rephrase Content on Demand

### Benefit 1: DeepL Pro Quality on Every Request
The endpoint returns the same translations as DeepL's Pro API — the engine that consistently outperforms Google Translate on European-language pairs in independent benchmarks. No quality drop-off between the consumer product, DeepL Pro, and the API access through this gateway.

### Benefit 2: Pay Per Translation, Not Per Plan
DeepL's own API ladder requires a $5.49/month subscription floor plus per-character billing. Per-call billing through Locus collapses that to one shape: one request, one charge. A SaaS product that translates a few hundred strings a week and a content pipeline running millions use the same pricing — no upgrade tiers, no character-block prepayment, no rollover rules.

### Benefit 3: Translation as a Tool Call, Not a Subscription
The endpoint is MCP-discoverable and x402-priced, so an autonomous agent can find it, call it, pay for it, and continue without a human onboarding step. No long-lived API key in agent logs; no DeepL account to provision per agent; no enterprise sales loop to enable production rate limits.

### Benefit 4: Formality, Glossaries, and Document Mode
The full DeepL feature set is available through the gateway: formality control (formal/informal register, critical for German, French, Spanish, Japanese), glossary support for brand terms and product names, and document translation that preserves the original Word, PDF, PowerPoint, or HTML structure. DeepL Write endpoints for rephrasing and tone adjustment are exposed too.

### Benefit 5: One Endpoint, Every Language Pair
Translate between any of DeepL's 30+ supported languages through the same gateway, with consistent request shape. Source-language detection is automatic when omitted; target language is the only required field. Your code references one base URL regardless of locale.


## Use Cases / Who It Is For

### Headline
Built for Teams That Need Professional Translation Without the Subscription Math

### Use Case 1: For AI Agent Builders
A multilingual support agent, research bot, or content-curation agent translates text inline as a tool call — no human-managed DeepL account, no API key rotation. MCP discovery and x402 payment let the agent self-onboard at runtime; per-call billing keeps spend tied to actual translation volume rather than a flat monthly fee.

### Use Case 2: For SaaS and Content Tools
A CMS, marketing tool, or chat product offers translation features (auto-localize posts, translate inbound messages, generate multi-language variants) without negotiating a DeepL API Pro contract. Per-call pricing maps cleanly to per-user usage, so free-tier traffic doesn't burn a flat-rate plan and high-volume customers scale linearly.

### Use Case 3: For Localization and Documentation Teams
Tech writers and localization engineers translate Markdown, Word, and HTML docs with DeepL's format-preserving document mode. Glossary support keeps brand terminology consistent across releases. Pay only for the docs that actually need translation in a given sprint.

### Use Case 4: For Customer Support and Operations
Inbound multilingual messages get translated to a support agent's language and replies translated back, all routed through one endpoint with formality control. Per-call billing aligns spend with ticket volume — a quiet week costs proportionally less, a viral support moment scales without plan upgrades.


## Research

## Summary
Developers and AI agents searching for translation APIs face a market split between subscription products (DeepL API Pro at $5.49/month + $25 per million characters; Google Cloud Translation at $20/M characters with a free tier; Microsoft Translator at $10/M characters; Amazon Translate at $15/M) and DIY open-source models (NLLB, M2M-100) that require infrastructure. DeepL's reputation for European-language quality is well-established — it ranks #1 in 65% of language pairs in independent benchmarks like Intento — but the access model assumes a billing-entity-owned API key.

The strongest unmet demand comes from three groups: AI agent builders who need translation as a tool call without seat licensing, SaaS products that want to embed translation features without committing to monthly minimums, and content/localization teams whose workloads spike around release cycles and don't fit a flat plan. Search intent clusters around "DeepL API," "translation API for developers," "AI translation API," "pay-per-use translation," and "DeepL alternatives without subscription." The intersection — DeepL Pro quality with per-call billing and agent-native auth — is what DeepL via Locus occupies.

### Similar Services
- **DeepL API Pro direct** — $5.49/month + $25/M characters; same data, different access shape and a monthly base fee.
- **Google Cloud Translation** — $20/M (NMT) or $10+$10/M (LLM mode); broader language coverage (130+) but lower European-language fidelity than DeepL.
- **Microsoft Translator** — $10/M characters; strong enterprise features, more languages than DeepL.
- **Amazon Translate** — $15/M characters; AWS-native, designed for AWS-shaped workloads.
- **ModernMT** — Adaptive MT with custom-domain training; subscription pricing.
- **Open-source models (NLLB, M2M-100)** — Free in compute, but you operate the inference stack.

### User Reviews & Market Signal
- DeepL is consistently ranked #1 for European-language translation quality (German, French, Spanish, Italian, Polish, Portuguese, Dutch) in independent benchmarks.
- Recurring complaints in developer reviews: the $5.49/month base subscription floor for the DeepL API Pro plan friction-blocks light or experimental usage, and the prepaid character-block model means leftover credits expire if usage drops.
- AI-agent builders mention specifically that translation is a high-frequency, low-amortized-cost tool call where flat-rate plans don't fit — they want per-call billing to budget against agent runs.

## Your recommendation
The landing page should lead with the **pay-per-call, no-subscription angle** combined with **DeepL Pro-tier quality and the agent-native MCP+x402 shape.** Here's why:

1. **Pain point alignment:** The biggest complaints in the category are the monthly subscription floor, prepaid character blocks that don't roll over, and the friction of wiring translation into autonomous agents. Per-call billing on top of DeepL's feed removes all three.

2. **Keyword strategy:** Target "DeepL API" (high commercial intent, branded) and "translation API for developers," "pay-per-use translation API," and "AI agent translation" (specific, intent-rich). The "no subscription" angle captures searches like "DeepL without subscription" and "translation API without monthly fee."

3. **Conversion reasoning:** SaaS builders, agent developers, and localization teams are commitment-averse. Leading with "DeepL quality, billed per request" removes the largest barrier to trial. The agent-native angle differentiates from every other DeepL access path because no other route exposes DeepL as an MCP/x402 tool.

4. **Trust signals:** DeepL's repeated #1 ranking in independent translation-quality benchmarks gives concrete credibility that holds up against Google Translate, Microsoft Translator, and Amazon Translate positioning. The Locus gateway adds per-call billing without changing the underlying translation quality story.
