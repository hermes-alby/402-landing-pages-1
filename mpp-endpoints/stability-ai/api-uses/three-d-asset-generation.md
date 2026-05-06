# Stability AI: 3D Asset Generation API Uses

## What This Endpoint Group Does

These endpoints create textured 3D assets from a single object image. Stable Fast 3D focuses on rapid generation and remeshing controls, while Stable Point Aware 3D adds point-aware generation controls such as guidance scale and a different default foreground ratio.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/stability-ai/stable-fast-3d` | Generate a GLTF-style 3D model from an object image. | `image`, `texture_resolution`, `foreground_ratio`, `remesh` | 3D model output expected; schema not documented. |
| POST | `/stability-ai/stable-point-aware-3d` | Generate a point-aware 3D model from an object image. | `image`, `texture_resolution`, `foreground_ratio`, `guidance_scale`, `seed` | 3D model output expected; schema not documented. |

## Field Notes

### Inputs

Both endpoints require a base64 `image` of the object. `texture_resolution` can be 512, 1024, or 2048. `foreground_ratio` controls object scale in the frame. Stable Fast 3D exposes `remesh` with `none`, `triangle`, or `quad`; Stable Point Aware 3D exposes `guidance_scale` and `seed`.

### Outputs

MPP docs describe GLTF model generation, but the OpenAPI does not document whether the result is a binary file, base64 payload, URL, archive, or JSON envelope.

### Important Constraints Or Gaps

Object isolation, image quality, and view angle likely affect output quality. The wrapper does not document model file size limits, texture packing, material fields, or license/usage metadata.

## Use Cases

### Rapid Game And AR Prototype Assets

An indie developer can photograph or sketch a prop and create a quick 3D placeholder for a game or AR scene. A studio can use the endpoints to create prototype meshes before assigning high-value assets to a 3D artist.

`texture_resolution`, `foreground_ratio`, and `remesh` affect whether the output is suitable for quick preview, mobile AR, or downstream editing. The output helps decide which objects are worth manual modeling.

### Ecommerce 3D Product Previews

A seller can turn product photos into rough 3D previews for interactive product pages. A retailer can test whether categories like decor, footwear, accessories, or collectibles benefit from 3D viewing before building a full scanning pipeline.

The useful fields are `image`, `texture_resolution`, and `foreground_ratio`. Outputs should be treated as previews unless verified against the actual product, because single-image 3D generation may hallucinate unseen backside geometry.

### Design Review From Physical References

An industrial designer or architect can create a 3D draft from a reference object to support early review. A business can let clients submit object photos and receive a rough spatial model for discussion.

Stable Point Aware 3D may be useful when better backside/depth inference is needed. The limitation is that dimensional accuracy is not documented, so these outputs should not be used for engineering measurements without validation.

### Asset Library Expansion

A creative team can generate low-cost 3D candidates from a set of approved 2D references, then triage which assets merit cleanup in Blender or a DCC tool. `seed` on the point-aware endpoint supports controlled retries.

This can enrich internal asset libraries quickly, but rights to the input images and generated assets must be managed. The MPP response schema gap also means storage and file naming should be handled by the caller.
