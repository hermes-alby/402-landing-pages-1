# StablePhone: Phone Number Management API Uses

## What This Endpoint Group Does

This group manages StablePhone numbers that can be used as outbound caller IDs. `POST /api/number` buys a US or Canadian number for 30 days, `POST /api/number/topup` extends a number by another 30 days, and `GET /api/numbers` lists the numbers associated with the authenticated wallet.

The group matters because caller identity changes call answer rates, user trust, routing, and lifecycle cost. The output fields are simple, but `phone_number`, `area_code`, `country_code`, and `expires_at` are enough to build number selection and renewal workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/number` | Buy a 30-day phone number | `area_code`, `country_code` | `success`, `phone_number`, `expires_at` |
| POST | `/api/number/topup` | Extend a phone number by 30 days | `phone_number` | `success`, `phone_number`, `expires_at` |
| GET | `/api/numbers` | List wallet-owned numbers | SIWX auth | `success`, `numbers[].phone_number`, `numbers[].expires_at`, `numbers[].area_code`, `numbers[].country_code` |

## Field Notes

### Inputs

`area_code` lets a user request geographic familiarity where available. `country_code` is limited to `US` or `CA` and defaults to `US`. `phone_number` on top-up is the stable identifier for renewal. Listing requires SIWX rather than query parameters, so wallet identity determines the number set.

### Outputs

`phone_number` is the reusable caller ID for `POST /api/call` via the `from` field. `expires_at` is the key automation field: it can drive renewal warnings, budget planning, and caller-ID rotation. `area_code` and `country_code` help choose the right number for a campaign, region, or personal workflow.

### Important Constraints Or Gaps

Buying a number costs $20.00 for 30 days and top-up costs $15.00 per 30-day extension. Public docs say top-ups stack and anyone can top up any number. The docs do not expose inventory availability, exact error schemas, pagination for number listing, expired-number behavior, or a way to reserve a specific full number.

## Use Cases

### Consistent Caller ID For Personal Automation

A person using AI calls for errands can buy one recognizable number and reuse it in the call endpoint's `from` field. That avoids every call appearing from an arbitrary or unfamiliar number, which matters when calling a contractor, school, local business, or family contact.

`GET /api/numbers` and `expires_at` let the user keep track of when the number will expire. A personal agent can warn before expiry or top up when the number is still needed. The main limitation is cost: the number is useful when continuity matters, not for one-off calls where a dedicated caller ID has little value.

### Regional Calling Presence For Sales Or Recruiting

A sales, recruiting, or community team can request an `area_code` that matches the region they serve, then use the returned `phone_number` as the caller ID for outreach calls. A local or consistent number can make follow-up easier than rotating caller IDs.

The business value comes from pairing number inventory with CRM segmentation: `metadata` on the call endpoint can carry the lead id, while the number-management fields decide which caller ID should be used. The public API does not guarantee area-code availability, so the workflow should handle purchase failures or random-number fallback.

### Renewal Control For Long-Running Campaigns

A person running a multi-week task, such as apartment hunting or event coordination, can retain the same phone number by topping it up before `expires_at`. The number becomes a temporary but stable identity for the project.

For a business, `expires_at` can drive a renewal queue for campaigns, support lines, or regional pools. Because top-ups stack, an operator can prepay continuity for critical numbers. The cost field is simple enough for budget rules: renew high-value numbers, let experimental or inactive numbers expire.

### Wallet-Scoped Caller-ID Inventory

A personal agent can call `GET /api/numbers` before placing a call and choose the right `from` number based on `area_code`, `country_code`, and `expires_at`. That prevents accidental use of expired or wrong-region caller IDs.

In a business workflow, wallet-scoped listing can back a small inventory service for agents. The inventory can map numbers to teams, regions, or campaigns outside StablePhone, then feed the selected `from` value into the call request. The public API does not document server-side labels, so local metadata storage is required.

### Sponsored Number Continuity

Because docs say anyone can top up any number, a client, partner, or delegated automation could extend a number without owning the wallet that lists it. A person could ask another wallet to fund continuity for a project number.

For businesses, this creates a simple sponsorship or shared-cost pattern: one process owns and lists numbers, while another process can pay to extend a number that must stay alive. The limitation is governance. Since ownership and notification behavior are not described publicly, businesses would need their own controls before relying on third-party top-ups.
