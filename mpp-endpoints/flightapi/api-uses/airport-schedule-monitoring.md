# FlightAPI: Airport Schedule Monitoring API Uses

## What This Endpoint Group Does

This endpoint group retrieves airport arrivals or departures schedules. Inputs identify the airport, schedule mode, day or page, and possibly v2 date/page fields if the MPP wrapper supports the provider's documented `/schedule/v2` path. Outputs include airport metadata, schedule paging, flight rows, carrier details, origin/destination airport details, status, aircraft fields, terminal/gate/baggage fields, and scheduled/real/estimated times.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/schedule/:rest*` | Retrieve airport arrivals or departures schedule | Mode, IATA airport code, relative day, page; v2 year/month/day/page if supported | Airport details, location/timezone, schedule counts/pages, flight identification, status, airline, aircraft, origin/destination, scheduled/real/estimated timing, terminal/gate/baggage |

## Field Notes

### Inputs

The v1 provider pattern is `/schedule/<api_key>?mode=<arrivals|departures>&iata=<airport>&day=<relative_day>&page=<page>`. The docs list `day` values `-1`, `-2`, `1`, and `2`, while also saying that omitting `day` returns a wider last-five-days-to-next-five-days schedule and can change credit cost.

The provider also documents `/schedule/v2/<api_key>?mode=dep&iata=JAI&year=2025&month=11&day=25&page=1`, but the MPP service feed lists only one `/schedule/:rest*` endpoint. The wildcard path may support v2, but that is not confirmed.

### Outputs

The v1 sample includes `airport.pluginData.details` with airport name, IATA/ICAO codes, delay index, position, country, city, timezone, URLs, and images. It includes `airport.pluginData.schedule.departures` with item/page counts, timestamp, and `data[].flight` objects. Flight objects include identification, status, aircraft, airline, airport origin/destination, terminal/gate/baggage fields, and scheduled/real/estimated time objects.

The v2 sample uses a different shape under `data.header` and `data.flights[]`, including date titles, departure airport metadata, `sortTime`, `departureTime`, `arrivalTime`, carrier fields, `operatedBy`, tracker `url`, airport code/city, and `isCodeshare`.

### Important Constraints Or Gaps

The docs conflict on whether `day` is required. The docs say credit cost can depend on the number of days returned when `day` is omitted. V2 support through MPP is unconfirmed. The examples are partial and do not define every possible flight status, aircraft field, or nullability rule.

## Use Cases

### Airport Pickup And Staffing Windows

A hotel, car service, event team, or family member can query arrivals for an airport and use flight rows, scheduled and estimated times, terminal/gate/baggage fields, and airport timezone data to decide when to staff a pickup or move a driver. The schedule view is useful when the exact flight number is not known but the destination airport and day are.

For businesses, schedule paging and item counts help size operational workload: a busy arrivals window can trigger more staff, while sparse windows can reduce idle time. The caveat is that gate and baggage fields may be null, and schedule freshness is not documented.

### Airport Disruption And Congestion Monitoring

Operations teams can watch departures or arrivals for a major airport and summarize `status.text`, delay-index fields, scheduled versus estimated times, and page totals. A high share of delayed or cancelled rows can drive customer messaging, staffing changes, or proactive rebooking review.

For an individual traveler, the same signal helps decide whether to leave earlier for a congested airport or expect delays on a connecting route. The API does not expose official airport advisories, so schedule-derived disruption should be treated as an operational signal rather than a source of regulatory truth.

### Flight Discovery Before Specific Tracking

When a user knows "I am flying from Jaipur to Mumbai tomorrow night" but not the flight number, schedule results can expose carrier, flight number, airport, and URL fields. The assistant can use those rows to identify candidate flights, then pass the carrier and number into the tracking endpoint for a more specific status lookup.

For travel support businesses, this reduces manual itinerary reconstruction from incomplete messages. The v2 fields are especially useful for this because `data.flights[].carrier.flightNumber`, `carrier.fs`, `airport.fs`, and `url` are compact and easy to present.

### Codeshare And Operator Messaging

Schedule v2 examples include `operatedBy` and `isCodeshare`, while v1 examples include airline code/name and aircraft fields. These fields help a travel app tell users which operating carrier to look for at the airport, even if the marketed carrier is different.

For businesses, this reduces missed check-in or terminal confusion in automated reminders. Because v2 support through MPP is unconfirmed, a production integration should verify whether `/schedule/v2` works through the wrapper before depending on `isCodeshare` fields.

### Airport Intelligence For Travel Planning

The airport details response includes position, timezone, country/city, airport URLs, images, and ratings/review snippets in the sample. A travel product can use these fields to enrich an itinerary page with airport context and local time, or to normalize schedule times against the airport timezone.

This is valuable as supporting context, not as the main reason to call the endpoint. Some content fields, such as images and review snippets, may come from third-party sources and should be used carefully with attribution and freshness checks.
