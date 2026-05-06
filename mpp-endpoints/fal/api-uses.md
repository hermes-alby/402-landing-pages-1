# fal.ai API Uses

## Service Summary

fal.ai provides APIs and GPU infrastructure for generative media. The MPP service at `https://fal.mpp.tempo.xyz` wraps 16 paid fal model endpoints for still-image generation, image editing, video generation, and generic model routing. The wrapper is useful when a person or agent wants paid per-request media generation without setting up a direct fal account, API key, or prepaid fal credit balance.

No paid calls, generation jobs, wallet signatures, account actions, or mutations were performed for this research. The field inventory is based on local MPP feed data and saved public fal docs/model-page snapshots.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Text-To-Image Generation | 8 | Generate still images from prompts across Flux, Stable Diffusion, Fast SDXL, Recraft, and Grok, with controls for quality, style, speed, safety, output format, size, and reproducibility. | [api-uses/text-to-image-generation.md](api-uses/text-to-image-generation.md) |
| Image Editing | 1 | Edit existing images from URLs with prompt instructions, returning edited image URLs and a revised prompt. | [api-uses/image-editing.md](api-uses/image-editing.md) |
| Video Generation | 5 | Generate or animate video from prompts or input images, returning hosted video files and useful video metadata. | [api-uses/video-generation.md](api-uses/video-generation.md) |
| Generic Model Routing | 2 | Route paid requests to dynamic fal model paths when the caller supplies model-specific schemas. | [api-uses/generic-model-routing.md](api-uses/generic-model-routing.md) |

## Highest-Value Uses

The strongest use is rapid creative production and triage: generate many still-image or video candidates, preserve prompts/seeds/source URLs, and route promising outputs to human review. This is valuable for marketing, ecommerce, concept art, editorial graphics, game prototypes, product storytelling, and internal creative exploration.

The second strong use is model and vendor evaluation. The endpoint set spans multiple image and video model families, so a buyer can compare output quality, style control, speed, cost, and safety metadata before committing to direct fal account setup or a larger provider integration.

The third strong use is asset adaptation. Image editing and image-to-video endpoints let teams repurpose existing approved images into variants, motion tests, and campaign drafts. This is safer than pure text-to-image for workflows where a known product, character, or brand asset must stay recognizable, though human QA is still required.

## Personal Use Opportunities

- Create social graphics, thumbnails, posters, or creative drafts from text prompts without managing a direct fal key.
- Animate a still image into a short clip for a portfolio, pitch, event, or social post.
- Edit an existing image with a prompt to explore mood, style, cleanup, or background changes.
- Compare model families using the same prompt and preserve seeds or revised prompts for future iterations.

## Business Use Opportunities

- Generate first-pass marketing creative variants for review before paying for manual design or video production.
- Build an internal creative queue that records prompt, model endpoint, MPP payment amount, output URLs, safety metadata, and reviewer decisions.
- Explore brand style systems through Recraft fields such as `style`, `colors`, and `style_id`.
- Prototype product visualization and short-form video concepts for ecommerce, ads, support, and sales enablement.
- Evaluate fal model coverage through named endpoints first, with generic routes as an uncertain fallback for models not listed as named MPP paths.

## Endpoint Group Summaries

### Text-To-Image Generation

The text-to-image group is the broadest and most immediately useful surface. It includes low-cost fast drafts, higher-quality Flux Pro variants, style-heavy Recraft output, and Grok image generation. The most important fields are `prompt`, `negative_prompt`, `image_size`, `aspect_ratio`, `num_images`, `seed`, safety fields, and model-specific style controls. See [api-uses/text-to-image-generation.md](api-uses/text-to-image-generation.md).

### Image Editing

The image-editing group contains Grok Imagine image edit. It is valuable when the workflow starts from existing images and needs controlled transformations rather than fully synthetic images. The key fields are `image_urls[]`, `prompt`, `resolution`, `output_format`, and `revised_prompt`. See [api-uses/image-editing.md](api-uses/image-editing.md).

### Video Generation

The video group covers prompt-to-video and image-to-video workflows. Stable Video provides motion controls for an input image, MiniMax provides simpler prompt-driven generation, and Grok exposes explicit duration, aspect ratio, and resolution controls. See [api-uses/video-generation.md](api-uses/video-generation.md).

### Generic Model Routing

The generic routes provide path-parameter based model selection but lack stable documented schemas. They are best treated as experimental routing primitives, not production-ready endpoints, until an allowlist, validation behavior, response envelope, and pricing relationship are confirmed. See [api-uses/generic-model-routing.md](api-uses/generic-model-routing.md).

## Field And Data Themes

Prompts and source media are the core creative inputs. Output URLs are the core deliverables. Seeds, revised prompts, safety flags, dimensions, content types, durations, and file metadata are the fields that make generated assets auditable and sortable.

Cost-sensitive workflows should pay attention to `num_images`, resolution/size fields, video `duration`, and endpoint-specific MPP amounts. Safety-sensitive workflows should not assume uniform moderation metadata, because some endpoints expose `has_nsfw_concepts` or safety controls while others expose less.
