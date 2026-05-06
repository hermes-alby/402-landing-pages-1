# fal.ai: Text-To-Image Generation API Uses

## What This Endpoint Group Does

This group turns text prompts into still images through eight named fal model endpoints. The practical differences are speed, quality, output size, price, style control, safety control, reproducibility, and whether the endpoint is optimized for a specific family such as Flux, SDXL, Stable Diffusion 3.5, Recraft, or Grok Imagine.

The common core is `prompt` plus optional controls such as `image_size`, `aspect_ratio`, `num_images`, `seed`, `output_format`, `sync_mode`, and safety fields. Some endpoints expose richer controls: Fast SDXL and Stable Diffusion 3.5 include negative prompts and advanced adapters; Flux dev/schnell expose `acceleration`; Flux Pro exposes `safety_tolerance` and `enhance_prompt`; Recraft exposes brand/style-oriented fields such as `style`, `colors`, and `style_id`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/fal-ai/flux/dev` | High-quality Flux still images. | `prompt`, `image_size`, `num_inference_steps`, `guidance_scale`, `seed`, `num_images`, `output_format`, `acceleration`. | `images[]`, `timings`, `seed`, `has_nsfw_concepts`, `prompt`. |
| POST | `/fal-ai/flux/schnell` | Fast Flux still images. | `prompt`, `num_inference_steps`, `image_size`, `guidance_scale`, `seed`, `num_images`, `output_format`, `acceleration`. | `images[]`, `timings`, `seed`, `has_nsfw_concepts`, `prompt`. |
| POST | `/fal-ai/flux-pro/v1.1` | Professional Flux still images. | `prompt`, `image_size`, `seed`, `num_images`, `output_format`, `safety_tolerance`, `enhance_prompt`. | `images[]`, `timings`, `seed`, `has_nsfw_concepts`, `prompt`. |
| POST | `/fal-ai/flux-pro/v1.1-ultra` | Higher-resolution Flux still images. | `prompt`, `aspect_ratio`, `raw`, `image_url`, `image_prompt_strength`, `seed`, `num_images`, `output_format`, `safety_tolerance`. | `images[]`, `timings`, `seed`, `has_nsfw_concepts`, `prompt`. |
| POST | `/fal-ai/stable-diffusion-v35-large` | Stable Diffusion 3.5 Large images. | `prompt`, `negative_prompt`, `num_inference_steps`, `guidance_scale`, `image_size`, `controlnet`, `loras`, `ip_adapter`. | `images[]`, `timings`, `seed`, `has_nsfw_concepts`, `prompt`. |
| POST | `/fal-ai/fast-sdxl` | Fast SDXL images. | `prompt`, `negative_prompt`, `image_size`, `guidance_scale`, `num_images`, `format`, `loras`, `embeddings`, `expand_prompt`. | `images[]`, `timings`, `seed`, `has_nsfw_concepts`, `prompt`. |
| POST | `/fal-ai/recraft-v3` | Styled images and vector-like art. | `prompt`, `image_size`, `style`, `colors`, `style_id`, `enable_safety_checker`. | `images[]` file URLs. |
| POST | `/xai/grok-imagine-image` | Grok Imagine still images. | `prompt`, `num_images`, `aspect_ratio`, `resolution`, `output_format`, `sync_mode`. | `images[]`, `revised_prompt`. |

## Field Notes

### Inputs

The most useful input fields for workflow design are `prompt`, `negative_prompt`, `image_size`, `aspect_ratio`, `num_images`, `seed`, and model-specific quality/style controls. `seed` matters for reproducible variant testing. `num_images`, `resolution`, image size, and Recraft vector styles matter for cost expectations. Safety fields vary by model, so a workflow cannot assume a single uniform moderation control across all endpoints.

Recraft is the most directly brand/design-oriented endpoint because it exposes `style`, `colors`, and `style_id`. Flux Pro Ultra is the strongest fit when aspect ratio and higher-resolution output are important. Fast SDXL and Flux Schnell are better suited to high-volume drafts where speed and lower MPP price matter more than final polish.

### Outputs

Most endpoints return `images[]` with hosted image URLs and image content type or file metadata. Flux, SDXL, and Stable Diffusion endpoints also expose `seed` and `has_nsfw_concepts`, which are useful for audit, reruns, and safety triage. Grok Imagine returns `revised_prompt`, which helps explain how the prompt was transformed before generation.

### Important Constraints Or Gaps

The MPP wrapper does not document whether it returns the exact direct fal response or adds a payment wrapper envelope. The inventory assumes the model response fields shown in public fal docs are the useful payload fields, but records this as a gap. No endpoint was invoked. Direct fal docs also describe queue and SDK flows, but the MPP service exposes only paid POST generation paths, not queue polling, cancellation, webhooks, or request-history endpoints.

## Use Cases

### Creative Concept Screening

A person can quickly test several visual directions for a project by routing the same core `prompt` through fast endpoints such as Flux Schnell or Fast SDXL, then using `seed`, `image_size`, and `num_images` to compare controlled variants. The returned `images[]` and `seed` let the user preserve promising drafts and rerun or refine a direction without starting from scratch.

A business can turn this into a pre-production step for campaign concepts, game art, editorial graphics, or product visuals. Low-cost draft endpoints can screen ideas before paying more for Flux Pro Ultra or Recraft. The limitation is that final licensing, brand review, and content review still require human policy checks and model-specific terms review.

### Brand Asset And Style Exploration

Recraft V3 is useful when a person wants a poster, icon, social image, or vector-like illustration in a specific visual family. `style`, `colors`, and `style_id` are the fields that make this more than generic image generation: they let a user steer output toward a brand palette or established style reference.

For a business, these fields support rapid brand-system prototyping across web banners, product cards, ads, and packaging sketches. The output can help decide which style families to test with customers or creative directors. The main gap is that `style_id` depends on an upstream style reference workflow that the MPP wrapper does not expose.

### Ecommerce Product Visualization

A solo seller could generate lifestyle backgrounds, category thumbnails, or promotional images from product-focused prompts, using `image_size` and `aspect_ratio` to match marketplace slots. `negative_prompt` on SDXL/Stable Diffusion helps suppress unwanted artifacts such as distorted text or extra objects.

A business can automate first-pass product content for A/B testing and merchandising. Seeds and output metadata make tests repeatable, while `num_images` controls variant volume. The endpoint group does not guarantee product factual accuracy, so workflows that depict real SKUs need post-generation review and ideally input-image/editing steps outside this text-to-image group.

### Marketing Creative Variant Generation

A person running a newsletter, event, or small product launch can generate multiple ad visuals by changing the prompt and preserving `seed` values for controlled iteration. `aspect_ratio` and `output_format` fields help produce channel-specific assets for square social posts, landscape banners, or portrait stories.

For teams, the value is generating many candidates before paid media review. The outputs support decisions such as which visual direction to hand to a designer or test in a campaign. Cost and policy constraints matter because `num_images`, higher resolution, and some model choices can increase spend, and safety outputs are not uniform across every endpoint.

### Prompt And Model Benchmarking

A technically inclined user can send the same prompt to Flux, Stable Diffusion, Recraft, and Grok endpoints, then compare outputs, seeds, safety flags, revised prompts, and style controls. This helps decide which model family is best for photorealism, typography, vectors, speed, or prompt following.

A business can run a vendor/model-selection bakeoff before committing to a direct fal account, prepaid credits, or custom integration. MPP is useful here because it avoids account setup for one-off paid calls. The gap is that the wrapper does not expose direct fal pricing APIs or queue telemetry, so production cost and latency benchmarking still needs direct provider evaluation.

### Safety-Aware Draft Triage

Flux, SDXL, and Stable Diffusion outputs include `has_nsfw_concepts`, and several inputs expose safety controls. A person can use those fields to filter drafts before saving or sharing generated images.

A business can incorporate the safety fields into an approval queue, flagging generated assets for review when safety results or prompt content indicate risk. This is not a complete compliance system: Recraft and Grok outputs differ in available safety metadata, and direct fal or xAI terms may still require additional review.
