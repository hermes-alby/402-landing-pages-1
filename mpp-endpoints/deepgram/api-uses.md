# Deepgram API Uses

## Service Summary

Deepgram is a speech AI provider with APIs for speech-to-text, text-to-speech, voice agents, audio intelligence, text intelligence, model metadata, and account operations. The assigned MPP service exposes four paid wrapper endpoints: transcribe audio from a public URL, generate speech from text, analyze text, and list available models.

The main value of the MPP wrapper is access-friction reduction. Deepgram already publishes official pay-as-you-go usage pricing, but MPP can let an agent or occasional user make a specific request without creating a Deepgram account, managing a Deepgram API key, or preloading provider credits.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Audio Transcription And Enrichment | 1 | Convert public audio URLs into transcripts, timing, speaker structure, summaries, topics, intents, sentiment, and entities. | [audio-transcription-and-enrichment.md](api-uses/audio-transcription-and-enrichment.md) |
| Text To Speech Generation | 1 | Generate voice audio from short text with selectable Aura voice and audio format controls. | [text-to-speech-generation.md](api-uses/text-to-speech-generation.md) |
| Text Intelligence Analysis | 1 | Summarize and classify existing text by sentiment, topics, and intents. | [text-intelligence-analysis.md](api-uses/text-intelligence-analysis.md) |
| Model Discovery And Selection | 1 | Inspect current STT and TTS model metadata before choosing a transcription model or voice. | [model-discovery-and-selection.md](api-uses/model-discovery-and-selection.md) |

## Highest-Value Uses

- Transcribe and summarize sales calls, support calls, customer interviews, podcasts, meetings, and webinars, then use topic, sentiment, intent, entity, and timestamp fields to route review or repurpose content.
- Analyze support tickets, reviews, survey responses, CRM notes, and chat logs for summary, sentiment, topics, and intent before triage or routing.
- Generate short speech assets for voice agents, IVR prompts, accessibility narration, education clips, and product prototypes.
- Refresh current STT/TTS model and voice metadata so applications and agents do not rely on stale model lists.

## Personal Use Opportunities

Individuals can transcribe interviews, consultations, lectures, podcast drafts, or recorded calls into searchable notes. The most useful fields are transcript, word timings, paragraphs, summary, topics, entities, and sentiment.

They can also turn short written material into audio for listening later, or analyze written notes and long messages to extract a summary, topics, or intent. Privacy matters because audio transcription requires a public URL and model-generated analysis should be checked before making important decisions.

## Business Use Opportunities

Businesses can use the transcription endpoint for contact-center QA, sales coaching, meeting intelligence, media workflows, and voice-of-customer research. The text analysis endpoint supports ticket triage, feedback mining, moderation queues, account signal extraction, and CRM summarization.

The TTS endpoint fits short prompt generation, voice UX prototypes, localized announcements, and accessibility assets. The model-listing endpoint supports operational reliability by grounding model and voice selection in current provider metadata.

## Endpoint Group Summaries

### Audio Transcription And Enrichment

`/deepgram/transcribe` accepts a public audio URL and optional enrichment toggles. It is the most broadly useful endpoint because it turns audio into both human-readable text and structured machine signals. Full details: [audio-transcription-and-enrichment.md](api-uses/audio-transcription-and-enrichment.md).

### Text To Speech Generation

`/deepgram/speak` accepts text and optional voice/output settings, then returns generated audio according to wrapper docs. It is best for short reusable prompts, narration, demos, and accessibility workflows. Full details: [text-to-speech-generation.md](api-uses/text-to-speech-generation.md).

### Text Intelligence Analysis

`/deepgram/analyze` applies summary, sentiment, topic, and intent analysis to existing text. It is useful when content is already textual and the workflow needs routing, prioritization, or distillation rather than transcription. Full details: [text-intelligence-analysis.md](api-uses/text-intelligence-analysis.md).

### Model Discovery And Selection

`/deepgram/list-models` lists STT and TTS model metadata. It helps applications and agents choose model names, supported languages, voice metadata, and STT capabilities before making processing calls. Full details: [model-discovery-and-selection.md](api-uses/model-discovery-and-selection.md).

## Field And Data Themes

The service works with three content types: public audio URLs, plain text, and generated audio. Transcription and analysis outputs include content fields (`transcript`, summaries, segment text), timing fields (`start`, `end`, `created`), identifiers (`request_id`, `uuid`, model names), confidence or score fields, token accounting fields for intelligence features, and model metadata.

The most decision-ready fields are summary text, sentiment segments and averages, topic labels with confidence, intent labels with confidence, entity values, word timestamps, speaker numbers, model languages, and TTS voice metadata.
