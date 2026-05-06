# Mathpix: Digital Ink Handwriting Recognition API Uses

## What This Endpoint Group Does

This endpoint group recognizes handwriting directly from digital ink coordinate arrays. Instead of rendering handwriting into an image and then running image OCR, callers send grouped x/y stroke coordinates to `/mathpix/process-strokes`, corresponding to upstream `POST /v3/strokes`.

The group is valuable for stylus-first products: whiteboards, note-taking apps, math tutoring tools, tablet worksheets, and interactive equation editors. It returns recognized Mathpix Markdown or LaTeX-style output with confidence fields and handwriting/printed flags.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mathpix/process-strokes` | Recognize handwritten math/text from digital ink coordinates | `strokes.strokes.x`, `strokes.strokes.y`, `formats`, delimiters, `rm_spaces`, `rm_fonts`, `metadata.improve_mathpix`, optional upstream `strokes_session_id` | `text`, `latex_styled`, confidence fields, handwriting/printed flags, inferred dimensions, `auto_rotate_confidence`, `error_info`, `version` |

## Field Notes

### Inputs

The required `strokes` payload contains x and y coordinate arrays. Official docs describe each sub-array as one stroke, so the order and grouping of pen movement matters. Formatting options mirror the image endpoint: `formats`, math delimiters, `rm_spaces`, and `rm_fonts`.

The upstream API also supports `strokes_session_id` for live update drawing when combined with app-token authentication. The assigned MPP wrapper does not confirm whether it supports that live-session mode. Wrapper docs include a `metadata` object and give `improve_mathpix` as an example, which aligns with Mathpix privacy docs.

### Outputs

The core outputs are `text` and `latex_styled`. `latex_styled` is especially valuable for handwritten single-equation input. `confidence` and `confidence_rate` let a product choose between auto-accepting, asking the user to correct, or preserving the raw ink for manual review. `is_handwritten`, `image_height`, `image_width`, and `version` support debugging and analytics.

Errors can indicate missing stroke data, malformed coordinates, no recognizable content, oversized request bodies, quota problems, or payment requirements. The upstream docs emphasize `error_info.id` as the reliable programmatic identifier.

### Important Constraints Or Gaps

Upstream `v3/strokes` has a 512 KB JSON body limit, smaller than image OCR. That matters for long whiteboard sessions or high-frequency stylus sampling. The MPP endpoint is paid per request and wrapper docs estimate $0.013 per call, so streaming every small pen update through the wrapper could be expensive unless the live-session mode is confirmed and priced as expected.

## Use Cases

### Handwritten Equation Entry For Students And Tutors

A student can write an equation on a tablet, send the stroke coordinates, and receive `latex_styled` or Mathpix Markdown for insertion into notes, chat, or a homework tool. This avoids forcing learners to type complex math syntax.

For tutoring and edtech businesses, the endpoint can power math answer boxes that accept natural handwriting. `confidence` and `confidence_rate` can decide whether to accept the conversion or show an editable preview. The workflow should keep the original ink around until the learner confirms the transcription, because a small symbol error can change the answer.

### Interactive Whiteboard Capture

During a live lesson or meeting, a whiteboard app can convert selected ink strokes into clean equation text. The user gets searchable, copyable math from the board instead of a static screenshot.

A business selling collaborative whiteboards can use this to generate meeting notes, equation summaries, or downstream exports. The 512 KB request limit means the product should segment ink into equations or regions rather than submit an entire long board. If live stroke sessions are required, wrapper support for `strokes_session_id` must be validated first.

### Auto-Check Handwritten Math Steps

An individual learner can write each algebra step by hand and have the system convert the strokes to text before comparing it with an expected solution path. The output `text` and `latex_styled` fields become the bridge from handwriting to symbolic checking or LLM feedback.

For an edtech company, this enables step-by-step feedback while preserving a handwriting-first interface. Confidence fields are important guardrails: low-confidence transcriptions should trigger "please rewrite this step" rather than incorrect grading. This endpoint supplies recognition, not mathematical validation, so a separate checker is still needed.

### Accessibility And Alternative Input For Math Authoring

People who find LaTeX typing difficult can use handwriting as the input modality and receive Mathpix Markdown or LaTeX-style output. This is useful for personal notes, messages, or accessibility tooling.

For document editors, LMS tools, and scientific authoring products, stroke recognition can be an alternative input method alongside keyboard shortcuts and equation palettes. `rm_spaces`, `rm_fonts`, and delimiter options help normalize the output for the host editor. The workflow should surface an edit step, because accessibility tools should not silently insert uncertain math.

### Lightweight Digitization Of Paper-Like Tablet Notes

Tablet note apps can convert selected handwritten equations from stored stroke data without needing to export screenshots first. A user can select an equation and get text for search or reuse.

For businesses, this supports better search and indexing of notes while preserving the original handwriting. `request_id`, `version`, and confidence fields help track recognition quality over time. Cost and privacy are the main caveats: batch or local indexing strategies may be needed for large notebooks, and `metadata.improve_mathpix` behavior through the wrapper should be verified for private notes.
