# Alpha Vantage: Forex And Crypto Rates API Uses

## What This Endpoint Group Does

This endpoint group covers Alpha Vantage wrapper calls for exchange-rate lookup and daily currency time series. It supports realtime conversion rates for physical and digital currencies, daily OHLC forex history for a currency pair, and daily OHLCV cryptocurrency history in a selected market currency.

All four endpoints are MPP wrapper `POST` calls under `https://alphavantage.mpp.paywithlocus.com/alphavantage/`. Each endpoint is documented with `intent=charge`, `method=tempo`, and an estimated per-request cost of `$0.008`. This artifact is based only on public/local documentation and source snapshots; no paid endpoint calls were made.

## Endpoints Covered

| Endpoint ID | MPP endpoint | Upstream Alpha Vantage function | Required request fields | Optional request fields | Main response fields |
| --- | --- | --- | --- | --- | --- |
| `endp_2bb306a08b3e1edd603b` | `POST /alphavantage/currency-exchange-rate` | `CURRENCY_EXCHANGE_RATE` | `from_currency`, `to_currency` | None in wrapper schema | `Realtime Currency Exchange Rate` with source/target code and name, exchange rate, last refreshed timestamp, time zone, bid price, and ask price |
| `endp_8d87330c80c69519e9d1` | `POST /alphavantage/fx-daily` | `FX_DAILY` | `from_symbol`, `to_symbol` | `outputsize`, `datatype` | `Meta Data`; `Time Series FX (Daily)` with date-keyed open, high, low, close observations |
| `endp_12b23b285aa0cf5fd1e9` | `POST /alphavantage/crypto-exchange-rate` | `CURRENCY_EXCHANGE_RATE` | `from_currency`, `to_currency` | None in wrapper schema | `Realtime Currency Exchange Rate` with crypto-to-currency exchange rate, bid, ask, and refresh time |
| `endp_5bc21dc34b580cba6386` | `POST /alphavantage/digital-currency-daily` | `DIGITAL_CURRENCY_DAILY` | `symbol`, `market` | None in wrapper schema | `Meta Data`; `Time Series (Digital Currency Daily)` with date-keyed OHLCV observations and market cap where provided |

## Field Notes

- Currency identifiers are plain currency or crypto symbols. The realtime endpoints use `from_currency` and `to_currency`; daily FX uses `from_symbol` and `to_symbol`; daily crypto history uses `symbol` and `market`.
- `currency-exchange-rate` and `crypto-exchange-rate` are separate wrapper endpoints, but both map to upstream Alpha Vantage `CURRENCY_EXCHANGE_RATE`. The split appears to be a wrapper convenience for physical-currency and crypto use cases, not a distinct upstream function.
- `fx-daily` accepts `outputsize=compact` or `outputsize=full`; Alpha Vantage documents `compact` as the latest 100 daily points and `full` as the full-length daily series.
- `fx-daily` accepts `datatype=json` or `datatype=csv` in the wrapper schema. Alpha Vantage docs also show a CSV example for `DIGITAL_CURRENCY_DAILY`, but the wrapper OpenAPI and MPP docs for `digital-currency-daily` only expose `symbol` and `market`.
- Response schemas are not machine-readable in the wrapper OpenAPI. The 200-response field names here come from the inventory's docs-derived fields and official Alpha Vantage documentation examples.
- Timestamp fields include `Last Refreshed` on realtime records and date-keyed daily observations for FX and crypto series. Digital-currency daily data is documented by Alpha Vantage as refreshed daily at midnight UTC.
- Money and quantity fields include exchange rate, bid price, ask price, open, high, low, close, volume, and market cap where Alpha Vantage provides it.

## Use Cases

1. Portfolio currency normalization: convert cash balances, foreign holdings, and crypto holdings into a reporting currency using realtime exchange rates and daily history.
2. FX exposure monitoring: track daily OHLC moves for important currency pairs such as EUR/USD or USD/JPY for treasury dashboards, risk alerts, or investment research.
3. Crypto valuation snapshots: fetch current BTC, ETH, or other crypto exchange rates against fiat currencies for wallet valuation and reconciliation workflows.
4. Historical crypto analytics: build daily return, volatility, drawdown, or benchmark series for a cryptocurrency in a selected market currency.
5. Cross-asset research enrichment: attach exchange-rate and crypto-price context to news, fundamentals, or macroeconomic research produced by other Alpha Vantage endpoint groups.
6. Lightweight agent tools: let an agent answer bounded market-data questions such as current conversion rates, daily FX trend checks, or historical crypto price lookups without maintaining exchange integrations directly.
