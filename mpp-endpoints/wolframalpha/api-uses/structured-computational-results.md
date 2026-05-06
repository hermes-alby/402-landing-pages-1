# Wolfram|Alpha: Structured Computational Results API Uses

## What This Endpoint Group Does

This group covers the Full Results endpoint. It returns comprehensive structured Wolfram|Alpha results with pods, subpods, plaintext, images, MathML, assumptions, warnings, and related metadata when available. It is the endpoint to use when an application needs to inspect the answer, select parts of it, render multiple sections, or pass structured computed knowledge into another workflow.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/wolframalpha/full-results` | Return comprehensive structured results for a natural-language query. | `input`, `format`, `includepodid`, `excludepodid`, `units`, `location`, `timeout` | `queryresult`, pods, subpods, plaintext, images, MathML, assumptions, warnings. |

## Field Notes

### Inputs

`input` is the natural-language query. `format` controls whether content should include `plaintext`, `image`, or `mathml`; the MPP docs list a default of `plaintext,image`. `includepodid` and `excludepodid` let callers focus on or suppress specific pod IDs such as `Result`. `units` supports `metric` or `nonmetric`, `location` provides contextual interpretation, and `timeout` bounds processing time.

### Outputs

The official Full Results API returns a descriptive XML or JSON structure around requested content formats. The inventory captures the central response concepts: a top-level `queryresult`, `pods`, pod `id` and `title`, `subpods`, `plaintext`, `img`, `mathml`, assumptions, and warnings. The MPP OpenAPI does not provide a concrete 200 JSON schema, so consumers should code defensively.

### Important Constraints Or Gaps

The MPP endpoint is paid and was not called. The wrapper documents only a subset of upstream Full Results controls, so advanced upstream features may not be available through MPP unless later confirmed. Official terms may require attribution for displayed results and limit caching. Some subjects may be restricted by default in the official API.

## Use Cases

### LLM Grounding With Inspectable Computation

A person using an AI assistant can ask questions that require computation, exact units, formulas, or curated factual knowledge, and the agent can request `format: "plaintext"` or `format: "plaintext,mathml"` to bring back data it can inspect. Pod titles and subpod plaintext let the agent decide what to summarize rather than copying an opaque screenshot.

For businesses building AI products, this is the strongest endpoint for grounding because the response can be filtered and validated. A tutoring bot, analyst copilot, or support assistant can include the `Result` pod, inspect warnings or assumptions, and avoid over-answering when Wolfram|Alpha did not confidently interpret the query.

### Education And Tutoring Workflows

A student can ask for a calculus, algebra, statistics, chemistry, physics, or unit-conversion result and receive multiple pods that may include interpretation, result, plots, formulas, and related context. The `format` field can request plaintext for chat and MathML for equation rendering.

Education platforms can use pods to separate "answer", "plot", "formula", and "input interpretation" areas instead of presenting a single unstructured string. This supports answer checking, generated worksheets, LMS integrations, and teacher dashboards. The limitation is that the public MPP schema does not document step-by-step solution fields, so a product should not promise step-by-step tutoring unless confirmed by live endpoint behavior or another licensed provider API.

### Data-Enriched Research Notes And Reports

A personal research notebook can turn natural-language prompts into structured computed snippets: population comparisons, historical facts, astronomical quantities, nutritional values, or mathematical tables. `location` and `units` make the same question more relevant to the user's context.

For a business, report generation and analyst workflows can use Full Results to enrich memos with computed facts while preserving pod structure. For example, a market analyst could compare distances, populations, growth rates, or formulas and keep the returned pods separate from the analyst's commentary. The no-caching and attribution constraints matter if generated results are displayed or reused.

### Domain-Specific Calculators Without Building Domain Logic

A person can ask "monthly payment on a $350000 mortgage at 6.5% for 30 years" or "BMI for 180 cm 80 kg" and get computed pods without the app implementing each formula. `units` and `location` help keep interpretation aligned with the user.

Businesses can embed this in finance, health-adjacent administrative, education, engineering, and productivity tools as a broad fallback calculator. The endpoint returns computed knowledge rather than a validated regulated decision, so apps in medical, financial, or legal contexts should use it as informational support and apply domain-specific compliance review before making decisions.

### Search Result Enhancement

A personal search experience can detect computational queries and show a Wolfram|Alpha result pod before web links. `includepodid` can keep the display focused on the result, while `excludepodid` can suppress sections that do not fit the UI.

Search companies, enterprise knowledge portals, and help centers can route exact computational queries to Full Results, then display the result with attribution alongside normal search hits. The business value is better answer quality for queries where web pages are a poor substitute for computation. The gap is that routing is outside this endpoint; a query recognizer or classifier would be needed.

### Structured Math And Formula Rendering

A person writing notes or solving problems can request `mathml` to render equations cleanly in a document or app. The output pods can provide both human-readable plaintext and machine-renderable math representations when available.

For businesses building STEM publishing, notebook, LMS, or technical documentation tools, MathML output can bridge natural-language input and accessible equation rendering. The exact availability of MathML depends on the query and selected formats, and the MPP wrapper's precise JSON shape should be tested only with explicit approval for paid calls.

### Location-Aware Everyday Knowledge

A user can ask location-sensitive questions such as sunrise, weather-adjacent astronomical facts, local time calculations, or geography comparisons with `location` set explicitly. This reduces ambiguity compared with a bare natural-language question.

Businesses can use this for travel, education, logistics, or customer support flows where the same question has different answers by place. The endpoint does not document freshness guarantees or live-update cadence for every subject, so workflows requiring real-time operational data should verify freshness from domain-specific sources.
