# DripStack API Uses

## Service Summary

DripStack exposes Substack-backed publication metadata and full-post retrieval through an agent-friendly API. The free endpoints list stored publications and return post-summary catalogs for a selected publication. The paid endpoint retrieves one full post as JSON, including `contentHtml`, after an MPP or x402 payment challenge is accepted.

The useful pattern is selective access: discover and rank candidate publications or posts for free, then buy only the article whose title, subtitle, and source metadata justify the cost.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Publication Catalog And Post Selection | 2 | Free discovery of stored publications, source metadata, and valid `postSlug` values before any paid retrieval. | [`api-uses/publication-catalog-and-post-selection.md`](api-uses/publication-catalog-and-post-selection.md) |
| Paid Post Content Retrieval | 1 | Paid conversion of one selected Substack-backed post into structured JSON with metadata, source URL, timestamps, and `contentHtml`. | [`api-uses/paid-post-content-retrieval.md`](api-uses/paid-post-content-retrieval.md) |

## Highest-Value Uses

DripStack is most valuable as a paid-source triage system for agentic research. A client can browse publications, inspect a publication's title-level post catalog, and stop at a 402 challenge to evaluate the exact cost before paying for the full article. That is stronger than blind paywall access because the free metadata narrows spend to a small set of likely useful posts.

The service is also valuable for specialist newsletter workflows: investment research, competitive intelligence, narrative monitoring, and personal knowledge management. The returned full-post fields can keep extracted claims tied to `publicationSlug`, `guid`, `url`, `author`, and timestamps, which makes source provenance cleaner than copied browser text.

## Personal Use Opportunities

- Build a private reading queue from publication titles, descriptions, and post summaries, then buy only the posts worth reading in full.
- Ask a personal assistant to summarize one selected Substack article, preserving the author, canonical URL, and publication timestamp in the note.
- Maintain a personal knowledge vault of occasional paid article notes, with strict handling of `contentHtml` as paid third-party content.

## Business Use Opportunities

- Let analysts pre-screen specialist newsletters by source and title before buying a small number of posts for claim extraction or briefing.
- Use paid full-post retrieval as a controlled RAG source acquisition step, with source metadata attached to every chunk or extracted claim.
- Monitor market or competitor narratives by tracking publication catalogs and buying only posts whose summaries indicate material relevance.
- Offer writer-facing agent access where agents can pay per article rather than forcing manual browsing or broad subscriptions, subject to explicit content-use terms.

## Endpoint Group Summaries

### Publication Catalog And Post Selection

The free discovery group covers `GET /api/v1/publications` and `GET /api/v1/publications/{publicationSlug}`. It returns publication identifiers, display metadata, source URLs, sync timestamps, and post summaries containing `slug`, `title`, and `subtitle`. This is the decision layer for source mapping, watchlists, and budget control before paid post access.

Full details: [`api-uses/publication-catalog-and-post-selection.md`](api-uses/publication-catalog-and-post-selection.md)

### Paid Post Content Retrieval

The paid retrieval group covers `GET /api/v1/publications/{publicationSlug}/{postSlug}`. It accepts publication and post slugs, returns 402 payment challenges when unpaid, and after payment is documented to return `FullPublicationPost` JSON with identifiers, article metadata, timestamps, canonical URL, image URL, and `contentHtml`.

Full details: [`api-uses/paid-post-content-retrieval.md`](api-uses/paid-post-content-retrieval.md)

## Field And Data Themes

- Discovery identifiers: `publicationSlug`, `siteUrl`, `post.slug`, `publicationId`, `guid`.
- Source context: publication `title`, `description`, `authorName`, `authorEmail`, `copyright`, post `title`, `subtitle`, `description`, `author`, `url`.
- Freshness hints: `lastSyncedAt`, `publishedAt`, `createdAt`, `updatedAt`.
- Paid content: `contentHtml` on successful paid retrieval.
- Payment metadata: dynamic USD budgeting range in OpenAPI, MPP Tempo payment claim in normalized data, and x402 challenge fields from the unpaid sample 402.
