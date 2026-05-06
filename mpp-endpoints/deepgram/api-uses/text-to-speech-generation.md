# Deepgram: Text To Speech Generation API Uses

## What This Endpoint Group Does

This endpoint group converts written text into generated speech. The MPP wrapper accepts `text` plus optional controls for voice model, encoding, container, and sample rate. Wrapper docs say the response is base64-encoded audio, MP3 by default, but the public wrapper OpenAPI does not document the response envelope or field name.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/deepgram/speak` | Generate speech audio from text. | `text`, `model`, `encoding`, `container`, `sample_rate` | Base64-encoded audio per wrapper docs; exact field name undocumented |

## Field Notes

### Inputs

`text` is required. The wrapper docs recommend roughly 2000 characters per call. `model` selects a Deepgram Aura voice, with the wrapper documenting `aura-2-thalia-en` as the default and model names following the `aura-2-{voice}-{lang}` pattern. `encoding`, `container`, and `sample_rate` control output format and telephony or media compatibility.

### Outputs

The MPP docs say the response contains base64-encoded audio. The provider reference for `/v1/speak` documents the request and audio generation but leaves the success schema effectively empty, so downstream callers should inspect the wrapper response before assuming a specific field name.

### Important Constraints Or Gaps

The wrapper does not expose all provider controls, including `speed`, `bit_rate`, `tag`, `callback`, and `mip_opt_out`. The exact maximum text length is not documented, only a recommendation. Output format options depend on provider constraints; for example, some sample rates are only valid for certain encodings. Deepgram rate limits list lower concurrent limits for TTS REST than for several STT surfaces.

## Use Cases

### Voice Prompts For Agents And IVR

A business can generate short voice prompts for phone agents, IVR menus, onboarding flows, or status announcements. `model` selects the voice personality and language, while `encoding`, `container`, and `sample_rate` let the output fit telephony, web playback, or post-processing needs.

The generated audio can be cached and reused wherever the prompt text is stable. The key limitation is response schema uncertainty: an integration should first confirm how the wrapper names and packages the base64 audio before wiring it into a production phone or media system.

### Accessibility Narration For Written Content

A personal user or small publisher can convert announcements, articles, study notes, or support docs into listenable audio. The `text` field holds the script, and the voice model can be chosen for language and tone. MP3 output is suitable for broad playback, while other encodings can support custom players.

The value is making written content usable while commuting, exercising, or supporting users who prefer audio. The endpoint is best for short passages because the wrapper recommends about 2000 characters per call; longer content needs chunking and stitching outside this API.

### Product Demos And Prototype Voice UI

Product teams can quickly prototype voice-first experiences without provisioning a full provider account. The endpoint can generate sample button reads, onboarding narration, assistant replies, and product demo voiceovers. This is useful when a team needs realistic speech assets to test interaction timing and user perception.

The output fields support automation only once the base64 response format is confirmed. For high-volume production, teams should also compare MPP per-request cost, official Deepgram usage pricing, caching policy, and rate limits.

### Multilingual Customer Communication Snippets

Support, sales, or operations teams can generate brief voice snippets in supported languages when the selected Aura-2 model supports the desired language. A workflow could create localized appointment reminders, order updates, or training clips from approved text.

The model field matters because language is encoded in the voice model name. The list-models endpoint can help discover current voices and languages before generation. Human review is still important for pronunciation, brand tone, and regulated messages.

### Audio Assets For Education And Training

Educators and internal enablement teams can turn lesson summaries, flashcards, or training steps into audio. `sample_rate` and `container` let the audio be shaped for learning platforms, lightweight mobile playback, or downstream editing.

The endpoint does not return alignment, timestamps, or captions, so workflows needing synchronized text/audio would need another tool. It also generates audio from input text only; it does not validate instructional correctness or handle licensing of the written content.
