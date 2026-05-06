# ScreenshotOne API Uses

## Service Summary

ScreenshotOne is a website rendering and screenshot API. Through the assigned MPP service, it exposes one paid endpoint that renders a URL, supplied HTML, or supplied markdown into an image/PDF/related response with controls for viewport, full-page capture, element selection, output format, dark mode, cleanup, timing, and response type.

The strongest API-use opportunities are workflows that need repeatable rendered artifacts: visual QA, archival evidence, generated documents, marketing previews, support screenshots, and low-volume pay-per-request rendering.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Webpage Rendering And Capture | 1 | Render URLs, HTML, or markdown into screenshots, PDFs, or related responses with standardized capture options. | [`api-uses/webpage-rendering-and-capture.md`](api-uses/webpage-rendering-and-capture.md) |

## Highest-Value Uses

- Release QA and regression evidence for pages and components, using stable viewport, selector, delay, and full-page options.
- Point-in-time archiving of public pages, pricing, terms, booking confirmations, or campaign pages as PDF or image artifacts.
- HTML/markdown-to-PDF or image generation for reports, invoices, certificates, statements, and branded summaries.
- Content and marketing preview generation for CMS, landing page, newsletter, and product launch workflows.
- Customer-support screenshots that make public-page layout bugs easier to reproduce and triage.

## Personal Use Opportunities

Individuals can capture public pages for their own records, generate PDFs from markdown or HTML, test personal websites across viewport sizes, and create clean preview images for blogs or portfolios. MPP access is especially relevant when usage is occasional and a direct provider subscription or access-key setup would be unnecessary overhead.

## Business Use Opportunities

Businesses can fold the endpoint into deploy checks, support-ticket workflows, campaign review, sales/marketing asset production, document generation, vendor/procurement evidence, and product QA. The valuable fields are not just `url`, but the rendering controls that make outputs consistent: `selector`, `full_page`, viewport dimensions, `device_scale_factor`, `delay`, `wait_for_selector`, `format`, and `response_type`.

## Endpoint Group Summaries

### Webpage Rendering And Capture

This group covers the service's single MPP endpoint, `POST /screenshotone/take`. It accepts one source input (`url`, `html`, or `markdown`) plus rendering and timing options, and returns the rendered artifact or an error. The group artifact details practical uses around visual QA, archival records, generated documents, content previews, support snapshots, design review, and low-volume pay-per-request rendering.

Full details: [`api-uses/webpage-rendering-and-capture.md`](api-uses/webpage-rendering-and-capture.md)

## Field And Data Themes

- Source content: `url`, `html`, and `markdown` decide what is rendered.
- Capture scope: `full_page` and `selector` decide whether the workflow captures a whole page, viewport, or element.
- Rendering context: `viewport_width`, `viewport_height`, `device_scale_factor`, `dark_mode`, `delay`, `timeout`, and `wait_for_selector` make output repeatable.
- Output shape: `format`, `image_quality`, and `response_type` determine whether the caller receives an image/PDF body, a JSON response, or an empty status response.
- Error handling: provider docs show `is_successful`, `error_code`, `error_message`, and `documentation_url` for failures.
- Payment: the MPP feed lists `55000` units of the Tempo asset per request, and the MPP docs estimate `$0.055`.
