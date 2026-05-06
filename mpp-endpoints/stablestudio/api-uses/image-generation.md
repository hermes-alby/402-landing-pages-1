# StableStudio: Image Generation API Uses

## What This Endpoint Group Does

These endpoints create new still images from a prompt without requiring uploaded reference assets. They differ by model, price, expected latency, aspect-ratio support, output size, quality controls, safety tolerance, prompt upsampling, background options, and output format.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/generate/nano-banana/generate` | Fast Nano Banana image generation | `prompt`, `aspectRatio`, `imageSize`, `thinkingLevel` | `jobId`, pending status |
| POST | `/api/generate/nano-banana-pro/generate` | Recommended high-quality image generation up to 4K | `prompt`, `aspectRatio`, `imageSize` | `jobId`, pending status |
| POST | `/api/generate/gpt-image-2/generate` | GPT Image 2 generation with output controls | `prompt`, `quality`, `size`, `background`, `output_format`, `moderation` | `jobId`, pending status |
| POST | `/api/generate/gpt-image-1.5/generate` | GPT Image 1.5 generation with transparent background support | `prompt`, `quality`, `size`, `background`, `output_format`, `moderation` | `jobId`, pending status |
| POST | `/api/generate/flux-2-pro/generate` | Flux 2 Pro image generation | `prompt`, `aspect_ratio`, `resolution`, `output_format`, `safety_tolerance`, `prompt_upsampling` | `jobId`, pending status |
| POST | `/api/generate/flux-2-max/generate` | Flux 2 Max generation up to 4 MP | `prompt`, `aspect_ratio`, `resolution`, `output_format`, `output_quality` | `jobId`, pending status |
| POST | `/api/generate/grok/generate` | Grok Image generation with broad aspect ratios | `prompt`, `aspect_ratio` | `jobId`, pending status |

## Field Notes

### Inputs

The common decision field is `prompt`. Format and cost decisions come from `aspectRatio` or `aspect_ratio`, `imageSize`, `resolution`, `quality`, `size`, `background`, `output_format`, `moderation`, `safety_tolerance`, `prompt_upsampling`, and `thinkingLevel`.

### Outputs

Generation endpoints return only async job metadata at request time: `success`, `jobId`, `status: pending`, and `type`. The actual `imageUrl` is returned later through the job status endpoint.

### Important Constraints Or Gaps

The official docs publish route-level prices and expected times, but exact final image dimensions, MIME type, file size, and moderation error bodies are not documented in response schemas. Asset URLs returned after polling expire after roughly 20 minutes.

## Use Cases

### Campaign Creative Exploration

A marketer can generate multiple prompt variants for paid ads, social posts, thumbnails, or landing-page concepts, choosing `aspectRatio` for placement and `quality` or `imageSize` for production value. A business can run low-cost exploratory generations first, then rerun the best prompts through Nano Banana Pro or Flux 2 Max when higher resolution is needed.

The key workflow value is controlled iteration. `jobId` lets an automation queue and retrieve many assets, while per-route costs make it possible to cap spend by model and only escalate to expensive settings for shortlisted prompts.

### Product Mockups Without Design Tool Setup

A founder or product manager can create concept art, packaging ideas, app-store screenshots, or ecommerce lifestyle images directly from text. The `background`, `output_format`, and transparent-background support on GPT Image 1.5 are useful when outputs need to be composited into existing layouts.

For a business, this can enrich merchandising and creative testing workflows before hiring full production design. The limitation is that brand accuracy and product fidelity may require reference-image edit endpoints, not pure generation.

### Format-Specific Content Pipelines

A creator can request square, portrait, landscape, ultra-wide, or platform-specific ratios through model-specific aspect-ratio enums. A business can automate separate generations for Instagram posts, YouTube thumbnails, blog headers, marketplace images, and presentation slides from one campaign brief.

The fields make the workflow concrete: `aspectRatio`, `size`, and `output_format` determine where the output can be used, while `jobId` supports batch orchestration and later retrieval.

### Cost-Aware Model Selection

An agent can choose GPT Image 2 or Flux 2 Pro for inexpensive drafts, Grok for fast fixed-price generation, and Nano Banana Pro for the documented quality/cost default. A procurement or operations team can log `published_cost`, expected time, selected model, and prompt category to decide which model gives acceptable output for each internal workflow.

The API does not return quality scores, so the decision loop needs human review or downstream evaluation. Still, the route-level prices make model selection auditable.

### Programmatic Visual Personalization

A sales or customer-success tool can generate personalized visual headers, event graphics, or account-specific illustrations from CRM-safe prompt templates. Personal users could generate invitations, profile images, or project visuals without signing up for a subscription.

This is most valuable when prompts are templated and reviewed. Businesses should avoid inserting sensitive personal data into prompts unless their own policy and the upstream model terms permit it.
