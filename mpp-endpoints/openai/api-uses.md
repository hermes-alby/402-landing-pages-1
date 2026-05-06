# OpenAI API Uses

## Service Summary

OpenAI provides hosted AI APIs for model responses, chat, embeddings, image generation, speech-to-text, and text-to-speech. The MPP wrapper at `https://openai.mpp.tempo.xyz` exposes six public OpenAI-compatible POST endpoints with Tempo payment metadata. It is best understood as a narrow paid-access wrapper around first-party OpenAI APIs, not a separate model provider.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Model Responses And Chat | 2 | Text generation, structured extraction, tool calls, multimodal chat, streaming, and agent steps. | [model-responses-and-chat.md](api-uses/model-responses-and-chat.md) |
| Embeddings And Semantic Retrieval | 1 | Text-to-vector embeddings for search, retrieval, clustering, recommendations, classification, and anomaly detection. | [embeddings-and-semantic-retrieval.md](api-uses/embeddings-and-semantic-retrieval.md) |
| Image Generation | 1 | Prompt-to-image asset creation with model, size, quality, format, moderation, and streaming controls. | [image-generation.md](api-uses/image-generation.md) |
| Audio Conversion | 2 | Speech-to-text and text-to-speech conversion for transcripts, captions, voice input, and generated audio. | [audio-conversion.md](api-uses/audio-conversion.md) |

## Highest-Value Uses

The strongest uses are paid, one-off AI tasks where a user or agent wants OpenAI-backed output without direct OpenAI account setup: extracting structured data from text, summarizing or classifying documents, generating embeddings for semantic search, transcribing audio, producing short voice output, and drafting visual assets. For businesses, the most durable value is workflow enrichment: routing support tickets, searching internal knowledge, processing call recordings, generating creative drafts, and using model outputs as reviewed inputs to downstream systems.

## Personal Use Opportunities

Personal workflows include summarizing notes, turning documents into structured JSON, building a private semantic search index, transcribing interviews or lectures, generating read-aloud audio, and creating draft images for projects or social posts. The MPP payment model is most useful when the user wants a small number of calls without managing API keys or direct billing.

## Business Use Opportunities

Business workflows include support triage, CRM enrichment from calls and emails, retrieval-augmented internal assistants, content moderation prep, creative exploration, meeting intelligence, accessibility captioning, and voice interfaces built by chaining transcription, model response, and speech generation. The outputs can drive human review queues, recommendations, routing, analytics, or generated customer-facing content. Any mutation, purchase, account action, or automated decision should remain outside the model call and be governed by separate approval and validation.

## Endpoint Group Summaries

### Model Responses And Chat

Responses and Chat Completions generate text, structured data, chat messages, tool calls, and streaming events. Responses is the recommended new text generation surface in OpenAI docs; Chat Completions remains important for compatibility and some audio chat workflows. See [api-uses/model-responses-and-chat.md](api-uses/model-responses-and-chat.md).

### Embeddings And Semantic Retrieval

Embeddings convert text into vectors that can be stored and compared for semantic search, clustering, recommendations, anomaly detection, and classification. The endpoint is most valuable when paired with a vector database and metadata store. See [api-uses/embeddings-and-semantic-retrieval.md](api-uses/embeddings-and-semantic-retrieval.md).

### Image Generation

Image generation creates visual assets from prompts. It is strongest for ideation, drafts, personalized visuals, and content production where human review can handle text rendering, brand consistency, and policy checks. See [api-uses/image-generation.md](api-uses/image-generation.md).

### Audio Conversion

Audio transcription and speech generation bridge spoken content and text workflows. Transcription creates transcripts, timestamps, segments, and sometimes diarization or logprobs; speech produces audio bytes from text. See [api-uses/audio-conversion.md](api-uses/audio-conversion.md).

## Field And Data Themes

Across the service, `model` is the central cost and behavior switch. Content fields such as `input`, `messages`, `prompt`, `file`, and speech `input` carry the user's source material. Output fields such as `output[]`, `choices[]`, `embedding`, `b64_json`, `text`, `segments`, and audio bytes are the useful artifacts. Usage fields support cost and quota tracking, but the MPP wrapper's pricing mapping is only partially documented.
