# Deepgram: Model Discovery And Selection API Uses

## What This Endpoint Group Does

This endpoint group lists available Deepgram STT and TTS models. It supports planning rather than content processing: callers can discover current model names, canonical names, architectures, supported languages, versions, UUIDs, STT capabilities, and TTS voice metadata before selecting a model for transcription or speech generation.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/deepgram/list-models` | List available STT and TTS models. | None | `stt[]`, `tts[]`, model names, canonical names, architecture, languages, version, UUID, STT batch/streaming/formatted-output flags, TTS metadata |

## Field Notes

### Inputs

The MPP docs say no parameters are required. The original provider endpoint is `GET /v1/models` and supports `include_outdated`, but the wrapper uses `POST /deepgram/list-models` with an empty JSON body and does not expose `include_outdated`.

### Outputs

For STT models, provider docs list `name`, `canonical_name`, `architecture`, `languages`, `version`, `uuid`, `batch`, `streaming`, and `formatted_output`. For TTS models, provider docs list `name`, `canonical_name`, `architecture`, `languages`, `version`, `uuid`, and `metadata`. TTS metadata may include `accent`, `age`, `color`, `image`, `sample`, `tags`, and `use_cases`.

### Important Constraints Or Gaps

The wrapper OpenAPI does not document a 200 response schema, so fields are inferred from the original provider docs. The model list can change over time. The endpoint lists current public models; provider docs say custom models are retrieved through a different provider endpoint, which the MPP wrapper does not expose.

## Use Cases

### Choose The Right STT Model Before Transcription

A developer or agent can call model discovery before transcribing to pick an STT model that supports the desired language and use mode. `languages`, `batch`, `streaming`, and `formatted_output` help decide whether a model is appropriate for pre-recorded files and whether it can produce the style of output the workflow needs.

This is useful for businesses processing multilingual call archives, interviews, or media libraries. The model list reduces avoidable failed calls and can let a workflow fall back when a preferred model is unavailable. The wrapper transcribe endpoint only documents a subset of model names, so integrations should verify whether every listed provider model is accepted by the wrapper.

### Select Voices For Brand Or Product Experience

Product teams building voice prompts, accessibility narration, or assistant replies can inspect TTS `languages` and `metadata` before using `/deepgram/speak`. Metadata such as voice tags, use cases, sample URLs, accent, and age can guide voice selection for a brand, audience, or channel.

A personal creator can use the same data to choose a voice for a language-learning clip, podcast intro, or narration prototype. The endpoint does not generate audio samples itself, though metadata can include sample URLs. Final quality still requires listening tests.

### Keep Model Configuration Fresh

An application can periodically refresh the model list and update internal allowlists for STT and TTS. `uuid`, `version`, and `canonical_name` help detect version changes, while language arrays and capability flags can update UI choices or validation rules.

This is valuable for businesses that expose model selection to customers. A stale hardcoded list can cause failed requests or hide new voices. The caveat is that the MPP endpoint itself costs per request, so refresh cadence should be deliberate.

### Build A Model Picker For Agents

An AI agent orchestrating audio workflows can use this endpoint to ask which model or voice is available before deciding whether to transcribe, synthesize speech, or ask the user for a different language. The structured outputs support automatic filtering by language, STT capability, or TTS use-case tags.

The decision value is reducing brittle prompt-level guesses. Instead of assuming `aura-2-thalia-en` or `nova-3` is always right, the agent can ground its choice in returned model metadata. It still needs guardrails because the wrapper does not document whether every provider model is accepted by the paid wrapper endpoints.
