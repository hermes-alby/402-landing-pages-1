# Holidays API Uses

## Service Summary

Holidays is a Locus MPP wrapper around AbstractAPI's Public Holidays API. It lets a caller look up public, local, religious, national, and observance holidays for a country and optional date window without managing an AbstractAPI account or API key directly.

The service is most useful as calendar enrichment: it turns a country/date question into structured holiday records that can influence scheduling, staffing, travel, fulfillment, support, marketing, finance, and productivity workflows.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Holiday Calendar Lookup | 1 | Finds holiday records for a country and optional year, month, or day, including name, local name, description, location, type, date parts, and weekday. | [api-uses/holiday-calendar-lookup.md](api-uses/holiday-calendar-lookup.md) |

## Highest-Value Uses

- Enrich global workforce calendars so teams avoid meetings, releases, or on-call transitions on country holidays.
- Adjust ecommerce, logistics, and customer support expectations around local closures and reduced staffing.
- Flag campaign, launch, or content dates that overlap major holidays in a target market.
- Add holiday context to travel itineraries, event plans, booking tools, and scheduling assistants.
- Trigger HR, payroll, finance, and payment timing reviews when a due date or cutoff falls on a country holiday.

## Personal Use Opportunities

People can use the endpoint to make travel, scheduling, shipping, and personal calendar decisions with country-specific holiday context. The most practical personal workflows are checking a trip date before booking, avoiding cross-border meeting dates that fall on holidays, planning gift shipping around possible closures, and adding holiday overlays to a personal calendar.

## Business Use Opportunities

Businesses can use the endpoint as a lightweight holiday signal inside operational systems. Strong fits include workforce scheduling, support coverage planning, campaign calendars, ecommerce delivery promises, invoice follow-up timing, booking availability, relocation tools, and customer-facing calendar badges. The endpoint is best used as enrichment or a trigger for review, not as the sole authority for legal, payroll, banking, or logistics commitments.

## Endpoint Group Summaries

### Holiday Calendar Lookup

The group contains the single MPP endpoint, `POST /abstract-holidays/lookup`. It accepts `country` plus optional `year`, `month`, and `day`, then returns documented provider holiday fields such as `name`, `name_local`, `language`, `description`, `location`, `type`, `date`, and `week_day`. The full use-case analysis is in [api-uses/holiday-calendar-lookup.md](api-uses/holiday-calendar-lookup.md).

## Field And Data Themes

The key input theme is geography plus date filtering. `country` selects the national calendar using ISO 3166-1 alpha-2 codes, while `year`, `month`, and `day` control the lookup window.

The key output themes are human-readable holiday content, location applicability, holiday classification, and schedule-ready dates. `name`, `name_local`, `language`, and `description` support display and localization. `country` and `location` support market and region context. `type` supports rough classification, although no closed enum is published. `date`, `date_year`, `date_month`, `date_day`, and `week_day` support joins to calendars and planning systems.
