# DeepL: Language Support Discovery API Uses

## What This Endpoint Group Does

This endpoint group lists supported DeepL source or target languages through the MPP wrapper. The provider API uses `GET /v2/languages?type=source|target`; the MPP wrapper exposes `POST /deepl/languages` with a JSON `type` field. The response returns language codes and English display names, and target-language responses can include `supports_formality`.

The endpoint is not a translation call. Its value is validation and planning before paid translation or localization workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/deepl/languages` | List supported source or target languages. | `type` (`source` or `target`) | `language`, `name`, target-only `supports_formality` |

## Field Notes

### Inputs

`type` selects whether to list source languages or target languages. DeepL provider docs default to `source` when omitted. The MPP wrapper docs show the same logical field in the POST body.

### Outputs

`language` is the code to use in translation-related requests. `name` is the English display name. `supports_formality` appears for target-language listings and tells callers whether `formality` can be safely offered or used for a target language.

### Important Constraints Or Gaps

DeepL docs say text-improvement languages have not yet been added to `/languages`, so this endpoint should not be used as the source of truth for `/write/rephrase` support. The endpoint also does not expose model availability, glossary pair support, style-rule support, or v3 product-feature details. DeepL has beta `/v3/languages` endpoints for product-specific feature support, but those are outside the assigned MPP manifest.

## Use Cases

### Validate Translation Requests Before Spending

An agent can call `/deepl/languages` before paid translation to verify that a requested `target_lang` is available. For personal use, this prevents a user from paying for a translation request that is likely to fail because the language code is wrong. For a business workflow, it can validate imported localization jobs before sending batches to `/deepl/translate`.

The fields make this concrete: `language` is the code to compare against user input, and `name` can drive error messages or UI labels. This endpoint itself has a fixed MPP fee, so high-volume systems may prefer caching the result and refreshing periodically rather than paying on every translation.

### Build A Language Picker For Translation Tools

A product team can use target-language responses to populate a language selector in an internal translation tool. `name` provides display labels, while `language` supplies the value sent to `/deepl/translate`. For personal tools, the same response can build a simple menu for a browser extension or note-taking workflow.

The key benefit is avoiding hard-coded language lists that drift as DeepL adds or changes support. The limitation is that the result is for translation languages, not DeepL Write languages, and it does not include product-specific beta feature support from the `/v3/languages` endpoint.

### Show Formality Options Only When Supported

The target-language response can include `supports_formality`. A business localization UI can use that field to show a formality selector only for supported target languages, reducing avoidable 400-class failures when users choose strict `more` or `less` formality for unsupported languages.

For individuals, this can make a simple translation assistant less confusing: the assistant can explain that formality control is available for some languages and omit the option elsewhere. The caveat is that DeepL's formality feature can also change over time, so cached lists need refresh policies.

### Route Localization Jobs By Language Capability

Localization operations can use source and target language lists to route jobs to DeepL or to a fallback provider. If an incoming job contains a source or target language outside the returned `language` codes, the system can send it for human handling or another translation system before incurring DeepL translation spend.

This is useful for businesses with multilingual content queues because it turns supported-language metadata into a decision point. It can also help analysts triage documents by language before selecting a translation path. The missing dependency is product-specific capability: this endpoint does not tell whether glossaries, style rules, or next-gen models are available for a language pair.

### Audit Existing Locale Files

A software team can compare existing locale codes in an application against DeepL `source` and `target` language lists. The output can reveal unsupported or incorrectly formatted codes before automated translation scripts run.

The result supports concrete actions: normalize codes, exclude unsupported locales, or add manual translation tasks. Because the endpoint returns English names, it can also enrich reports for non-engineering stakeholders. Teams should still verify DeepL's variant expectations, such as regional English or Portuguese codes, before updating production locale identifiers.
