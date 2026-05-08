---
layout: ../layouts/UseCasePage.astro
title: "CoinGecko API · Pay Per Call, Full Crypto Market Data"
description: "Query CoinGecko's full crypto market data — prices, charts, exchanges, NFT, on-chain DEX — for 3M+ tokens. Billed per call. No subscription, no API key, no demo-tier rate limit."
bodyClass: "page-coingecko"
themeColor: "#0b0b0c"
ogTitle: "CoinGecko API — Pay Per Call, No Subscription"
ogDescription: "Full CoinGecko coverage — 3M+ tokens, prices, charts, exchanges, NFT, on-chain DEX — billed per request. Built for AI agents and developers."
schema:
  name: "CoinGecko via Locus"
  description: "Pay-per-call gateway to CoinGecko's full crypto market data API. Real-time and historical prices, charts, exchange data, NFT, and on-chain DEX feeds."
  mainEntityName: "CoinGecko via Locus"
  mainEntityDescription: "Full CoinGecko market data billed per call via x402 — no subscription, no API key."
  providerName: "Locus"
hero:
  ghostNumber: "3M+"
  eyebrow: "Pay-per-call · Full CoinGecko coverage · No subscription"
  title:
    lines:
      - "Every token,"
      - "every chart,"
    highlight: "one call."
  lead: "CoinGecko via Locus is a pay-per-call gateway to CoinGecko's full crypto market data — real-time and historical prices, market cap, exchanges, NFT floors, on-chain DEX feeds, and trending coins for 3M+ digital assets. Send a request, get the data, walk away. No $129–$499/month plan, no API key, no demo-tier rate cliff."
  meta:
    - "3M+ tokens, 12y of historical data"
    - "Prices · charts · exchanges · NFT · DEX"
    - "No signup, no API key"
    - "MCP + x402 native"
  connection:
    agent:
      eyebrow: "Your AI agent"
      logo: "Logo"
      title: "Any agent"
    service:
      eyebrow: "CoinGecko"
      logo: "/logos/coingecko.png"
      title: "Crypto Data API"
trust:
  items:
    - label: "Asset coverage"
      stat: ""
      statHighlight: "3M+"
      desc: "Tokens indexed across centralized exchanges, DEXs, and on-chain sources — the full CoinGecko universe."
    - label: "Historical depth"
      stat: ""
      statHighlight: "12y"
      desc: "Up to twelve years of OHLC data, granularity down to 5-minute candles. Backtests run, signals stay honest."
    - label: "Reliability"
      stat: ""
      statHighlight: "99.9%"
      statSuffix: "uptime"
      desc: "Same SOC-2 Type 2 infrastructure that powers wallets and exchanges. Production-ready, no vendor evaluation."
useCases:
  eyebrow: "Who it's for"
  title:
    text: "Built for teams that need crypto data "
    highlight: "without the plan-tier math."
  description: "Four shapes of customer who benefit most. If you recognize your workflow, the per-call model is in your favor."
  items:
    - who: "For AI agent builders"
      title: "Crypto data as just another tool call."
      text: "MCP discovery and x402 payment let an autonomous trading or research agent self-onboard at runtime. The agent fires a request, gets live prices or historical OHLC back, and moves on — no human-managed CoinGecko subscription anywhere in the loop."
      query: "Last 90 days of BTC and ETH 1h OHLC, plus current liquidity on the top 5 DEX pools"
    - who: "For crypto apps and wallets"
      title: "Pull token data without a Pro plan."
      text: "Wallets, portfolio trackers, and DeFi dashboards embed live prices, charts, and metadata through one endpoint. Per-call billing maps cleanly to per-user query patterns — bursts during market events scale linearly instead of hitting a rate cliff."
      query: "Live prices for the user's portfolio (24 tokens) plus 7d charts and 24h volume"
    - who: "For trading and quant workflows"
      title: "Backtest without committing to a plan."
      text: "Pull 12 years of 5-minute OHLC for any token in coverage. Evaluate whether the data fits your strategy with a tiny spend, then scale only if the signal works. No Analyst-tier upfront commitment."
      query: "5y of 5-minute OHLC for the top 20 large-caps + cross-exchange spread data"
    - who: "For research and content tools"
      title: "Embed live prices in newsletters, dashboards, and reports."
      text: "Crypto research products and dashboards surface market state without negotiating an enterprise contract. The endpoint becomes a primitive: one call returns the data, billed at the rate the product actually generates."
      query: "Top 50 trending coins in the last 24h with full metadata and 7d sparklines"
cta:
  eyebrow: "Start in two minutes"
  title:
    text: "Stop guessing your way "
    highlight: "up the plan ladder."
  text: "Connect a wallet, hit the endpoint, and your first chart lands a moment later. If you don't query for a month, you don't pay for the month. Same data CoinGecko ships at the Pro tier, billed per request instead. That's the entire deal."
  actions:
    - label: "Start"
      text: "Try a request →"
      href: "#"
      primary: true
    - label: "Docs"
      text: "Read the schema"
      href: "#"
  badges:
    - "Full CoinGecko coverage"
    - "No signup, no API key"
    - "MCP + x402 native"
    - "SOC-2 Type 2"
faq:
  eyebrow: "FAQ"
  title: "The honest answers."
  description: "If something below doesn't cover your case, ping us — we answer directly, no SDR funnel."
  items:
    - question: "What data does the gateway expose?"
      answer: "The full CoinGecko Pro API surface — live and historical prices, market cap, exchange feeds, on-chain DEX data, NFT collection floors, derivatives data, and trending coins for 3M+ digital assets. Same fields and conventions as the CoinGecko Pro docs."
      open: true
    - question: "Is the data different from CoinGecko's direct API?"
      answer: "No. The gateway proxies CoinGecko's Pro endpoints, so the data quality, coverage, and freshness match exactly. The only difference is the access shape: per-call billing instead of monthly tiers."
    - question: "Do I need a CoinGecko account or API key?"
      answer: "No. Authentication is per-request via x402. Connect a wallet, sign the request, get the data. No signup form, no key to rotate, no shared secret in agent logs."
    - question: "How does this compare to going direct on CoinGecko's plans?"
      answer: "Direct CoinGecko plans run Demo (free, 30 RPM, 10K calls/month) → Analyst at $129/month → Pro at $499/month → Enterprise on contract. The gateway charges per call instead, which fits better when traffic is bursty, when you don't want to commit during a build-out, or when an autonomous agent needs to call without a billing-entity-owned API key."
    - question: "Can autonomous AI agents use this?"
      answer: "Yes — that's a primary design point. The endpoint supports MCP discovery and x402 payment, so an autonomous agent can find it, call it, pay for it, and consume the response without a human creating an account."
    - question: "What about rate limits?"
      answer: "Per-key rate limits apply with concurrency-fair queueing — a noisy client never starves another client on the same key. Practical limits scale with the underlying CoinGecko Pro tier the gateway runs on, which is well above what individual agents typically need."
footer:
  brand: "CoinGecko"
  suffix: "Crypto market data"
  tag: "© 2026 · Built for agents"
---
