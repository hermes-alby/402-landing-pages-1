# Object Storage: Object Deletion And Cleanup API Uses

## What This Endpoint Group Does

This group covers object removal. `DELETE /:key` deletes one object by key after MPP payment. The endpoint is important because object storage workflows often produce temporary files, intermediate artifacts, and sensitive outputs that should not remain accessible indefinitely.

Deletion is a mutation and was not tested. The live descriptor and mpp.dev feed both list a fixed amount of `100` for this endpoint. Cloudflare R2's compatible `DeleteObject` operation documents a conditional delete header, but Tempo has not confirmed whether the wrapper supports it.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `DELETE` | `/:key` | Delete one object by key. | `key`; optional compatibility-derived `x-amz-if-match-last-modified-time` if forwarded. | Payment challenge; likely empty success response or wrapper-defined deletion status after payment. |

## Field Notes

### Inputs

The confirmed input is the object `key`. A conditional last-modified header would let a caller delete only if an object has not changed since it was listed, but that support is inferred from R2 compatibility and not confirmed for Tempo.

### Outputs

The unpaid path is expected to return payment challenge metadata. A successful delete in S3-style APIs is often an empty success response, but the Tempo wrapper might return a JSON status. No successful delete schema is public.

### Important Constraints Or Gaps

No DELETE request was made. Missing-key behavior, idempotency, namespace scoping, audit logging, soft-delete behavior, and conditional deletion support are unknown.

## Use Cases

### Temporary File Cleanup

A personal user can ask an agent to remove temporary files after a task, such as scratch HTML captures, intermediate JSON, or generated images. The key identifies the target object, and fixed delete pricing makes the cleanup cost predictable.

A business can attach cleanup to the end of batch jobs. After a report is delivered or a review window expires, an automation can delete intermediate objects and retain only final outputs. This reduces exposure of stale workflow artifacts, but it depends on reliable key scoping and clear missing-key behavior.

### Retention Policy Enforcement

If listing exposes timestamps, an agent can find old keys and delete objects beyond a retention window. A personal assistant might remove exported personal notes after they have been summarized into a local vault.

For companies, object deletion supports data minimization policies. Support attachments, scrape outputs, or temporary enriched datasets can be removed after a case closes. The current API does not document audit logs, retention guarantees, or compliance features, so this endpoint is best viewed as operational cleanup rather than a complete compliance system.

### Cost And Namespace Hygiene

Even when direct R2 egress is free, object sprawl makes workflows harder to inspect. A user can delete obsolete keys to keep future list calls usable and reduce accidental retrieval of stale files.

Businesses running many agent jobs can use deletion to keep per-run prefixes tidy. This reduces noise in listing, makes key collisions less likely, and limits the chance that a later agent reads an outdated artifact. The workflow should list before deletion because the delete endpoint only accepts a key and does not expose search behavior.

### Safer Replacement Workflows

If conditional delete is supported, an agent can implement safer replace flows: list or retrieve object metadata, verify last-modified state, delete the old object only if unchanged, then upload a replacement. This reduces the chance of deleting an object that another agent updated.

For teams, conditional deletion would be valuable in concurrent workflows where multiple agents may touch related keys. That said, Tempo has not confirmed conditional header forwarding, so callers should not assume this protection exists without explicit testing approval.
