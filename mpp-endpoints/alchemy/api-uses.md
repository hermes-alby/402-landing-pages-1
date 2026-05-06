# Alchemy API Uses

## Service Summary

Alchemy is a first-party blockchain infrastructure and data provider. The Alchemy MPP service exposes three paid wildcard endpoints through `https://mpp.alchemy.com`: one JSON-RPC route for `eth_*` and `alchemy_*` methods, plus GET and POST routes for NFT API v3 operations. Together they let an agent or application retrieve chain state, balances, token metadata, transfers, logs, read-only contract-call outputs, NFT ownership, NFT metadata, collection context, spam signals, and batch NFT metadata.

The strongest MPP opportunity is low-friction occasional access to Alchemy-backed blockchain facts. A caller can pay for a small number of data calls without creating an Alchemy account, provisioning API keys, or managing monthly billing. High-volume production systems still need native Alchemy controls, throughput planning, observability, support, and clear method allow-lists.

This artifact is based on local MPP metadata and public Alchemy documentation snapshots only. No paid endpoint calls, account actions, API-key creation, wallet signatures, x402/MPP settlements, transaction broadcasts, metadata refresh jobs, spam reports, or mutations were performed.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Blockchain RPC And Token Activity | 1 | Read EVM chain state, balances, token metadata, transfers, logs, and read-only contract outputs through the JSON-RPC wildcard endpoint. | [api-uses/blockchain-rpc-and-token-activity.md](api-uses/blockchain-rpc-and-token-activity.md) |
| NFT Ownership Metadata And Market Context | 2 | Retrieve NFT ownership, token metadata, contract/collection context, spam signals, batch metadata, and provider-side refresh status through NFT API v3 wildcard endpoints. | [api-uses/nft-ownership-metadata-and-market-context.md](api-uses/nft-ownership-metadata-and-market-context.md) |

## Highest-Value Uses

- Wallet and portfolio review: combine native balances, token balances, token metadata, NFT holdings, NFT images, spam signals, and metadata freshness to show what a wallet owns and which records need caution.
- Payment and settlement evidence: use asset transfers, logs, transaction hashes, block numbers, sender/recipient fields, and raw values to verify whether an onchain payment or token movement occurred.
- Token-gated access and membership verification: check NFT ownership by wallet, contract, token ID, and block snapshot before granting access to communities, events, support benefits, or loyalty features.
- Support and incident triage: reconstruct wallet, transfer, token, NFT, and metadata issues without asking users for private credentials.
- NFT marketplace and catalog enrichment: batch metadata and contract metadata to populate asset cards, detect broken token URIs, preserve raw metadata drift, and flag spam or stale cache states.
- Contract/event monitoring: use `eth_call` and `eth_getLogs` for read-only preflight checks, alert backfills, and incident investigations.

## Personal Use Opportunities

An individual can use Alchemy MPP as a pay-per-call source of wallet facts: check gas balance, token balances, NFT holdings, suspicious airdrops, token metadata, and recent transfer evidence before making a decision. The most useful fields are addresses, token contracts, token IDs, balances, transfer hashes, NFT images, raw metadata, spam classifications, `validAt`, and `timeLastUpdated`.

The personal value is convenience. A one-off agent can answer "what does this wallet hold?", "did this payment arrive?", "who owns this NFT?", or "why is this NFT image stale?" without setting up a developer account. The caveat is that results are chain-specific, method-specific, and sometimes cached; high-stakes decisions still need source review and confirmations.

## Business Use Opportunities

Businesses can use these endpoints in wallets, marketplaces, fintech apps, support tools, risk triage, accounting workflows, token-gated SaaS, and community platforms. The API fields support concrete decisions: grant access, reconcile a payment, flag a suspicious NFT, retry a metadata refresh, split a log backfill into smaller block ranges, or route a support case to the right team.

For production volume, direct Alchemy Pay as You Go or Enterprise plans are likely more appropriate because they expose native usage analytics, throughput controls, custom limits, and support. MPP is most compelling for agents, evaluation harnesses, demos, low-frequency automations, and workflows where account/API-key setup is the dominant friction.

## Endpoint Group Summaries

### Blockchain RPC And Token Activity

`POST /:network/v2` accepts JSON-RPC bodies with `jsonrpc`, `id`, `method`, and method-specific `params`. Representative read-only methods include `eth_getBalance`, `eth_call`, `eth_getLogs`, `alchemy_getTokenBalances`, `alchemy_getTokenMetadata`, and `alchemy_getAssetTransfers`. It returns method-specific JSON-RPC `result` values such as hex balances, contract call data, log rows, token balance rows, token metadata, transfer rows, and pagination keys. Full details: [api-uses/blockchain-rpc-and-token-activity.md](api-uses/blockchain-rpc-and-token-activity.md).

### NFT Ownership Metadata And Market Context

`GET /:network/nft/v3/:endpoint` and `POST /:network/nft/v3/:endpoint` route to NFT API v3 operations. Representative inputs include owner address, contract address, token ID, token type, page cursors, spam filters, `withMetadata`, `tokenUriTimeoutInMs`, `tokens[]`, and `contractAddresses[]`. Outputs include `ownedNfts[]`, token metadata, contract metadata, OpenSea metadata where available, image and animation URLs, raw metadata, collection details, spam classifications, mint/acquisition fields, `validAt`, `pageKey`, and refresh status fields. Full details: [api-uses/nft-ownership-metadata-and-market-context.md](api-uses/nft-ownership-metadata-and-market-context.md).

## Field And Data Themes

- Identifiers: `network`, wallet address, contract address, token ID, transaction hash, block hash, block number, log index, collection slug, page key, and unique transfer ID.
- Quantities and value fields: native balance in wei, ERC-20 token balances, token decimals, transfer value, raw contract value, NFT balance, total supply, total count, floor price, page size, and MPP raw payment amount.
- Provenance and freshness: `validAt.blockNumber`, `validAt.blockTimestamp`, `timeLastUpdated`, transfer block fields, `removed` on logs, `pageKey`, raw metadata errors, and metadata refresh status.
- Content fields: NFT name, description, image URLs, animation URLs, raw token URI, raw attributes, collection description, external URL, social links, token logo URL, log topics, and raw event data.
- Risk fields: spam filters, spam confidence, `isSpam`, `spamClassifications`, per-token errors, invalid NFT token types, and JSON-RPC errors.
