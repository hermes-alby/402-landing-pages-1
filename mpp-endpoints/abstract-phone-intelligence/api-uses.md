# Phone Intelligence API Uses

## Service Summary

Phone Intelligence is an MPP wrapper around AbstractAPI phone validation and enrichment. It validates a submitted phone number and can provide carrier, line type, location, messaging, registration, risk, and breach-history context. The service is best suited to transactional checks where a user or agent needs one phone intelligence lookup without setting up a direct AbstractAPI account or subscription plan.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Phone Validation And Risk Intelligence | 1 | Validate a phone number, normalize it, identify carrier and line type, infer location/timezone, and use risk or breach signals for routing, contactability, and fraud review. | [api-uses/phone-validation-and-risk-intelligence.md](api-uses/phone-validation-and-risk-intelligence.md) |

## Highest-Value Uses

The strongest business uses are signup and checkout risk triage, lead/contact data cleaning, customer-support callback routing, account-recovery step-up policy, and CRM deduplication. These workflows benefit because the endpoint combines contactability fields (`is_valid`, `line_status`), normalization fields (`phone_format`), routing fields (`country_code`, `timezone`, `carrier.name`, `line_type`), and risk fields (`risk_level`, `is_disposable`, `is_abuse_detected`, breach history).

## Personal Use Opportunities

Individuals and small operators can use the endpoint to clean contact lists, check whether a submitted callback number appears valid, normalize international phone formats, and decide when to contact someone based on inferred timezone. Personal use should avoid live lookups without a clear reason and should treat registration, risk, and breach fields as sensitive.

## Business Use Opportunities

Businesses can use phone intelligence as one signal in fraud prevention, onboarding, CRM hygiene, sales routing, support operations, and campaign compliance. The endpoint is most valuable when it improves a concrete decision: whether to accept a signup, require extra verification, route a lead to a region, suppress invalid numbers, schedule a callback, or flag an account-recovery request for review.

## Endpoint Group Summaries

### Phone Validation And Risk Intelligence

The single MPP endpoint accepts a required `phone` and optional `country`, then looks up phone validation and enrichment data. The MPP OpenAPI does not document a detailed response schema, but upstream AbstractAPI docs show fields for phone formatting, carrier, line type, country/region/city/timezone, SMS gateway, validity, line status, VoIP status, number age, registration, risk, and breach history. Full details: [api-uses/phone-validation-and-risk-intelligence.md](api-uses/phone-validation-and-risk-intelligence.md).

## Field And Data Themes

- Contactability: `phone_validation.is_valid`, `line_status`, `is_voip`, and `phone_carrier.line_type` help decide whether a number is reachable and what channel may be appropriate.
- Normalization: `phone_format.international` and `phone_format.national` reduce duplicate records and downstream formatting errors.
- Routing: `phone_location.country_code`, `region`, `city`, and `timezone` support territory assignment, contact-window selection, and localization.
- Risk: `phone_risk.risk_level`, `is_disposable`, `is_abuse_detected`, and breach fields can trigger step-up review but should not be treated as identity proof.
- Cost: MPP docs list an estimated `$0.006` per lookup; the local feed lists `6000` units of the Tempo asset with `6` decimals.
