# SerpApi API Uses

## Service Summary

SerpApi is a structured search-results API provider. This MPP service exposes one SerpApi-backed Google Flights endpoint at `https://serpapi.mpp.tempo.xyz/search`, described in the MPP feed as Google Flights search with a 15,000 micro-unit Tempo charge. The endpoint is most useful for occasional or agentic flight-search workflows that need current itinerary, price, duration, emissions, and booking-continuation data without a direct SerpApi subscription.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Flight Search And Booking Options | 1 | Search Google Flights, compare itinerary price/duration/stops/emissions, continue into return-leg or multi-city selection, and request booking options using result tokens. | [api-uses/flight-search-and-booking-options.md](api-uses/flight-search-and-booking-options.md) |

## Highest-Value Uses

The strongest use is decision-grade flight comparison: find viable itineraries by route/date/passenger/cabin constraints, then rank them by price, duration, stops, time windows, layover risk, carrier, baggage implications, and emissions. `price_insights` makes this more valuable by adding low/typical price context.

The second strongest use is token-based itinerary continuation. `departure_token` lets an app carry a selected outbound into return-leg or multi-city searches, while `booking_token` can move a selected itinerary toward booking-option lookup. This supports assistants and travel tools that need multi-step planning rather than a single flat list of fares.

## Personal Use Opportunities

Personal users can monitor a route before buying, compare flexible travel options, avoid overnight or long-layover itineraries, screen for preferred airlines, and weigh carbon emissions against price and time. The MPP wrapper is a good fit for occasional checks where a monthly SerpApi plan is unnecessary.

## Business Use Opportunities

Businesses can pre-screen corporate travel choices against policy, support travel desk recommendations, compare preferred-carrier options, assemble multi-leg trips, and build sustainability-aware travel workflows. The data is also useful for budget alerts and market checks, but high-volume products should compare MPP economics with direct SerpApi quotas and Enterprise pricing.

## Endpoint Group Summaries

### Flight Search And Booking Options

This group covers the single `GET /search` MPP endpoint. It accepts Google Flights route, date, passenger, cabin, locale, currency, sorting, airline, time-window, layover, duration, price, and emissions parameters, and returns structured itineraries plus price insights and airport metadata. See [api-uses/flight-search-and-booking-options.md](api-uses/flight-search-and-booking-options.md).

## Field And Data Themes

- Route and location fields: `departure_id`, `arrival_id`, airport IATA codes, kgmids, airport names, cities, countries, and country codes.
- Time fields: outbound/return dates, segment departure/arrival times, layover duration, total duration, and price-history timestamps.
- Money and quantity fields: ticket `price`, `lowest_price`, `typical_price_range`, passenger counts, baggage count, duration, and emissions.
- Decision fields: `stops`, `sort_by`, `travel_class`, airline filters, `extensions`, overnight flags, delay flags, legroom, and emissions deltas.
- Continuation fields: `departure_token`, `booking_token`, `search_metadata.id`, and `search_metadata.status`.
