# Stability AI: Audio Generation And Editing API Uses

## What This Endpoint Group Does

These endpoints generate or transform audio. Text-to-audio creates music or sound effects from a prompt. Audio-to-audio transforms an uploaded audio file with a prompt. Audio inpaint replaces a time segment using `mask_start` and `mask_end`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/stability-ai/text-to-audio` | Generate audio from a text prompt. | `prompt`, `model`, `duration`, `steps`, `cfg_scale`, `output_format`, `seed` | Generated audio; schema not documented. |
| POST | `/stability-ai/audio-to-audio` | Transform existing audio with a prompt. | `audio`, `prompt`, `model`, `strength`, `steps`, `output_format`, `seed` | Transformed audio; schema not documented. |
| POST | `/stability-ai/audio-inpaint` | Replace a timed audio region. | `audio`, `prompt`, `mask_start`, `mask_end`, `model`, `steps`, `output_format` | Inpainted audio; schema not documented. |

## Field Notes

### Inputs

`prompt` defines desired sound. `model` selects `stable-audio-2.5` or `stable-audio-2`. `duration`, `steps`, and `cfg_scale` affect generation scope and cost. Audio editing uses base64 `audio`; audio-to-audio adds `strength`, and inpainting uses `mask_start` and `mask_end` in seconds.

### Outputs

The expected output is generated or transformed audio in `mp3` or `wav`. The response schema is not documented.

### Important Constraints Or Gaps

Audio endpoints have dynamic price hints, with an example around $0.23 for 50 steps on stable-audio-2. The full cost formula, maximum duration, input format limits, and response schema are not documented in the MPP OpenAPI.

## Use Cases

### Custom Background Music Drafts

A creator can generate short music beds for videos, podcasts, or prototypes using `prompt`, `duration`, and `output_format`. A business can create draft sonic directions for ads, explainers, or in-store media before commissioning final licensed music.

The workflow benefits from `seed` for repeatability and `steps` for quality/cost tuning. Users still need rights, suitability, and platform-policy review before commercial release.

### Sound Effects For Games And Apps

A developer can generate interface sounds, ambient loops, or game effects from concise prompts. A studio can quickly test many sound-design directions before handing selected examples to an audio designer.

`duration`, `cfg_scale`, `steps`, and `output_format` are the operational fields. The output helps decide which sounds fit the product experience. Maximum duration and loudness/mastering behavior are not documented, so final production may need post-processing.

### Audio Variation And Remixing

A musician or editor can upload a rough audio clip and transform it with `audio-to-audio`. A business can create alternate mood versions of a jingle, explainer bed, or product demo soundtrack.

`strength` controls how much the input changes, while `prompt` describes the desired transformation. This workflow should avoid using copyrighted or unlicensed source audio without permission.

### Repairing Timed Audio Sections

A podcaster can replace a noisy or awkward section by specifying `mask_start`, `mask_end`, and a replacement prompt. A media team can fix small gaps, stingers, or transitions without regenerating a full track.

The time fields make the workflow concrete: only the selected range should change. The gap is that no response schema or waveform continuity guarantees are documented, so editors should audition the result before publishing.
