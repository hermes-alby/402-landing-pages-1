# Stability AI: Image Editing And Backgrounds API Uses

## What This Endpoint Group Does

These endpoints modify existing images: removing objects, filling masked regions, extending canvases, replacing or recoloring objects, removing backgrounds, and replacing/relighting backgrounds. They are strongest when the user already has a source image and needs controlled transformation rather than generating a new image from scratch.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/stability-ai/erase` | Remove masked or detected unwanted content. | `image`, `mask`, `grow_mask`, `output_format`, `seed` | Edited image; schema not documented. |
| POST | `/stability-ai/inpaint` | Fill a masked region using a prompt. | `image`, `prompt`, `mask`, `negative_prompt`, `grow_mask`, `seed` | Edited image; schema not documented. |
| POST | `/stability-ai/outpaint` | Extend image borders. | `image`, `left`, `right`, `up`, `down`, `prompt`, `creativity`, `seed` | Expanded image; schema not documented. |
| POST | `/stability-ai/search-and-replace` | Find an object by text and replace it. | `image`, `search_prompt`, `prompt`, `grow_mask`, `negative_prompt` | Edited image; schema not documented. |
| POST | `/stability-ai/search-and-recolor` | Find an object by text and recolor it. | `image`, `select_prompt`, `prompt`, `negative_prompt` | Recolored image; schema not documented. |
| POST | `/stability-ai/remove-background` | Remove the image background. | `image`, `output_format` | Cutout image, likely transparent PNG/WebP; schema not documented. |
| POST | `/stability-ai/replace-background-and-relight` | Replace a subject background and adjust lighting. | `subject_image`, `background_prompt`, `background_reference`, `foreground_prompt`, `light_source_direction`, `light_source_strength` | Async id, then final image via result polling. |

## Field Notes

### Inputs

Image inputs are base64 strings in the MPP wrapper. Object and region targeting use `mask`, `search_prompt`, `select_prompt`, and `grow_mask`. Background workflows use `subject_image`, `background_prompt`, `background_reference`, `foreground_prompt`, and lighting controls. Outpaint uses directional pixel fields: `left`, `right`, `up`, and `down`.

### Outputs

Most endpoints are expected to return edited images. Replace Background & Relight is documented as asynchronous and returns an id that must be polled with `/stability-ai/result`.

### Important Constraints Or Gaps

Response body schemas, image dimensions, mask file constraints, and async result lifecycle are not documented in the MPP OpenAPI. Background replacement and relighting is paid, while polling is free.

## Use Cases

### Ecommerce Product Photo Cleanup

A seller can remove distracting backgrounds, erase blemishes, recolor a product variant, or place the same item into a more suitable scene. A business catalog team can automate draft product-image cleanup by sending raw supplier photos through `remove-background`, then using `replace-background-and-relight` for consistent category imagery.

The key fields are `image`, `subject_image`, `background_prompt`, `background_reference`, and `light_source_direction`. These fields let the workflow standardize visual merchandising while retaining the actual product subject. Human QA remains important because generated backgrounds and relighting can misrepresent product details.

### Real Estate And Interior Visual Edits

A homeowner can outpaint a cropped room photo or remove temporary clutter before sharing a listing draft. A real estate team can use `erase`, `inpaint`, and `outpaint` to create cleaner marketing previews while keeping original photos archived separately.

`mask`, `prompt`, `grow_mask`, and directional outpaint fields define what changes. The output helps decide whether a listing image needs a professional reshoot. Compliance matters: generated edits should be disclosed where required and should not materially misrepresent property condition.

### Apparel And Color Variant Previews

A shopper can preview a shirt, chair, or accessory in another color with `search-and-recolor`. A retailer can generate first-pass variant imagery before physical samples are photographed, using `select_prompt` to target the object and `prompt` to specify the desired appearance.

This is valuable when colorway demand is uncertain. The fields support targeted edits without manual masking, but final catalog images should still be checked against actual SKU colors and materials.

### Layout Adaptation For Different Channels

A creator can outpaint a square image into a vertical story or wide banner by setting `up`, `down`, `left`, and `right`. A marketing team can automate channel adaptation for ads, thumbnails, email headers, and landing pages.

`creativity` controls how far the model may invent around the original frame. This helps preserve a campaign's central asset while avoiding manual canvas extension. The risk is that generated surroundings can add unwanted objects or visual claims.

### Localized Background Swaps

A travel, retail, or food brand can place the same subject into region-specific settings by using `background_prompt` or `background_reference`. A person can create event-specific portraits or portfolio images without a studio setup.

The combination of `foreground_prompt`, `light_source_direction`, and `light_source_strength` can make the new environment more plausible. This workflow should avoid deceptive identity, endorsement, or location claims.
