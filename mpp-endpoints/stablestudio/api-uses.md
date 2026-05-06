# StableStudio API Uses

## Service Summary

StableStudio is a Merit Systems pay-per-generation API for image and video creation. It uses x402/MPP payments instead of subscriptions or API keys: paid generation routes return a `jobId`, and authenticated job routes later return temporary media URLs.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Image Generation | 7 | Prompt-only still image generation across Nano Banana, GPT Image, Flux, and Grok models. | [image-generation.md](api-uses/image-generation.md) |
| Image Editing And Reference Generation | 7 | Reference-image edits, style transfer, product variants, background changes, and fidelity-controlled revisions. | [image-editing-and-reference-generation.md](api-uses/image-editing-and-reference-generation.md) |
| Video Generation And Animation | 11 | Text-to-video, image-to-video, first-frame animation, interpolation, reference-guided video, and audio-aware experiments. | [video-generation-and-animation.md](api-uses/video-generation-and-animation.md) |
| Asset Upload Preparation | 2 | Paid upload-token creation and authenticated confirmation of blob URLs for downstream media jobs. | [asset-upload-preparation.md](api-uses/asset-upload-preparation.md) |
| Generation Job Lifecycle | 3 | Listing, polling, retrieving, and cleaning up async generation jobs. | [generation-job-lifecycle.md](api-uses/generation-job-lifecycle.md) |

## Highest-Value Uses

- Generate campaign, product, social, and presentation visuals without a subscription, while choosing model and quality by cost.
- Turn existing product or brand assets into edited variants for ecommerce, ads, localization, and creative testing.
- Produce short videos from prompts or source images for social clips, product animation, pitch storyboards, and ad prototypes.
- Build an agentic media pipeline where upload, payment, generation, polling, retrieval, review, and storage are separate auditable steps.
- Use lower-cost routes for drafts and reserve higher-cost Sora, Veo, Nano Banana Pro, or Flux Max calls for final candidates.

## Personal Use Opportunities

Personal users can create occasional images, edit project assets, animate photos or artwork, and generate short clips without signing up for a plan. The pay-per-request model is most useful when the user needs a few high-value assets rather than continuous access.

## Business Use Opportunities

Businesses can embed media generation into creative operations, ecommerce merchandising, marketing experiments, sales personalization, and design prototyping. The fields support practical controls: aspect ratio, resolution, output format, quality, model selection, reference images, duration, video resolution, and async job status. The strongest business workflows log every prompt, route, cost, `jobId`, source `blobUrl`, final asset URL, and review decision.

## Endpoint Group Summaries

### Image Generation

Prompt-only image routes support fast creative exploration and format-specific output generation. They are best for net-new assets where exact source-image fidelity is not required. Full details: [api-uses/image-generation.md](api-uses/image-generation.md).

### Image Editing And Reference Generation

Edit routes use uploaded image URLs to produce revised assets, making them better for product images, brand variants, localization, and controlled creative changes. Full details: [api-uses/image-editing-and-reference-generation.md](api-uses/image-editing-and-reference-generation.md).

### Video Generation And Animation

Video routes cover text-to-video, image-to-video, reference guidance, interpolation, and model-specific controls. They are higher cost and slower, so draft/final model selection matters. Full details: [api-uses/video-generation-and-animation.md](api-uses/video-generation-and-animation.md).

### Asset Upload Preparation

Upload routes prepare blob URLs that downstream edit and video routes consume. They are the intake and provenance layer for source assets. Full details: [api-uses/asset-upload-preparation.md](api-uses/asset-upload-preparation.md).

### Generation Job Lifecycle

Job routes provide the operational loop for async generation: poll status, retrieve temporary image/video URLs, list work, and clean up failed jobs. Full details: [api-uses/generation-job-lifecycle.md](api-uses/generation-job-lifecycle.md).

## Field And Data Themes

Across the API, the most important input themes are prompt text, uploaded blob URLs, aspect ratio, resolution or size, output format, quality, model-specific controls, video duration, reference/interpolation fields, and wallet authentication headers. The most important output theme is async orchestration: generation calls return `jobId`, then job polling returns temporary media URLs.
