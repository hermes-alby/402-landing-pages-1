# OpenAI: Audio Conversion API Uses

## What This Endpoint Group Does

This group converts between speech and text. `POST /v1/audio/transcriptions` turns audio files into text, optionally with timestamps, segments, logprobs, streaming, and diarization. `POST /v1/audio/speech` turns text into generated audio bytes or audio stream events. These endpoints can be used separately or chained with Responses/Chat Completions for voice-agent workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/audio/transcriptions` | Transcribe uploaded audio into text. | `file`, `model`, `language`, `prompt`, `response_format`, `timestamp_granularities`, `include`, `stream`, `chunking_strategy`, `known_speaker_names` | `text`, `segments`, `words`, `logprobs`, `usage`, transcript stream events |
| POST | `/v1/audio/speech` | Generate audio from text. | `model`, `input`, `voice`, `response_format`, `speed`, `stream_format` | binary audio body, stream events |

## Field Notes

### Inputs

For transcription, `file` and `model` are required. `response_format`, timestamps, `include`, `stream`, and diarization fields determine whether the output is simple text, timed transcript data, or incremental transcript events. For speech, `model`, `input`, and `voice` are core fields, while `response_format`, `speed`, and `stream_format` influence playback, storage, and UI design.

### Outputs

Transcription returns `text` and may include `segments`, `words`, `speaker`, `logprobs`, and usage by duration or tokens. Speech returns audio bytes, usually consumed as an MP3/WAV/etc. file or streamed to a player. Together, these outputs can bridge spoken interfaces and text-based AI workflows.

### Important Constraints Or Gaps

OpenAI docs distinguish these specialized endpoints from Realtime and Chat Completions audio. For low-latency bidirectional voice, Realtime may be better, but it is not exposed by this MPP wrapper. The fetched excerpts did not confirm maximum file size or every supported audio format. The MPP feed uses fixed charges and does not say whether charges scale with audio length, output length, or model.

## Use Cases

### Meeting And Call Transcription

A person can transcribe recorded meetings, interviews, lectures, or voice memos. `response_format: verbose_json`, `timestamp_granularities`, and `segments` help jump back to important parts of the recording. If diarization is supported through the wrapper, `speaker` fields help separate participants.

A business can process sales calls, support calls, webinars, interviews, and compliance recordings. The returned text can feed search, quality scoring, summaries, CRM notes, or coaching workflows. The important limitation is consent and privacy: callers need proper permission to process recordings, and retention controls should match the sensitivity of the audio.

### Accessibility And Content Repurposing

A person can turn podcasts, videos, or voice notes into captions, transcripts, or searchable notes. `response_format` can support downstream caption formats, while timestamps align text with media.

Businesses can create captions, searchable archives, knowledge-base drafts, training summaries, or localization prep from recorded content. The output enables editors to find sections, cut highlights, and publish accessible text. Human review is still needed for names, jargon, legal claims, and medical or financial content.

### Voice Input For Text Agents

A person can speak a request, transcribe it, send the text to Responses or Chat Completions, and optionally synthesize the answer back to audio. The transcription `text` and speech `input` fields are the bridge between audio and text APIs.

Businesses can add voice input to existing text agents without adopting a full realtime voice stack. This works for non-urgent workflows such as internal assistants, kiosk interactions, accessibility features, and asynchronous customer support. The caveat is latency: chaining transcription, model response, and speech generation is slower than native Realtime speech-to-speech.

### Read-Aloud And Audio Publishing

A person can turn notes, articles, scripts, or study materials into audio for listening while commuting or exercising. Fields such as `voice`, `response_format`, and `speed` affect comfort and device compatibility.

Businesses can create audio versions of help articles, onboarding materials, announcements, product tutorials, and personalized messages. The returned binary audio can be stored in a CMS or delivered directly to a user. Teams should review brand voice, pronunciation, and accessibility requirements before publication.

### Quality Review And Confidence Triage

A person can request logprobs or timestamps to find uncertain words in a transcript and manually correct them. Word-level timing helps align edits to the original audio.

Businesses can triage transcript quality by flagging low-confidence segments, unusual vocabulary, or speaker changes for human review. `logprobs`, `segments`, and `words` are the useful fields. This is valuable in contact centers, legal discovery prep, media editing, and research transcription, but low confidence is not a definitive error signal.

### Voice Notifications And Personalization

A person can generate short voice reminders, study prompts, or custom narration from text. The output audio bytes can be played by a personal script or app.

Businesses can generate voice notifications, product walkthroughs, IVR prompts, internal training snippets, or personalized onboarding messages. The inputs `input`, `voice`, and `speed` control the experience. The risk is that synthesized voice can affect user trust; businesses should disclose generated audio where appropriate and avoid impersonation or misleading use.
