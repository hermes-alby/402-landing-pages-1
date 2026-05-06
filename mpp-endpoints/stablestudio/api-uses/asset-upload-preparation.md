# StableStudio: Asset Upload Preparation API Uses

## What This Endpoint Group Does

These endpoints prepare user-supplied images for StableStudio edit and image-to-video routes. The flow is: pay for an upload token, upload the file directly to Vercel Blob with the client token, then confirm the resulting `blobUrl` with wallet-signature authentication.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/upload` | Get a paid client token for direct upload | `filename`, `contentType`, optional `size` | `uploadId`, `clientToken`, `pathname`, `expiresAt` |
| POST | `/api/upload/confirm` | Confirm uploaded file and final blob URL | `uploadId`, `blobUrl`, `SIGN-IN-WITH-X` | `success`, `upload.id`, `upload.blobUrl` |

## Field Notes

### Inputs

`filename` and `contentType` are required for the token request. Supported content types are `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, and `image/webp`. `size` is optional. Confirmation uses `uploadId` and `blobUrl`.

### Outputs

The token request returns upload-session metadata and a Vercel Blob client token. Confirmation returns the final `blobUrl` to pass into `images`, `image`, `input_reference`, `last_image`, `lastFrame`, or `referenceImages` fields on downstream routes.

### Important Constraints Or Gaps

The token request costs $0.01. The direct upload step goes to Vercel Blob, not a StableStudio endpoint. StableStudio docs do not specify file-size maximums, token TTL beyond `expiresAt`, malware scanning, or direct-upload error schemas.

## Use Cases

### Controlled Reference Asset Intake

A personal user can upload one source image and reuse the confirmed `blobUrl` for several edits or video attempts. A business can build an intake step that validates `contentType`, logs `filename`, records `uploadId`, and only permits downstream paid generation after the upload is confirmed.

This group is valuable because it separates asset preparation from expensive generation. The output `blobUrl` becomes a reusable input across edit and video routes.

### Approval Gates Before Paid Generation

An agency or internal creative tool can require upload confirmation before authorizing more expensive edit or video jobs. The application can present the uploaded asset for review, then decide which model and prompt should consume the `blobUrl`.

The important fields are `uploadId`, `blobUrl`, `expiresAt`, and `contentType`. The limitation is that the API does not document image dimensions or file-size constraints, so client-side validation should be stricter than the public docs.

### Asset Provenance For Media Workflows

A business can store each `uploadId`, original filename, MIME type, confirmed blob URL, and downstream `jobId` together. This creates a simple lineage from source asset to generated output for review, rights management, and cost attribution.

The API does not itself expose ownership or licensing fields. Those need to come from the user's asset-management system or upload UI.

### Batch Preparation For Image-To-Video

A creator can prepare first frames, last frames, and reference images before launching video jobs. For Veo reference mode, up to three `referenceImages` can be passed after upload; interpolation workflows need both first and last frame URLs.

The value is reducing wasted video spend. A workflow can confirm all blob URLs first, then submit only complete video requests.
