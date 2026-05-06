# CoinGecko: Exchange Discovery And Venue Quality API Uses

## What This Endpoint Group Does

This group has one endpoint: exchange list with data. It helps users compare trading venues by exchange ID, name, country, establishment year, trust score, trust-score rank, trade volume in BTC, URL, image, and centralized/decentralized flag where present.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/coingecko/exchanges` | List exchanges with data | optional `per_page`, `page` | Exchange ID, name, year established, country, description, URL, image, trust score, trust-score rank, 24h BTC volume |

## Field Notes

### Inputs

`per_page` and `page` support paginated review of exchanges. The MPP wrapper does not expose deeper exchange-by-ID or ticker endpoints.

### Outputs

Important fields include `id`, `name`, `year_established`, `country`, `description`, `url`, `image`, `has_trading_incentive`, `trust_score`, `trust_score_rank`, `trade_volume_24h_btc`, and `trade_volume_24h_btc_normalized`.

### Important Constraints Or Gaps

The endpoint provides venue-level summaries, not order books, pair tickers, fees, jurisdictional licensing, withdrawal status, or proof-of-reserves details. Trust score and volume are useful screening signals, but they should not be treated as a complete venue risk assessment.

## Use Cases

### Venue Shortlisting For A Trade Or Listing

A person deciding where to trade can sort or page through exchanges and compare trust score, normalized 24-hour volume, country, and whether the venue is centralized. A business listing or treasury team can use those same fields to shortlist venues for deeper review before checking fees, legal availability, custody risk, and operational status from other sources.

### Exchange Metadata Enrichment

Wallets, portfolio trackers, and tax products often store exchange IDs but need display names, logos, URLs, and country metadata. `exchanges` can enrich those records so user interfaces show recognizable venue names and images while analytics pipelines retain stable exchange IDs.

### Liquidity And Counterparty Risk Triage

`trade_volume_24h_btc`, `trust_score`, and `trust_score_rank` can help a risk team triage whether a venue deserves manual review. Low trust score, missing country, or thin normalized volume can trigger additional checks before allowing a venue in an internal routing, pricing, or reporting workflow.
