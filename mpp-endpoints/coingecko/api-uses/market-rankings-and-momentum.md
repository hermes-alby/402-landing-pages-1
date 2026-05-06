# CoinGecko: Market Rankings And Momentum API Uses

## What This Endpoint Group Does

This group supports market screening and relative comparison. It returns ranked coin market data, trending assets, market categories, and the strongest gainers and losers over selected windows. The useful pattern is not just "build a dashboard"; it is to identify which assets or sectors deserve attention before a user spends time on deeper due diligence.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/coingecko/coins-markets` | Ranked coin market data | `vs_currency`, optional `ids`, `category`, `order`, `per_page`, `page`, `sparkline`, `price_change_percentage` | Price, market cap, rank, volume, supply, ATH/ATL, price changes, optional sparkline |
| POST | `/coingecko/trending` | Trending search assets | none | Trending coins, NFTs, categories, scores, ranks, market data snippets |
| POST | `/coingecko/categories` | Coin categories with market data | optional `order` | Category IDs/names, market cap, volume, 24h market-cap change, top coins |
| POST | `/coingecko/top-gainers-losers` | Top movers | `vs_currency`, optional `duration`, `top_coins` | Top gainers and losers with price and percentage change fields |

## Field Notes

### Inputs

`coins-markets` can screen by `category`, sort by `market_cap_desc`, `volume_desc`, and related orders, paginate up to documented limits, and request `price_change_percentage` windows. `top-gainers-losers` uses `duration` values such as `1h`, `24h`, `7d`, `14d`, `30d`, `60d`, and `1y`; `top_coins` narrows the ranking universe.

### Outputs

The highest-value outputs are `current_price`, `market_cap`, `market_cap_rank`, `total_volume`, `price_change_percentage_*`, supply fields, `sparkline_in_7d`, category market cap and volume, trending score/rank, and top-gainer/top-loser arrays. These fields support ranking, liquidity checks, and momentum filters.

### Important Constraints Or Gaps

Trending is based on CoinGecko search activity, not guaranteed trading volume or investment quality. Top gainers/losers can include illiquid or high-risk assets depending on `top_coins`. Category and market rankings depend on CoinGecko's taxonomy and availability, so consumers should preserve category IDs and source timestamps.

## Use Cases

### Sector Rotation Watchlist

A personal investor can call `categories` sorted by market cap or change, then use `coins-markets` with a selected `category` to inspect the leading coins in that sector. A research desk can automate daily sector notes by combining category `market_cap_change_24h`, `volume_24h`, and top coin symbols, then drilling into category constituents with `current_price`, `market_cap_rank`, and `price_change_percentage_24h`.

### Momentum Triage With Liquidity Filters

`top-gainers-losers` quickly surfaces outsized moves over windows like `1h`, `24h`, or `7d`, but the workflow becomes more useful when followed by `coins-markets` for `total_volume`, `market_cap`, and rank. A trader can ignore thinly traded spikes; a business risk team can flag customer collateral or treasury tokens whose 24-hour movement crosses an internal threshold.

### Trending Narrative Discovery

`trending` identifies coins, NFTs, and categories receiving user search attention. A media analyst can use trending rank and item metadata to pick stories for coverage, while a product team can pre-fill watchlist suggestions. The value comes from comparing search attention against `coins-markets` liquidity and price-change fields so that social interest is not mistaken for market depth.

### Exchange Or Wallet Asset Listing Review

A wallet or exchange product team can use `coins-markets` pagination and ordering to assess whether an asset meets listing heuristics such as market cap rank, volume, supply availability, and recent price stability. Personal users can apply the same fields before adding a token to a watchlist. The MPP wrapper is most practical for occasional reviews, not full high-volume market-data ingestion.
