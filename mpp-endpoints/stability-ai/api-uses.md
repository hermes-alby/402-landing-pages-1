# Stability AI API Uses

## Service Summary

Stability AI exposes generative media APIs for images, 3D assets, and audio. The MPP service wraps 23 Stability AI operations behind HTTP 402 payment, letting a user or agent make pay-per-request calls without directly managing Stability credits or API keys. The surface is strongest for concrete creative workflows: generating campaign images, editing product photos, upscaling assets, controlling style and composition, producing rough 3D assets, and creating or repairing audio.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Image Generation | 3 | Prompt-driven still image generation across quality/cost tiers. | [`image-generation.md`](api-uses/image-generation.md) |
| Image Editing And Backgrounds | 7 | Retouching, object edits, background removal/replacement, outpainting, recoloring, and relighting. | [`image-editing-and-backgrounds.md`](api-uses/image-editing-and-backgrounds.md) |
| Image Upscaling | 3 | Low-cost fast upscaling, conservative high-fidelity upscaling, and creative detail generation. | [`image-upscaling.md`](api-uses/image-upscaling.md) |
| Image Control And Style | 4 | Sketch-to-image, structure-preserving generation, style guidance, and style transfer. | [`image-control-and-style.md`](api-uses/image-control-and-style.md) |
| 3D Asset Generation | 2 | Single-image generation of textured 3D assets. | [`three-d-asset-generation.md`](api-uses/three-d-asset-generation.md) |
| Audio Generation And Editing | 3 | Text-to-audio, audio transformation, and timed audio inpainting. | [`audio-generation-and-editing.md`](api-uses/audio-generation-and-editing.md) |
| Async Result Retrieval | 1 | Polling outputs from async media jobs. | [`async-result-retrieval.md`](api-uses/async-result-retrieval.md) |

## Highest-Value Uses

The highest-value uses are workflows where generated media removes setup friction or avoids repeated manual creative labor: ecommerce image cleanup, channel-specific campaign creative, asset upscaling for print or listings, controlled brand-style generation, 3D prototype assets, and draft music or sound effects. MPP is most useful when the caller wants a small number of paid operations without account setup or credit management.

## Personal Use Opportunities

Individuals can generate social visuals, create custom wallpapers or invitations, clean up photos, extend image canvases for different formats, upscale old images, turn sketches into concept art, generate quick 3D props, and create draft music or sound effects. The practical constraint is that generated media still needs human review for accuracy, rights, and suitability.

## Business Use Opportunities

Businesses can build pay-per-action creative features, automate product-photo preparation, prototype ad concepts, create style-consistent campaign variants, rescue low-resolution catalog images, generate rough 3D previews for product pages, and draft audio assets for marketing or apps. The response-schema gaps mean production systems should store request metadata locally and treat outputs as review candidates unless verified.

## Endpoint Group Summaries

### Image Generation

Ultra, Core, and SD3/SD3.5 generate new still images from prompts, with controls for aspect ratio, output format, seed, style, image-to-image strength, model, and guidance scale. See [`api-uses/image-generation.md`](api-uses/image-generation.md).

### Image Editing And Backgrounds

Editing endpoints start from an existing image and perform region or object-level transformations such as erase, inpaint, outpaint, replace, recolor, remove background, and relight. These are especially useful for product photography, real estate imagery, and channel adaptation. See [`api-uses/image-editing-and-backgrounds.md`](api-uses/image-editing-and-backgrounds.md).

### Image Upscaling

Upscaling endpoints increase resolution at different cost and quality tiers. Fast upscale is suitable for previews and low-cost web improvements, while conservative and creative upscalers support higher-value assets. See [`api-uses/image-upscaling.md`](api-uses/image-upscaling.md).

### Image Control And Style

Control and style endpoints let users preserve sketch contours, source structure, or visual style while generating new outputs. They are valuable for design iteration and brand-consistent creative systems. See [`api-uses/image-control-and-style.md`](api-uses/image-control-and-style.md).

### 3D Asset Generation

The 3D endpoints convert a single object image into a 3D asset with controls for texture resolution, foreground framing, remeshing, guidance, and seed. They are best treated as prototype or preview asset generators until outputs are validated. See [`api-uses/three-d-asset-generation.md`](api-uses/three-d-asset-generation.md).

### Audio Generation And Editing

Audio endpoints generate music or sound effects from prompts, transform existing audio, or replace timed segments. They can accelerate drafts and prototypes, but rights, audio quality, and production mastering need downstream review. See [`api-uses/audio-generation-and-editing.md`](api-uses/audio-generation-and-editing.md).

### Async Result Retrieval

The result endpoint supports async operations such as creative upscale and background replacement/relighting. It is a workflow coordination endpoint rather than a creative model endpoint. See [`api-uses/async-result-retrieval.md`](api-uses/async-result-retrieval.md).

## Field And Data Themes

Common inputs include `prompt`, `negative_prompt`, base64 `image` or `audio`, `output_format`, `seed`, and model/quality controls. Image workflows add fields like `aspect_ratio`, `strength`, `mask`, `grow_mask`, `creativity`, `control_strength`, style controls, and lighting controls. Audio workflows add `duration`, `steps`, `cfg_scale`, `strength`, `mask_start`, and `mask_end`. 3D workflows add `texture_resolution`, `foreground_ratio`, `remesh`, and `guidance_scale`.
