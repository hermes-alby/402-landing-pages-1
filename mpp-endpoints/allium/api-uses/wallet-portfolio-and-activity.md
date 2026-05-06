# Allium: Wallet Portfolio And Activity API Uses

## What This Endpoint Group Does

This endpoint group turns public wallet addresses into portfolio state, historical balance snapshots, transaction activity, and current profit/loss metrics. The common input is a chain plus wallet address; the endpoints differ by whether the caller wants current balances, balance history over a time window, enriched transaction rows, or PnL calculated from holdings and price data.

The practical value is that a wallet, accounting tool, analyst workflow, or AI agent can ask "what does this wallet hold, what changed, what did it cost, and what is it worth now?" without building its own chain indexer. The group is strongest when the returned balance rows, block timestamps, transaction hashes, activities, labels, asset transfers, and PnL totals are joined into a wallet timeline. It is still a paid, request-metered data surface, so callers should cache supported-chain metadata and avoid polling patterns that exceed the `/developer/` rate limit or create unnecessary payment authorizations.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/developer/wallet/balances` | Fetch current fungible-token balances for one or more wallets. | JSON array of `chain` and `address` pairs, 1-100 items; optional `with_liquidity_info=true`. | `items` balance rows with `chain`, `address`, `token`, `raw_balance`, `raw_balance_str`, `block_timestamp`, and chain-specific block fields; optional `cursor`. |
| POST | `/api/v1/developer/wallet/balances/history` | Fetch wallet token balances over a UTC time range. | `start_timestamp`, `end_timestamp`, and `addresses[]` with `chain` and `address`, 1-5 addresses; optional `limit` default 1000, max 5000, and `cursor`. | Historical balance `items` with token metadata, raw balances, block timestamps, block numbers/slots/hashes, transaction ids where available, plus `cursor`. |
| POST | `/api/v1/developer/wallet/transactions` | Fetch enriched transaction history for wallets. | JSON array of `chain` and `address` pairs, 1-20 items; optional `activity_type`, `transaction_hash`, `limit` default 25, max 1000, and `cursor`. | Transaction `items` with `id`, `hash`, `chain`, `address`, `block_timestamp`, block identifiers, `fee`, `from_address`, `to_address`, `asset_transfers`, `activities`, `labels`, and `cursor`. |
| POST | `/api/v1/developer/wallet/pnl` | Fetch current wallet profit/loss and per-token PnL breakdown. | JSON array of `chain` and `address` pairs, 1-20 items; optional `min_liquidity`. | `data` or `items` containing wallet `chain`, `address`, `tokens`, `total_balance`, `total_realized_pnl`, `total_unrealized_pnl`, `total_unrealized_pnl_ratio_change`, `error`, and `cursor`. |

## Field Notes

### Inputs

The main identifiers are lowercase chain names and public wallet addresses. Current balances accept up to 100 chain/address pairs per call; transactions and PnL accept up to 20; historical balances accept a smaller batch of up to 5 addresses plus UTC ISO 8601 `start_timestamp` and `end_timestamp`.

Query controls shape cost and result size. Historical balances and transactions are paginated by `cursor`; historical balances can return up to 5000 rows per page, while transactions can return up to 1000. Transaction queries can filter by `activity_type` or a specific `transaction_hash`. Balance calls can request liquidity metadata, and PnL calls can filter out tokens below a `min_liquidity` threshold.

### Outputs

Balance endpoints return token-level rows, not only wallet-level totals. Each row includes the wallet, chain, token metadata, raw token quantity, a UTC block timestamp, and chain-specific provenance such as block number, slot, hash, token account, or transaction id. These fields let clients reconstruct holdings by token and verify when the balance snapshot was observed.

Transaction responses add the activity layer: transaction hash, block ordering, fee, from/to addresses, asset transfers, labels where supported, and normalized activities such as DEX trades, bridges, approvals, liquidity events, and NFT trades on supported chains. PnL responses summarize total USD balance, realized PnL, unrealized PnL, unrealized ratio change, and per-token average cost, current price, current balance, raw balance, realized PnL, and unrealized PnL.

### Important Constraints Or Gaps

All four endpoints are listed at `$0.03` per request on the machine-payment surface. Realtime `/developer/` endpoints are in a 3 requests/second per-wallet rate-limit bucket, and machine-payment clients should expect HTTP `402` negotiation plus `429` backoff behavior.

Supported-chain coverage is endpoint-specific and should be discovered and cached from the free supported-chain endpoint before making paid calls. The local discovery snapshot lists broad coverage for wallet balances, historical balances, transactions, and PnL, but the Holdings overview page also says Holdings APIs are currently supported on Bitcoin and Solana with more chains coming; that mismatch should be treated as a documentation drift risk for PnL and holdings-style workflows.

Freshness is described at the realtime API level as roughly 3-4 seconds, but block production, indexing lag, and endpoint-specific coverage can vary by chain. Transaction enrichment is not uniform: the transactions docs state Bitcoin has asset transfers but not activities or labels, Solana has activities and asset transfers but not labels, and EVM chains have the fullest support. PnL uses average-cost-basis methodology, which may not match a user's tax jurisdiction, accounting policy, or lot-selection method.

Wallet activity and labels can be sensitive even when sourced from public blockchains. Applications using these endpoints for compliance, credit, customer profiling, tax, or employment-related decisions should treat wallet addresses and inferred behavior as regulated or privacy-sensitive data where applicable, keep audit trails, and avoid presenting Allium-calculated PnL as final tax advice.

## Use Cases

### Personal Portfolio Dashboard

A consumer wallet or personal finance app can use latest balances plus PnL to show a wallet owner what tokens they hold, how much the holdings are worth in USD, and whether each position is up or down. Raw balance strings, decimals, token metadata, current price, current balance, and realized/unrealized PnL let the product avoid maintaining its own token indexer and price pipeline.

Historical balances make the dashboard more useful than a point-in-time snapshot. A user can inspect how their holdings changed across a day, month, or tax year, while transaction rows explain the "why" behind changes through transfers, trades, approvals, bridges, and fees. The main limitations are paid polling cost, chain coverage differences, and the need to explain that average-cost PnL is an estimate rather than jurisdiction-specific tax reporting.

### Wallet Activity Feed And Customer Support

A wallet, custody, or portfolio app can use the transactions endpoint to build a readable wallet activity feed with transaction hashes, timestamps, fees, from/to addresses, asset transfers, labels, and normalized activities. Filtering by `transaction_hash` helps support teams diagnose one user-reported transaction without crawling an entire history page.

The output fields support a practical support workflow: confirm whether a transaction is indexed, identify involved assets and counterparties, show fee context, and link back to chain provenance. Product teams should account for feature differences by chain; for example, Bitcoin rows should not be expected to include the same activity and label enrichment available on EVM chains.

### Treasury And Accounting Reconciliation

A business with onchain treasury wallets can use current balances for daily position checks, historical balances for period-end snapshots, and transactions for ledger reconciliation. The combination of wallet address, token, raw balance, block timestamp, transaction hash, fee, transfer direction, and activity type is enough to map onchain movements into an internal chart of accounts or exception queue.

PnL adds a fast management view of realized and unrealized performance, which is useful for treasury review and month-end variance analysis. Accounting teams still need controls around source retention, cutoff times, pricing methodology, and cost-basis policy. Allium's average-cost PnL may be a good analytical input but should be reconciled against the organization's official accounting and tax method before books are closed.

### Risk And Compliance Triage

Compliance teams can combine balances and enriched transactions to triage wallet exposure before onboarding a customer, accepting deposits, or reviewing suspicious activity. The output can identify held tokens, recent counterparties, bridging or DEX behavior, approvals, fees, and labels where available, making it easier to route wallets into low-risk, review, or block categories.

This is a data-enrichment layer, not a full sanctions, KYC, or AML decision engine. Wallet labels are not uniformly available across chains, public addresses can still be linked to individuals, and compliance decisions may require licensed screening data, jurisdiction-specific policies, and human review. Rate limits and per-call pricing also favor targeted lookups over broad surveillance crawls.

### Agentic Portfolio Checks Before A Paid Action

An AI agent that is about to recommend or execute a user-approved onchain action can query balances, recent transactions, and PnL first. The agent can check whether the wallet holds the required asset, whether a recent transfer or swap already achieved the user's goal, and whether selling a token would likely realize a gain or loss under Allium's average-cost model.

The group is well suited to preflight checks because the machine-payment model removes API-key setup and prices each lookup independently. The agent still needs explicit user approval for any mutation, signing, or payment outside the data call, and it should cache free supported-chain discovery plus recent read results to avoid repeated `$0.03` requests during a single planning session.

### Investor, DAO, Or Fund Reporting

A DAO, fund analyst, or investor-relations workflow can use historical balances and PnL to build periodic wallet reports for public treasury addresses. Current and historical token rows provide holdings evidence, transaction rows explain inflows and outflows, and PnL totals provide a concise performance snapshot for stakeholders.

The returned data is particularly useful when reports need both summary metrics and drill-down provenance. However, analysts should preserve raw snapshots, cite block timestamps and transaction hashes, and call out coverage limits by chain. For public-facing reports, teams should distinguish between observed onchain holdings, Allium-enriched interpretations, and any offchain obligations or custodial assets not visible in the wallet data.
