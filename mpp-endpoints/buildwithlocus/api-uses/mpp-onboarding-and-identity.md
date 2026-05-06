# Build With Locus: MPP Onboarding And Identity API Uses

## What This Endpoint Group Does

This endpoint group is the MPP-funded entry point into Build With Locus. It lets a Tempo MPP-capable client bootstrap or recover a workspace, receive the JWT needed for the rest of the Locus API, and verify which user and workspace the token represents before any provisioning workflow starts.

The group is identity infrastructure, not deployment infrastructure. It does not create projects, services, addons, domains, or top-ups by itself; it establishes the authenticated workspace context those later calls depend on.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/auth/mpp-sign-up` | Bootstrap a Tempo MPP workspace and obtain API credentials. | `X-Mpp-Payment` header, `Content-Type: application/json`, optional `tempoAddress` body field. | `jwt`, `workspaceId`, `isNewWorkspace`, optional `claimUrl`. |
| GET | `/v1/auth/whoami` | Verify the current JWT and return the workspace identity. | `Authorization: Bearer <jwt>` header. | `userId`, `workspaceId`, optional `email`. |

## Field Notes

### Inputs

`POST /v1/auth/mpp-sign-up` expects a Tempo MPP payment header and may receive `tempoAddress` in the JSON body. The endpoint inventory marks the payment as MPP/Tempo charge metadata under the `mpp.buildwithlocus.com` realm, but the payment amount is inconsistent across sources: the raw feed says amount `0`, while provider docs describe sign-up as `$0.001 USDC`.

`GET /v1/auth/whoami` has no request body. It requires the JWT returned by sign-up or another Locus auth flow in an `Authorization: Bearer <jwt>` header. Provider docs say tokens expire after 30 days and a 401 from whoami means the caller should get a fresh token.

### Outputs

The sign-up response returns `jwt` and `workspaceId` as the key handoff fields. `isNewWorkspace` tells automation whether onboarding created a fresh workspace or attached to an existing one, and `claimUrl` may be returned so the human can link an email and access the dashboard.

The whoami response returns `userId`, `workspaceId`, and optionally `email`. These are enough for a CLI, agent, or internal platform wrapper to confirm that it is operating in the intended tenant before starting billable or state-changing setup.

### Important Constraints Or Gaps

No paid calls, payment settlement, wallet signing, or account actions were performed for this artifact. The sign-up endpoint is documented as requiring MPP payment material, so live behavior was not verified.

New MPP workspaces start with `$0.00` credits, so a successful signup does not by itself make the workspace ready to create billable services or addons. A separate top-up flow is required before first deploy.

The group has a base-URL ambiguity. The MPP feed and endpoint inventory list both endpoints under `https://mpp.buildwithlocus.com`, while the onboarding guide verifies tokens with `https://api.buildwithlocus.com/v1/auth/whoami` and states that MPP auth and billing use the MPP host while other calls use the API host.

There is no located official OpenAPI spec. Field coverage is derived from the MPP feed, normalized endpoint rows, provider markdown, and examples.

## Use Cases

### Wallet-Funded First Workspace Bootstrap

A developer or AI agent with a Tempo wallet can use `POST /v1/auth/mpp-sign-up` to turn wallet payment capability into a Locus workspace and JWT without starting from a dashboard-only account flow. The useful fields are `jwt` for immediate API access, `workspaceId` for routing all later project and billing work, `isNewWorkspace` for deciding whether to run first-time setup, and `claimUrl` for handing dashboard access back to the human owner.

The business value is low-friction onboarding for hosted compute: a product can provision infrastructure from a wallet-funded customer journey and keep the human in control through the claim link. The limitation is that signup still depends on a valid MPP payment header and does not include deploy-ready credits; automation must stop after identity bootstrap unless the user explicitly approves top-up and later mutating calls.

### Agent Session Guardrail Before Provisioning

Before an agent creates projects, services, addons, domains, or webhooks, `GET /v1/auth/whoami` can validate that the current token belongs to the expected `workspaceId` and, when present, the expected `email`. This is especially useful when tokens are cached between shell sessions or passed between tools, because a quick identity check can prevent deploying into the wrong workspace.

For a business, this becomes a compliance and cost-control checkpoint: internal tools can log `userId` and `workspaceId`, enforce workspace allowlists, and halt if identity does not match the requested customer or environment. The main limitation is that whoami only proves token identity; it does not report credit balance, role permissions beyond token validity, or whether the workspace is safe to mutate.

### Claim-Link Handoff From Agent To Human

When MPP signup returns `claimUrl`, the agent can create the workspace context and then hand the claim URL to the human so they can connect an email and access the dashboard. This supports a personal workflow where the user asks an agent to prepare the account boundary while retaining direct ownership and recovery access.

For a team or platform, claim-link handoff makes agent-created workspaces auditable and transferable instead of leaving them as anonymous wallet-only contexts. The prerequisite is that the signup response actually includes a claim URL; if it is absent or expired, a separate claim-link flow outside this endpoint group may be needed.

### Workspace-Aware Customer Routing

An integration that serves multiple customers can use signup and whoami together to map Tempo-funded onboarding to a durable `workspaceId`. After signup, the integration records `workspaceId`; on later sessions, whoami confirms that the supplied JWT still maps to the same workspace before displaying project lists, checking billing, or triggering any downstream automation.

This has a practical business angle for managed developer platforms: support, metering, and audit trails can key off Locus workspace identity rather than a transient wallet header alone. The gap is that these two endpoints do not expose plan status, credits, service counts, or transaction history, so routing must be combined with the billing endpoint group for complete account readiness checks.
