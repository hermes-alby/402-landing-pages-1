---
layout: ../layouts/UseCasePage.astro
title: "CoinGecko API for Hermes Agent · Pay Per Call, Full Crypto Data"
description: "Wire CoinGecko market data into Hermes Agent. Live prices, historical OHLC, exchanges, NFT, on-chain DEX feeds — billed per call. No signup, no monthly plan, no API key."
bodyClass: "page-coingecko"
themeColor: "#0b0b0c"
ogTitle: "CoinGecko API for Hermes Agent — Pay Per Call Crypto Data"
ogDescription: "Full CoinGecko market data inside your Hermes Agent flow. One skill, billed per call, no API key wrangling."
schema:
  name: "CoinGecko via Locus for Hermes Agent"
  description: "Crypto market data skill for Hermes Agent flows — full CoinGecko coverage billed per call via x402."
  mainEntityName: "CoinGecko via Locus for Hermes Agent"
  mainEntityDescription: "Hermes Agent skill that returns live and historical crypto market data, exchange feeds, NFT, and on-chain DEX info."
  providerName: "Locus"
hero:
  ghostNumber: "HERMES"
  eyebrow: "Hermes Agent · Pay-per-call · No subscription"
  title:
    lines:
      - "Hermes Agent,"
      - "wired into"
    highlight: "every market."
  lead: "Drop CoinGecko via Locus into your Hermes Agent flow as a single skill. Token symbols and IDs go in, live prices, historical OHLC, exchange feeds, NFT, and on-chain DEX data come back, billed per call. The shape of the call matches Hermes Agent's skill contract — declare it once, then forget it."
  meta:
    - "Hermes-native skill — one POST"
    - "3M+ tokens, 12y of historical data"
    - "Per-flow budget caps respected"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "/logos/hermes.png"
      title: "Hermes Agent"
    service:
      eyebrow: "CoinGecko"
      logo: "/logos/coingecko.png"
      title: "Crypto Data API"
trust:
  items:
    - label: "Asset coverage"
      stat: ""
      statHighlight: "3M+"
      desc: "Tokens indexed across exchanges and on-chain sources — Hermes sees the full CoinGecko universe."
    - label: "Historical depth"
      stat: ""
      statHighlight: "12y"
      desc: "Up to 12 years of 5-minute OHLC for backtests, signal research, and historical context."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Add one skill to your Hermes Agent registry, declare per-call cost, ship. No CoinGecko account, no plan negotiation."
useCases:
  eyebrow: "What Hermes Agent builders ship"
  title:
    text: "Real Hermes flows that "
    highlight: "rely on this skill."
  description: "Each pattern below is a single Hermes Agent flow with CoinGecko via Locus registered as one skill. The math works because the flow only spends when it actually queries the market."
  items:
    - who: "Hermes trading flow"
      title: "Live prices, no human-managed key."
      text: "An autonomous trading or signal-generation flow fetches live prices and orderbook context from a single Hermes Agent skill call. No subscription tied to a billing entity, no rotating API key in flow logs — the flow self-onboards via MCP and pays per call from a connected wallet."
      query: "Live BTC/USD across the top 8 exchanges, 1h OHLC for the last 7 days"
    - who: "Hermes research flow"
      title: "Token diligence on demand."
      text: "A research-side Hermes flow receives a token name or contract address, pulls metadata, history, exchange listings, and on-chain liquidity, and assembles a report. Per-call billing keeps each diligence pass cheap; idle weeks cost zero."
      query: "Full report on $TOKEN: metadata, top exchanges, 90d OHLC, current DEX liquidity"
    - who: "Hermes portfolio assistant"
      title: "Daily portfolio summaries."
      text: "A Hermes flow runs on a cron, queries live prices and 24h moves for the user's holdings, and posts a summary to a chat surface. Days the user doesn't trade still cost nothing extra; high-volatility days scale predictably."
      query: "Live prices and 24h moves for 24 tokens in the user's portfolio"
    - who: "Hermes DeFi monitor"
      title: "Watch DEX liquidity for thresholds."
      text: "A scheduled Hermes flow pulls on-chain DEX data from the gateway and alerts when pool liquidity, volume, or token concentration crosses a threshold. The flow only spends when there's something to check."
      query: "Top 10 Uniswap pools by 24h volume — flag if any drop >30% week-over-week"
cta:
  eyebrow: "Hermes-ready in two minutes"
  title:
    text: "Stop wrapping CoinGecko plans "
    highlight: "into your flows."
  text: "Register one skill, connect a wallet, and your Hermes Agent flow gets the full CoinGecko feed on every relevant call. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
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
    - "Full CoinGecko coverage"
    - "Flow caps honored"
    - "MCP + x402 native"
faq:
  eyebrow: "FAQ"
  title: "Hermes Agent specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with Hermes Agent builders, no SDR funnel."
  items:
    - question: "How does this register as a Hermes Agent skill?"
      answer: "It's a standard POST endpoint with a typed body. You register it in Hermes the same way you'd register any HTTP skill — endpoint, schema, per-call price. Hermes Agent uses the price to plan flow budgets and to show the user what each run will cost before it fires."
      open: true
    - question: "Does Hermes Agent need a CoinGecko subscription or API key?"
      answer: "No. The gateway accepts x402-signed requests, so Hermes can pay per call from a wallet you connect. No CoinGecko account is created, and there's no shared API key to rotate or leak in flow logs."
    - question: "What happens when a Hermes flow hits its budget cap?"
      answer: "The skill returns whatever data it has resolved so far and Hermes stops issuing new calls. The flow can decide whether to ask the user for more budget or hand off with a partial answer."
    - question: "Can Hermes call this concurrently across many flows?"
      answer: "Yes. Per-key rate limits apply with concurrency-fair queueing — a noisy flow never starves another flow on the same key. Practical limits scale with the underlying CoinGecko Pro infrastructure."
    - question: "How is this different from giving Hermes a CoinGecko Pro subscription?"
      answer: "Subscriptions don't fit Hermes Agent's skill model. The skill can't report a true per-call cost, so Hermes can't do real budget planning. The gateway reports an honest per-call cost up front, which is what Hermes was designed to consume."
    - question: "Is the data the same as CoinGecko Pro?"
      answer: "Yes. The gateway proxies CoinGecko's Pro API directly, so coverage, freshness, and field shape match exactly."
footer:
  brand: "CoinGecko"
  suffix: "Crypto market data for Hermes Agent"
  tag: "© 2026 · Built for Hermes Agent"
---
