# DeepL: Writing Improvement And Tone Control API Uses

## What This Endpoint Group Does

This endpoint group covers DeepL Write text improvement through the MPP wrapper. It accepts one or more text strings and can improve grammar, clarity, style, tone, and language variants. It is not a translation endpoint: DeepL docs say the source text language must match the target language, although variant conversion such as American English to British English is supported.

The group is useful when a workflow needs polished same-language text rather than translated text. The key fields are `text[]`, optional `target_lang`, optional `writing_style`, and optional `tone`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/deepl/rephrase` | Improve grammar, wording, style, tone, or language variant for same-language text. | `text[]`, `target_lang`, `writing_style`, `tone` | `improvements[].text`, `improvements[].detected_source_language`, docs-derived `improvements[].target_language` |

## Field Notes

### Inputs

`text[]` is required by provider docs. The MPP docs mark `target_lang` as required, while the current DeepL provider OpenAPI only requires `text`. `target_lang` controls the language or variant for the improved text, with options such as `en-US`, `en-GB`, `de`, `es`, `fr`, `it`, `ja`, `ko`, `pt-BR`, `pt-PT`, and `zh-Hans`.

`writing_style` can request styles such as `simple`, `business`, `academic`, or `casual`, including `prefer_` fallbacks. `tone` can request `friendly`, `confident`, `diplomatic`, or `enthusiastic`, also with `prefer_` fallbacks. DeepL docs say `writing_style` and `tone` cannot both be included in the same request.

### Outputs

The core output is `improvements[].text`, the improved version of each input string. `detected_source_language` helps catch source-language mismatches. DeepL overview docs also show `target_language`, but the current endpoint OpenAPI excerpt omits it, so downstream consumers should treat it as possible but not guaranteed.

### Important Constraints Or Gaps

DeepL docs list a 10 KiB request-body limit for text improvement. The feature is documented as available to DeepL API Pro customers and not API Free. Text improvement languages are not yet included in `/languages`, so callers cannot rely on the assigned language-list endpoint to validate Write support. Unsupported style/tone combinations can produce HTTP 400 when strict non-`prefer_` values are used.

## Use Cases

### Polish Customer-Facing Messages Before Sending

A support agent, salesperson, or personal assistant can send a draft message to `/deepl/rephrase` with `tone=friendly` or `tone=diplomatic` to make it more professional before sending. `detected_source_language` helps detect when a user accidentally submitted a language that does not match the desired `target_lang`.

For a business, the endpoint can sit between a ticketing system and a human review step: the agent drafts the reply, DeepL Write improves it, and the human accepts or edits the final text. The limitation is that tone and style are mutually exclusive controls, so the workflow should choose the more important axis for each request.

### Convert Between English Variants

A writer can use `target_lang=en-GB` or `target_lang=en-US` to convert copy between British and American English while improving spelling and phrasing. This helps individuals preparing resumes, cover letters, academic abstracts, or blog posts for a specific audience.

For a business, the same field supports regional variants for web pages, app store listings, product copy, and support macros. It avoids using translation for same-language variants, which DeepL docs warn would count toward billing and may not change the text. A review step is still needed for legal, regulatory, or brand-sensitive wording.

### Standardize Business Or Academic Style

Teams can send drafts with `writing_style=business` or `writing_style=academic` to standardize communications without building their own style model. This is useful for sales proposals, analyst notes, research summaries, and internal memos where the same underlying facts need a clearer register.

The returned `improvements[].text` can replace or be shown alongside the original draft. For organizations, this can become a low-friction editing step inside a CRM, CMS, or document workflow. The field gap is that supported styles vary by language, so `prefer_business` or `prefer_academic` may be safer than strict values when target language support is uncertain.

### Make Public Content Easier To Read

An individual can rephrase dense notes, emails, or copied article excerpts with `writing_style=simple` to make them easier to read. A business can apply the same pattern to help-center drafts, onboarding copy, product instructions, or internal policy summaries.

The output is valuable because it preserves the same language while reducing reading effort. This differs from summarization: the endpoint is designed to improve the text, not necessarily shorten it or extract claims. The workflow should avoid submitting content that the user has no right to process or store.

### Prepare Multilingual Drafts For Native Review

When teams already have same-language drafts in supported languages, they can use `target_lang`, `writing_style`, and `tone` to improve local-market copy before a native speaker reviews it. For example, a French marketing draft can be made more businesslike, or a German support macro can be made more diplomatic.

This is useful because human reviewers spend time on nuance instead of grammar and clarity fixes. The caveat is that the `/languages` endpoint does not represent Write support, and DeepL docs state style/tone support is narrower than translation language support.

### Clean AI-Generated Drafts Before Publication

Agents often produce drafts that are useful but awkward. A workflow can pass those drafts to `/deepl/rephrase` to improve grammar and tone before presenting them to a user. `tone=confident` can suit product announcements, while `tone=diplomatic` can suit sensitive customer communication.

For businesses, this endpoint can act as a final text-quality pass in agentic content workflows where a small paid improvement call is cheaper than maintaining a full direct API subscription. It should not be the only control for factuality, policy compliance, or brand claims because it improves wording rather than verifying truth.
