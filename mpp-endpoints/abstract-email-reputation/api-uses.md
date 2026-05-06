# Email Reputation API Uses

## Service Summary

Email Reputation is an MPP-wrapped AbstractAPI service for checking the reputation and risk profile of an email address. It takes one email address and returns deliverability, mail-server, address-quality, sender, domain, risk, and breach-exposure signals. The direct provider path requires an AbstractAPI account/API key and plan credits; the MPP route offers transactional access through Locus/Tempo payment.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Email Reputation And Risk Screening | 1 | Decide whether a submitted email is reachable, trustworthy, risky, disposable, breach-exposed, or worth extra review. | [api-uses/email-reputation-and-risk-screening.md](api-uses/email-reputation-and-risk-screening.md) |

## Highest-Value Uses

- Pre-screen signup, checkout, trial, and promotion activity for disposable, suspicious, risky, or unreachable addresses before granting sensitive access or incentives.
- Clean email lists before marketing or lifecycle campaigns by suppressing invalid, undeliverable, disposable, role-based, or risky contacts.
- Route inbound leads by business-contact quality using domain, sender, organization, free-provider, and role-address signals.
- Add security friction when breach exposure or domain/address risk makes account recovery or profile changes more sensitive.
- Improve support workflows by distinguishing bad format, invalid mailbox, full mailbox, missing DNS, and temporarily unavailable mail servers.

## Personal Use Opportunities

An individual can check whether an address appears deliverable, breach-exposed, disposable-looking, or associated with a questionable domain before using it for a critical account. The most practical personal value is account hygiene: if an address has breach exposure, the user can rotate passwords and enable stronger authentication; if a contact address appears undeliverable, they can request an alternate channel.

Personal use should be privacy-conscious. Checking someone else's address can reveal sensitive signals, especially breach exposure, so production workflows need a lawful purpose, minimization, and careful display choices.

## Business Use Opportunities

For businesses, the endpoint is most valuable at decision points where an email address gates money, reputation, or manual labor: account creation, free-trial issuance, coupon redemption, campaign sending, lead routing, vendor intake, and account recovery. The field mix supports graduated actions instead of simple allow/block decisions: suppress from campaigns, retry later, request verification, send to nurture, queue manual review, limit trial credits, or ask for a better contact address.

The MPP model is especially useful for occasional or agent-driven checks that do not justify a direct AbstractAPI subscription. Sustained high-volume usage may still fit direct provider plans better because they include quota bundles and rate limits.

## Endpoint Group Summaries

### Email Reputation And Risk Screening

The single endpoint, `POST /abstract-email-reputation/check`, accepts `email` and returns deliverability, quality, sender, domain, risk, and breach fields. Its core job is to enrich a raw email address into operational signals that help decide whether to accept, suppress, route, or review that address. Full details: [api-uses/email-reputation-and-risk-screening.md](api-uses/email-reputation-and-risk-screening.md).

## Field And Data Themes

The request surface is intentionally small: a single `email` string. The response surface is broader and decision-oriented:

- Reachability: `email_deliverability.status`, `status_detail`, format/SMTP/MX booleans, and MX records.
- Quality and abuse signals: `score`, disposable/free/catchall/subaddress/role flags, suspicious username, DMARC, SPF, and minimum age.
- Identity and domain context: sender name hints, provider name, organization name/type, domain age, registrar, live-site status, and domain dates.
- Risk and exposure: address/domain risk statuses, breach count, first/last breach timestamps, and breached domains.
