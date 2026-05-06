# Stability AI: Image Upscaling API Uses

## What This Endpoint Group Does

These endpoints increase image resolution using three tradeoff points: fast low-cost upscaling, conservative 4K upscaling that preserves the source, and creative upscaling that can add AI-generated detail. They are useful when the source image is valuable but too small, degraded, or not suitable for print or high-resolution displays.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/stability-ai/upscale-fast` | Quick 4x upscaling. | `image`, `output_format` | Upscaled image; schema not documented. |
| POST | `/stability-ai/upscale-conservative` | Preserve source while upscaling toward 4K. | `image`, `prompt`, `negative_prompt`, `creativity`, `seed` | Upscaled image; schema not documented. |
| POST | `/stability-ai/upscale-creative` | Upscale with AI-enhanced detail generation. | `image`, `prompt`, `negative_prompt`, `creativity`, `style_preset`, `seed` | Async id, then upscaled result via polling. |

## Field Notes

### Inputs

All endpoints require `image`. Conservative and creative modes require a descriptive `prompt`, and expose `creativity` for the amount of detail enhancement. Creative upscaling also supports `style_preset`. `seed` can help reproduce or compare outputs when supported.

### Outputs

The expected output is an upscaled image. Creative upscale is documented as asynchronous and requires polling `/stability-ai/result`.

### Important Constraints Or Gaps

The MPP docs mention fast 4x upscaling and conservative/creative 4K-style workflows, but the MPP OpenAPI does not document exact pixel limits, returned metadata, or result lifecycle. Costs differ sharply: fast is low-cost, while conservative and creative are much more expensive.

## Use Cases

### Marketplace Image Rescue

A seller can recover low-resolution supplier photos for a listing without scheduling new photography. A marketplace operator can offer image enhancement as an optional listing-prep step, using fast upscaling for low-value drafts and conservative upscaling for images that should preserve product details.

The workflow depends on `image`, `prompt`, `creativity`, and `output_format`. Conservative mode is better when product accuracy matters. Creative mode should be used carefully because added details may misrepresent the actual item.

### Print And Event Asset Preparation

A person can upscale a logo, poster draft, or event photo before printing. A small business can prepare signage, flyers, and booth graphics from older source images that were originally made for web use.

The endpoint output helps decide whether an asset is print-ready or needs a designer. `prompt` and `negative_prompt` provide context for preserving content, while `creativity` controls whether the upscaler should invent extra detail.

### Archival And Portfolio Enhancement

An artist, photographer, or agency can upscale older portfolio images for modern displays. Businesses with historical brand imagery can make legacy assets usable in current websites and decks without fully recreating them.

Fast upscale is suitable for previews and web refreshes. Conservative upscale is preferable for archival fidelity. The response schema gap means the caller should store source image metadata and request parameters for traceability.

### Quality Tiering In Creative Pipelines

A creative platform can route many images through `upscale-fast` for preview and reserve `upscale-creative` for paid or approved final assets. This maps cost directly to workflow stage.

The useful decision fields are endpoint choice, `creativity`, `style_preset`, and output format. Since creative upscale is async, the platform also needs job tracking and result polling.
