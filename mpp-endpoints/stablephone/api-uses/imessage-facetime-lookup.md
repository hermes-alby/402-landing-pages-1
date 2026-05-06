# StablePhone: iMessage And FaceTime Lookup API Uses

## What This Endpoint Group Does

This group checks whether a phone number appears available on iMessage or FaceTime. `POST /api/lookup` starts a paid asynchronous lookup and returns a token. `GET /api/lookup/status` polls with that token and SIWX auth until the result is pending, complete, or error.

The practical value is channel selection. The result can tell a workflow whether a number likely supports Apple messaging or FaceTime, while also returning carrier, number type, country, and checked date metadata.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/lookup` | Start a paid iMessage/FaceTime lookup | `phone_number` | `token` |
| GET | `/api/lookup/status` | Poll async lookup result | `token`, SIWX auth | `status`, `message`, `phone_number`, `imessage`, `facetime`, `carrier`, `country`, `checked_at`, `error` |

## Field Notes

### Inputs

`phone_number` is required and follows a North American E.164 pattern. The token returned from the paid lookup is required for polling. The polling endpoint also requires SIWX and docs say only the wallet that paid can poll.

### Outputs

`status` controls polling and downstream handling: `pending`, `complete`, or `error`. On completion, `imessage` can be `available`, `unavailable`, or `unknown`; `facetime` can be `available`, `unavailable`, `unknown`, or `pending`. `carrier.carrier`, `carrier.number_type`, and `country.iso2` provide additional routing context. `checked_at` helps decide whether a cached result is fresh enough.

### Important Constraints Or Gaps

Lookups cost $0.05. Docs say they are asynchronous, typically take 30-90 seconds, and should be polled every 3-5 seconds. Tokens expire after 60 minutes. The same number submitted within about 1 hour reuses the cached result with no extra charge. OpenAPI says the token response is 200, while `llms.txt` describes 202. Public docs do not provide confidence scores, carrier number-type enums, or a guarantee that `unknown` means a specific failure mode.

## Use Cases

### Choose The Best Personal Contact Channel

A person can check whether a new contact's number supports iMessage or FaceTime before deciding how to reach out. If `imessage` is available, the user might send a richer message thread. If it is unavailable or unknown, they may choose SMS, phone call, or email instead.

The returned `carrier`, `number_type`, and `country` fields add context before communication starts. The limitation is that the endpoint does not send the message or call; it only informs the choice of channel. A result of `unknown` should not be treated as proof that the number is invalid.

### Lead And Customer Communication Routing

A business can run the lookup before choosing a first-contact channel for opted-in leads or customers. `imessage` and `facetime` availability can route Apple-capable numbers to Apple-friendly workflows while sending other numbers to SMS, email, or phone call queues.

The workflow benefits from `checked_at` and the one-hour cache note. A CRM can avoid repeated paid checks during active routing, then refresh only when a result is stale. Compliance still matters: availability does not imply consent to message or call.

### Detect Landline, VoIP, Or Low-Fidelity Contact Records

A person cleaning an address book can use `unknown` results plus `carrier.number_type` to flag contacts that may be landline, VoIP, or otherwise less suitable for mobile messaging. That helps decide whether to ask for an updated mobile number.

Businesses can use the same fields to improve contact data quality before time-sensitive outreach. A workflow can suppress FaceTime-dependent steps when `facetime` is unavailable, and queue records with ambiguous `unknown` statuses for alternate verification. The endpoint is a signal, not a full phone intelligence product.

### Reduce Failed Appointment Or Delivery Notifications

For personal reminders, a user can lookup a phone number before relying on an Apple-message follow-up. If iMessage is unavailable, the workflow can choose a call or SMS reminder instead of silently assuming Apple delivery.

For appointment, delivery, or field-service teams, this can improve pre-visit communication routing. `country.iso2`, `carrier.carrier`, and `number_type` can help split records by communication path. Because lookups are async, the best design is to pre-check records before the notification moment rather than waiting at send time.

### Prioritize FaceTime-Capable Support Or Concierge Calls

A person arranging a remote walkthrough, family tech support, or high-touch consultation can check `facetime` availability before suggesting a FaceTime interaction. If FaceTime is unavailable, the user can prepare a regular phone call or another video platform.

Businesses offering concierge onboarding, tele-support, or visual troubleshooting can use `facetime` as one routing signal. The returned value can determine whether to offer FaceTime as a convenience option. The limitation is that `facetime` can be `pending` or `unknown`, so the workflow needs fallback options.

### Fraud And Risk Triage As A Lightweight Signal

A personal marketplace seller or buyer can use lookup results as one weak signal when deciding how to communicate with a counterpart. For example, a mobile number with normal carrier metadata and available iMessage may feel more reachable than an unknown or unavailable result.

For businesses, the same fields can be one feature in a broader fraud or contactability model. `carrier.number_type`, `country.iso2`, and Apple-service availability can inform manual review or outreach routing, but they should not be used alone for adverse decisions. The API does not provide risk scores, identity proof, or consent evidence.
