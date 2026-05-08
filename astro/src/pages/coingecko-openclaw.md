---
layout: ../layouts/UseCasePage.astro
title: "CoinGecko API for OpenClaw · Pay Per Call, Full Crypto Data"
description: "Plug CoinGecko market data into OpenClaw. Live prices, historical OHLC, exchanges, NFT, on-chain DEX feeds — billed per call. No signup, no monthly plan, no API key."
bodyClass: "page-coingecko"
themeColor: "#0b0b0c"
ogTitle: "CoinGecko API for OpenClaw — Pay Per Call Crypto Data"
ogDescription: "Full CoinGecko market data inside your OpenClaw agent. One tool, billed per call, no API key wrangling."
schema:
  name: "CoinGecko via Locus for OpenClaw"
  description: "Crypto market data tool for OpenClaw agents — full CoinGecko coverage billed per call via x402."
  mainEntityName: "CoinGecko via Locus for OpenClaw"
  mainEntityDescription: "OpenClaw-ready endpoint that returns live and historical crypto market data, exchange feeds, NFT, and on-chain DEX info."
  providerName: "Locus"
hero:
  ghostNumber: "OPEN"
  eyebrow: "OpenClaw · Pay-per-call · No subscription"
  title:
    lines:
      - "OpenClaw, see"
      - "every market"
    highlight: "in real time."
  lead: "Drop CoinGecko via Locus into your OpenClaw agent as a single tool call. Token symbols and IDs go in, live prices, historical OHLC, exchange feeds, NFT, and on-chain DEX data come back, billed per call. Full CoinGecko Pro coverage with no monthly plan, no API key, and no demo-tier rate cliff."
  meta:
    - "Single OpenClaw tool — one POST"
    - "3M+ tokens, 12y of historical data"
    - "Per-run budget caps honored"
    - "No persistent API key required"
  connection:
    agent:
      eyebrow: "AI agent"
      logo: "/logos/openclaw.svg"
      title: "OpenClaw"
    service:
      eyebrow: "CoinGecko"
      logo: "/logos/coingecko.png"
      title: "Crypto Data API"
trust:
  items:
    - label: "Asset coverage"
      stat: ""
      statHighlight: "3M+"
      desc: "Tokens indexed across exchanges and on-chain sources — OpenClaw sees the full CoinGecko universe."
    - label: "Historical depth"
      stat: ""
      statHighlight: "12y"
      desc: "Up to 12 years of 5-minute OHLC for backtests, signal research, and historical context."
    - label: "Time to wire it in"
      stat: "~"
      statHighlight: "5"
      statSuffix: "min"
      desc: "Register one tool in OpenClaw, declare per-call cost, ship. No CoinGecko account, no plan-tier negotiation."
useCases:
  eyebrow: "What OpenClaw builders ship"
  title:
    text: "Real OpenClaw agents that "
    highlight: "rely on this tool."
  description: "Each pattern below is a single OpenClaw agent with CoinGecko via Locus registered as one tool. The math works because the agent only spends when it actually queries the market."
  items:
    - who: "OpenClaw trading agent"
      title: "Live prices, no human-managed key."
      text: "An autonomous trading or signal-generation agent fetches live prices and orderbook context from a single OpenClaw tool call. No subscription tied to a billing entity, no rotating API key in agent logs — the agent self-onboards via MCP and pays per call from a connected wallet."
      query: "Live BTC/USD across the top 8 exchanges, 1h OHLC for the last 7 days"
    - who: "OpenClaw research bot"
      title: "Token diligence on demand."
      text: "A research-side OpenClaw agent receives a token name or contract address, pulls metadata, history, exchange listings, and on-chain liquidity, and assembles a report. Per-call billing keeps each diligence pass cheap; idle weeks cost zero."
      query: "Full report on $TOKEN: metadata, top exchanges, 90d OHLC, current DEX liquidity"
    - who: "OpenClaw portfolio assistant"
      title: "Daily portfolio summaries."
      text: "An OpenClaw agent runs on a cron, queries live prices and 24h moves for the user's holdings, and posts a summary to Slack. Days the user doesn't trade still cost nothing extra; high-volatility days scale predictably."
      query: "Live prices and 24h moves for 24 tokens in the user's portfolio"
    - who: "OpenClaw DeFi monitor"
      title: "Watch DEX liquidity for thresholds."
      text: "A scheduled OpenClaw agent pulls on-chain DEX data from the gateway and alerts when pool liquidity, volume, or token concentration crosses a threshold. The agent only spends when there's something to check."
      query: "Top 10 Uniswap pools by 24h volume — flag if any drop >30% week-over-week"
cta:
  eyebrow: "OpenClaw-ready in two minutes"
  title:
    text: "Stop wrapping CoinGecko plans "
    highlight: "into your agent."
  text: "Register one tool, connect a wallet, and your OpenClaw agent gets the full CoinGecko feed on every relevant call. Idle runs cost zero. Tool migrations later cost zero. That's the entire deal."
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
    - "Full CoinGecko coverage"
    - "Budget caps honored"
    - "MCP + x402 native"
faq:
  eyebrow: "FAQ"
  title: "OpenClaw-specific questions."
  description: "If something below doesn't cover your case, ping us — we work directly with OpenClaw builders, no SDR funnel."
  items:
    - question: "How does this register as an OpenClaw tool?"
      answer: "It's a standard POST endpoint with a typed body. You register it in OpenClaw the same way you'd register any HTTP tool — endpoint, schema, per-call price. OpenClaw uses the price to enforce budget caps and to show the user what each agent run will cost before it runs."
      open: true
    - question: "Does OpenClaw need a CoinGecko subscription or API key?"
      answer: "No. The gateway accepts x402-signed requests, so OpenClaw can pay per call from a wallet you connect. No CoinGecko account is created, and there's no shared API key to rotate or leak in agent logs."
    - question: "What happens when an OpenClaw run hits its budget cap?"
      answer: "The tool returns whatever data it has resolved so far and OpenClaw stops issuing new calls. The agent treats this as a normal tool boundary and can ask the user for more budget or hand off the partial answer."
    - question: "Can OpenClaw call this concurrently across many agents?"
      answer: "Yes. Per-key rate limits apply with concurrency-fair queueing — a noisy agent never starves another agent on the same key. Practical limits scale with the underlying CoinGecko Pro infrastructure."
    - question: "How is this different from giving OpenClaw a CoinGecko Pro subscription?"
      answer: "Subscriptions don't fit OpenClaw's tool model. The tool can't report a true per-call cost, so OpenClaw can't do real budget planning. The gateway reports an honest per-call cost up front, which is what OpenClaw was designed to consume."
    - question: "Is the data the same as CoinGecko Pro?"
      answer: "Yes. The gateway proxies CoinGecko's Pro API directly, so coverage, freshness, and field shape match exactly."
footer:
  brand: "CoinGecko"
  suffix: "Crypto market data for OpenClaw"
  tag: "© 2026 · Built for OpenClaw"
---
