# StableTravel: Airport Transfers Booking API Uses

## What This Endpoint Group Does

Search, book, and cancel airport transfer offers using pickup/drop-off locations, passenger counts, and transfer timing. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream transfer search, booking, and cancellation data comes from Amadeus-backed transfer surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/transfers/cancel` | Cancel a transfer order | orderId, confirmNbr | data |
| POST | `/api/transfers/search` | Search available transfer offers | startDateTime, passengers, startLocationCode, startUicCode, startAddressLine, startZipCode, startCountryCode, startCityName | data, warnings |
| POST | `/api/transfers/book` | Book a transfer order | offerId, data | data, warnings |

## Field Notes

### Inputs

- orderId (required)
- confirmNbr (required)
- startDateTime (required)
- passengers
- startLocationCode (required)
- startUicCode
- startAddressLine
- startZipCode
- startCountryCode
- startCityName
- startStateCode
- startGeoCode
- startName
- startGooglePlaceId
- endLocationCode
- endUicCode
- endAddressLine
- endZipCode
- endCountryCode
- endCityName
- endStateCode
- endGeoCode
- endName
- endGooglePlaceId
- transferType
- duration
- language
- currency
- vehicleCategory
- vehicleCode
- providerCodes
- baggages
- discountNumbers
- extraServiceCodes
- equipmentCodes
- reference
- stopOvers
- startConnectedSegment
- endConnectedSegment
- passengerCharacteristics

### Outputs

- data
- warnings

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Airport Pickup Coordination

Transfer search accepts pickup and drop-off locations, date-time, passenger count, transfer type, and address/geocode fields. A traveler can line up private airport transport as soon as a flight and hotel are known; a concierge or corporate travel desk can automate quote gathering while requiring confirmation before booking.

### Operations Recovery After Flight Changes

When a flight delay or airport disruption changes arrival time, a workflow can search new transfer options or cancel a transfer order if the supplier policy allows it. This is valuable when paired with live flight tracking, but transfer book/cancel endpoints are mutations and should be guarded by human approval and duplicate-payment controls.

### Accessible Or Group Ground Transport Planning

Passenger count, transfer type, vehicle offer outputs, and end-address fields help compare whether a transfer fits a family, executive group, or event shuttle need. Public docs do not expose all vehicle constraints, so accessibility, luggage, child-seat, and meet-and-greet requirements may need separate confirmation.
