# Google Maps: Places Search And Details API Uses

## What This Endpoint Group Does

Find, identify, describe, autocomplete, and visualize businesses or points of interest.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /maps/place/textsearch/json | Search places by text query | query, keyword, type, language, minprice, maxprice, opennow, pagetoken | results, next_page_token, status |
| GET | /maps/place/nearbysearch/json | Search nearby places | location, radius, keyword, type, language, minprice, maxprice, opennow | results, next_page_token, status |
| GET | /maps/place/details/json | Get place details | place_id, fields, language, region, sessiontoken | result, status |
| GET | /maps/place/findplacefromtext/json | Find a place from text | input, inputtype, fields, locationbias, language | candidates, status |
| GET | /maps/place/autocomplete/json | Place autocomplete suggestions | input, sessiontoken, offset, location, radius, strictbounds, types, components | predictions, status |
| GET | /maps/place/queryautocomplete/json | Query autocomplete suggestions | input, sessiontoken, offset, location, radius, strictbounds, types, components | predictions, status |
| GET | /maps/place/photo | Get a place photo | photo_reference, maxwidth, maxheight | binary_image |
| GET | /places/v1/places/:id | Get place details (essentials) | id, X-Goog-FieldMask, languageCode, regionCode, sessionToken | id, displayName, formattedAddress, location, types, businessStatus, rating, userRatingCount |
| POST | /places/v1/places:searchText | Text search for places | X-Goog-FieldMask, textQuery, includedType, locationBias, locationRestriction, priceLevels, openNow, pageSize | places, nextPageToken |
| POST | /places/v1/places:searchNearby | Nearby search for places | X-Goog-FieldMask, locationRestriction, includedTypes, excludedTypes, includedPrimaryTypes, maxResultCount, rankPreference, languageCode | places, nextPageToken |
| POST | /places/v1/places:autocomplete | Place autocomplete | input, sessionToken, locationBias, locationRestriction, includedPrimaryTypes, includedRegionCodes, origin, languageCode | suggestions |
| GET | /places/v1/places/:id/photos/:photoId/media | Get a place photo | id, photoId, maxHeightPx, maxWidthPx, skipHttpRedirect | name, photoUri |

## Field Notes

### Inputs

- text query
- nearby circle
- place ID
- place types
- field mask
- language/region
- session token
- photo dimensions

### Outputs

- place IDs
- names
- addresses
- coordinates
- types
- ratings
- opening hours
- business status
- contact fields
- photos
- pagination tokens

### Important Constraints Or Gaps

- Direct Google Maps Platform use normally requires an API key or OAuth, enabled APIs, a Google Cloud project, billing, quotas, and compliance with Google Maps Platform terms. The MPP wrapper hides direct key setup but the public feed does not document wrapper-specific error schemas or transformations.
- Several newer APIs require field masks or optional response field selection. Missing field masks can change output shape and billing tier.
- Image, tile, photo, and video endpoints return binary media, redirects, media URLs, or tileset metadata rather than uniform JSON.

## Use Cases

### Local Vendor Shortlisting

A person planning a trip or event can search nearby restaurants, pharmacies, or services and compare ratings, hours, location, and photos. A procurement or operations team can automate first-pass vendor lists for new offices, events, or field jobs, then hand only plausible candidates to humans.

### Lead And Store Enrichment

A business can turn sparse names or addresses into stable place IDs, formatted addresses, coordinates, phone numbers, websites, opening hours, and category tags. Those fields help deduplicate CRM records, route leads geographically, and avoid contacting closed or irrelevant locations.

### Typeahead Location Capture

A consumer app can use autocomplete predictions to capture cleaner destinations with fewer keystrokes. The same session token and place ID flow helps businesses reduce failed searches and connect the final selected place to details or routing calls.
