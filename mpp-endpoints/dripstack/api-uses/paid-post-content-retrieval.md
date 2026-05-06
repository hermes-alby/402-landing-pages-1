# DripStack: Paid Post Content Retrieval API Uses

## What This Endpoint Group Does

This endpoint group covers DripStack's paid full-post retrieval route for one Substack-backed article. A client supplies a normalized `publicationSlug` and a `postSlug` selected from the free publication catalog, receives a 402 payment challenge when unpaid, and retries with an MPP or x402 payment credential to receive structured post JSON.

The value is not discovery by itself. Discovery happens in the free routes. This group is the conversion point where a selected post becomes machine-readable full content: identifiers, title and description fields, canonical URL, author, timestamps, image URL, and `contentHtml`. That combination can support high-signal article summarization, citation, extraction, and workflow automation, as long as the caller has accepted the per-post payment and respects the underlying publisher's rights.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/publications/{publicationSlug}/{postSlug}` | Retrieve one full Substack-backed post as JSON after payment; unpaid requests return 402 challenges for MPP and x402. | `publicationSlug` path parameter, `postSlug` path parameter, then `Authorization: Payment <credential>` for MPP or `PAYMENT-SIGNATURE` for x402 after the 402 challenge. | On 200: `id`, `publicationId`, `publicationSlug`, `guid`, `slug`, `title`, `subtitle`, `description`, `url`, `author`, `imageUrl`, `publishedAt`, `contentHtml`, `createdAt`, `updatedAt`. On 402: problem fields plus `WWW-Authenticate` and `PAYMENT-REQUIRED` payment challenge headers. |

## Field Notes

### Inputs

`publicationSlug` is the normalized publication host, such as `qualitystocks.substack.com`; DripStack's docs say custom domains remove a leading `www.`. The `postSlug` should come from the free publication detail response, because the paid route returns 404 when the publication or post cannot be found and the free summaries are the safe way to choose valid post identifiers.

Payment inputs are intentionally second-step inputs. An unpaid request returns HTTP 402, then a payment-aware client retries with either `Authorization: Payment <credential>` for MPP or `PAYMENT-SIGNATURE` for x402 v2. The captured sample 402 used x402 `exact` payment on `eip155:8453` with USDC, amount `10000` base units, and `maxTimeoutSeconds` 300. The MPP feed identifies Tempo as the method and marks the amount as dynamic.

### Outputs

The successful response schema, `FullPublicationPost`, is structured for downstream processing. Identifiers (`id`, `publicationId`, `publicationSlug`, `guid`, `slug`) make the article deduplicable and linkable to the upstream source. Descriptive fields (`title`, `subtitle`, `description`, `url`, `author`, `imageUrl`) support source cards, citations, and relevance checks. Timestamp fields (`publishedAt`, `createdAt`, `updatedAt`) help callers reason about article freshness and DripStack record freshness, although the captured schemas only type them as strings. `contentHtml` is the main paid payload and may be `null` by schema, even though it is the reason to pay.

The 402 output is also useful. The body includes `type`, `title`, `status`, `detail`, and optional `challengeId`; the headers expose both MPP and x402 payment requirements. OpenAPI lists a dynamic USD range of `0.01` to `10.00`, the MPP feed has an amount hint of `$0.05-$10`, and the docs say the live 402 challenge is authoritative for the exact post.

### Important Constraints Or Gaps

No paid 200 response was sampled under the no-paid-calls policy. The full response fields come from OpenAPI and the decoded public payment challenge example, not from retrieved paid content.

Free post summaries do not expose the exact per-post price, canonical URL, author, image, or publish timestamp before payment. A client must use the 402 challenge to know the live price and should apply budget caps before retrying with credentials.

The captured docs do not define rate limits, cache freshness guarantees, redistribution rights, retention limits, or whether `contentHtml` may be used for model training. Because DripStack wraps third-party Substack publications, consumers should treat the returned HTML as licensed article content, not as freely reusable public-domain data.

## Use Cases

### Pay-Per-Article Research Assistant

An individual assistant can browse free publication catalogs, pick one or a few promising `postSlug` values from titles and subtitles, then purchase only the article needed for a specific question. The returned `contentHtml`, title, author, URL, and timestamps let the assistant produce a grounded summary with a clean source citation rather than relying on search snippets or a user's memory of the article.

The main prerequisite is a payment-aware client with a funded wallet and a strict approval or budget policy. Since the free catalog does not show the exact post price, the assistant should stop at the 402 challenge, show the live price, and proceed only when the user accepts the charge. Raw article dumps, broad redistribution, and model-training use remain compliance risks because the captured docs do not grant those rights.

### Analyst Briefing From Specialist Newsletters

Research, investing, and strategy teams can use the endpoint to turn selected Substack posts into structured briefing inputs. The route is useful when a title or subtitle from the free catalog looks directly relevant to a company, market, policy issue, or technical niche, and the team wants the full article text for claim extraction, thesis comparison, or evidence review.

The output fields support traceability: `guid`, `url`, `publicationSlug`, `author`, and `publishedAt` can stay attached to extracted claims. Costs are granular but dynamic, so teams need per-run spend ceilings and deduplication using the post identifiers. Freshness should be checked against `publishedAt` and `updatedAt`, and the lack of documented redistribution terms means internal-use summaries are safer than republishing full HTML.

### Selective RAG Source Acquisition

A retrieval-augmented answer system can use DripStack as a paid source acquisition step after free discovery has narrowed the candidate set. Rather than buying every possible article, the system can shortlist by publication and post summary, inspect the 402 price challenge, then purchase only the few posts it will actually cite in a final answer.

The endpoint's JSON shape is practical for this because `contentHtml` carries the body, while `title`, `description`, `url`, `author`, and timestamps provide metadata for citation and chunk provenance. The system still needs HTML cleaning, quote-length controls, rights-aware storage, and spend controls. It should not silently train or permanently index paid content unless the publisher and platform terms allow it.

### Competitive And Narrative Monitoring

Content, product, and communications teams can monitor free catalogs for writers or publications that shape a market narrative, then buy the full post only when a summary suggests meaningful movement. The paid response can feed internal notes on messaging, emerging objections, customer language, or competitor positioning while retaining the article's source URL and author.

This is strongest for selective review, not bulk scraping. The route has dynamic pricing, no documented rate limits in the captured sources, and no prepayment field for price overrides. Teams should keep the original post metadata with any extracted insights, avoid copying large portions into shared collateral, and account for the possibility that DripStack's stored record may lag the upstream publication.

### Personal Knowledge Vault With Paid Source Links

A reader can build a private reading and notes workflow around occasional Substack purchases. After choosing a post from a known publication, the paid route can return the full HTML plus the article's identifiers and metadata, letting the user's tool save a note, extract highlights, and link back to the canonical article.

This use case depends on personal-use boundaries. The fields make organization straightforward, but the content is still paid third-party writing. A vault should preserve the canonical `url`, author, and timestamps, avoid sharing full `contentHtml` with other users, and refresh or recheck only when needed because every paid retrieval may incur a new cost.

### Writer-Facing Agent Access Product

For publishers and tools serving writers, this route suggests a product pattern where agent readers can pay per article instead of forcing a subscription or manual browser session. DripStack handles the payment challenge and returns article JSON that agents can summarize or cite, while free catalog routes help agents decide which post is worth buying.

The business value is a lower-friction sales surface for occasional agent traffic. The unresolved issues are important: the docs captured here do not describe publisher controls, per-post price discovery before 402, refund behavior, analytics, or content usage terms. Any writer-facing product would need explicit policy language for what buyers may store, summarize, quote, or redistribute.
