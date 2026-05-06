# StableEnrich: Property And Resident Lookup API Uses

## What This Endpoint Group Does

Look up property ownership, resident, and address-linked property details from a structured address.

Property lookup has distinct privacy, address, real-estate, and resident-data use cases from general person search, and it uses a separate Whitepages endpoint.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/whitepages/property-search` | Whitepages Property Search - Get property ownership and resident data ($0.44) | street, city, state_code, zipcode, excludeFields | result, result.property_id, result.apn, result.property_address, result.property_address.id, result.property_address.address, result.property_address.full_address, result.property_address.line1 |

## Field Notes

### Inputs

- `street`
- `city`
- `state_code`
- `postal_code when supported`
- `excludeFields`

### Outputs

- `property ownership data`
- `resident data`
- `address details`
- `associated people and phone/address fields when returned`

### Important Constraints Or Gaps

- The exact response schema for property attributes is broad and upstream-derived.
- The service does not document whether returned property data is suitable for regulated eligibility decisions.
- Endpoints in this group cost /api/whitepages/property-search: $0.44.

## Use Cases

### Address Due Diligence And Owner Context

A person evaluating a property, rental, neighborhood move, or service visit can look up address-linked ownership and resident context from street, city, and state_code. The docs specifically warn that the field is state_code, not state.

Real estate, home services, insurance-adjacent, and field operations teams can use property and resident signals to prepare outreach or verify address context. Because the schema is upstream-derived and the compliance terms were not reviewed in this pass, regulated eligibility or tenant-screening uses should not be assumed allowed.

### Field Service And Direct-Mail Preparation

A local service business can use property search to enrich a target address before dispatch, quote prep, or mail campaign segmentation. Address normalization, associated residents, and property attributes when returned can help decide whether to call, mail, or route to a specialized crew.

The endpoint is high-cost compared with most StableEnrich calls, so it should be reserved for qualified addresses rather than broad prospecting. Outputs may be incomplete or stale and should be verified for operationally critical work.
