# Object Storage: Object Listing And Discovery API Uses

## What This Endpoint Group Does

This group covers the object discovery path. A paid `GET /` request is intended to return the keys and likely basic metadata for objects in the Tempo Object Storage namespace. The listing step matters because downloads are dynamically priced by object size and mutations have state risk; an agent needs a way to decide which key to retrieve, ignore, or delete before spending more money.

The exact paid response schema is not public. Cloudflare R2's compatible upstream operations support list filters such as `prefix`, `delimiter`, `max-keys`, and pagination markers, but Tempo has not documented whether its wrapper forwards those parameters.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `GET` | `/` | List objects in the storage namespace. | Optional S3-compatible filters if forwarded: `prefix`, `delimiter`, `max-keys`, `marker`, `continuation-token`. | Expected key list with possible size, ETag, and last-modified metadata; unpaid requests return 402 payment metadata. |

## Field Notes

### Inputs

The only confirmed wrapper path is `/`. Compatibility-derived optional fields include `prefix` for narrowing to a workflow folder, `delimiter` for grouping pseudo-directories, `max-keys` for bounding response size, and marker or continuation token fields for pagination. These are useful for budget control, but they remain unconfirmed on the Tempo wrapper.

### Outputs

A useful successful list response would expose object `key`, byte `size`, `lastModified`, and `etag`, matching common S3 list semantics. Those fields would let an agent choose which artifact to download, estimate dynamic retrieval cost, avoid stale objects, and detect whether a previously known object has changed. The only directly observed response for this group is a safe unpaid 402 challenge with amount `100` and Tempo payment metadata.

### Important Constraints Or Gaps

No paid list response was retrieved. The wrapper's namespace, pagination behavior, sort order, and visibility rules are not documented. The live descriptor confirms `GET /` with amount `100`, but does not publish response fields.

## Use Cases

### Agent Artifact Picker

A personal coding or research agent can list stored objects under a run prefix such as `runs/2026-05-05/` and pick the relevant `summary.md`, `raw.html`, or `dataset.csv` key before downloading. If the list includes size and last-modified fields, the agent can avoid downloading stale or oversized files and ask for approval before expensive retrieval.

For a business workflow, the same pattern supports batch pipelines where agents exchange intermediate artifacts through object keys. A report generator can list `customer-a/reports/`, select the newest completed output, and pass only that key to a reviewer or delivery step. The output fields matter because keys identify artifacts, timestamps indicate freshness, and size hints inform per-download cost.

### Spend-Gated Retrieval Planning

Because downloads are dynamically priced by size, listing is the natural preflight step. A personal assistant can list available backups or exported notes, inspect object sizes if exposed, and avoid retrieving a multi-megabyte file when a smaller summary object is available.

Businesses can use the same pattern to enforce agent budget policies. A workflow engine can list candidate objects, rank them by key naming conventions and size, and retrieve only the smallest object that satisfies the task. The current limitation is that size and pagination are expected from S3-style listing but not guaranteed by the public Tempo docs.

### Workflow State Inspection

Object keys can function as lightweight workflow state. A user can ask an agent whether a generated invoice, chart, or scraped page exists by listing a known prefix rather than attempting a paid download for each possible filename.

For teams, listing enables simple coordination between independent agents: one agent uploads an object, another agent lists the namespace to detect completion, and a third retrieves it. This is valuable when agents do not share a database or cloud account, but it depends on well-understood key scoping; Tempo has not documented whether keys are global, payer-scoped, or session-scoped.

### Cleanup Candidate Selection

Listing can identify old, duplicate, or temporary objects before calling the delete endpoint. A personal user might list `tmp/` and delete expired scratch files after confirming names and ages.

A business can schedule cleanup agents that list prefixes for completed jobs, compare timestamps against retention policy, and delete only keys that are no longer needed. This avoids blind deletion, but it requires the list response to expose enough metadata to make retention decisions.
