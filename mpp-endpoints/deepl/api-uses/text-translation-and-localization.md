# DeepL: Text Translation And Localization API Uses

## What This Endpoint Group Does

This endpoint group covers paid text translation through the MPP wrapper. It accepts one or more source text strings and returns translated text in the same order. Optional fields let callers choose source and target languages, add non-billed translation context, control formality, request quality- or latency-oriented model behavior, preserve formatting, use glossary/style/translation-memory identifiers, add custom instructions, and handle XML or HTML markup.

The practical value is controlled localization: a caller can translate product copy, support replies, UI snippets, or structured markup while keeping terminology, tone, and formatting aligned with the task. The MPP version is most useful for occasional or agent-triggered calls where a user does not want to maintain a DeepL API account or fixed plan.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/deepl/translate` | Translate UTF-8 plain text between supported languages. | `text[]`, `target_lang`, `source_lang`, `context`, `formality`, `model_type`, `glossary_id`, `style_id`, `custom_instructions`, markup controls | `translations[].text`, `translations[].detected_source_language`, optional `billed_characters`, optional `model_type_used` |

## Field Notes

### Inputs

`text[]` is the core payload. DeepL docs allow up to 50 text entries per request within the request-size limit and return translations in matching order. `target_lang` is required. `source_lang` is optional; omitting it triggers language detection. `context` is useful for short or ambiguous strings because it influences translation quality without being translated or counted toward DeepL text-translation billing.

Quality controls matter. `formality` can select more or less formal language where the target language supports it. `model_type` can request quality-optimized, prefer-quality-optimized, or latency-optimized behavior. `glossary_id`, `style_id`, `translation_memory_id`, `translation_memory_threshold`, and `custom_instructions` are higher-control localization fields, but the live MPP wrapper support for all provider-only fields was not tested. `tag_handling`, `tag_handling_version`, `outline_detection`, `non_splitting_tags`, `splitting_tags`, and `ignore_tags` make XML/HTML translation safer when content includes markup.

### Outputs

The useful output is `translations[].text`. `detected_source_language` can be stored for QA and routing, especially when `source_lang` was omitted. `billed_characters`, if requested and returned, helps reconcile cost. `model_type_used`, if returned, helps audit whether a quality-oriented request actually used quality-optimized behavior.

### Important Constraints Or Gaps

The provider text-translation request body limit is 128 KiB, and DeepL docs say translation calls with equal source and target language still count toward billing. The MPP OpenAPI lists `text` as a string, while DeepL OpenAPI and MPP prose describe an array of strings. The MPP docs expose only a subset of the provider OpenAPI fields, so production callers should test whether advanced fields are forwarded before depending on them.

## Use Cases

### Localize Product Catalog Copy With Context

A retailer can send product names, short descriptions, and category-specific `context` to translate listings for a new market. The `context` field is valuable for short strings such as product names because it can explain what the item is without becoming part of the translated output. `formality`, `glossary_id`, or `custom_instructions` can help keep terminology and brand voice consistent.

For an individual seller, the same workflow can translate occasional listings without subscribing to a monthly API plan. The returned `detected_source_language` can flag catalog rows that were not in the expected source language, and optional `billed_characters` can help estimate per-market translation cost. The limitation is that large catalogs need batching because of the 50-item and request-size limits.

### Translate Customer Support Replies

A support agent or AI assistant can translate inbound customer messages and draft outbound replies using `source_lang`, `target_lang`, and `formality`. For business support teams, `context` can include the product area, refund policy, or issue summary so short customer phrases are translated with the right meaning. A formal `formality` option can be useful for languages where polite register affects customer experience.

The output enables faster triage and response routing: `detected_source_language` can confirm customer language, and translated text can be passed to a ticketing system or response composer. Compliance still matters because customer messages may contain personal data; the artifact does not establish DeepL or MPP data-retention terms for this wrapper.

### Translate UI Strings And Preserve Markup

Software teams can translate UI labels, help text, or HTML/XML snippets while using `tag_handling`, `ignore_tags`, `non_splitting_tags`, and `splitting_tags` to reduce broken markup. `preserve_formatting` and `split_sentences` can help when UI strings include punctuation, line breaks, placeholders, or compact labels.

The value is not just translated text; it is translation that can fit a build pipeline. `translations[].text` can be written back to locale files, while `model_type_used` and language metadata can feed QA checks. The limitation is that uncommon placeholders or marker sequences can still be translated or moved unless protected with markup handling.

### Maintain Terminology For Legal, Finance, Or Healthcare Copy

A business translating regulated or domain-specific text can use `glossary_id`, `translation_memory_id`, `translation_memory_threshold`, `style_id`, and `custom_instructions` to reduce terminology drift. This matters when the same source term must map to the same target-language term across contracts, disclosures, or product documentation.

A personal user might apply the same pattern to immigration documents, academic text, or professional correspondence, but should treat the result as translation assistance rather than certified translation. The field gap is important: the MPP docs do not prove that all advanced provider controls are supported by the wrapper, and sensitive documents may require a direct enterprise relationship or stricter data-processing terms.

### Pre-Translate Marketing Drafts For Market Testing

Marketing teams can translate ad variants, landing-page headlines, or email snippets into multiple target languages and use `formality` plus `custom_instructions` to approximate region-specific tone. `context` can explain the campaign, audience, and product category without increasing DeepL's translated-character billing unit.

The returned translations can support quick qualitative review, A/B testing preparation, or budget decisions before commissioning human localization. This is high value when the goal is early screening rather than final publication. The caveat is that culturally sensitive marketing still needs native review, and paid MPP calls may be less efficient than direct API plans for high-volume campaigns.

### Agentic Research And Reading Assistance

An individual or analyst can translate selected paragraphs from public pages, filings, documentation, or messages into their working language. `source_lang` can be omitted to let DeepL detect language, and `context` can carry article or company background that improves ambiguous names or headlines.

The output enables summarization, note-taking, or cross-language comparison. The MPP wrapper is a fit for occasional translation because the user pays for the specific request rather than creating a DeepL account. The workflow should avoid sending copyrighted or confidential full documents unless rights and data-handling terms are clear.
