# Tempo RPC: Tempo JSON-RPC Access API Uses

## What This Endpoint Group Does

This endpoint group covers the single MPP-gated Tempo RPC endpoint. It lets a client submit JSON-RPC calls to Tempo and pay per request through an MPP session instead of arranging a conventional hosted RPC account or API key. The request body is the standard JSON-RPC envelope: `jsonrpc`, `method`, optional `params`, and optional `id`. The useful data surface is determined by the selected RPC method.

The group is valuable because it gives scripts, developer tools, and agents direct access to current Tempo chain state, contract reads, block and transaction data, gas estimation, transaction submission, and Tempo-specific metadata such as fork schedules. Some documented Tempo namespaces are not generally available on public endpoints: consensus methods are validator-only, `consensus_subscribe` is WebSocket-only, and `admin_validatorKey` requires a self-hosted node with the admin API enabled.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `/` | Paid Tempo JSON-RPC call through MPP | JSON-RPC `method`, `params`, `id`; MPP payment voucher after 402 challenge | Method-specific `result` or `error`; fork schedule, block/transaction/contract state, gas estimates, consensus metadata where available |

## Field Notes

### Inputs

The most important input is `method`. Standard Ethereum RPC methods such as `eth_blockNumber`, `eth_call`, `eth_getLogs`, `eth_getTransactionReceipt`, `eth_estimateGas`, and `eth_sendRawTransaction` support common EVM workflows. Tempo-specific documented methods include `tempo_forkSchedule`, `tempo_fundAddress`, `consensus_getFinalization`, `consensus_getLatest`, `consensus_subscribe`, `consensus_unsubscribe`, `consensus_getIdentityTransitionProof`, and `admin_validatorKey`.

`params` are method-specific. Tempo's RPC reference documents no parameters for `tempo_forkSchedule`; an `address` parameter for `tempo_fundAddress`; a `"latest"` or `{ "height": number }` query for `consensus_getFinalization`; and `from_epoch` plus `full` for `consensus_getIdentityTransitionProof`. Standard Ethereum RPC methods add their own schemas for account addresses, block tags, transaction hashes, log filters, call objects, and raw transaction bytes.

MPP payment input is handled at the HTTP transport layer. Foundry's docs state that a first unpaid request receives `402 Payment Required`; the client then opens or reuses a payment channel and retries with an `Authorization: Payment` voucher. The MPP feed lists the charge as `$0.001` per request.

### Outputs

Outputs are method-specific JSON-RPC `result` values or JSON-RPC `error` objects. For Tempo-specific methods, useful outputs include fork schedule rows with `name`, `activationTime`, `active`, and `forkId`; consensus finalization fields such as `epoch`, `view`, `digest`, `certificate`, and `block`; consensus snapshots with `finalized` and `notarized`; identity transition proofs; and validator public keys on self-hosted admin-enabled nodes.

For standard Ethereum methods, outputs include block numbers, blocks, transaction objects, receipts, logs, account/code/storage data, contract call return data, gas estimates, and raw transaction hashes. Tempo modifies a few standard assumptions: `eth_getBalance` returns a large constant because Tempo has no native gas token, and token balances should be read through TIP-20 contracts.

### Important Constraints Or Gaps

The paid endpoint was not called during this research, so runtime 402 challenge details, batch behavior, and exact method availability on the MPP endpoint remain unverified. Static docs do not publish an OpenAPI spec. The service should be treated as a paid HTTP JSON-RPC transport, not as a full indexed data API: historical analytics, decoded token flows, risk scoring, and portfolio summaries may require indexers or specialist providers even when raw RPC data is available.

## Use Cases

### Pay-As-You-Go Smart Contract Reads

A developer or AI coding agent can read Tempo contract state through `eth_call` without creating a managed RPC account. Personal users can inspect TIP-20 balances, contract configuration, allowance state, or application-specific views from a terminal. Businesses can embed those reads into back-office workflows that verify whether a payment contract, fee pool, or stablecoin integration is configured as expected.

The fields that matter are the JSON-RPC `method`, the call `params` for target contract address and encoded calldata, and the `result` return data. The MPP payment wrapper adds a predictable per-request cost, so an agent can perform occasional checks without maintaining a monthly provider plan. The limitation is that raw contract return data must be ABI-decoded by the client, and high-volume monitoring may be better served by an indexer.

### Transaction Submission For Stablecoin Payment Workflows

Apps and agents that already construct signed Tempo transactions can submit them through `eth_sendRawTransaction`. Personal users can broadcast payments or contract interactions from scripts; businesses can use it to submit operational stablecoin transfers, settlement transactions, or smart contract actions when they want a machine-payable RPC path.

The key input is the raw signed transaction in `params`; key outputs are transaction hashes, receipts retrieved via follow-up calls, and error messages if the transaction is rejected. Tempo supports standard EVM transactions and Tempo Transactions, but production workflows must manage signing, compliance, nonce behavior, fee token selection, and confirmation monitoring outside the RPC call. This research did not send transactions.

### Forked Testing And Local Debugging

Foundry users can point `forge`, `cast`, `anvil`, or `chisel` at `https://rpc.mpp.tempo.xyz` and let the tool handle MPP payment challenges. Personal developers can fork mainnet-like Tempo state for debugging a contract or reproducing an issue. Businesses can run CI jobs or pre-deployment checks against recent Tempo state without provisioning provider credentials for every worker environment.

The endpoint returns the same kinds of raw state data that forked testing needs: block numbers, account storage, bytecode, logs, receipts, and call results. MPP channel reuse matters here because the first request may incur channel-opening latency while subsequent requests reuse vouchers. The gap is pricing behavior for large fork workloads: the feed says `$0.001` per request, but batch support and request volume controls are not documented in static sources.

### Payment Reconciliation Against Onchain Events

A merchant, marketplace, or payroll operator can query receipts and logs to reconcile stablecoin payment events against internal invoices or payout records. A personal user might verify that a transfer settled and inspect the transaction receipt. A business can automate checks that a transaction hash exists, succeeded, emitted the expected transfer event, and matches the expected contract address or memo-supporting token flow.

Useful fields are transaction hashes, block numbers, log filter params, receipt status, event logs, and decoded TIP-20 transfer data. The endpoint's value is fresh chain access with no API-key setup. The limitation is that JSON-RPC provides raw logs rather than normalized accounting records; durable reconciliation still needs ABI decoding, chain reorg/finality policy, storage, and idempotent matching logic.

### Gas And Fee Readiness Checks

Before submitting a transaction, a wallet, agent, or backend can call `eth_estimateGas` and contract balance methods to check whether the effective fee payer has enough selected TIP-20 fee token balance. Personal developers can diagnose why a payment transaction would fail. Businesses can preflight user actions and route them to top-up, sponsorship, or alternate fee-token flows before a failed checkout or payout.

The important outputs are gas estimates, token balance reads, and any RPC errors surfaced during simulation. Tempo's docs note that `eth_estimateGas` accounts for TIP-20 fee token balances instead of native ETH, and `eth_getBalance` should not be treated as a real spendable balance. Systems must therefore rely on TIP-20 `balanceOf` and Tempo fee-token logic instead of Ethereum-native ETH assumptions.

### Network Upgrade And Compatibility Monitoring

Infrastructure teams can call `tempo_forkSchedule` to see the active Tempo fork and scheduled fork metadata. Personal developers can quickly confirm that their tooling is pointed at a network with expected protocol behavior. Businesses running payment applications can use the active fork and `activationTime` fields to gate feature flags, compatibility checks, or upgrade runbooks.

The useful outputs are `schedule[]`, `active`, `name`, `activationTime`, `active`, and `forkId`. This is a stronger use case than a generic dashboard because protocol fork state directly affects transaction formats, fee behavior, and supported protocol features. Static docs show the method is available on all Tempo nodes, but the paid MPP endpoint was not called to verify runtime availability.

### Bridge, Explorer, And Validator-Side Consensus Verification

For validator-node operators, bridge builders, or explorer teams, the consensus namespace can return finalized blocks, notarized blocks, subscriptions, and identity transition proofs. A personal validator operator could inspect node consensus state. A business building a bridge or light-client flow could use `consensus_getFinalization` and `consensus_getIdentityTransitionProof` to verify finality and DKG identity transitions.

Key fields include `epoch`, `view`, `digest`, `certificate`, `block`, `finalized`, `notarized`, `identity`, and `transitions`. These outputs support decisions about when to accept a block as final, when to update bridge proofs, or when to alert on consensus lag. The major limitation is availability: Tempo docs say consensus methods are validator-node only and WebSocket subscriptions are validator WebSocket only, so this may not be available on the public MPP RPC endpoint.

### Self-Hosted Node Health And Admin Checks

Teams running their own Tempo node can use standard RPC calls such as `net_peerCount`, `eth_blockNumber`, and `admin_validatorKey` to monitor health and configuration. Personal node operators can check whether a local node is following the chain. Businesses can feed these checks into infrastructure monitoring to detect stalled sync, missing peers, or validator-key misconfiguration.

The endpoint group matters here because the same JSON-RPC interface can target either the public MPP endpoint or a self-hosted node, but admin methods require self-hosted nodes with the `admin` API enabled. The MPP public endpoint is not a replacement for private admin RPC. Operational workflows should restrict admin APIs to trusted networks and avoid exposing them publicly.
