# DeepL API Uses

## Service Summary

DeepL provides professional translation and writing-improvement APIs. The assigned MPP service exposes three paid wrapper endpoints: translate text, rephrase/improve same-language text with DeepL Write, and list supported languages. It is a strong fit for occasional or agent-triggered language work where the user wants per-request access without creating a DeepL account, managing API keys, or committing to a monthly API plan.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Text Translation And Localization | 1 | Translate text batches with optional context, formality, model preference, terminology/style controls, and markup handling. | [`api-uses/text-translation-and-localization.md`](api-uses/text-translation-and-localization.md) |
| Writing Improvement And Tone Control | 1 | Improve grammar, clarity, style, tone, and language variants for same-language text. | [`api-uses/writing-improvement-and-tone-control.md`](api-uses/writing-improvement-and-tone-control.md) |
| Language Support Discovery | 1 | Validate supported source/target languages and formality availability before translation workflows. | [`api-uses/language-support-discovery.md`](api-uses/language-support-discovery.md) |

## Highest-Value Uses

The highest-value use is selective localization: translate product copy, support replies, UI strings, or research excerpts only when needed, with `context`, `formality`, and optional terminology controls improving usefulness beyond a generic translation call. MPP access is useful when a person or agent needs a small number of high-quality language transformations and does not want a standing provider account.

The second high-value pattern is writing polish. `/deepl/rephrase` can turn rough drafts into clearer, more businesslike, academic, friendly, confident, diplomatic, or simple text. That makes it useful in CRM, support, publishing, and personal correspondence workflows.

Language discovery is less glamorous but operationally important. It lets tools validate `target_lang`, build language pickers, hide unsupported formality controls, and avoid failed translation calls.

## Personal Use Opportunities

- Translate selected foreign-language passages, emails, or documentation snippets into a working language.
- Rephrase resumes, cover letters, academic notes, or sensitive emails for clarity and tone.
- Convert writing between English variants such as `en-US` and `en-GB`.
- Build a small personal translation assistant that refreshes supported languages and pays only for actual translation or writing-help calls.

## Business Use Opportunities

- Localize product listings, UI copy, help-center content, and marketing drafts with context and formality control.
- Add a paid translation step to customer-support workflows for inbound triage and outbound replies.
- Use rephrasing as a pre-send quality pass for sales, support, legal-adjacent, or executive communications.
- Validate language support and formality support before submitting translation batches or exposing UI controls.
- Route unsupported language jobs to human review or another provider before incurring translation spend.

## Endpoint Group Summaries

### Text Translation And Localization

`POST /deepl/translate` maps to DeepL provider `/v2/translate`. It accepts `text[]`, `target_lang`, optional `source_lang`, optional non-billed `context`, `formality`, `model_type`, and advanced controls such as glossary/style/translation-memory identifiers and XML/HTML tag handling. It returns `translations[].text`, `detected_source_language`, and optional billing/model metadata. Full details: [`api-uses/text-translation-and-localization.md`](api-uses/text-translation-and-localization.md).

### Writing Improvement And Tone Control

`POST /deepl/rephrase` maps to DeepL provider `/v2/write/rephrase`. It accepts text plus optional `target_lang`, `writing_style`, or `tone`, and returns improved text. It is intended for same-language improvement and variant conversion rather than cross-language translation. Full details: [`api-uses/writing-improvement-and-tone-control.md`](api-uses/writing-improvement-and-tone-control.md).

### Language Support Discovery

`POST /deepl/languages` wraps provider `GET /v2/languages`. It accepts `type=source|target` and returns language codes, English names, and target-language `supports_formality` where applicable. It supports validation, UI construction, and routing before paid translation. Full details: [`api-uses/language-support-discovery.md`](api-uses/language-support-discovery.md).

## Field And Data Themes

- Content fields: `text[]`, `context`, `custom_instructions[]`, `translations[].text`, `improvements[].text`.
- Language fields: `source_lang`, `target_lang`, `detected_source_language`, `target_language`, `language`, `name`.
- Control fields: `formality`, `model_type`, `writing_style`, `tone`, `split_sentences`, `preserve_formatting`, `tag_handling`.
- Terminology/style identifiers: `glossary_id`, `style_id`, `translation_memory_id`.
- Cost/quantity fields: text character count, optional `billed_characters`, request-size limits, MPP dynamic amount hints, and fixed language-listing fee.
