# Stability AI: Image Generation API Uses

## What This Endpoint Group Does

These endpoints create new still images from text prompts, with optional negative prompts, style presets, aspect ratios, seeds, and image-to-image inputs. The group lets users choose between Ultra for highest quality, Core for fast lower-cost generation, and SD3/SD3.5 variants for model-specific quality, speed, and cost tradeoffs.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/stability-ai/generate-ultra` | Highest-quality Stable Image generation, including optional image-to-image. | `prompt`, `negative_prompt`, `aspect_ratio`, `style_preset`, `image`, `strength`, `seed` | Generated image; exact MPP response schema not documented. |
| POST | `/stability-ai/generate-core` | Fast, cost-effective image generation. | `prompt`, `negative_prompt`, `aspect_ratio`, `style_preset`, `seed` | Generated image; exact MPP response schema not documented. |
| POST | `/stability-ai/generate-sd3` | SD3/SD3.5 model family generation with model and mode selection. | `prompt`, `model`, `mode`, `image`, `strength`, `cfg_scale`, `aspect_ratio`, `seed` | Generated image; exact MPP response schema not documented. |

## Field Notes

### Inputs

The central input is `prompt`. `negative_prompt` helps exclude unwanted content, `aspect_ratio` controls output shape, and `output_format` selects `jpeg`, `png`, or `webp`. `seed` supports repeatability. Ultra and SD3 can take an input `image` plus `strength` for image-to-image workflows. SD3 adds `model`, `mode`, and `cfg_scale`, which matter for balancing cost, speed, and prompt adherence.

### Outputs

The endpoint is expected to return generated image media. The public MPP OpenAPI only lists generic 200 and 402 responses, so the exact response envelope is a gap.

### Important Constraints Or Gaps

SD3 has dynamic model-dependent pricing. Image-to-image requires a source image and strength, but wrapper-level image size and file limits are not documented. No endpoint was called.

## Use Cases

### Campaign Concept Generation

A solo creator can turn a product idea into several social ad concepts by varying `prompt`, `style_preset`, `aspect_ratio`, and `seed`, then compare which composition fits each channel. A business marketing team can automate first-pass creative exploration for seasonal campaigns, using Core for broad ideation and Ultra for finalist assets that need better prompt alignment.

The valuable fields are `aspect_ratio` for channel-specific output, `negative_prompt` for brand safety and avoiding artifacts, and `seed` for reproducible variants. The main limitation is that final commercial review still needs human approval, rights checks, and brand compliance review.

### Product Mockups Before Photoshoots

A founder or marketplace seller can generate product-in-context mockups before investing in photography. A retailer can use SD3 model choices to explore inexpensive drafts, then use Ultra for final concept images that brief photographers, designers, or merchandising teams.

The output helps decide which scenes, angles, and visual treatments are worth producing for real. Missing dependencies include exact response format and any provider-side restrictions around likeness, trademarked products, or regulated product categories.

### Personalized Visual Content At Low Setup Cost

An app can let users request custom avatars, wallpapers, thumbnails, or invitation images without the app operator managing Stability account credits directly. Personal workflows benefit from one-off MPP payment, while business workflows can meter each generation request to a user action or customer order.

`prompt`, `style_preset`, `aspect_ratio`, and `output_format` allow the app to keep requests structured. `seed` can support "make another like this" flows. Cost controls should route low-stakes drafts to Core or lower-cost SD3 models.

### Design Direction Search

Designers can generate multiple visual directions from a single creative brief by varying `style_preset`, `cfg_scale`, `model`, and `negative_prompt`. Agencies can use this as a structured mood-board accelerator, tagging outputs by prompt, seed, and model to compare client preferences.

This is useful because the request fields expose enough control to make comparisons intentional rather than random. The gap is that the MPP response schema does not document whether returned metadata includes seed, model, or prompt echoes, so the caller may need to store request metadata locally.
