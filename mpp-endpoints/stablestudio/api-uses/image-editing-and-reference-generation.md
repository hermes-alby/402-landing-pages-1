# StableStudio: Image Editing And Reference Generation API Uses

## What This Endpoint Group Does

These endpoints transform uploaded or referenced images using prompt instructions. They support edits, style transfer, product variations, background changes, fidelity controls, and reference-based generation. All routes require image URLs from the upload flow before the paid generation call.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/generate/nano-banana/edit` | Nano Banana image editing | `prompt`, `images`, `aspectRatio`, `imageSize`, `thinkingLevel` | `jobId`, pending status |
| POST | `/api/generate/nano-banana-pro/edit` | Higher-quality image editing up to 4K | `prompt`, `images`, `aspectRatio`, `imageSize` | `jobId`, pending status |
| POST | `/api/generate/gpt-image-2/edit` | GPT Image 2 edits with output controls | `prompt`, `images`, `quality`, `size`, `background`, `output_format`, `moderation` | `jobId`, pending status |
| POST | `/api/generate/gpt-image-1.5/edit` | GPT Image 1.5 edits with fidelity/background controls | `prompt`, `images`, `input_fidelity`, `background`, `output_format` | `jobId`, pending status |
| POST | `/api/generate/flux-2-pro/edit` | Flux 2 Pro reference editing | `prompt`, `images`, `aspect_ratio`, `resolution` | `jobId`, pending status |
| POST | `/api/generate/flux-2-max/edit` | Flux 2 Max reference editing up to 4 MP | `prompt`, `images`, `aspect_ratio`, `resolution` | `jobId`, pending status |
| POST | `/api/generate/grok/edit` | Grok image editing | `prompt`, `images`, `aspect_ratio` | `jobId`, pending status |

## Field Notes

### Inputs

All endpoints use `prompt` and `images[]`. Model-specific controls include `aspectRatio`, `aspect_ratio`, `imageSize`, `resolution`, `quality`, `size`, `background`, `output_format`, `moderation`, `thinkingLevel`, and `input_fidelity`.

### Outputs

The paid edit request returns `jobId` and pending status. The final edited `imageUrl` is retrieved through the job status endpoint.

### Important Constraints Or Gaps

Docs say Nano Banana edit routes accept 1-14 reference images, Flux 2 Pro accepts 1-8, and Flux 2 Max accepts 1-10. The OpenAPI field schema does not encode every count limit. Upload-token and upload-confirmation prerequisites add cost, wallet auth, and blob URL handling.

## Use Cases

### Ecommerce Image Refinement

A seller can upload product photos and request consistent backgrounds, lifestyle settings, seasonal variants, or marketplace-specific crops. `background`, `aspectRatio`, `resolution`, and `output_format` determine whether outputs fit marketplace galleries, ads, email banners, or transparent compositing workflows.

For a business, the value is turning a small set of source images into many channel-specific assets while preserving the original product better than pure text-to-image. The missing dependency is a documented guarantee of product fidelity; teams should review outputs before publishing.

### Brand Style Transfer And Creative Localization

A designer can provide reference images for brand tone, composition, or previous campaign art, then use prompts to generate localized or seasonal variants. Agencies can automate batches for regions, languages, sale periods, or audience segments while keeping the same visual system.

The fields that matter are `images[]`, `prompt`, aspect ratio, resolution, and `input_fidelity` where supported. Output retrieval through `jobId` enables queue-based review and approval.

### Personal Photo And Project Editing

An individual can upload a personal image and ask for a cleaner background, different crop, stylized scene, or presentation-ready variant. The API supports occasional paid edits without an account or subscription.

The practical limits are consent, privacy, and content policy. Users should avoid uploading sensitive personal images unless they understand the service terms and have rights to the source image.

### Automated Design QA Variants

A product or marketing team can generate multiple edited variants from the same source and compare conversion, readability, or brand compliance. `output_format`, `resolution`, and `aspect_ratio` let automations prepare assets for downstream QA tools.

The API itself does not evaluate image quality, detect text legibility, or verify brand compliance. Those decisions require human review or separate analysis tools after the `imageUrl` is retrieved.

### Rapid Concept Restoration Or Cleanup

A creative team can use reference editing to remove distracting elements, adjust lighting, or prototype alternate visual directions before committing to manual retouching. The pay-per-generation model is useful for small bursts of work where a full editing subscription is not justified.

Costs can compound when an upload token plus multiple edit attempts are needed, so workflows should log prompt, model, route, and final approval status.
