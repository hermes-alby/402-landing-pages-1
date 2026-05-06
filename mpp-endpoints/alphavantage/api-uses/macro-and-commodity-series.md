# Alpha Vantage: Macro And Commodity Series API Uses

## What This Endpoint Group Does

This group brings external macroeconomic and commodity time series into market, budgeting, and risk models. The two MPP endpoints wrap Alpha Vantage commodity and US economic-indicator functions behind paid POST calls, returning dated observations such as oil prices, metal and agricultural commodity prices, GDP, Treasury yields, policy rates, CPI, inflation, retail sales, durable goods orders, unemployment, and nonfarm payrolls.

These endpoints are best treated as contextual drivers rather than tradable instrument feeds. They provide series-level observations with `name`, `interval`, `unit`, and `data` values, where `data` is a date/value observation array.

## Endpoints Covered

| Endpoint ID | MPP endpoint | Upstream Alpha Vantage functions | Required request fields | Optional controls | Response notes |
| --- | --- | --- | --- | --- | --- |
| `endp_12134682e6b7f3ae5f22` | `POST /alphavantage/commodity-price` | `WTI`, `BRENT`, `NATURAL_GAS`, `COPPER`, `ALUMINUM`, `WHEAT`, `CORN`, `COTTON`, `SUGAR`, `COFFEE` | `commodity` | `interval`, `datatype` | Historical commodity series. JSON responses are documented as `name`, `interval`, `unit`, and `data` observations; CSV is available via `datatype=csv`. |
| `endp_63416f9c34d2df5d2457` | `POST /alphavantage/economic-indicator` | `REAL_GDP`, `REAL_GDP_PER_CAPITA`, `TREASURY_YIELD`, `FEDERAL_FUNDS_RATE`, `CPI`, `INFLATION`, `RETAIL_SALES`, `DURABLES`, `UNEMPLOYMENT`, `NONFARM_PAYROLL` | `indicator` | `interval`, `maturity`, `datatype` | US macroeconomic series. JSON responses are documented as `name`, `interval`, `unit`, and `data` observations; CSV is available via `datatype=csv`. |

## Field Notes

- Both endpoints are paid MPP wrapper calls with `intent=charge`, `method=tempo`, amount `8000`, and an estimated cost of `$0.008` per request. This research used only local source snapshots and did not call the paid endpoints.
- The wrapper request body is JSON, while the upstream Alpha Vantage API is documented as public `GET /query?function=...&apikey=...` calls. The wrapper abstracts the upstream Alpha Vantage API key but introduces HTTP 402 payment handling.
- `commodity` selects a commodity function. The wrapper covers energy (`WTI`, `BRENT`, `NATURAL_GAS`), metals (`COPPER`, `ALUMINUM`), and agriculture (`WHEAT`, `CORN`, `COTTON`, `SUGAR`, `COFFEE`).
- The wrapper OpenAPI lists commodity `interval` as `daily`, `weekly`, or `monthly`, but the official Alpha Vantage docs differ by commodity. WTI, Brent, and natural gas accept daily/weekly/monthly, while copper, aluminum, wheat, corn, cotton, sugar, and coffee are documented with monthly/quarterly/annual horizons.
- `indicator` selects a US macro series. Some indicators use `interval`; some do not. `TREASURY_YIELD` also uses `maturity` with `3month`, `2year`, `5year`, `7year`, `10year`, or `30year`.
- The wrapper OpenAPI lists economic `interval` as `daily`, `weekly`, `monthly`, `quarterly`, or `annual`, but the official docs are indicator-specific. Examples: `REAL_GDP` supports quarterly/annual; `TREASURY_YIELD` and `FEDERAL_FUNDS_RATE` support daily/weekly/monthly; `INFLATION` is annual; retail sales, durable goods, unemployment, and nonfarm payroll are monthly series without an interval parameter in the official examples.
- `datatype=csv` is documented for both endpoints. The inventory records JSON fields because the wrapper OpenAPI does not define machine-readable success response schemas.
- Output values are series observations, not normalized accounting or market OHLCV records. Consumers should preserve `unit` and `interval` alongside each value before joining series into models.

## Use Cases

1. Macro regime overlays for portfolio models: combine GDP, inflation, CPI, unemployment, payrolls, Treasury yields, and policy rates to tag market periods before comparing equity, FX, or crypto performance.
2. Yield-curve and rate-sensitivity monitoring: request `TREASURY_YIELD` at several maturities and pair it with `FEDERAL_FUNDS_RATE` to track curve shape, rate-cycle changes, and duration risk.
3. Commodity cost exposure tracking: use WTI, Brent, natural gas, metals, and agricultural series as inputs for airline fuel assumptions, manufacturing cost models, food input costs, or energy-sensitive margin analysis.
4. Inflation and purchasing-power analysis: combine CPI, annual inflation, commodity prices, retail sales, and payroll data to explain consumer-demand shifts or pressure-test pricing assumptions.
5. Budget and forecast scenario generation: feed macro and commodity observations into finance planning workflows to create downside, base, and upside cases for revenue, COGS, and working-capital assumptions.
6. Market narrative grounding for agents: give research agents dated macro and commodity context so generated summaries can distinguish company-specific news from broader rate, inflation, energy, or labor-market drivers.
