# Suno API Uses

## Service Summary

Suno, through the SunoAPI.org provider and the PayWithLocus MPP wrapper, exposes pay-per-request AI music and lyrics workflows. The MPP surface is focused: submit a music generation task, poll music results, submit a lyrics generation task, and poll lyrics results. It is most useful for agents, creators, and businesses that need occasional generated music or lyric drafts without maintaining a direct SunoAPI account, API key, or prepaid provider credit balance.

The API is asynchronous. Generation endpoints return a `taskId`; status endpoints turn that identifier into usable creative assets or failure details. That shape makes the API valuable in workflows that can queue a creative request, poll for completion, review outputs, and store assets before provider retention windows expire.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Music Generation And Results | 2 | Prompt-to-song generation with audio URLs, stream URLs, cover image URLs, prompt/title/tags, model, duration, status, and errors. | [api-uses/music-generation-and-results.md](api-uses/music-generation-and-results.md) |
| Lyrics Creation And Results | 2 | Prompt-to-lyrics drafting with structured lyric text, title, task status, variation status, and errors. | [api-uses/lyrics-creation-and-results.md](api-uses/lyrics-creation-and-results.md) |

## Highest-Value Uses

The strongest use is staged creative production: generate lyrics first, review or edit the structured text, then use approved lyrics as a custom music prompt. This reduces wasted full-song generations and gives humans a checkpoint before spending more or publishing anything.

The next strongest use is on-demand background music for creator, agency, game, podcast, and app workflows. The music status endpoint returns enough metadata to operationalize generated assets: `audioUrl`, `streamAudioUrl`, `imageUrl`, `duration`, `title`, `tags`, `modelName`, `createTime`, and task/error status.

Suno is also useful for creative QA loops. Status enums and error fields allow systems to stop polling, retry selectively, route sensitive-word failures for prompt revision, and log which prompt/model/title produced which asset.

## Personal Use Opportunities

Individuals can use the lyrics group to draft song ideas, poems, parody-free personal celebration songs, or social media hooks before deciding whether to generate audio. The 200-character lyrics prompt limit means the best personal workflows summarize the user's intent into a concise brief.

Creators can use the music group to make background tracks for videos, podcasts, live streams, games, or prototypes. The returned `duration` and URLs help decide whether a track fits a specific edit or needs regeneration.

Musicians and producers can use both groups for early ideation: generate lyrics, choose a title/text variation, then generate two song options and compare `tags`, `duration`, and the actual audio.

## Business Use Opportunities

Agencies can generate campaign lyric drafts and jingle references while preserving prompt/title/model metadata for review. Product teams can embed pay-per-generation music features without exposing a direct provider API key. Game studios and content operations teams can queue many scene- or campaign-specific tracks and route completed assets into human approval.

Business workflows should treat outputs as drafts until reviewed. The MPP/provider docs do not expose explicit rights attestations, similarity checks, brand-safety scores, loudness/mix analysis, or legal/compliance metadata in the response.

## Endpoint Group Summaries

### Music Generation And Results

This group covers `POST /suno/generate-music` and `POST /suno/get-music-status`. It supports full asynchronous song generation from a prompt and creative controls, then returns result metadata and asset URLs. The most practical workflows are on-demand soundtracks, game background music, brand jingle ideation, personalized in-app audio, production sketching, and retry/error handling. Full details: [api-uses/music-generation-and-results.md](api-uses/music-generation-and-results.md).

### Lyrics Creation And Results

This group covers `POST /suno/generate-lyrics` and `POST /suno/get-lyrics-status`. It supports a lower-cost drafting step before full audio generation, returning structured lyric text and titles that can be reviewed, edited, or passed into custom music generation. The most practical workflows are songwriting drafts, campaign copy, personalized lyrics, localization brainstorming, and lyric QA loops. Full details: [api-uses/lyrics-creation-and-results.md](api-uses/lyrics-creation-and-results.md).

## Field And Data Themes

The main inputs are creative controls: `prompt`, `customMode`, `instrumental`, `model`, `style`, `title`, `negativeTags`, and `vocalGender`. The main identifiers are `taskId` and, for completed music, audio IDs in generated track records. The main outputs are creative assets and metadata: lyric `text`, song `audioUrl`, `streamAudioUrl`, `imageUrl`, `title`, `tags`, `modelName`, `createTime`, and `duration`.

Status fields are central. Music statuses include `PENDING`, `TEXT_SUCCESS`, `FIRST_SUCCESS`, `SUCCESS`, `CREATE_TASK_FAILED`, `GENERATE_AUDIO_FAILED`, `CALLBACK_EXCEPTION`, and `SENSITIVE_WORD_ERROR` in provider docs. Lyrics statuses include `PENDING`, `SUCCESS`, `CREATE_TASK_FAILED`, `GENERATE_LYRICS_FAILED`, `CALLBACK_EXCEPTION`, and `SENSITIVE_WORD_ERROR`.
