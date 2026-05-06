# Alpha Vantage: Market News And Earnings Events API Uses

## What This Endpoint Group Does

This endpoint group collects textual market context around public companies, crypto, forex, and broad financial topics. It combines a news feed with AI-generated sentiment and relevance metadata, plus earnings-call transcripts for a specific ticker and fiscal quarter.

The practical value is event explanation. These endpoints can help a client connect market moves, portfolio alerts, or analyst workflows to the narratives behind them: article titles and summaries, source URLs, topic relevance, ticker sentiment, transcript speaker turns, and transcript sentiment signals. They do not replace exchange prices, fundamentals, filings, or source-article review, and the MPP wrapper requires payment before calls are executed.

## Endpoints Covered

| Endpoint ID | Method | MPP path | Provider function | Purpose | Key inputs | Key outputs | Payment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `endp_2490cbd597322f02b424` | POST | `/alphavantage/news-sentiment` | `NEWS_SENTIMENT` | Return live and historical market news with sentiment scores and ticker/topic relevance filters. | Optional `tickers`, `topics`, `time_from`, `time_to`, `sort`, `limit` | `items`, sentiment and relevance definitions, `feed[]` articles with title, URL, time, authors, summary, source metadata, topics, overall sentiment, and ticker sentiment | `8000` units/request, estimated `$0.008` |
| `endp_51673270eedbc7461e49` | POST | `/alphavantage/earnings-call-transcript` | `EARNINGS_CALL_TRANSCRIPT` | Return an earnings-call transcript for one company and fiscal quarter, with sentiment signals where available. | Required `symbol`, required `quarter` in `YYYYQN` / `YYYYQM` style such as `2024Q1` | `symbol`, `quarter`, `transcript[]` speaker turns with speaker, title, content, and sentiment signals where available | `8000` units/request, estimated `$0.008` |

## Field Notes

### Inputs

`POST /alphavantage/news-sentiment` accepts optional filters. `tickers` is a comma-separated list and can include equities, crypto symbols such as `CRYPTO:BTC`, and forex symbols such as `FOREX:USD`; Alpha Vantage documents multi-value filters as simultaneous matches. `topics` is also comma-separated and supports `blockchain`, `earnings`, `ipo`, `mergers_and_acquisitions`, `financial_markets`, `economy_fiscal`, `economy_monetary`, `economy_macro`, `energy_transportation`, `finance`, `life_sciences`, `manufacturing`, `real_estate`, `retail_wholesale`, and `technology`.

The news time filters use `YYYYMMDDTHHMM` timestamps. If `time_from` is supplied without `time_to`, the upstream docs say results cover the period from `time_from` to current time. `sort` supports `LATEST`, `EARLIEST`, and `RELEVANCE`, with latest first as the documented default. `limit` defaults to 50 and can request up to 1000 results.

`POST /alphavantage/earnings-call-transcript` requires `symbol` and `quarter`. The wrapper OpenAPI describes the quarter format as `YYYYQN`, while the Alpha Vantage documentation prose says `YYYYQM`; both examples use values such as `2024Q1`. The official docs state that quarters since `2010Q1` are supported.

### Outputs

The news sentiment response is documented as a count plus a `feed[]` array. Each article can carry source and content metadata such as title, URL, published time, authors, summary, source domain, topics, overall sentiment score/label, and per-ticker sentiment and relevance scores. These fields are useful for ranking, attribution, and source review, but they should be treated as article-level metadata rather than verified market facts.

The earnings-call transcript response is documented around `symbol`, `quarter`, and `transcript[]`. The inventory records transcript entries as speaker turns with speaker, title, content, and sentiment signals where available. The wrapper documentation describes sentiment at a high level, but the local OpenAPI does not publish a precise success schema for transcript item fields.

### Important Constraints Or Gaps

Both covered routes are MPP payment-gated POST endpoints. This research used only public documentation and local snapshots; it did not call paid endpoints, settle a 402 challenge, register for an Alpha Vantage key, or test live responses.

Alpha Vantage's direct API uses public-looking GET URLs with an `apikey` parameter, while this MPP wrapper uses JSON POST bodies and abstracts the upstream key. The wrapper OpenAPI defines request fields, payment metadata, and `402` responses, but not machine-readable `200` response schemas. Success fields in the inventory are therefore derived from official Alpha Vantage docs and examples.

Sentiment and relevance fields are model-derived signals. They can be useful features for triage and ranking, but downstream systems should preserve source URLs, timestamps, and raw payloads so analysts can review the underlying article or transcript before making investment, legal, compliance, or trading decisions.

## Use Cases

### Portfolio News Monitoring

An investor, advisor, or portfolio app can call the news endpoint with a watchlist in `tickers` and `sort=LATEST` to collect recent article summaries and sentiment labels. The returned article URLs, source domains, `time_published`, and ticker sentiment fields can drive alerts or morning briefings.

The limitation is that news sentiment is explanatory context, not a trading signal by itself. Critical alerts should be cross-checked against price data, filings, and primary sources before action.

### Event-Driven Market Research

A researcher can filter news by topics such as `earnings`, `ipo`, `mergers_and_acquisitions`, `economy_monetary`, or `financial_markets` to collect narratives around a market event. `time_from`, `time_to`, and `sort=RELEVANCE` help build a focused corpus for a known window.

This is strongest for discovery and clustering. The endpoint returns summaries and article metadata, so any substantive claims should be traced back to the source URL and preserved with the original timestamp.

### Earnings Season Briefing

An analyst can combine `topics=earnings` news for a ticker with its earnings-call transcript for the relevant quarter. News sentiment can show market framing before or after the call, while transcript speaker turns provide management commentary and Q&A content.

The transcript endpoint requires exact `symbol` and `quarter`, so a workflow should get the fiscal quarter from a trusted calendar or fundamentals source first. Transcript coverage starts at `2010Q1` according to the provider docs.

### Sentiment Feature Engineering

A quantitative or ML workflow can use article-level overall sentiment, ticker sentiment, topic relevance, and transcript sentiment signals as features for backtests, market-regime analysis, or risk dashboards. Time filters and `limit` help collect bounded slices for experiments.

The field gap matters here: the MPP wrapper does not publish strict success schemas. Feature pipelines should record raw responses, validate score presence and ranges, and treat missing sentiment fields as visible data quality events rather than silently imputing them.

### Company Narrative Diligence

A corporate strategy, investor relations, or competitive-intelligence team can use the transcript endpoint to inspect management language for a specific quarter, then use news sentiment to see how outside coverage characterized the same period. Speaker names, titles, content, source URLs, and summaries support structured review packets.

This use case depends on careful attribution. Transcript and article content may carry rights or redistribution limits, and the endpoint metadata should be used to guide review rather than republish third-party content wholesale.

### Agent Research Budget Control

An agent can use the group as a paid, narrow event-context step after cheaper discovery has identified a ticker, topic, and quarter. For example, it can request at most one transcript for a known `symbol`/`quarter` and one news query capped with `limit`, then stop unless a human or policy approves more spend.

This fits the MPP price model because both endpoints have a per-request estimated cost, but actual calls still require 402 payment handling. Agents should expose the intended query, expected spend, and source-use purpose before settlement.
