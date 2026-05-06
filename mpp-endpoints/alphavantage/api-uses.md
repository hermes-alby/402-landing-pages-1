# Alpha Vantage API Uses

## Service Summary

Alpha Vantage is a financial-market data provider for developers, investors, analysts, finance teams, fintech products, spreadsheets, and agents. The researched surface is a third-party Locus MPP wrapper around selected Alpha Vantage endpoints, not Alpha Vantage's own hosted API.

The wrapper exposes 26 paid `POST` endpoints under `https://alphavantage.mpp.paywithlocus.com/alphavantage/`. Each covered endpoint is documented with HTTP 402 payment metadata, `intent=charge`, `method=tempo`, amount `8000`, and an estimated cost of `$0.008` per request. The upstream Alpha Vantage API is documented as `GET /query?function=...&apikey=...`; the wrapper abstracts the upstream API key and replaces it with MPP payment handling.

The highest-value opportunity is a compact market-research toolkit: resolve symbols, pull price and volume history, explain moves with news and transcripts, enrich companies with fundamentals, normalize FX/crypto exposure, add macro/commodity context, and derive common technical indicators.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Equity Prices And Market Discovery | 8 | Find instruments, check market status, retrieve quotes, market movers, and equity OHLCV history. | [api-uses/equity-prices-and-market-discovery.md](api-uses/equity-prices-and-market-discovery.md) |
| Market News And Earnings Events | 2 | Collect event narratives and sentiment around tickers, topics, and fiscal quarters. | [api-uses/market-news-and-earnings-events.md](api-uses/market-news-and-earnings-events.md) |
| Company Fundamentals And Earnings | 5 | Analyze issuer identity, valuation, statements, cash generation, and EPS history. | [api-uses/company-fundamentals-and-earnings.md](api-uses/company-fundamentals-and-earnings.md) |
| Forex And Crypto Rates | 4 | Retrieve currency-pair, crypto-rate, and daily FX/crypto time series. | [api-uses/forex-and-crypto-rates.md](api-uses/forex-and-crypto-rates.md) |
| Macro And Commodity Series | 2 | Bring commodity and US macroeconomic drivers into analysis. | [api-uses/macro-and-commodity-series.md](api-uses/macro-and-commodity-series.md) |
| Technical Indicators | 5 | Turn price series into chart, screening, and alerting signals. | [api-uses/technical-indicators.md](api-uses/technical-indicators.md) |

## Highest-Value Uses

1. **Market research packet for a public company**: combine symbol search, company overview, statements, earnings, daily price history, news sentiment, and an earnings-call transcript for a concise ticker dossier.
2. **Portfolio monitoring and alerting**: refresh quotes, top movers, market status, news sentiment, fundamentals, FX conversion rates, and technical indicators for watched holdings.
3. **Event explanation workflow**: detect a price move with quotes or OHLCV, then join news sentiment, earnings transcript content, and fundamentals to explain likely drivers.
4. **Business risk and exposure review**: enrich customers, vendors, competitors, or public-company counterparties with financial health, market performance, cash/debt context, and macro or commodity exposure.
5. **Agent-controlled paid research**: use the MPP wrapper for bounded, per-call research steps after cheaper local/public discovery has narrowed the ticker, topic, quarter, or series.

## Personal Use Opportunities

- Build a watchlist that resolves ambiguous tickers before adding them, displays latest quotes, and marks whether the relevant market is currently open.
- Review a portfolio each day with daily price change, volume context, top market movers, and fresh news sentiment for held symbols.
- Research a stock by combining company profile, valuation ratios, income statement, balance sheet, cash flow, EPS surprise history, and recent price trend.
- Track FX and crypto exposure by converting holdings into a home currency and reviewing daily FX or crypto history.
- Add simple chart signals such as SMA, EMA, MACD, RSI, and Bollinger Bands without implementing indicator math locally.
- Put market moves in context with inflation, rates, unemployment, payrolls, GDP, energy prices, metals, and agricultural commodities.

## Business Use Opportunities

- Power fintech dashboards, spreadsheet add-ons, CRM enrichment, and internal research tools with structured public-market data.
- Create market-hours-aware notification systems that suppress stale or off-session alerts and show venue status alongside quotes.
- Build research queues from top gainers, top losers, most-active tickers, topic-filtered news, and sentiment/relevance metadata.
- Support vendor, customer, or competitor diligence with public-company financial statements, cash generation, leverage, profitability, and EPS surprise trends.
- Normalize multi-currency and crypto balances for finance, treasury, reconciliation, or reporting workflows.
- Feed risk, planning, and strategy models with macro and commodity drivers such as Treasury yields, policy rates, CPI, inflation, payrolls, oil, gas, metals, and crop prices.
- Give internal agents a narrow paid-data capability where each request has visible cost, query intent, and source provenance.

## Endpoint Group Summaries

### [Equity Prices And Market Discovery](api-uses/equity-prices-and-market-discovery.md)

Covers `time-series-intraday`, `time-series-daily`, `time-series-weekly`, `time-series-monthly`, `global-quote`, `symbol-search`, `market-status`, and `top-gainers-losers`. This is the entry layer for resolving instruments, understanding whether markets are open, getting current quote snapshots, finding market movers, and collecting OHLCV history for monitoring or model input.

Best use: ticker resolution, portfolio snapshots, intraday volatility triage, market-mover queues, historical trend screening, and backtesting inputs.

### [Market News And Earnings Events](api-uses/market-news-and-earnings-events.md)

Covers `news-sentiment` and `earnings-call-transcript`. This is the event-explanation layer for article summaries, source URLs, topic relevance, ticker sentiment, and management commentary by fiscal quarter.

Best use: portfolio news monitoring, event research, earnings-season briefings, sentiment feature engineering, and narrative diligence.

### [Company Fundamentals And Earnings](api-uses/company-fundamentals-and-earnings.md)

Covers `company-overview`, `income-statement`, `balance-sheet`, `cash-flow`, and `earnings`. This is the fundamental-analysis layer for issuer identity, business description, valuation, profitability, financial health, cash generation, and EPS surprise history.

Best use: company research packets, valuation sanity checks, earnings-quality review, financial-health screening, periodic portfolio refresh, and internal record enrichment.

### [Forex And Crypto Rates](api-uses/forex-and-crypto-rates.md)

Covers `currency-exchange-rate`, `fx-daily`, `crypto-exchange-rate`, and `digital-currency-daily`. This is the currency and digital-asset layer for realtime conversion rates, bid/ask fields, daily FX OHLC, and daily crypto OHLCV series.

Best use: portfolio currency normalization, treasury exposure monitoring, crypto valuation snapshots, historical crypto analytics, and cross-asset enrichment.

### [Macro And Commodity Series](api-uses/macro-and-commodity-series.md)

Covers `commodity-price` and `economic-indicator`. This is the external-driver layer for energy, metals, agricultural commodities, GDP, Treasury yields, policy rates, CPI, inflation, retail sales, durable goods, unemployment, and nonfarm payrolls.

Best use: macro regime overlays, yield-curve and rate-cycle monitoring, commodity cost exposure tracking, inflation analysis, planning scenarios, and agent research grounding.

### [Technical Indicators](api-uses/technical-indicators.md)

Covers `sma`, `ema`, `macd`, `rsi`, and `bbands`. This is the derived-signal layer for chart overlays, screening rules, momentum checks, volatility bands, alerts, and model features.

Best use: charting tools, signal generation, portfolio alerts, backtesting features, volatility-aware review, and research-assistant context.

## Field And Data Themes

- **Identifiers**: stock ticker symbols, instrument keywords, exchange/region, currency codes, crypto symbols, commodity functions, economic indicator functions, Treasury maturities, fiscal quarters.
- **Time controls**: intraday interval, daily/weekly/monthly periods, specific intraday `month`, news `time_from`/`time_to`, fiscal dates, reported dates, transcript quarters, macro observation dates.
- **Market values**: open, high, low, close, volume, latest price, previous close, change, change percent, bid, ask, exchange rate, market cap, commodity prices, yields, rates, CPI, GDP, labor indicators.
- **Company fundamentals**: company profile, sector, industry, country, exchange, currency, market capitalization, valuation ratios, revenue, profitability, assets, liabilities, equity, cash, debt, cash flow, capex, dividends, EPS, estimates, surprises.
- **Text and sentiment**: article title, URL, summary, authors, source domain, topics, relevance scores, overall sentiment, ticker sentiment, transcript speaker names/titles/content.
- **Derived technical fields**: SMA, EMA, MACD, MACD histogram, MACD signal, RSI, Bollinger upper/middle/lower bands, indicator timestamps.
