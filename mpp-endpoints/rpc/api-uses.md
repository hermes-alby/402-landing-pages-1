# Tempo RPC API Uses

## Service Summary

Tempo RPC provides JSON-RPC access to the Tempo blockchain. The MPP endpoint at `https://rpc.mpp.tempo.xyz` exposes a paid `POST /` JSON-RPC transport for Tempo mainnet, with the MPP service feed listing a session charge of `$0.001` per request. Tempo's public docs also list direct public RPC endpoints for mainnet and Moderato testnet, plus a Foundry integration that automatically handles `402 Payment Required` challenges, payment channels, vouchers, and retries.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Tempo JSON-RPC Access | 1 | Paid per-request access to standard Ethereum JSON-RPC methods, Tempo-specific RPC metadata, contract reads, transaction submission, forked testing, and node or consensus data where available. | [`api-uses/tempo-json-rpc-access.md`](api-uses/tempo-json-rpc-access.md) |

## Highest-Value Uses

The highest-value use is pay-as-you-go developer and agent access to current Tempo chain state without standing up RPC infrastructure or managing a provider account. This is especially useful for occasional contract reads, Foundry fork tests, scripted diagnostics, and autonomous coding agents that need a paid RPC URL they can use through a standard toolchain.

For businesses, the strongest opportunities are payment reconciliation, transaction preflight, stablecoin contract monitoring, and CI or staging workflows that need real Tempo state. The endpoint is less suitable as a complete analytics product because it returns raw JSON-RPC data; decoded histories, portfolio views, risk scoring, and large-scale indexing require additional infrastructure.

## Personal Use Opportunities

Developers can use `cast`, `forge`, `anvil`, or `chisel` against the MPP URL for one-off state reads, forked debugging, and contract interaction checks. The JSON-RPC `method` and `params` fields provide access to block numbers, receipts, logs, call results, gas estimates, raw transaction submission, and Tempo-specific fork schedule metadata.

Personal node operators can also use the same RPC method patterns against a local node to check peer count, block height, and validator/admin configuration. The public MPP endpoint should not be assumed to expose private admin or validator-only consensus methods.

## Business Use Opportunities

Businesses building stablecoin payment systems can use paid RPC calls to verify transaction settlement, reconcile logs to invoices, preflight gas and fee-token readiness, monitor active fork compatibility, and submit signed transactions from controlled backends. The per-request MPP model can be attractive for agents, internal tools, and low-volume workflows where API-key onboarding or monthly RPC plans are heavier than the usage requires.

Teams running high-volume production workloads should evaluate whether the `$0.001` per request MPP price, channel behavior, and undocumented batch semantics fit their traffic. For sustained indexing or analytics, Tempo's ecosystem docs point to indexers and data platforms that may be more appropriate than raw RPC.

## Endpoint Group Summaries

### Tempo JSON-RPC Access

The single endpoint group covers `POST /` on `https://rpc.mpp.tempo.xyz`, using standard JSON-RPC envelopes and MPP session payment. It supports use cases around contract reads, transaction submission, forked testing, reconciliation, fee preflighting, network upgrade monitoring, validator-side consensus verification where available, and self-hosted node health checks. Full details: [`api-uses/tempo-json-rpc-access.md`](api-uses/tempo-json-rpc-access.md).

## Field And Data Themes

Inputs center on the JSON-RPC envelope: `jsonrpc`, `method`, `params`, and `id`. The `method` field controls the entire functional surface, spanning standard Ethereum namespaces such as `eth_`, `net_`, `web3_`, `txpool_`, `trace_`, and `debug_`, plus Tempo-specific methods like `tempo_forkSchedule`, `consensus_getFinalization`, and `admin_validatorKey`.

Outputs are method-specific `result` values or JSON-RPC `error` objects. Reusable data themes include account addresses, contract addresses, transaction hashes, block numbers, logs, receipts, gas estimates, fork IDs, activation timestamps, consensus epochs and views, block digests, certificates, and validator keys. Because Tempo has no native gas token, `eth_getBalance` should not be used as a real spendable-balance signal; TIP-20 contract reads and Tempo fee-token behavior matter.
