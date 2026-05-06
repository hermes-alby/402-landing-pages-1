# StableStudio: Video Generation And Animation API Uses

## What This Endpoint Group Does

These endpoints create short videos from text prompts, first frames, reference images, interpolation frames, and model-specific motion controls. They cover Grok Video, Seedance, Seedance Fast, Wan 2.6, Sora 2, Sora 2 Pro, Veo 3.1, and Veo 3.1 Fast.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/generate/grok-video/generate` | Fast video generation with optional image input | `prompt`, `duration`, `resolution`, `aspect_ratio`, `image` | `jobId`, pending status |
| POST | `/api/generate/seedance/t2v` | Seedance text-to-video | `prompt`, `duration`, `resolution`, `aspect_ratio`, `generate_audio`, `camera_fixed`, `seed` | `jobId`, pending status |
| POST | `/api/generate/seedance/i2v` | Seedance image-to-video/interpolation | `prompt`, `image`, `last_image`, `duration`, `resolution`, `seed` | `jobId`, pending status |
| POST | `/api/generate/seedance-fast/t2v` | Lower-cost Seedance text-to-video | `prompt`, `duration`, `resolution`, `aspect_ratio` | `jobId`, pending status |
| POST | `/api/generate/seedance-fast/i2v` | Lower-cost Seedance image-to-video | `prompt`, `image`, `last_image`, `duration`, `resolution` | `jobId`, pending status |
| POST | `/api/generate/wan-2.6/t2v` | Wan text-to-video | `prompt`, `duration`, `size`, `negativePrompt`, `audioUrl`, `seed` | `jobId`, pending status |
| POST | `/api/generate/wan-2.6/i2v` | Wan image-to-video | `prompt`, `image`, `duration`, `resolution`, `negativePrompt`, `audioUrl` | `jobId`, pending status |
| POST | `/api/generate/sora-2/generate` | Sora 2 video generation or image-to-video | `prompt`, `seconds`, `size`, `input_reference`, `autoCrop` | `jobId`, pending status |
| POST | `/api/generate/sora-2-pro/generate` | Higher-end Sora route with larger sizes | `prompt`, `seconds`, `size`, `input_reference`, `autoCrop` | `jobId`, pending status |
| POST | `/api/generate/veo-3.1/generate` | Recommended video default with multiple image modes | `prompt`, `durationSeconds`, `resolution`, `aspectRatio`, `imageMode`, `image`, `lastFrame`, `referenceImages` | `jobId`, pending status |
| POST | `/api/generate/veo-3.1-fast/generate` | Faster Veo route | `prompt`, `durationSeconds`, `resolution`, `aspectRatio`, `imageMode`, image fields | `jobId`, pending status |

## Field Notes

### Inputs

Core controls include `prompt`, `duration`, `durationSeconds`, `seconds`, `resolution`, `size`, `aspect_ratio`, `aspectRatio`, `negativePrompt`, `seed`, `audioUrl`, and image-reference fields. Veo adds `imageMode` with `none`, `first-frame`, `reference`, and `interpolation`.

### Outputs

Paid requests return `jobId` and pending status. Completed jobs return `videoUrl` and `thumbnailUrl` through job polling, according to the docs.

### Important Constraints Or Gaps

Video routes have higher published costs and longer expected times than image routes. Docs recommend polling every 10 seconds with a 10 minute timeout. Exact codec, frame rate, audio behavior, final duration rounding, and content-policy error schemas are not documented.

## Use Cases

### Social Video Production From Campaign Briefs

A creator or social team can turn campaign copy into short vertical, square, or landscape videos by setting `aspectRatio`, `resolution`, and duration fields. Businesses can create first-draft clips for TikTok, Reels, YouTube Shorts, ads, or product teasers without committing to a video subscription.

The API is valuable because each video job returns a `jobId`, making it easy to queue, poll, download, and review multiple variants. Teams should use lower-cost routes for drafts and reserve Sora Pro or Veo for final candidates.

### Product Animation From Still Images

An ecommerce team can upload a product image, pass it as `image`, `input_reference`, or Veo first-frame/reference input, and generate a short motion clip. Personal users can animate artwork, invitations, or project stills.

This workflow depends on the upload-preparation group and job lifecycle group. The output enables merchandising tests, ad creative, and richer listing media, but visual fidelity and product claims need manual approval before publication.

### Storyboard And Pitch Video Prototyping

Creative teams can use text-to-video for rough scene exploration and image-to-video for animating approved keyframes. `seed`, `negativePrompt`, `camera_fixed`, `enablePromptExpansion`, `multiShots`, and `autoCrop` give teams some control over consistency and motion.

The returned `videoUrl` is temporary, so a production workflow should download the asset immediately and store prompt, model, route, cost, and approval notes alongside it.

### Interpolation And Before/After Motion

Seedance i2v and Veo interpolation modes can animate between an initial image and `last_image` or `lastFrame`. A person might animate a transformation concept; a business might show product setup, renovation concepts, fashion transitions, or UI state changes.

The important fields are `image`, `last_image` or `lastFrame`, `imageMode: interpolation`, duration, and resolution. The gap is that the docs do not specify how strictly the model preserves start and end frames.

### Audio-Aware Video Experiments

Wan routes expose `audioUrl`, and Seedance exposes `generate_audio`. This can support experiments in music-driven, narration-aware, or ambient video generation for creators and brands.

Because the docs do not specify supported audio formats, synchronization guarantees, or audio moderation behavior, this should be treated as an exploratory workflow until validated with paid calls under explicit approval.
