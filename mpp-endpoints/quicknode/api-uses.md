# Quicknode API Uses

## Service Summary

Quicknode provides blockchain infrastructure across 80+ blockchains and 140+ networks, including Core Node RPC APIs, Streams, Webhooks, IPFS, SQL Explorer, Solana Yellowstone gRPC, validator services, dedicated clusters, and Admin API tooling. The MPP service at `https://mpp.quicknode.com` gives first-party, wallet-paid access to Quicknode Core Node API proxying without a Quicknode account or API key.

The local manifest lists two MPP POST endpoints. Both send JSON-RPC or chain-specific REST requests to a selected network. The difference is payment mode: `/:network` uses one-off charge payments at `$0.001` per request, while `/session/:network` uses a session/payment-channel flow at `$0.00001` per request.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Wallet-Paid Blockchain RPC Access | 2 | Accountless blockchain RPC/REST reads and proxy calls across Quicknode-supported networks, using MPP charge or session payment credentials instead of Quicknode API keys. | [Details](api-uses/wallet-paid-blockchain-rpc-access.md) |

## Highest-Value Uses

1. Check wallet gas and token readiness before bridging, minting, claiming, swapping, or running operational jobs.
2. Triage transaction hashes with receipts, block numbers, status, gas used, sender/recipient fields, and logs.
3. Read contract state with `eth_call` or chain-specific equivalents before asking a user or signer to act.
4. Monitor bounded event-log ranges for deposits, withdrawals, mints, claims, governance actions, marketplace sales, or support investigations.
5. Verify chain health and route correctness with chain id, block height, slot, syncing state, and gateway errors.
6. Prepare transactions with gas, fee, and nonce reads before explicit signing or broadcast.
7. Let agents retrieve onchain facts with per-request spend visibility and receipt evidence.

## Personal Use Opportunities

- Confirm a wallet has enough gas on a specific network before attempting a transaction.
- Check whether a transaction succeeded and how many confirmations it has.
- Query a token or NFT contract for ownership, balance, allowance, or app-specific state.
- Watch a narrow event range for a bridge deposit, mint, claim, or transfer involving a known address.
- Compare basic chain state across networks without creating a provider account for each chain.

## Business Use Opportunities

- Customer support can enrich transaction tickets with receipts, block context, gas used, logs, and upstream errors.
- Treasury and operations teams can monitor native-token gas balances and pause jobs when wallets need funding.
- Product backends can perform targeted contract reads for eligibility, allowance, pool-state, or bridge-state checks.
- Protocol and marketplace teams can poll bounded event ranges for reconciliation and incident response.
- Agent platforms can give agents controlled onchain read access with payment receipts and explicit spend boundaries.
- Engineering teams can run preflight route checks before deployments, relayer jobs, or incident diagnostics.

## Endpoint Group Summaries

### Wallet-Paid Blockchain RPC Access

This group contains both manifest endpoints: `POST /:network` and `POST /session/:network`. The caller chooses a Quicknode network slug and sends a JSON-RPC body such as `{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}` or a chain-specific request. The outputs are upstream RPC results or errors, while the MPP layer adds 402 payment challenges, `Authorization: Payment` credentials, and `Payment-Receipt` headers. Detailed field notes and use cases are in [api-uses/wallet-paid-blockchain-rpc-access.md](api-uses/wallet-paid-blockchain-rpc-access.md).

## Field And Data Themes

- Routing and payment: `network`, MPP intent, amount, currency, `WWW-Authenticate`, `Authorization: Payment`, and `Payment-Receipt`.
- JSON-RPC envelope: `jsonrpc`, `id`, `method`, `params`, `result`, and `error`.
- Onchain identifiers: wallet addresses, contract addresses, transaction hashes, block hashes, block numbers, log indexes, chain ids, slots, and session channel ids.
- Economic quantities: MPP per-request price, token atomic units, gas price, gas estimate, gas used, native-token balances, and token balances.
- Contract and event data: ABI-encoded call data, return data, log addresses, topics, data payloads, receipts, and block context.
- Operational signals: rate-limit errors, unsupported-network errors, lifetime testnet caps, syncing status, route freshness, and upstream JSON-RPC errors.
