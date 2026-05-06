# Mathpix API Uses

## Service Summary

Mathpix converts STEM-heavy visual content into machine-readable text and structured formats. The assigned MPP wrapper exposes two paid endpoints: one for OCR on a single image and one for recognizing handwritten digital ink strokes. Both are most valuable when the input contains math, formulas, tables, chemistry diagrams, or handwriting that generic OCR and plain text extraction handle poorly.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Single Image STEM OCR | 1 | Convert image URLs or base64 images into Mathpix Markdown, LaTeX-style equations, HTML, structured data, line/word data, and confidence signals. | [single-image-stem-ocr.md](api-uses/single-image-stem-ocr.md) |
| Digital Ink Handwriting Recognition | 1 | Convert stylus or drawing coordinate arrays into recognized math/text and LaTeX-style output. | [digital-ink-handwriting-recognition.md](api-uses/digital-ink-handwriting-recognition.md) |

## Highest-Value Uses

- Turn equation screenshots and handwritten math into editable Mathpix Markdown or LaTeX-style text.
- Add handwriting-first math input to tutoring, note-taking, whiteboard, and document-authoring tools.
- Search and index STEM-heavy images that would otherwise remain visual-only.
- Extract table, chemistry, line, and word structure when OCR output needs review or downstream automation.
- Use confidence fields and error IDs to route low-quality inputs to recapture or manual review instead of trusting weak OCR.

## Personal Use Opportunities

Students, tutors, researchers, and technical writers can use the image endpoint for occasional screenshot-to-LaTeX or screenshot-to-Markdown conversion without setting up a full Mathpix account. Tablet users can use the stroke endpoint to convert handwritten equations into editable text for notes, chat, assignments, or authoring tools.

The practical personal caveat is review. Math notation is brittle: one wrong symbol can change meaning. Personal workflows should preserve the original image or ink until the user confirms the output.

## Business Use Opportunities

Edtech and tutoring products can accept natural equation input from images or stylus strokes, then use `confidence`, `confidence_rate`, and `error_info.id` to decide when to ask for recapture. Knowledge-base and publishing tools can index STEM images using Mathpix Markdown and, where requested, structured data such as LaTeX, MathML, SVG, TSV, or chemistry representations. Whiteboard and note-taking apps can convert selected handwriting into clean equations while keeping the original ink.

The MPP wrapper is strongest for low-volume, agent-mediated, or friction-sensitive use. High-volume production customers may prefer direct Mathpix API contracts because Mathpix already publishes Convert API usage pricing and offers broader endpoints than the wrapper exposes.

## Endpoint Group Summaries

### Single Image STEM OCR

`/mathpix/process-image` accepts a `src` image URL or base64 image and can return `text`, `html`, `latex_styled`, structured `data`, line/word segmentation, confidence fields, and error details. It supports workflows such as equation screenshot conversion, searchable STEM archives, table extraction, chemistry diagram extraction, and quality-gated educational intake. Full details: [api-uses/single-image-stem-ocr.md](api-uses/single-image-stem-ocr.md).

### Digital Ink Handwriting Recognition

`/mathpix/process-strokes` accepts digital ink coordinate arrays and returns recognized text/LaTeX-style output with confidence fields. It is best suited for tablet math entry, interactive whiteboards, handwritten tutoring steps, accessibility-oriented math authoring, and note digitization. Full details: [api-uses/digital-ink-handwriting-recognition.md](api-uses/digital-ink-handwriting-recognition.md).

## Field And Data Themes

The major input theme is visual or stroke content plus output-format control. The major output theme is STEM-preserving text: Mathpix Markdown, LaTeX-style equations, HTML, and optional structured data. Confidence fields are central because they make OCR usable in automated workflows without blindly trusting every result. For image OCR, line and word data are the key fields for review interfaces and region-level quality control. For stroke recognition, coordinate structure and request size are the key design constraints.
