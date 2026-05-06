# Stability AI: Image Control And Style API Uses

## What This Endpoint Group Does

These endpoints use reference images to control the output: sketches define contours, structure images preserve layout, style guide images set visual style, and style transfer applies one image's style to another. The group is for directed creation where consistency matters more than freeform prompt generation.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/stability-ai/sketch` | Turn sketch or line art into a detailed image. | `image`, `prompt`, `control_strength`, `negative_prompt`, `seed` | Controlled image; schema not documented. |
| POST | `/stability-ai/structure` | Generate while preserving source layout. | `image`, `prompt`, `control_strength`, `negative_prompt`, `seed` | Controlled image; schema not documented. |
| POST | `/stability-ai/style-guide` | Apply style from a reference image to prompted content. | `image`, `prompt`, `fidelity`, `aspect_ratio`, `negative_prompt`, `seed` | Styled image; schema not documented. |
| POST | `/stability-ai/style-transfer` | Transfer style from one image onto another. | `init_image`, `style_image`, `prompt`, `style_strength`, `composition_fidelity`, `change_strength`, `seed` | Restyled image; schema not documented. |

## Field Notes

### Inputs

All endpoints use reference imagery. `control_strength`, `fidelity`, `style_strength`, `composition_fidelity`, and `change_strength` define how strongly the reference influences the result. `prompt` and `negative_prompt` provide semantic direction. `aspect_ratio` appears on style guide for output composition.

### Outputs

The expected output is a generated or transformed image. The MPP OpenAPI does not document the response body schema.

### Important Constraints Or Gaps

The distinction between style guide and style transfer matters: style guide uses a reference style to create new prompted content, while style transfer restyles an existing content image using a separate style image. Exact image constraints and response payloads are not documented.

## Use Cases

### Brand-Consistent Creative Generation

A creator can use a reference image to keep social thumbnails or illustrations in the same look across a series. A business can encode brand art direction with `style-guide`, then generate campaign visuals that stay closer to an approved style.

The important fields are `image`, `prompt`, `fidelity`, `negative_prompt`, and `seed`. The output can speed up creative production, but brand teams should still review for trademark, logo, and style-policy compliance.

### Sketch-To-Concept Workflows

A designer can sketch a product, room, character, or UI-adjacent visual and use `sketch` to produce refined concept art. A product team can turn rough workshop sketches into clearer visuals for stakeholder review.

`control_strength` is central because it controls how closely the output follows the sketch. This supports fast iteration while keeping the original composition recognizable.

### Scene Or Pose Preservation

A photographer, storyboard artist, or apparel team can use `structure` to preserve a pose, layout, or scene geometry while changing subject matter or style through `prompt`. A business can generate localized or seasonal variants without losing the approved composition.

The workflow matters when layout consistency is part of the asset value. `negative_prompt` helps prevent unwanted elements, but visual QA is required because the model can still alter details.

### Style Transfer For Portfolio And Asset Reuse

An artist can restyle existing work for a new project while preserving composition. A game or media team can apply a target art style to concept images to evaluate whether old assets can fit a new visual direction.

`init_image`, `style_image`, `style_strength`, `composition_fidelity`, and `change_strength` expose the tradeoff between preserving content and adopting style. Rights to both source and style images should be clear before commercial use.
