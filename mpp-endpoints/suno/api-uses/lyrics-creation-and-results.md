# Suno: Lyrics Creation And Results API Uses

## What This Endpoint Group Does

This endpoint group creates structured song lyrics from a short prompt and retrieves the resulting lyric variations. `generate-lyrics` accepts a prompt describing theme, mood, style, or topic, plus an optional callback URL in the MPP wrapper. `get-lyrics-status` accepts the returned `taskId` and returns task status, generated lyric text, generated title, per-variation status, and error messages.

The group is useful when a user needs lyrics before committing to full music generation. Provider docs explicitly say generated lyrics can be used as input to the music generation endpoint in custom mode, making this a planning and drafting layer for song creation.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/suno/generate-lyrics` | Submit a lyrics generation task. | `prompt`, `callBackUrl` | `taskId` |
| POST | `/suno/get-lyrics-status` | Poll a lyrics generation task. | `taskId` | `status`, `response.data[].text`, `response.data[].title`, `response.data[].status`, `errorCode`, `errorMessage` |

## Field Notes

### Inputs

The core input is `prompt`, limited by provider docs to 200 characters. Good prompts need to carry theme, mood, style, topic, and any desired structure within that short space. MPP docs make `callBackUrl` optional, while direct provider docs require it; polling with `taskId` is therefore the reliable MPP workflow.

### Outputs

The submit endpoint returns a `taskId`. The status endpoint returns the task state and generated lyric variations, each with `text`, `title`, `status`, and `errorMessage`. Lyrics typically include song structure markers such as `[Verse]`, `[Chorus]`, and `[Bridge]`, which makes them easier to pass into custom music generation or a human editing workflow.

### Important Constraints Or Gaps

Provider docs say generated lyrics are retained for 15 days, callbacks have one stage (`complete`), and status values include `PENDING`, `SUCCESS`, `CREATE_TASK_FAILED`, `GENERATE_LYRICS_FAILED`, `CALLBACK_EXCEPTION`, and `SENSITIVE_WORD_ERROR`. MPP docs say typical completion is 5-15 seconds and the endpoint costs $0.02 plus a $0.005 fee, with status polling at the fee only. The exact number of lyric variations is not specified in public docs.

## Use Cases

### Songwriting Drafts Before Full Music Generation

A songwriter can submit a short creative direction, retrieve several structured lyric options, and choose the strongest `text`/`title` pair before spending more on full music generation. Because the output includes verse/chorus markers, the result is immediately usable as the `prompt` in custom music mode.

For a business, this separates low-cost ideation from higher-cost song generation. A creative tool can let users generate lyrics, edit them, and only then invoke music generation, reducing wasted song-generation calls caused by weak lyrics or unclear briefs.

### Brand-Safe Campaign Copy For Jingles

Marketing teams can generate lyrical concepts around a product, slogan, mood, or seasonal campaign. The returned `title` and structured `text` give copywriters a starting point for a jingle, ad hook, or social audio campaign.

For agencies, status/error fields support review queues. If a task returns `SENSITIVE_WORD_ERROR` or a failed variation, the system can route the prompt back for rewriting rather than moving directly into audio generation. The API does not provide trademark, claims, or rights checks, so brand/legal review remains necessary.

### Personalized Lyrics In Consumer Apps

Apps can collect a user's occasion, mood, relationship, or event theme and generate personalized lyrics before creating a song. The result fields let the app show multiple candidate lyrics and titles, and the user can choose one for a later music generation step.

For businesses, this is a lower-latency engagement feature than full song generation. Since MPP docs describe typical lyrics completion as 5-15 seconds, it can fit an interactive product flow. The 200-character prompt limit means the app should summarize user input before submission.

### Localization And Cultural Variants For Creative Teams

Creative teams can run multiple concise prompts for different moods, languages, or cultural references, then compare returned lyric texts and titles before selecting candidates for further editing. The structured markers make it easier to compare song sections across variants.

For a company, the endpoint can seed localization brainstorming for ads, games, or creator campaigns. The API does not expose explicit language controls in the MPP schema, quality scores, or cultural-sensitivity analysis, so outputs should be reviewed by fluent humans before production use.

### Lyric QA And Prompt Refinement Loops

Because the status endpoint returns both task-level and variation-level status/error fields, applications can build prompt refinement loops. Failed outputs can be logged with `errorMessage`; successful texts can be scored by downstream editorial rules for length, prohibited terms, or brand voice before being sent to music generation.

For a business, this reduces paid downstream failures and creates an audit trail of prompt-to-lyrics decisions. The workflow should avoid automatically publishing generated lyrics without human review, especially when lyrics reference real people, brands, sensitive topics, or regulated claims.
