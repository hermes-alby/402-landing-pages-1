# Alpha Vantage: Technical Indicators API Uses

## What This Endpoint Group Does

The `technical-indicators` group exposes five MPP wrapper endpoints for deriving common chart indicators from Alpha Vantage time-series data: SMA, EMA, MACD, RSI, and Bollinger Bands. These endpoints turn a ticker, interval, price series type, and indicator-specific period settings into timestamp-keyed technical-analysis values that can be used for chart overlays, screening signals, alerting, and research workflows.

The local inventory covers these as paid MPP `POST` endpoints under `https://alphavantage.mpp.paywithlocus.com/alphavantage/`. The upstream Alpha Vantage documentation describes equivalent `GET /query?function=<FUNCTION>` endpoints and states that technical indicators are derived from the underlying time-series stock API and forex data, with indicators calculated from adjusted time-series data.

## Endpoints Covered

| Endpoint ID | MPP endpoint | Upstream function | What it returns | Required inputs | Optional inputs | Documented output fields | Estimated cost |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `endp_2092ce6016092f6133c0` | `POST /alphavantage/sma` | `SMA` | Simple moving average values for a ticker and interval. | `symbol`, `interval`, `time_period`, `series_type` | `month`, `datatype` | `Meta Data`; `Technical Analysis: SMA` with timestamp-keyed `SMA` values. | `$0.008` per request |
| `endp_6c565bb512d58e69dedf` | `POST /alphavantage/ema` | `EMA` | Exponential moving average values for a ticker and interval. | `symbol`, `interval`, `time_period`, `series_type` | `month`, `datatype` | `Meta Data`; `Technical Analysis: EMA` with timestamp-keyed `EMA` values. | `$0.008` per request |
| `endp_b04c62b78f9f2251503f` | `POST /alphavantage/macd` | `MACD` | Moving average convergence/divergence trend and momentum values. | `symbol`, `interval`, `series_type` | `fastperiod`, `slowperiod`, `signalperiod`, `month`, `datatype` | `Meta Data`; `Technical Analysis: MACD` with timestamp-keyed `MACD`, `MACD_Hist`, and `MACD_Signal` values. | `$0.008` per request |
| `endp_cb0cca5070e59b372d00` | `POST /alphavantage/rsi` | `RSI` | Relative Strength Index momentum oscillator values. | `symbol`, `interval`, `time_period`, `series_type` | `month`, `datatype` | `Meta Data`; `Technical Analysis: RSI` with timestamp-keyed `RSI` values. | `$0.008` per request |
| `endp_42c337fd42f86b6517be` | `POST /alphavantage/bbands` | `BBANDS` | Bollinger Band volatility bands around a moving average. | `symbol`, `interval`, `time_period`, `series_type` | `nbdevup`, `nbdevdn`, `matype`, `month`, `datatype` | `Meta Data`; `Technical Analysis: BBANDS` with timestamp-keyed `Real Upper Band`, `Real Middle Band`, and `Real Lower Band` values. | `$0.008` per request |

## Field Notes

- Common required selector fields are `symbol`, `interval`, and `series_type`. Supported intervals in the local inventory are `1min`, `5min`, `15min`, `30min`, `60min`, `daily`, `weekly`, and `monthly`; supported series types are `close`, `open`, `high`, and `low`.
- `time_period` is required for SMA, EMA, RSI, and Bollinger Bands. MACD instead exposes `fastperiod`, `slowperiod`, and `signalperiod`, with defaults documented in the wrapper docs as 12, 26, and 9.
- `month` is optional and applies to intraday historical indicator retrieval in `YYYY-MM` format.
- `datatype` accepts `json` or `csv`; the inventory records JSON-oriented response fields because the wrapper OpenAPI does not publish a machine-readable success schema.
- Bollinger Bands adds volatility-shaping parameters: `nbdevup`, `nbdevdn`, and `matype`. The documented `matype` mapping is `0=SMA`, `1=EMA`, `2=WMA`, `3=DEMA`, `4=TEMA`, `5=TRIMA`, `6=T3`, `7=KAMA`, and `8=MAMA`.
- Official Alpha Vantage docs include an `entitlement` parameter for freshness on technical indicator endpoints, but the local MPP wrapper inventory for these five endpoints does not expose `entitlement`.
- The MPP wrapper abstracts the upstream Alpha Vantage `apikey` parameter. Calling these wrapper endpoints requires HTTP 402 payment handling; this artifact was prepared from public/local documentation only and did not execute paid endpoint calls.

## Use Cases

1. **Chart overlays for investing tools**
   Use SMA, EMA, and Bollinger Bands to draw standard overlays on intraday, daily, weekly, or monthly price charts without implementing indicator math in the client.

2. **Signal generation for screening**
   Combine MACD, RSI, and moving-average outputs to flag momentum changes, potential overbought or oversold conditions, and trend confirmation candidates for watchlists.

3. **Portfolio monitoring alerts**
   Run a fixed set of indicator queries for held symbols and trigger alerts when RSI crosses a configured threshold, MACD turns positive or negative, or price approaches a Bollinger Band.

4. **Backtesting feature inputs**
   Retrieve historical indicator series using interval and `month` controls to assemble reproducible feature sets for strategy tests, model evaluation, or dashboard backfills.

5. **Volatility-aware risk review**
   Use Bollinger Band upper, middle, and lower bands to identify symbols with widening volatility, mean-reversion setups, or price moves outside expected bands.

6. **Research-assistant market context**
   Feed timestamp-keyed SMA, EMA, MACD, RSI, and Bollinger values into an analyst or AI-agent workflow so market summaries can reference concrete technical conditions instead of recomputing indicators from raw OHLCV data.
