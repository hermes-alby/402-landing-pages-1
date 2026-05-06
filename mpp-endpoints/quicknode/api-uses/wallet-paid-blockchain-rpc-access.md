# Quicknode: Wallet-Paid Blockchain RPC Access API Uses

## What This Endpoint Group Does

This endpoint group provides accountless, wallet-paid access to Quicknode blockchain RPC and REST proxying. A caller selects a supported network slug, sends a JSON-RPC or chain-specific REST request, and pays with MPP instead of a Quicknode account/API key. The charge endpoint is best for low-volume or one-off requests; the session endpoint exposes the same practical RPC surface with lower per-request cost for sustained or agentic workflows.

The value comes from the upstream chain data returned by the requested method: block numbers, slots, chain ids, wallet balances, contract call outputs, logs, receipts, blocks, gas estimates, fee history, and chain-specific account data. Those fields let people and businesses verify onchain state, reconcile transactions, monitor contracts, prepare transactions, and debug issues without first provisioning a full Quicknode endpoint.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/:network` | One-off paid JSON-RPC or REST proxy request using MPP charge intent. | `network`, `Content-Type`, optional `Authorization: Payment`, JSON-RPC `jsonrpc`, `id`, `method`, `params`. | Upstream JSON-RPC `result` or `error`, 402 payment challenge, `Payment-Receipt`, gateway errors. |
| POST | `/session/:network` | Lower-cost repeated JSON-RPC or REST proxy request using MPP session vouchers. | `network`, `Content-Type`, session `Authorization: Payment`, JSON-RPC `jsonrpc`, `id`, `method`, `params`. | Upstream JSON-RPC `result` or `error`, 402 session challenge, `Payment-Receipt`, gateway errors. |

## Field Notes

### Inputs

The `network` path parameter is the primary routing input. Quicknode's public `GET /networks` snapshot from 2026-05-05 lists slugs such as `ethereum-mainnet`, `base-mainnet`, `base-sepolia`, `polygon-mainnet`, `solana-mainnet`, `arbitrum-mainnet`, `tempo-mainnet`, and `tempo-testnet`.

For JSON-RPC calls, the shared request fields are `jsonrpc`, `id`, `method`, and `params`. The `method` determines the true request schema. Examples from Quicknode's MPP docs include EVM `eth_blockNumber` and Solana `getSlot`; chain-specific docs linked from Quicknode's docs index cover many other methods. Common parameter families include wallet or contract addresses, block tags, block numbers, slots, event log filters, call objects, ABI-encoded data, transaction hashes, and signed raw transactions.

Payment is carried through HTTP headers rather than the JSON body. Unpaid requests receive a `WWW-Authenticate: Payment` challenge; paid retries include `Authorization: Payment <credential>`. Session requests require channel/session setup and vouchers handled by MPP client libraries.

### Outputs

Successful JSON-RPC responses return method-specific `result` values. For practical workflows this can include:

- current block height or Solana slot;
- chain id, syncing state, and node/client metadata;
- native-token or token balances;
- contract read outputs from `eth_call` or chain-equivalent methods;
- event logs with addresses, topics, data, block numbers, transaction hashes, and log indexes;
- transaction receipts with status, gas used, block number, sender/recipient, contract address, and logs;
- fee and gas estimates used to prepare transactions;
- upstream JSON-RPC `error` objects when requests are malformed, unsupported, or rejected.

Quicknode's MPP layer can also return gateway errors such as `unsupported_network`, `rate_limit_exceeded`, `lifetime_limit_reached`, and `mpp_not_configured`. Successful paid responses include a `Payment-Receipt` header; receipt references may be transaction hashes for charge payments or session channel ids for session payments.

### Important Constraints Or Gaps

MPP on Quicknode is documented as alpha and additive to standard Quicknode plans. It is useful for agents, prototypes, intermittent access, and permissionless per-request work, but production workloads may still need account-based plans, API keys, dashboards, support, SLAs, higher limits, analytics, and dedicated clusters.

The endpoint group is broad because the MPP proxy does not expose a single OpenAPI schema for every chain method. A complete field inventory for all possible methods would require chain-by-chain documentation. Use cases below therefore focus on RPC field families that are commonly available and explicitly supported by Quicknode's chain documentation model.

Transaction submission methods are intentionally treated as a boundary. Broadcasting a signed transaction can mutate chain state and requires explicit user approval, chain-id validation, signer controls, and receipt monitoring. This research did not call paid endpoints, sign wallets, open sessions, or submit transactions.

## Use Cases

### Wallet Balance And Gas Readiness Checks

A person can check whether a wallet has enough native token on `base-mainnet`, `ethereum-mainnet`, `arbitrum-mainnet`, `tempo-mainnet`, or another supported network before bridging, minting, claiming, or interacting with a dApp. The workflow uses the `network` slug plus balance methods such as `eth_getBalance` or chain-specific account methods; the important returned fields are balances, block/slot context, and any upstream error. The output tells the user whether to proceed, top up gas, change networks, or avoid a failed transaction.

A business can run the same checks across operational wallets before scheduled payouts, contract interactions, liquidations, or market-making jobs. Returned balance quantities and latest block/slot context can feed automated guardrails: pause a job when gas is below threshold, alert treasury when multiple wallets need funding, or choose a cheaper/livelier network route before asking a signer to approve a transaction. The main limitation is freshness: balances are only current at the observed block or slot, and repeated production checks may be better served by a standard Quicknode plan.

### Transaction Receipt Triage And Customer Support

A person who has a transaction hash can query a receipt method on the relevant `network` to determine whether a transfer, swap, mint, bridge deposit, or contract interaction succeeded. Receipt outputs such as `status`, `blockNumber`, `gasUsed`, `from`, `to`, `contractAddress`, and logs help decide whether to retry, wait for confirmations, contact an app, or share evidence with support.

For a business, support teams can use receipt and block fields to answer "where is my transaction?" tickets without relying only on block explorer links. A support workflow can enrich an internal ticket with status, block height, confirmations, gas used, and relevant logs, then route failures to engineering when the receipt indicates a contract revert or unexpected event. The endpoint does not decode every app-specific event by itself; teams need ABI/event knowledge or a decoder for human-friendly explanations.

### Contract State Reads For Apps And Agents

A developer or agent can use contract read methods such as `eth_call` to query ERC-20 balances, allowances, NFT ownership, pool reserves, bridge state, governance proposal state, or app-specific contract variables. Inputs include contract address, ABI-encoded call data, block tag, and selected network. Outputs are raw return data or chain-specific account objects that can be decoded into actionable state.

Businesses can use this for lightweight feature checks or operational automation: verify whether a customer has a token-gated asset, check whether an allowance is large enough before prompting for a swap, inspect a pool's reserves before routing a quote, or validate that a bridge message has reached a required state. The returned data is valuable because it lets the application make a go/no-go decision before any user signing step. The gap is that ABI decoding and business rules are outside the MPP endpoint; callers must provide those layers.

### Event Log Monitoring For Narrow Workflows

A person can monitor a small block range for an event involving a known address or topic, such as a transfer, mint, claim, deposit, withdrawal, or governance vote. The key inputs are `network`, log filter address, topics, `fromBlock`, and `toBlock`; the useful outputs are log address, topics, data, transaction hash, block number, and log index. This can answer "did the event I care about happen yet?" without setting up an indexing pipeline.

A business can use bounded log polling for lightweight operations: detect deposits to a protocol contract, watch for failed or missing bridge events, reconcile marketplace sales, or trigger internal workflows when a specific contract emits a known event. The endpoint is not a replacement for robust streaming or backfill infrastructure at high scale. Quicknode Streams or Webhooks may be more appropriate when the workflow needs guaranteed delivery, reorg handling, historical backfills, transformations, or many contracts across many networks.

### Chain Health And Network Route Verification

Before using a network in a script or agent workflow, a person can query `eth_chainId`, `eth_blockNumber`, `net_version`, Solana `getSlot`, or similar methods to verify that the selected slug resolves to the expected chain and is returning fresh data. The relevant outputs are chain id, current block/slot, syncing status where available, and upstream errors.

For a business, this becomes a preflight check before deployments, relayer jobs, monitoring tasks, or incident response. If a route returns an unexpected chain id, stale block height, `unsupported_network`, or repeated rate-limit errors, automation can fail closed instead of submitting work to the wrong network or reporting stale state. These checks are low-cost but not a full SLA monitor; production reliability workflows should compare multiple signals and may need standard Quicknode plan telemetry.

### Gas, Fee, And Nonce Preparation Before Explicit Signing

A user preparing a transaction can use read-only preparation methods to estimate gas, check current fees, and get nonce/account sequence state before asking a wallet to sign. The important inputs are the transaction call object, sender address, target contract, encoded data, value, and network. The outputs, such as gas estimate, gas price/fee history, and nonce, help prevent underpriced or invalid transactions.

Businesses can use these fields to improve transaction services, checkout flows, relayers, and account abstraction systems. Automation can estimate costs, reject transactions that exceed a budget, choose batching windows, or ask for explicit approval with a realistic fee preview. The boundary is important: estimating and preparing are read operations, while signing and broadcasting are sensitive mutation steps. This research did not sign or broadcast anything, and production systems need chain-id checks, simulation, replay protection, and signer policy controls.

### Intermittent Cross-Chain Research And Comparisons

A researcher can query the same basic method across several networks, such as block height, token contract state, or wallet balances, without creating separate provider endpoints for every chain. The `network` slug acts as the switchboard; the JSON-RPC envelope stays familiar while the method-specific `result` lets the researcher compare state across Base, Ethereum, Solana, Arbitrum, Polygon, Tempo, and other supported routes.

A business can use this for one-off chain due diligence, integration scoping, or incident checks: confirm whether a token or contract is live on candidate networks, compare current block progress during an outage, or inspect customer wallet state on the chain named in a support case. MPP pricing is attractive when the work is sporadic. For continuous analytics, the economics and operational features should be compared against Quicknode plans, Streams, Webhooks, SQL Explorer, or a dedicated indexing provider.

### Agentic Blockchain Data Retrieval With Spend Controls

An AI agent can use the charge endpoint for occasional chain facts and the session endpoint for repeated low-cost reads once a payment channel is funded. Because inputs are explicit (`network`, `method`, `params`) and outputs are structured JSON-RPC responses, the agent can decide whether it has enough evidence to answer a user, retry with a corrected network slug, or stop when gateway errors or spend limits are hit.

For businesses building agent workflows, the useful pattern is controlled, auditable access to onchain data: the agent can check wallet state, verify receipts, inspect contract state, or gather logs while recording request ids, network slugs, payment receipts, and returned block context. The constraints are payment-channel management, rate limits, alpha status, and method-specific safety. Agents should not be allowed to call transaction-broadcast methods unless a separate policy explicitly approves signing and mutation.
