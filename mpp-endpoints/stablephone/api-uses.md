# StablePhone API Uses

## Service Summary

StablePhone is a pay-per-request API for AI phone calls, dedicated caller-ID numbers, and iMessage/FaceTime availability lookup. It is published by Merit Systems at `https://stablephone.dev` and uses x402/MPP payments for paid operations. The public site says the calling capability is powered by Bland.ai, while StablePhone handles the no-account, no-API-key micropayment access surface.

The service is most useful when a workflow needs one concrete phone action or contactability signal: place a short AI call, collect a transcript, keep a consistent caller ID alive, or decide whether Apple messaging/video is a viable contact channel.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| AI Phone Calls | 2 | Start a paid AI voice call, poll for completion, and use transcript/summary/recording/error fields to drive follow-up. | [`api-uses/ai-phone-calls.md`](api-uses/ai-phone-calls.md) |
| Phone Number Management | 3 | Buy, renew, and list caller-ID numbers for consistent outbound identity. | [`api-uses/phone-number-management.md`](api-uses/phone-number-management.md) |
| iMessage And FaceTime Lookup | 2 | Check whether a phone number appears available on iMessage or FaceTime, with carrier/country metadata. | [`api-uses/imessage-facetime-lookup.md`](api-uses/imessage-facetime-lookup.md) |

## Highest-Value Uses

The highest-value use is phone-driven workflow closure: an agent places a bounded call, polls until `completed`, and stores the `summary`, `transcript`, `answered_by`, `recording_url`, and `error_message` fields against a task, ticket, lead, or booking. This is stronger than a generic call API because the returned transcript and summary make the result auditable and actionable.

The second high-value use is persistent caller identity. Buying a number and tracking `expires_at` lets a person or business reuse a recognizable `from` number for callbacks, regional outreach, or multi-week projects. The API is small, but it directly supports caller-ID continuity.

The third high-value use is channel selection before outreach. The lookup workflow returns `imessage`, `facetime`, `carrier`, `number_type`, `country`, and `checked_at`, which can decide whether to try Apple channels, SMS, a phone call, or another fallback.

## Personal Use Opportunities

- Let a personal assistant call businesses, service providers, contractors, schools, or clinics to confirm details, then store the transcript and summary in a calendar or task note.
- Use a temporary but stable phone number for a project, move, apartment search, or event, then renew it only if the project continues.
- Check whether a contact supports iMessage or FaceTime before choosing how to reach out.
- Use voicemail controls for polite, consistent callbacks when a recipient does not answer.
- Keep a written audit trail for calls that would otherwise be handled manually and forgotten.

## Business Use Opportunities

- Pre-qualify leads by phone, attach call summaries and transcripts to CRM records, and route only useful responses to humans.
- Confirm appointments, deliveries, job-site access, or customer readiness before dispatching staff.
- Use StablePhone numbers as regional or campaign caller IDs, with local inventory and renewal rules driven by `area_code`, `country_code`, and `expires_at`.
- Route customer or lead communication based on iMessage/FaceTime availability and carrier metadata, while preserving SMS, call, or email fallback paths.
- Add phone-call summaries to support tickets, onboarding tasks, collections follow-up, recruiting workflows, or concierge operations.

## Endpoint Group Summaries

### AI Phone Calls

[`api-uses/ai-phone-calls.md`](api-uses/ai-phone-calls.md) covers `POST /api/call` and `GET /api/call/:id`. The group accepts call instructions, destination, optional caller ID, voice/model controls, voicemail behavior, transfer number, and metadata. It returns a `call_id` first, then status, summary, transcript, recording URL, call length, price, timestamps, and errors through polling. Strong uses include scheduling, lead qualification, support triage, dispatch coordination, voicemail follow-up, and research calls.

### Phone Number Management

[`api-uses/phone-number-management.md`](api-uses/phone-number-management.md) covers `POST /api/number`, `POST /api/number/topup`, and `GET /api/numbers`. The group buys US/CA numbers, extends them by 30 days, and lists wallet-owned numbers. The key fields are `phone_number`, `area_code`, `country_code`, and `expires_at`. Strong uses include consistent personal caller ID, regional sales or recruiting presence, renewal control for campaigns, inventory selection before calls, and sponsored continuity through top-ups.

### iMessage And FaceTime Lookup

[`api-uses/imessage-facetime-lookup.md`](api-uses/imessage-facetime-lookup.md) covers `POST /api/lookup` and `GET /api/lookup/status`. The group starts an async paid lookup, polls with a token, and returns `imessage`, `facetime`, carrier, number type, country, checked date, and error fields. Strong uses include choosing a personal contact channel, routing business outreach, flagging low-fidelity contact records, reducing failed appointment notifications, selecting FaceTime-capable support paths, and adding a lightweight risk/contactability signal.

## Field And Data Themes

- Phone identifiers: `phone_number`, `from`, `transfer_phone_number`, and `call_id` connect calls, numbers, and external records.
- Workflow state: `completed`, `status`, `error_message`, and lookup `error` determine retries, fallback, and human intervention.
- Conversation evidence: `summary`, `transcript`, `transcripts`, and `recording_url` are the main business-value fields for calls.
- Lifecycle and freshness: `expires_at`, `created_at`, `checked_at`, 60-minute lookup token expiry, and one-hour lookup cache behavior drive scheduling and refresh rules.
- Channel selection: `imessage`, `facetime`, `carrier.carrier`, `carrier.number_type`, and `country.iso2` help choose communication paths.
- Cost control: fixed prices are $0.54 per call, $20.00 per 30-day number purchase, $15.00 per 30-day top-up, and $0.05 per lookup.
