# Alchemy: NFT Ownership Metadata And Market Context API Uses

## What This Endpoint Group Does

This group covers the two Alchemy NFT API v3 MPP wildcard endpoints: `GET /:network/nft/v3/:endpoint` and `POST /:network/nft/v3/:endpoint`. Together they expose NFT ownership, metadata, collection/contract context, spam signals, batch metadata, sales/floor context, and provider-side metadata refresh status.

The MPP wrapper does not publish a concrete per-endpoint OpenAPI schema, so this artifact uses representative official Alchemy NFT API v3 docs. No paid calls, metadata refresh requests, spam reports, wallet signatures, account actions, or mutations were executed.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/:network/nft/v3/:endpoint` | NFT API v3 wildcard for read-style operations such as ownership, token metadata, contract metadata, collection holdings, owners, spam checks, floor price, and NFT sales. MPP endpoint ID: `endp_dfd4dbbcae26ec7b8f75`; MPP URL: `https://mpp.alchemy.com/:network/nft/v3/:endpoint`; provider path: `/nft/v3/{apiKey}/{endpoint}`. | `network`, `endpoint`, `owner`, `contractAddress`, `contractAddresses[]`, `collectionSlug`, `tokenId`, `tokenType`, `withMetadata`, `pageKey`, `pageSize`, `startToken`, `limit`, `orderBy`, spam filters, `tokenUriTimeoutInMs`, and `refreshCache` where supported. | `ownedNfts[]`, `nfts[]`, `owners[]`, contract metadata, NFT image/raw metadata, collection metadata, OpenSea metadata, spam classifications, mint/acquisition details, `totalCount`, `validAt`, and `pageKey`. |
| POST | `/:network/nft/v3/:endpoint` | NFT API v3 wildcard for body-based operations such as `getNFTMetadataBatch`, `getContractMetadataBatch`, and `refreshNftMetadata`. MPP endpoint ID: `endp_f8d48a4be76f5e594137`; MPP URL: `https://mpp.alchemy.com/:network/nft/v3/:endpoint`; provider path: `/nft/v3/{apiKey}/{endpoint}`. | `network`, `endpoint`, JSON body `tokens[]`, `contractAddresses[]`, `contractAddress`, `tokenId`, `tokenUriTimeoutInMs`, and `refreshCache`. | Arrays of NFT metadata or contract metadata; for refresh jobs, `status` and `estimatedMsToRefresh`. |

## Field Notes

### Inputs

The most important path fields are `network` and `endpoint`. The NFT API docs list many endpoint names, including ownership endpoints (`getNFTsForOwner`, `getOwnersForNFT`, `getContractsForOwner`), metadata endpoints (`getNFTMetadata`, `getNFTMetadataBatch`, `getContractMetadataBatch`), spam endpoints, and sales endpoints. The public MPP catalog does not say which are allowed behind the wildcard path.

Owner workflows center on `owner`, optional `contractAddresses[]`, `withMetadata`, `pageKey`, `pageSize`, `orderBy=transferTime`, and spam filters. Token-specific metadata workflows center on `contractAddress`, `tokenId`, `tokenType`, `tokenUriTimeoutInMs`, and sometimes `refreshCache`.

Batch POST workflows use `tokens[]` with `contractAddress`, `tokenId`, and optional `tokenType`, or `contractAddresses[]` for contract metadata. The docs describe up to 100 tokens for `getNFTMetadataBatch`. Refresh-oriented fields such as `refreshCache` and `refreshNftMetadata` can trigger provider-side cache work and should require explicit user approval in any real workflow.

### Outputs

NFT ownership responses can include `ownedNfts[]`, `totalCount`, `pageKey`, and `validAt` block snapshot fields. Each NFT object can include `contract`, `tokenId`, `tokenType`, `name`, `description`, image and animation URLs, `raw.tokenUri`, raw metadata and attributes, `collection`, `timeLastUpdated`, `acquiredAt`, `mint`, and sometimes `owners`.

Contract and collection metadata can include address, name, symbol, total supply, token type, deployer address, deployed block number, OpenSea metadata, floor price, safelist status, image URLs, descriptions, external URL, social links, and last ingestion time. Spam-related outputs can include `isSpam` and `spamClassifications`, but the docs note paid-tier and chain limitations for some spam functionality.

Batch POST endpoints return arrays of NFT or contract metadata. `refreshNftMetadata` returns a job-like response with `status` and `estimatedMsToRefresh`.

### Important Constraints Or Gaps

The wrapper's exact endpoint allow-list, error envelope, payment challenge, and rate limits were not publicly available. This matters because the MPP path is a wildcard and Alchemy's native NFT API contains both read endpoints and provider-side actions such as metadata refresh or spam reporting.

NFT support varies by chain. The docs also indicate that spam filtering, transfer-time ordering, OpenSea metadata, and refresh behavior can vary by network or paid tier. Consumers should preserve `validAt`, `timeLastUpdated`, `pageKey`, and source metadata so stale or partial data is visible.

The MPP catalog lists raw 6-decimal payment amounts of `500` for both NFT wildcard endpoints. Native Alchemy pricing is Compute Unit based, so wrapper payment and provider CU cost should not be assumed equivalent without runtime verification.

## Use Cases

### Wallet NFT Portfolio Review

A person can use owner-focused NFT endpoints to see what NFTs a wallet currently holds, filter out known spam or airdrops where supported, and inspect each asset's name, image, collection, token ID, and metadata freshness. Inputs such as `owner`, `contractAddresses[]`, `withMetadata`, `pageSize`, `pageKey`, `excludeFilters[]`, and `spamConfidenceLevel` shape the result, while `ownedNfts[]`, `totalCount`, `validAt`, `timeLastUpdated`, and `pageKey` make the output reviewable.

A wallet or portfolio business can use the same fields to populate NFT tabs, support wallet import, detect suspicious assets, and avoid expensive metadata retrieval when users only need a quick list. The main limitations are chain support, spam-filter availability, and metadata freshness; `validAt` and `timeLastUpdated` should be displayed or stored so stale displays do not look authoritative.

### Token-Gated Access And Membership Verification

Communities, event tools, and SaaS products can verify whether a wallet holds an NFT from a required contract or collection before granting access. Depending on the workflow, the system can query `getNFTsForOwner`, `getContractsForOwner`, `isHolderOfContract`, or ownership-by-token endpoints. The important fields are `owner`, `contractAddress`, `tokenId`, `owners[]`, `ownedNfts[]`, token type, and `validAt`.

For a business, this supports gated Discord roles, loyalty benefits, allowlist checks, support entitlements, or event entry. The decision enabled by the output is concrete: grant, deny, ask the user to switch networks, or retry after a new block. Because ownership can change quickly, high-value gates should define acceptable block freshness and avoid relying on old cached responses.

### NFT Metadata Quality And Reveal Monitoring

Creators and NFT project operators can inspect whether token metadata has resolved after mint or reveal. `getNFTMetadata`, `getNFTMetadataBatch`, and contract metadata endpoints expose `raw.tokenUri`, `raw.metadata`, `raw.error`, image URLs, `attributes`, `collection`, `timeLastUpdated`, and contract-level metadata. This lets an operator find missing images, broken token URIs, stale attributes, or contracts that still show prereveal metadata.

For businesses such as marketplaces or portfolio apps, batch metadata workflows reduce repeated per-token lookups and help keep catalog displays consistent. Fields like `tokenUriTimeoutInMs` can trade freshness against latency, and `refreshCache` or `refreshNftMetadata` can request provider-side cache refresh when explicitly authorized. This research did not execute refresh calls; production usage needs controls to prevent unnecessary cache jobs and cost spikes.

### Collection Due Diligence And Marketplace Listing Checks

A buyer, analyst, or marketplace operator can use contract and collection metadata to inspect collection name, symbol, total supply, deployer address, deployed block number, collection description, external URL, social links, OpenSea safelist status, and floor price where available. Token metadata fields add image, attributes, token URI, and owner context.

Businesses can use this to pre-screen collection listings, flag suspicious metadata, enrich search results, or decide whether a contract should be hidden, reviewed, or manually approved. The value comes from combining identifiers and content fields: a verified-looking collection name is stronger when paired with contract address, deployer, token type, metadata freshness, and spam classifications. OpenSea metadata is not universal across all chains, so absence should not be treated as proof of fraud.

### NFT Support And Dispute Triage

Support teams can answer questions such as "Why does my NFT not show up?", "Did this token transfer?", or "Why is the image wrong?" using owner, token metadata, and contract metadata endpoints. The workflow starts from user-provided wallet address, contract address, token ID, and network, then retrieves ownership, `validAt`, metadata, `timeLastUpdated`, `raw.error`, image URLs, and possibly mint/acquisition data.

This gives support staff a source-backed answer without requesting seed phrases or wallet signatures. It also separates likely causes: wrong network, token not held, stale provider cache, broken token URI, unsupported token standard, spam classification, or marketplace metadata mismatch. If a refresh is needed, it should be an explicit action with user approval because refresh endpoints can trigger provider-side work.

### Batch NFT Enrichment For Apps And Indexers

An application that already knows a list of contract/token pairs can call `getNFTMetadataBatch` to enrich up to the documented batch size instead of making one request per NFT. Useful inputs are `tokens[]`, `tokenUriTimeoutInMs`, and optional `refreshCache`; useful outputs include names, descriptions, images, animation media, raw metadata attributes, collection data, owner lists where returned, and metadata errors.

For a business, this supports marketplace ingestion, wallet import, CRM-style customer asset enrichment, or periodic catalog normalization. The key operational decisions are which tokens to batch, whether stale cache is acceptable, and how to handle per-token errors without dropping records. Raw metadata and errors should be preserved because NFT schema drift is common and silently normalizing it can hide broken or misleading assets.

### Spam And Airdrop Risk Filtering

Individuals often see unwanted NFTs in wallets. The owner endpoints' `excludeFilters[]`, `includeFilters[]`, and `spamConfidenceLevel` fields, plus output fields such as `isSpam` and `spamClassifications`, can help hide or separate suspicious NFTs from intentional holdings where those filters are supported.

Wallet businesses can use these fields to reduce phishing exposure, improve portfolio readability, and route edge cases to review. This is not a perfect abuse classifier: the docs note chain and paid-tier limits, and spam labels can be incomplete or contested. Any automated hiding or warning should preserve the underlying contract address and allow recovery from false positives.
