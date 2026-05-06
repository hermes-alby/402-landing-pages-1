# Suno: Music Generation And Results API Uses

## What This Endpoint Group Does

This endpoint group turns a text brief into generated music and retrieves the resulting audio artifacts. `generate-music` accepts creative controls such as custom/non-custom mode, instrumental/vocal choice, model, prompt, style, title, negative tags, and optional vocal gender or callback URL. `get-music-status` accepts the returned `taskId` and provides task state plus result metadata such as audio URLs, streaming URLs, cover image URL, title, tags, prompt, model name, creation time, duration, and error information.

The group is asynchronous. A caller submits a paid generation request, receives a task identifier, and then pays a smaller polling fee until the task reaches `SUCCESS` or a failure state. The returned URLs and metadata are what make the endpoint useful: they allow downstream publishing, review, selection, asset storage, and production workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/suno/generate-music` | Submit a music generation task. | `customMode`, `instrumental`, `model`, `prompt`, `style`, `title`, `negativeTags`, `vocalGender`, `callBackUrl` | `taskId` |
| POST | `/suno/get-music-status` | Poll a music generation task. | `taskId` | `status`, `sunoData[].audioUrl`, `streamAudioUrl`, `imageUrl`, `prompt`, `modelName`, `title`, `tags`, `createTime`, `duration`, `errorCode`, `errorMessage` |

## Field Notes

### Inputs

The most important inputs are `customMode`, `instrumental`, `model`, and `prompt`. In non-custom mode, the prompt is a compact creative brief and the system generates lyrics and song choices. In custom mode, `style` and `title` become required, and `prompt` is required when vocals are requested because the prompt is treated as lyrics. `negativeTags` can steer away from unwanted sounds. `vocalGender` is useful for vocal direction, although public docs differ on enum spelling: the provider docs use `m`/`f`, while the MPP docs describe `male`/`female`.

### Outputs

The initial output is only a `taskId`. The status endpoint supplies the business value: a task state, generated track records, playable or downloadable audio URLs, stream URLs, cover art URL, prompt/lyrics, model name, title, tags, creation time, and duration. These fields let a caller decide whether the track is done, which version to use, where to store it, and how to attach metadata in a product catalog, creative asset manager, or publishing system.

### Important Constraints Or Gaps

Provider docs say every generation request returns exactly two songs, stream URLs arrive in roughly 30-40 seconds, downloadable song URLs in roughly 2-3 minutes, and generated files are retained for 15 days. MPP docs describe typical completion as 30-120 seconds. The provider direct API requires Bearer-token authentication; the MPP wrapper uses HTTP 402 auto-payment or wrapped Locus authentication. MPP OpenAPI does not document detailed success response schemas, so result field details are provider-doc-derived. Model availability may be slightly ambiguous because provider docs include `V5_5`, while the MPP docs list through `V5`.

## Use Cases

### On-Demand Soundtracks For Video And Social Content

A creator can submit a non-custom prompt such as a mood, topic, and platform context, then poll until two tracks are available. `audioUrl`, `streamAudioUrl`, `duration`, `title`, `tags`, and `imageUrl` let the creator audition options, pick a track that fits the edit length, and attach cover/metadata before publishing. The same workflow works for small agencies creating background music for clients without maintaining a prepaid SunoAPI credit balance.

For a business, the value is repeatable asset production. A content pipeline can generate music variants for product videos, ads, shorts, or podcast intros, store the returned URLs before their retention window expires, and log prompt/model/title metadata for approval and reuse. Human review remains important because quality, suitability, and rights/compliance checks are not encoded in the API response.

### Game And Interactive Experience Background Music

Game developers can generate instrumental loops or scene-specific music by setting `instrumental` true, choosing a model, and using `style`, `title`, and `negativeTags` to constrain genre and avoid inappropriate elements. `duration` helps decide whether a track fits menu screens, level ambience, or transition scenes. `tags` and `title` can feed an internal music library.

In a business setting, a studio could build a queue of music tasks for different levels, characters, or seasonal events, poll status in the background, and route completed `audioUrl` assets into a review board. The API does not expose loop points, stems, loudness, or licensing audit metadata, so final integration still needs audio QA and rights review.

### Rapid Brand Jingle And Campaign Ideation

Marketing teams can use custom mode with exact lyrics in `prompt`, brand-safe style notes in `style`, a campaign-specific `title`, and `negativeTags` to avoid off-brand genres. Since generation returns two song options per request, the status output can support quick A/B review: compare durations, titles, tags, and generated audio.

For a company, this is valuable during early creative exploration rather than final legal approval. The returned `prompt`, `modelName`, and `createTime` fields create a traceable record of what was requested and when. Missing fields include ownership confirmations, similarity checks, and explicit commercial rights metadata, so the workflow should include brand/legal review before public release.

### Personalized Audio Inside Apps

An app can let users request short personalized tracks by passing a brief prompt and polling for completion. The app can stream `streamAudioUrl` quickly, then retain `audioUrl` and `imageUrl` for the user's library. `status` and failure fields allow the UI to show progress, retry, or explain content-filter failures such as `SENSITIVE_WORD_ERROR`.

For businesses, this enables pay-per-generation features without exposing a direct provider API key. The main product constraint is latency and cost: generation is asynchronous, each poll has an MPP fee, and files have a documented retention window, so the app should store completed assets promptly and avoid excessive polling.

### Music Production Sketching And Reference Tracks

Producers and songwriters can use prompts, style controls, and negative tags to create rough references for tempo, mood, vocal direction, and arrangement. The returned two-track result gives options to compare, while `duration`, `tags`, and `modelName` help organize references by project.

For studios, this endpoint group can populate a shared idea board before a live recording or composing session. It is not a replacement for multitrack production because the exposed MPP surface does not include stem separation, WAV conversion, or detailed mix controls, even though the broader provider API has related endpoints.

### Automated Creative QA And Retry Queues

Because status includes explicit task states and error fields, a workflow can automatically retry failed jobs, flag sensitive-word failures for prompt revision, and stop polling when a task reaches `SUCCESS`. `CREATE_TASK_FAILED`, `GENERATE_AUDIO_FAILED`, and `SENSITIVE_WORD_ERROR` are especially useful for routing tasks to technical, creative, or policy review.

For businesses running higher-volume generation, this protects spend and user experience. The workflow can cap polling attempts, log `errorCode`/`errorMessage`, and require human review before new paid generation requests. The public docs do not provide detailed MPP error bodies, so robust implementations should treat undocumented errors conservatively.
