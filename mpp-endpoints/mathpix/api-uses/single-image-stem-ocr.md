# Mathpix: Single Image STEM OCR API Uses

## What This Endpoint Group Does

This endpoint group converts one image into machine-readable STEM content. The MPP endpoint `/mathpix/process-image` corresponds to the practical function of Mathpix upstream `POST /v3/text`: it accepts an image URL or base64 image and can return Mathpix Markdown `text`, `html`, `latex_styled`, structured `data`, line/word segmentation, chemistry outputs, and confidence signals.

The value is strongest when the source image contains math, STEM notation, tables, diagrams, or mixed handwritten/printed content that generic OCR handles poorly. The endpoint is not just "read text from an image"; it preserves math syntax and enough structure for downstream rendering, search, quality checks, and workflow automation.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mathpix/process-image` | OCR one image or screenshot of math, text, tables, diagrams, or handwriting | `src`, `formats`, delimiters, `include_line_data`, `include_word_data`, `include_smiles`, `data_options`, `region`, `confidence_threshold`, `metadata.improve_mathpix` | `text`, `html`, `latex_styled`, `data`, `line_data`, `word_data`, confidence fields, handwriting/printed flags, dimensions, `error_info`, `version` |

## Field Notes

### Inputs

`src` is the required image input and may be an image URL or base64-encoded image. `formats` controls whether the caller receives Mathpix Markdown text, HTML, computed data, or `latex_styled` for single-equation images. Delimiter fields let a workflow choose how inline and display math should be represented. `rm_spaces` and `rm_fonts` tune equation normalization.

The most workflow-specific fields are the optional structure and extraction flags. `include_line_data` and `include_word_data` expose segmentation for review, highlighting, or downstream alignment. `include_smiles` and `include_inchi` are useful when chemistry diagrams matter. `region` can constrain recognition to one part of an image, and `confidence_threshold` can force low-confidence outputs into an error path. Upstream docs say all API endpoints accept `metadata.improve_mathpix`, but the MPP wrapper docs do not explicitly confirm that the wrapper forwards it.

### Outputs

The central outputs are `text` and `latex_styled`. `text` is Mathpix Markdown for mixed content, while `latex_styled` is only returned when the whole image can be reduced to a single equation. `html` is useful for web previews, while `data` can carry math and table representations such as LaTeX, MathML, AsciiMath, SVG, or TSV when requested.

Quality and review fields matter. `confidence` and `confidence_rate` support automated acceptance thresholds. `line_data` and `word_data` let a product point users to exact low-confidence regions. `is_printed`, `is_handwritten`, `image_height`, `image_width`, `auto_rotate_confidence`, and `version` help debug repeatability and capture quality. Error handling needs to inspect `error_info.id`, because Mathpix docs say many API errors are returned in the response body rather than as non-200 HTTP statuses.

### Important Constraints Or Gaps

The MPP wrapper is paid per request. This research did not call it. Upstream image OCR limits include a 5 MB JSON body, 2 MB base64 image limit, 10 MB image download limit, and 15 second URL download timeout. The wrapper OpenAPI is sparse and types several array/object fields as strings, so consumers should validate wrapper behavior before relying on every upstream field. If the workflow includes sensitive student, patient, legal, or unpublished research material, the retention behavior of `metadata.improve_mathpix` should be tested explicitly through the wrapper before production use.

## Use Cases

### Convert Equation Screenshots Into Editable Study Notes

A student, tutor, or researcher can send a screenshot of an equation and request `text` or `latex_styled` output. `latex_styled` is valuable when the image is a single equation, while `text` is better for mixed notes that include prose and formulas. The result can be pasted into a Markdown note, LaTeX editor, flashcard system, or symbolic math workflow without retyping complex notation.

For a business, the same workflow supports note-taking apps, tutoring platforms, or browser extensions that capture textbook snippets. `confidence` and `confidence_rate` can decide whether to auto-insert the result or show a confirmation UI. The main limitation is that low-quality images, unsupported syntax, or low confidence should not be silently accepted in educational or assessment workflows.

### Build Searchable STEM Content From Image-Only Sources

Individuals with old lecture slides, paper notes, or image-only PDFs can OCR screenshots page by page into Mathpix Markdown and index the returned `text`. This makes formulas and terminology searchable in a personal knowledge base.

For publishers, libraries, and internal knowledge teams, the fields enable ingestion pipelines for STEM-heavy images. `line_data` can preserve the order and segmentation of recognized content, while `version` and `request_id` make later audits easier when recognition changes. This endpoint is only a one-image synchronous call, so high-volume page conversion may be better served by Mathpix's PDF/batch endpoints outside the assigned MPP surface.

### Extract Table Data From Screenshots For Analysis

When `formats` includes `data` and `data_options.include_tsv` is enabled, table-like image content can yield structured data alongside Mathpix Markdown or HTML. A person could convert a table from a paper or presentation into TSV for spreadsheet analysis.

A business could use this in a document intake workflow where analysts receive screenshots of lab tables, results tables, or STEM reports. The returned `data` and `html` fields can feed review tools, while `confidence_rate` can route uncertain extractions to manual QA. This is valuable only when the image is clear and table structure is within Mathpix's supported recognition behavior.

### Capture Chemistry Diagrams Into Searchable Representations

With `include_smiles` and optionally `include_inchi`, a user can turn chemistry diagrams in an image into machine-readable chemistry notation embedded in the output. That helps students, researchers, or lab teams move from a drawing in a paper or notebook to a searchable, copyable representation.

For businesses, chemistry publishers or lab informatics tools can enrich image-based documents by extracting SMILES-like strings for indexing and downstream chemical search. The workflow should preserve the original image and require review for regulated or safety-critical chemistry decisions, because OCR and diagram recognition errors can materially change a compound.

### Quality-Gated Intake For Homework Or Assessment Images

An edtech product can use `confidence_threshold`, `confidence`, `confidence_rate`, `is_handwritten`, `is_printed`, and `line_data` to decide whether an uploaded answer image is readable enough to pass to grading or feedback systems. Students get a retry prompt when recognition quality is poor rather than receiving feedback based on a bad transcription.

At business scale, this reduces support load and prevents downstream grading models from operating on malformed equations. The endpoint's `error_info.id` values, such as `image_no_content`, `image_decode_error`, or `math_confidence`, can drive precise UI messages. The main caveat is that the MPP wrapper cost applies per attempt, so retries and capture guidance matter.

### Region-Based Extraction From Dense Technical Images

`region` lets a workflow focus on a particular equation, table, or diagram inside a larger image. A person could crop recognition to one area of a slide or page without manually editing the image first.

A business workflow could combine a UI selection rectangle with region-based OCR so reviewers can extract only the relevant formula from a larger scanned page. This is valuable when line-level output would be too broad or noisy. The wrapper docs describe region coordinates differently from the upstream shared Region object, so this needs empirical wrapper validation before relying on it.
