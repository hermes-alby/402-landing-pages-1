# StablePhone: AI Phone Calls API Uses

## What This Endpoint Group Does

This group places a paid AI voice call and then polls the call result. `POST /api/call` accepts the destination number, task instructions, optional caller ID, voice, model, duration, recording, voicemail, transfer, and metadata controls. `GET /api/call/:id` returns the status and, when available, the completed call's summary, transcript, recording URL, price, timestamps, and errors.

The useful output is not just that a call happened. It is the transcript and summary that can be attached to a lead, ticket, calendar workflow, field-service dispatch, or personal task list.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/call` | Start a paid AI phone call | `phone_number`, `task`, `from`, `first_sentence`, `voice`, `max_duration`, `record`, `model`, `transfer_phone_number`, `voicemail_action`, `metadata` | `success`, `call_id`, `message` |
| GET | `/api/call/:id` | Poll call status and transcript | `call_id`, SIWX auth | `status`, `completed`, `to`, `from`, `call_length`, `answered_by`, `summary`, `transcript`, `transcripts`, `recording_url`, `price`, `error_message`, `created_at` |

## Field Notes

### Inputs

The core fields are `phone_number` and `task`. The task can be up to 4000 characters, which is enough for a structured call script, branching instructions, and expected result format. `first_sentence` controls the opener, `voice` and `model` tune the caller experience, and `max_duration` caps cost and call length. `transfer_phone_number` enables a handoff to a human if the recipient asks for help. `metadata` is important for joining call results back to a CRM record, ticket id, order id, calendar event, or internal workflow id.

### Outputs

The first response returns `call_id`; the second endpoint turns that id into operational evidence. `completed`, `status`, and `error_message` drive polling and retry decisions. `summary`, `transcript`, `transcripts`, and `recording_url` make the call auditable and useful downstream. `answered_by` separates human answers from voicemail behavior when available.

### Important Constraints Or Gaps

Calls cost $0.54 each. Free status polling requires SIWX and is limited to the initiating wallet. The OpenAPI summary says DNC numbers return 403 and should not be retried. Public docs do not publish exact call status enums, transcript segment schema, recording retention, webhook behavior, rate limits, or a full compliance guide. The API can place calls, so users still need lawful basis, consent, and appropriate calling policies for their jurisdiction and industry.

## Use Cases

### Appointment Scheduling And Confirmation

A personal assistant can call a contractor, clinic, school, or restaurant with a precise `task`, such as confirming an appointment time or asking whether a slot is available. The `summary` and `transcript` can update a calendar note, while `completed`, `answered_by`, and `error_message` decide whether to retry later, leave voicemail, or ask the user to step in.

For a business, the same workflow can confirm demos, onboarding calls, service appointments, or delivery windows. `metadata` can carry the booking id or customer id, and `transfer_phone_number` can route the recipient to a human scheduler when the call goes outside the scripted path. The value is closing the loop with evidence rather than just sending a reminder.

### Lead Qualification By Phone

A solo seller can ask an AI caller to verify whether a prospect is still interested, confirm a preferred callback time, or ask one or two qualifying questions. The returned `summary` and `transcript` identify whether the lead is warm, uninterested, unreachable, or needs human follow-up.

For a sales team, `metadata` can bind every call to a CRM lead id. A workflow can mark records based on `completed`, `answered_by`, and transcript content, then route only high-intent or complex responses to reps. The practical limit is compliance: teams must respect consent, DNC handling, and local outbound calling rules.

### Support Ticket Triage And Human Escalation

A user can have an agent call a business or service provider to ask for status on a repair, refund, or reservation. The transcript becomes a record of what was said, and `recording_url` can help review important details if recording is lawful and enabled.

For support operations, StablePhone can call customers about stalled tickets, verify whether an issue is resolved, or collect missing information. `transfer_phone_number` lets the AI escalate to a live support line when the customer requests a human. The fields allow a ticketing system to store summary, transcript, call length, and error data without manual note-taking.

### Delivery, Dispatch, And Field-Service Coordination

For personal tasks, an agent can call a driver, repair technician, or building manager with a short task and a capped `max_duration`, then summarize arrival time, access instructions, or blockers. The output can update a household task tracker or send the user a concise status.

For dispatch teams, the endpoint can verify site access, ETA, parts availability, or customer readiness before sending field staff. `metadata` can carry job ids, `from` can use a recognizable company number, and `answered_by` helps distinguish a live confirmation from voicemail. This is valuable where one short call prevents a failed truck roll.

### Voicemail Drops With Structured Follow-Up

A person can use `voicemail_action` and `voicemail_message` to leave a concise, consistent message when a recipient does not answer. The status output then tells the user whether the call completed and whether a follow-up should be scheduled.

Businesses can use this for low-volume, high-touch reminders where a voicemail is appropriate, such as missed appointment follow-ups or account-manager callbacks. The limitation is that voicemail behavior and legal consent need careful handling; the API documents controls, not a full compliance framework.

### Research Calls With Audit Trail

An individual researcher can ask public-facing businesses simple factual questions, such as hours, availability, or policy details, and then keep the transcript and summary in a research note. `first_sentence` and `task` make the call polite and bounded.

For a company, this can support market research or operations audits, such as checking whether franchise locations answer consistently. `summary`, `transcript`, `created_at`, and `metadata` make results reviewable. This works best for narrow factual calls, not sensitive data collection or deceptive calling.
