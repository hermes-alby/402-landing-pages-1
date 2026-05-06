# fal.ai: Image Editing API Uses

## What This Endpoint Group Does

This group contains the single Grok Imagine image-editing endpoint. It accepts a text edit prompt and optional `image_urls[]`, then returns edited image URLs and a `revised_prompt`. Unlike text-to-image generation, the workflow starts from existing visual material and asks the model to transform it.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/xai/grok-imagine-image/edit` | Edit one or more existing images using text instructions. | `prompt`, `image_urls[]`, `num_images`, `resolution`, `output_format`, `sync_mode`. | `images[]`, `revised_prompt`. |

## Field Notes

### Inputs

The most important fields are `image_urls[]` and `prompt`. The docs state that up to three image URLs are supported. `resolution`, `output_format`, and `num_images` control output size, format, and variant count. `sync_mode` has the same direct fal caveat as other media endpoints: direct fal docs say data URI output is returned and output data is not available in request history when enabled.

### Outputs

The response returns edited image file URLs under `images[]` and a `revised_prompt`. The revised prompt is useful for audit and iteration because it shows how the model interpreted or expanded the edit request.

### Important Constraints Or Gaps

The MPP wrapper does not document input media file limits, accepted formats, whether `image_urls` is truly optional in wrapper validation, or whether it returns the exact fal response body. No image edit request was submitted.

## Use Cases

### Product Photo Cleanup And Variant Creation

A person selling a product online can provide an existing photo URL and ask for a cleaner scene, better lighting, or a more realistic setting. `image_urls[]` anchors the edit to the actual item, while `prompt`, `resolution`, and `output_format` steer the final asset.

A business can use the same workflow for batch first-pass cleanup of catalog images or seasonal variants. The returned `images[]` are candidates for review, not automatic replacements, because generative editing can alter product details. Workflows should preserve original images and route edited outputs through human QA before publishing.

### Social Content Refresh

A creator can reuse an existing image and ask for a different mood, background, or style without recreating the full scene from text. The `revised_prompt` helps the user understand the edit direction and refine follow-up requests.

A brand team can use this endpoint to create channel-specific adaptations of an approved image, such as a more realistic version, a playful version, or a campaign-specific background. The main value is speed in exploration; legal and brand approval remain necessary before public use.

### Design Mockup Iteration

A person working on a game, interface, poster, or concept image can upload a reference and ask for targeted changes. Because the endpoint accepts up to three image URLs, a workflow can include multiple references for context, though the exact image-combination behavior is model-specific.

A business can route design-review feedback into prompt edits, producing visual alternatives for stakeholders before a designer spends time on manual revisions. The output supports decisions about direction and scope, but pixel-perfect edits still require traditional design tools.

### Creative Localization

A user can adapt an image for a different audience by changing setting, visual style, or presentation language cues in the prompt. `output_format` and `resolution` let the result match downstream publishing constraints.

For businesses, this supports fast local campaign mockups across regions or segments. The endpoint does not expose structured locale fields or compliance checks, so any localized output should be reviewed for cultural, legal, and brand suitability.

### Before-And-After Approval Workflows

A person can compare the original `image_urls[]` against returned `images[]` and keep the `revised_prompt` as an explanation of the transformation. This helps document why a version was accepted or rejected.

A business can store original URL, prompt, revised prompt, output URL, and reviewer decision in an asset pipeline. That makes generative edits auditable. The gap is that the MPP wrapper does not document retention or request-history behavior, especially when `sync_mode` is used.
