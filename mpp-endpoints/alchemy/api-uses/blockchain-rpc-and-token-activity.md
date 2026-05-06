# Alchemy: Blockchain RPC And Token Activity API Uses

## What This Endpoint Group Does

This group covers the MPP `POST /:network/v2` JSON-RPC wildcard endpoint. It is the route for read-oriented EVM chain state and token activity work: native balances, read-only smart-contract calls, event logs, token balances, token metadata, and historical asset transfers. The endpoint is useful when an agent needs onchain facts for a wallet, contract, token, or transaction flow before deciding what to show, alert on, reconcile, or investigate.

The underlying Alchemy provider surface also includes transaction-broadcast methods, but those are outside this artifact's use cases. This research did not make paid calls, create an Alchemy key, sign a payment, sign a wallet message, or submit any mutation.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/:network/v2` | JSON-RPC wildcard for standard `eth_*` and Alchemy enhanced `alchemy_*` methods. MPP endpoint ID: `endp_34b67a20fce8fd8fd820`; MPP URL: `https://mpp.alchemy.com/:network/v2`; provider path: `/v2/{apiKey}`. | `network`; JSON-RPC `jsonrpc`, `id`, `method`, and method-specific `params`; representative inputs include wallet address, token contract address, block tag/hash/number, `eth_call` transaction object, `eth_getLogs` filter, and `alchemy_getAssetTransfers` filters. | JSON-RPC `result` or `error`; representative outputs include hex native balances, contract call return data, log rows, token balance rows, token name/symbol/decimals/logo, transfer rows, and pagination keys. |

## Field Notes

### Inputs

The core routing fields are `network` and JSON-RPC `method`. The public MPP metadata does not enumerate all allowed network strings or JSON-RPC methods, so callers should treat the wildcard as a paid wrapper around a broad provider surface rather than a fixed schema.

For wallet and portfolio workflows, the important request fields are wallet addresses, token contract addresses, and token specifications such as `erc20`, `NATIVE_TOKEN`, or explicit token contract arrays. For historical activity, `alchemy_getAssetTransfers` accepts filters such as `fromBlock`, `fromAddress`, `toAddress`, transfer `category`, `excludeZeroValue`, `withMetadata`, `maxCount`, and `pageKey`. For event-driven workflows, `eth_getLogs` uses `fromBlock`, `toBlock`, `address`, and `topics`.

For read-only contract inspection, `eth_call` accepts a transaction object with fields such as `to` and `data`, plus a block tag or block reference. That enables contract reads without creating a transaction, but callers still need ABI knowledge to encode calldata and decode the hex response.

### Outputs

The endpoint returns JSON-RPC responses, so `result` is method-specific. `eth_getBalance` returns a hex wei balance. `alchemy_getTokenBalances` returns an address and `tokenBalances[]` rows with `contractAddress`, `tokenBalance`, and per-row errors. `alchemy_getTokenMetadata` returns `name`, `symbol`, `decimals`, and `logo`.

`alchemy_getAssetTransfers` returns `transfers[]` rows with fields such as `blockNum`, `uniqueId`, `hash`, `from`, `to`, `value`, `asset`, `category`, token IDs, ERC-1155 metadata, raw contract values, and optional metadata. `eth_getLogs` returns log rows with `removed`, log and transaction indices, transaction hash, block hash/number, emitting address, `data`, and `topics`.

### Important Constraints Or Gaps

No wrapper-specific OpenAPI schema, method allow-list, runtime payment challenge, response envelope, or rate-limit details were available from public MPP metadata. Field details are therefore derived from representative official Alchemy docs.

Alchemy's native pricing uses Compute Units and throughput limits. The MPP catalog lists a raw 6-decimal payment amount of `100` for this endpoint, but runtime session semantics were not tested.

`eth_getLogs` has documented block-range and response-size constraints that vary by chain and plan tier. Wide historical scans should be chunked, deduplicated, and retried carefully.

Transaction submission or wallet-signing workflows are intentionally excluded. The useful safe surface for this artifact is read-only state, log, token, transfer, and contract-call data.

## Use Cases

### Wallet Balance And Token Exposure Review

A person can check whether a wallet still holds enough native token for gas, which ERC-20 balances are present, and whether token metadata looks legitimate before interacting with an app. The workflow combines `eth_getBalance`, `alchemy_getTokenBalances`, and `alchemy_getTokenMetadata`; the useful fields are wallet address, token contract address, hex balances, token name, symbol, decimals, and logo. The output helps decide whether a wallet needs funding, whether a token is recognizable, and which assets should be hidden, reviewed, or exported.

A business wallet tool can use the same fields for customer support, treasury review, or account health checks. For example, support can verify that a user has a required balance without asking for private keys, and finance can normalize balances by token decimals before sending records into accounting. The limitation is that raw balances are not price valuations; a separate price source is needed to convert token quantities into fiat values.

### Payment And Settlement Evidence From Transfers

A merchant, freelancer, or agent can use `alchemy_getAssetTransfers` to check whether an expected payment arrived at a receiving wallet. Inputs such as `toAddress`, `fromAddress`, `fromBlock`, `category`, `excludeZeroValue`, and `withMetadata` narrow the search, while `transfers[].hash`, `from`, `to`, `value`, `asset`, `category`, `blockNum`, and `rawContract` provide evidence for reconciliation.

For a business, this enables payment operations without running its own node or indexer. A processor can match deposits against invoices, flag underpayments, detect duplicate transaction hashes, and preserve the block reference used for audit. This is still not a final compliance system: confirmations, chain reorg handling, token decimals, sanctioned-address checks, and offchain order records remain separate requirements.

### Contract Event Monitoring And Incident Triage

Developers and protocol operators can use `eth_getLogs` to retrieve events for a contract, topic, and block range when diagnosing a mint, swap, transfer, liquidation, or governance action. The output fields `address`, `topics`, `data`, `transactionHash`, `blockNumber`, and `removed` let a tool reconstruct what happened and whether any logs were affected by reorgs.

Businesses can use the same pattern for alert backfills and incident postmortems. If a webhook or stream missed events, a worker can chunk `fromBlock`/`toBlock` ranges, pull logs, decode them with ABI knowledge, and compare them to internal state. The important caveat is that log scans can hit plan-specific block-range and response-size limits, so large jobs need paging, block splitting, and deduplication by transaction hash plus log index.

### Read-Only Smart Contract State Checks

An individual can use `eth_call` to inspect contract state before acting, such as checking an allowance, reading a pool parameter, or previewing a view-function return. The request needs a `to` contract address, encoded `data`, and a block reference such as `latest`; the response is hex-encoded return data that must be decoded with the contract ABI.

For businesses, this is useful for preflight checks in wallets, checkout systems, risk controls, and DeFi operations. A system can verify whether a contract configuration changed or whether a user already granted approval, then route the user to the correct next step. The endpoint does not sign or broadcast transactions; any action based on the result requires separate wallet authorization and stronger safety controls.

### Support And Fraud Triage For Onchain Accounts

Support teams can use balances, token metadata, transfers, and logs to verify user-reported onchain states without asking for sensitive credentials. A user might report a missing deposit, unexpected NFT/token movement, or app balance mismatch; support can query by address, token contract, block range, and transaction hash to assemble a source-backed timeline.

The business value is faster triage with lower escalation load. Fields such as `hash`, `from`, `to`, `value`, `asset`, `category`, `blockNum`, and token metadata help classify whether the issue is indexing lag, wrong network, wrong token contract, contract behavior, or a real failed transfer. The limitation is privacy and policy: wallet addresses can reveal financial behavior, so stored records should be minimized and access-controlled.

### Lightweight Agent Access To Chain Facts

An autonomous agent that only needs a few chain facts can use this MPP endpoint instead of maintaining a native Alchemy account, app, API key, and monthly billing setup. Example tasks include checking whether a DAO vote transaction exists, confirming a known wallet's current native balance, or retrieving token metadata before formatting a user answer.

This is valuable when the cost of account setup exceeds the value of a small number of calls. It is not a replacement for high-volume infrastructure: production applications still need native usage dashboards, throughput controls, method allow-list clarity, support, and a strategy for retries, reorgs, and chain-specific limits.
