# Deepgram: Audio Transcription And Enrichment API Uses

## What This Endpoint Group Does

This endpoint group turns a public audio URL into transcript data. The wrapper exposes the core audio input plus practical enrichment toggles: punctuation, smart formatting, diarization, paragraphs, summarization, sentiment, topics, intents, and entity detection. Official Deepgram docs show that provider responses can include request metadata, duration, model identifiers, channel alternatives, transcript text, word timings, confidence scores, paragraph and utterance structure, detected entities, summaries, topics, intents, and sentiment segments.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/deepgram/transcribe` | Transcribe and optionally enrich pre-recorded audio from a public URL. | `url`, `model`, `language`, `smart_format`, `punctuate`, `diarize`, `paragraphs`, `summarize`, `sentiment`, `topics`, `intents`, `detect_entities` | `transcript`, `words[]`, `paragraphs`, `utterances[]`, `summary`, `topics`, `intents`, `sentiments`, `entities[]`, `metadata` |

## Field Notes

### Inputs

The required input is `url`, a publicly accessible audio file URL. `model` selects the STT model exposed by the wrapper, with `nova-3` documented as the default. `language` is a BCP-47 language hint. Boolean enrichment toggles determine whether the response includes readability structure, speaker information, entity extraction, and intelligence outputs.

### Outputs

The most important content output is `results.channels[].alternatives[].transcript`. Word-level `start`, `end`, and `confidence` support search, clipping, and subtitle alignment. `paragraphs` and `utterances` make long audio easier to read and attribute. `summary`, `topics`, `intents`, `sentiments`, and `entities` turn raw speech into structured signals for downstream review, triage, and analytics.

### Important Constraints Or Gaps

The wrapper requires a public audio URL, so private recordings must be hosted in a reachable location before use. The wrapper OpenAPI does not document a 200 response schema, so response fields are inferred from official Deepgram `/v1/listen` docs and the wrapper docs' feature descriptions. Deepgram rate limits say combined STT and intelligence requests are governed by the lower applicable service limit. The wrapper does not list `mip_opt_out`, callback, redaction, search, custom topic, custom intent, or other original Deepgram parameters.

## Use Cases

### Sales And Support Call Review

A business can transcribe sales demos, support calls, or customer success check-ins from recorded audio URLs, enabling `diarize`, `paragraphs`, `summarize`, `sentiment`, `topics`, and `intents`. The transcript and speaker-aware structure let managers review what was said, while sentiment and intent segments help find frustration, buying intent, cancellation risk, confusion, or escalation points without manually listening to every call.

For a personal workflow, someone could analyze a recorded service call or consultation to recover action items, names, dates, and the tone of the exchange. The useful fields are the full transcript, paragraph text, summary, entities, and sentiment segments. Limitations are privacy-sensitive: the recording must be public to the service, and the user should avoid uploading content they are not allowed to process.

### Meeting And Interview Notes

Researchers, journalists, recruiters, and operators can turn interview or meeting recordings into searchable notes. `smart_format`, `punctuate`, and `paragraphs` produce readable text; word timings preserve evidence back to the audio; `summary` creates a quick briefing; `topics` and `entities` help tag the conversation by subject, person, organization, or place.

The decision value is in shortening the review loop. A recruiter can compare candidate answers by topic, a journalist can jump to quoted segments using word timings, and a founder can turn customer interviews into product themes. The missing dependency is speaker names: diarization assigns speaker numbers, but it does not identify who each speaker is unless another workflow maps speaker labels to people.

### Podcast, Webinar, And Video Repurposing

Media teams can transcribe episodes, webinars, or product videos and use the transcript plus `summary`, `topics`, and `entities` to generate show notes, chapters, social snippets, accessibility captions, and internal content indexes. Word and paragraph timings help align text back to clips; topic segments can identify sections worth extracting.

Personal creators can use the same flow to make their own recordings searchable and easier to publish. The endpoint does not directly create finished captions or clips, so downstream formatting or editing tools are still required. Processing cost and concurrency limits matter for large back catalogs.

### Compliance And Quality Sampling

Regulated or quality-sensitive teams can sample calls for required disclosures, prohibited phrases, policy adherence, or adverse sentiment. The transcript gives auditable text; `entities` can flag names, organizations, or places; topic and intent signals can route calls to more specialized review queues.

This endpoint is not a full compliance engine by itself. It does not guarantee detection of every required phrase or policy issue, and wrapper docs do not expose Deepgram redaction controls. Teams handling sensitive personal data should treat public URL hosting and model-improvement settings as open concerns until the wrapper documents them.

### Voice-Of-Customer Theme Mining

Product and marketing teams can process recorded user interviews, support calls, or feedback voicemails and extract recurring `topics`, `intents`, `sentiments`, and summaries. This supports decisions about product priorities, messaging gaps, churn drivers, or documentation needs.

The value comes from connecting unstructured audio to structured fields: topic labels create categories, sentiment scores indicate pain intensity, and summary text makes review scalable. The risk is over-relying on model-generated labels; high-impact conclusions should be checked against transcripts and representative audio samples.
