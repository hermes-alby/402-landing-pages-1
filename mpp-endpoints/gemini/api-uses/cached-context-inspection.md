# Google Gemini: Cached Context Inspection API Uses

## What This Endpoint Group Does

This group lists and inspects existing CachedContent resources. Cached context is preprocessed content that can be reused with a specific model in later generation requests, but the MPP catalog only exposes read endpoints for cache records.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/:version/cachedContents` | List cached content records. | version, pageSize, pageToken | cachedContents[], nextPageToken |
| GET | `/:version/cachedContents/*` | Fetch one cached content record. | version, cached content wildcard/name | CachedContent fields |

## Field Notes

### Inputs

List uses `pageSize` and `pageToken`; get uses a cached content resource name through the wildcard path.

### Outputs

CachedContent exposes `name`, `model`, `displayName`, `contents`, `systemInstruction`, `tools`, `toolConfig`, `usageMetadata`, `createTime`, `updateTime`, `expireTime`, and `ttl`. These fields tell a client what context exists, which model it belongs to, when it expires, and how much cached content usage it represents.

### Important Constraints Or Gaps

The listed MPP endpoints cannot create, patch, or delete cached content. Workflows that need to create or refresh caches need direct upstream Gemini access or another wrapper endpoint. Cached content can be model-specific and expiration-sensitive.

## Use Cases

### Cache Audit Before Reusing Expensive Context

A person working with a large document set can list caches and inspect `displayName`, `model`, `expireTime`, and `usageMetadata` before referencing `cachedContent` in a generation request. This helps avoid using the wrong model-specific cache or a cache that is about to expire.

A business can run the same check for repeated analysis of policy manuals, product catalogs, knowledge bases, or case histories. Cache metadata lets the system decide whether to reuse existing context, route to a direct upstream cache-creation flow, or fall back to uploading/providing context again.

### Operational Inventory Of Shared AI Context

Individuals can see what cached contexts exist and what they contain at a high level through `contents`, `systemInstruction`, and `tools`. This is useful when debugging why a generation request behaves differently from a fresh prompt.

For businesses, cache inspection supports governance: teams can catalog cached prompts, model bindings, expiration windows, and tool configurations. That helps identify stale or sensitive context before it is reused in production workflows.

### Expiration And Refresh Planning

The `createTime`, `updateTime`, `expireTime`, and `ttl` fields let a client forecast when a cache will become unusable. A person can refresh their workflow before a long project session; a business can schedule cache rebuilds outside peak hours.

Because the MPP catalog lacks cache creation or patching, this endpoint group cannot perform the refresh by itself. Its value is in detecting the need and handing off to an approved upstream or internal process.
