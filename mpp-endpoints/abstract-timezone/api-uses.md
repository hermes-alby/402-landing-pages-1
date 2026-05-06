# Timezone API Uses

## Service Summary

Timezone is a Locus MPP wrapper around AbstractAPI's Time, Date, and Timezone API. It exposes paid JSON POST endpoints for resolving current local time from a location and converting a datetime between two locations. The service is most useful for workflows where a caller needs occasional pay-per-request access to timezone facts without managing an AbstractAPI account or API key.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Location Time Lookup And Conversion | 2 | Resolve current local time, convert datetimes between locations, and retrieve timezone, offset, DST, normalized-location, latitude, and longitude metadata. | [api-uses/location-time-lookup-and-conversion.md](api-uses/location-time-lookup-and-conversion.md) |

## Highest-Value Uses

The strongest uses are time-sensitive automations that would otherwise rely on brittle hard-coded offsets: cross-timezone meeting scheduling, outreach timing, travel itinerary localization, distributed support handoffs, and deadline or cutoff conversion. The most valuable fields are `datetime`, `timezone_location`, `gmt_offset`, `is_dst`, `requested_location`, `latitude`, and `longitude`.

## Personal Use Opportunities

People can use the endpoints to schedule calls across countries, understand travel times in destination-local terms, avoid sending messages during another person's night, and convert deadlines into their own local time. The API is also useful for lightweight personal agents that receive place names rather than normalized timezone IDs.

## Business Use Opportunities

Businesses can integrate the endpoints into CRM scheduling, customer notifications, support routing, global incident handoffs, travel tools, logistics reminders, and SLA or order-cutoff localization. The pay-per-request MPP model fits sporadic or agent-driven checks where maintaining a direct subscription and API key is unnecessary.

## Endpoint Group Summaries

### Location Time Lookup And Conversion

This group covers `POST /abstract-timezone/current-time` and `POST /abstract-timezone/convert-time`. Together they answer what time applies to a location now or after conversion from another location, with enough timezone and coordinate metadata to support automated scheduling, notification, and audit decisions. Full details: [api-uses/location-time-lookup-and-conversion.md](api-uses/location-time-lookup-and-conversion.md).

## Field And Data Themes

Inputs are location strings and an optional datetime string. Provider docs say locations can be names, coordinates, or IP addresses, while MPP docs explicitly mention names and coordinates. Outputs are JSON time and timezone facts: local datetime, timezone name/location/abbreviation, GMT offset, daylight-saving status, normalized requested location, latitude, and longitude. Conversion returns these fields for both the base and target locations.
