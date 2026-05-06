# Conduit API Uses

## Service Summary

Conduit provides onchain infrastructure for rollups and applications. The MPP service at `https://mpp.conduit.xyz` gives paid per-call access to Conduit Nodes, letting callers send EVM JSON-RPC requests to Conduit-hosted networks such as Tempo, Plume, Katana, Zora, Mode, BOB, and others.

The local MPP catalog lists one normalized endpoint: `POST /:network/`. The endpoint is broad because the selected JSON-RPC `method` determines the actual work: chain status, balance checks, contract reads, logs, receipts, blocks, gas estimation, transaction broadcast, or traces. The highest-value MPP fit is occasional, accountless, targeted RPC access for agents and developer workflows. Sustained high-volume usage may be better served by direct Conduit Nodes plans and API keys.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| EVM JSON-RPC Network Access | 1 | Send standard JSON-RPC 2.0 requests to selected Conduit networks for onchain reads, receipts, logs, gas/nonce preparation, transaction broadcast, and debugging where supported. | [Details](api-uses/evm-json-rpc-network-access.md) |

## Highest-Value Uses

1. Wallet and treasury gas checks across Conduit networks before bridging, batching, or triggering app workflows.
2. Contract read automation with `eth_call` for balances, allowances, pool state, bridge state, and app-specific contract data.
3. Transaction receipt triage for support, reconciliation, and user-facing status explanations.
4. Event log monitoring for protocol deposits, withdrawals, mints, claims, governance actions, or marketplace activity.
5. Chain health checks using block height, chain id, syncing state, and client version.
6. Gas, fee, and nonce preparation before explicit user-approved transaction signing or broadcast.
7. Advanced incident analysis with debug and trace methods where the selected network supports them.

## Personal Use Opportunities

- Check whether a wallet has enough native token on Tempo, Plume, Katana, Zora, or another Conduit network.
- Confirm a transaction hash succeeded and inspect its receipt before retrying or contacting support.
- Read a token or NFT contract using `eth_call` when a wallet or block explorer view is unavailable or stale.
- Watch a narrow event-log range for a mint, bridge, transfer, or claim involving a known contract.
- Verify a network route is alive and returning the expected chain id before using it in a script.

## Business Use Opportunities

- Customer support: answer transaction-status tickets with receipts, logs, gas used, status, sender, recipient, and block number.
- Treasury operations: monitor native-token gas balances and nonces for operational wallets across Conduit networks.
- Product backend automation: read contract state and event logs for app features without operating node infrastructure.
- Protocol monitoring: detect deposits, withdrawals, mints, failures, and governance actions from logs over bounded block ranges.
- Reliability checks: compare block height, chain id, and syncing status across network routes before deployments or incident response.
- Transaction services: estimate gas, get fee history, and check nonces before asking users or automated signers for explicit approval.

## Endpoint Group Summaries

### EVM JSON-RPC Network Access

This group contains the single normalized MPP endpoint, `POST /:network/`. The caller chooses a Conduit network in the path and sends a JSON-RPC body with `jsonrpc`, `id`, `method`, and `params`. The endpoint supports practical onchain workflows such as balance checks, contract reads, event log queries, transaction receipt lookup, block inspection, fee estimation, and signed transaction broadcast. Detailed use cases and field notes are in [api-uses/evm-json-rpc-network-access.md](api-uses/evm-json-rpc-network-access.md).

## Field And Data Themes

- Network identity: `network` path id, chain id, network id, and concrete route names from gateway discovery.
- JSON-RPC envelope: `jsonrpc`, `id`, `method`, `params`, method-specific `result`, and `error`.
- Onchain identifiers: wallet addresses, contract addresses, transaction hashes, block hashes, block numbers, log indexes, and request ids.
- State-read inputs: block tags, transaction call objects, ABI-encoded call data, storage slots, and log filters.
- Economic quantities: balances in wei, gas estimates, gas used, gas price, base fee, priority fee, effective gas price, CU costs, and MPP price per request.
- Event and transaction outputs: event topics, log data, receipt status, sender/recipient, contract creation address, and transaction arrays.
- Operational signals: syncing state, current block height, JSON-RPC error code/message, `402 Payment Required`, and unknown-network 404 behavior.
