# Holidays: Holiday Calendar Lookup API Uses

## What This Endpoint Group Does

Holiday Calendar Lookup turns a country code and optional date filters into holiday records. The MPP endpoint accepts `country`, `year`, `month`, and `day`; the documented provider response returns an array of holidays with names, local names, language, description, country, location or region, type, date parts, and weekday.

The value is not just knowing that a holiday exists. The useful output is a structured signal that a given date may affect work availability, school closures, travel demand, shopping behavior, support load, campaign performance, settlement expectations, or personal calendar planning in a specific country.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `/abstract-holidays/lookup` | Get public holidays for a country and optional date. | `country`, optional `year`, `month`, `day` | `name`, `name_local`, `language`, `description`, `country`, `location`, `type`, `date`, `date_year`, `date_month`, `date_day`, `week_day` |

## Field Notes

### Inputs

`country` is the required selector and uses a two-letter ISO 3166-1 alpha-2 country code. `year`, `month`, and `day` narrow the time window. The provider docs say `day` requires `month` and `year`, and `month` requires `year`. The MPP docs mark date fields optional, while the provider docs say those fields are optional on paid plans and required on free plans.

### Outputs

Each response item describes a holiday. `name`, `name_local`, `language`, and `description` support human-readable calendar display and localization. `country` and `location` identify where the holiday applies, although `location` is a string rather than a structured subdivision code. `type` helps distinguish national holidays from observances or other categories, but no closed enum is documented. `date`, `date_year`, `date_month`, `date_day`, and `week_day` support scheduling logic and calendar joins.

### Important Constraints Or Gaps

The MPP OpenAPI does not include a response schema, so output fields come from official AbstractAPI docs. The provider does not document data freshness, source authority, a closed holiday-type enum, or future-year coverage limits. The API should be treated as a calendar-enrichment signal, not as a complete legal determination of labor, payroll, banking, or tax obligations.

## Use Cases

### Workforce Scheduling And Support Coverage

A person managing a distributed team can check upcoming holidays for countries where teammates live, then avoid scheduling all-hands meetings, interview loops, release windows, or on-call handoffs on likely low-availability days. The useful fields are `country`, `date`, `week_day`, `name`, `type`, and `location`, because they let a calendar assistant annotate specific dates with the reason a person or region may be unavailable.

A business can use the same lookup to adjust support rosters and service-level expectations by market. For example, a support operations system can enrich next month's country staffing plan with `National` holidays and location-specific records, flagging days that need backup coverage or customer-facing SLA notes. The limitation is that `location` is not a structured province/state code, so local labor-rule decisions still need internal HR or legal policy data.

### Ecommerce, Logistics, And Delivery Promise Planning

An individual shipping gifts or documents internationally can check whether a target country has a holiday near a desired delivery date, then choose an earlier ship date or avoid planning pickup on a day that may have closures. `date`, `week_day`, `name`, `country`, and `location` are the core fields because they connect the holiday to practical pickup and delivery timing.

For a business, the endpoint can enrich checkout promises, warehouse staffing, and customer communications. A logistics workflow can look up holidays for destination countries before showing estimated delivery windows, suppressing unrealistic same-day or next-day promises around national holidays. The API does not return carrier-specific closures or customs processing rules, so it should be combined with carrier calendars and internal fulfillment cutoffs before changing guaranteed delivery dates.

### Cross-Border Campaign And Content Timing

A traveler, creator, or small seller can check holidays before sending invitations, newsletters, or promotional messages to friends or customers in another country. `name`, `type`, `date`, and `week_day` help identify whether a date is likely celebratory, sensitive, or simply a poor time for attention.

Marketing teams can automate market calendars for email, ads, launch announcements, and in-app messaging. The endpoint can tag campaign dates with holiday context so planners can avoid sending business-as-usual copy during major national or religious holidays, or deliberately localize a campaign around a relevant observance. The response does not include cultural guidance, audience sentiment, or retail-season demand data, so teams should use the holiday fields as timing context rather than as copy guidance on their own.

### Travel Itinerary And Event Planning

A person planning a trip can check destination holidays by country, month, or day to anticipate closures, crowded travel periods, or special events. `date`, `week_day`, `name`, `location`, and `description` can be added to a personal itinerary so the traveler knows why a museum, office, school, or transit service may have altered hours.

Travel platforms, relocation services, and event organizers can use the lookup to annotate itineraries and venue planning workflows. For example, an event planning tool can flag when a proposed conference date overlaps a national holiday in the host country, reducing the risk of poor attendance or expensive logistics. The endpoint does not return event attendance forecasts, hotel prices, or opening hours, so those decisions need additional travel and venue data.

### Payroll, Leave, And Compliance Review Triggers

An individual employee can use holiday records to sanity-check personal leave plans, especially when working with teams in another country. The useful fields are `date`, `week_day`, `name`, `type`, and `location`, which can make a leave calendar explain why colleagues may be offline.

Businesses can use the endpoint as an input to HRIS and payroll review workflows. A system can flag upcoming country holidays for manual policy review, payroll cutoff reminders, or country-specific leave calendar updates. This is a trigger use case, not an automated compliance decision: the API does not encode employment law, bank holiday settlement rules, union agreements, company policy, or jurisdictional subdivisions in a sufficiently formal way for final payroll compliance.

### Financial Operations And Payment Timing Awareness

A person sending an international payment can check whether the recipient country has a holiday on the expected processing date, then plan for possible delays. `date`, `week_day`, `country`, `location`, and `type` give a quick signal that a business day assumption may be wrong.

Finance and operations teams can enrich invoice due-date, collections, treasury, or vendor-payment workflows with holiday context. For example, if a payment due date falls on a national holiday in a vendor's country, the workflow can flag the item for earlier approval or adjusted follow-up language. The endpoint does not say whether banks are closed or whether payment rails settle, so payment systems should pair it with banking calendars and rail-specific settlement rules.

### Calendar Product Enrichment

A person using a personal productivity tool can generate country-specific holiday overlays without maintaining static holiday files. `name_local`, `language`, `description`, `date`, and `week_day` make the returned record useful for calendar titles, tooltips, and reminders.

Calendar, booking, CRM, and scheduling SaaS products can use the endpoint to enrich customer-facing availability views by country. A scheduling assistant can show holiday badges next to proposed meeting dates or warn when an appointment falls on an observance in the invitee's country. The API does not identify a user's country by itself, so the product needs profile, locale, address, or organization data to choose the right `country` input.
