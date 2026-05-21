## Service

### Description
Mathpix via Locus is a pay-per-call gateway to Mathpix's STEM-grade OCR API — the same engine that converts PDFs, images, and handwriting into LaTeX, MathML, Mathpix Markdown, HTML, DOCX, and structured tables. Calls go through Locus's micropayment proxy, so developers and AI agents get full Mathpix accuracy on math, chemistry, and scientific documents without signing up for a Convert API plan, managing keys, or hitting free-tier page caps.

### USPs
- **STEM-grade accuracy, no plan commitment:** Equation, table, chemistry, and handwriting OCR — billed per request instead of per Snip subscription or Convert API tier.
- **No signup, no API key:** x402 / pay-per-request authentication, so an autonomous agent can hit the endpoint without a human creating a Mathpix account or rotating an API key.
- **Agent-native rails:** MCP-discoverable and x402-priced, designed to drop into AI agent workflows that need to read math, equations, or scientific PDFs on demand.

### Keywords
- Mathpix API
- math OCR API
- LaTeX OCR
- equation recognition API
- PDF to LaTeX API
- handwriting math OCR
- AI agent document OCR
- scientific PDF extraction

### Eyebrow Text
The pay-as-you-go way for AI agents and developers to run Mathpix's math and document OCR without a monthly subscription.

### Headline
Math and Document OCR API That Gives Developers and Agents Mathpix Accuracy Without a Subscription

### Subheadline
Mathpix via Locus lets developers, research tools, and AI agents convert images, PDFs, and handwriting into LaTeX, Mathpix Markdown, and structured tables — so they can build STEM features without committing to a Snip plan, Convert API tier, or enterprise contract.

### Key Benefit Bullets
- Convert images, PDFs, and handwriting to LaTeX, MathML, and Markdown
- Extract equations, tables, and chemistry structures with STEM-grade accuracy
- Skip Mathpix's monthly tiers — pay per request instead
- No signup, no API key — call from a wallet
- Plug it straight into AI agents via MCP and x402


## Core Benefits Section

### Headline
Everything You Need to Turn Math, Science, and Documents Into Structured Text

### Benefit 1: STEM-Grade OCR on Every Call
The endpoint exposes the same engine that powers Mathpix Snip and the Convert API — printed and handwritten math, chemistry structures (SMILES, ChemDraw), tables with cell-level structure, and full document layout. Output formats include LaTeX, MathML, Mathpix Markdown, HTML, DOCX, and CSV. Your code or your agent gets the real signal, not a generic OCR with degraded math.

### Benefit 2: Pay Per Request, Not Per Plan
Mathpix's own product ladder — Snip subscriptions for individuals, Convert API quotas for developers, custom contracts for enterprise — forces a guess about future usage. Per-call billing collapses that into a single shape: one image or one page, one charge. A research tool that runs occasionally and a high-volume document pipeline use the same pricing — no plan upgrades when traffic spikes, no unused-page rot.

### Benefit 3: Built for AI Agents Out of the Box
The endpoint is MCP-discoverable and x402-priced, so an autonomous agent can find it, call it, pay for it, and move on without a human onboarding step. No long-lived API key to leak in agent logs; no subscription to forget about; no enterprise sales call to enable bulk rate limits.

### Benefit 4: Handles the Hardest Inputs
Mathpix's engine is trained specifically for the failure modes that break general-purpose OCR — handwritten equations, multi-line displayed math, nested fractions, matrices, chemical diagrams, complex tables, and dense scientific PDFs. Production workloads can rely on the data without a separate fallback for math-heavy inputs.

### Benefit 5: One Endpoint, Every Format
Image-to-LaTeX, PDF-to-Markdown, table extraction, chemistry OCR, and digital-ink processing are all reachable through the same gateway with consistent path conventions. No multi-vendor stitching, no separate auth for separate document types — your code references one base URL and one auth shape.


## Use Cases / Who It Is For

### Headline
Built for Teams That Need Math and Document OCR Without the Plan-Tier Math

### Use Case 1: For AI Agent Builders
A research or tutoring agent reads scientific PDFs, extracts equations, and turns whiteboard photos into LaTeX without a human-managed Mathpix subscription. MCP discovery and x402 payment let the agent self-onboard at runtime; per-call billing keeps spend bounded by what the agent actually processes.

### Use Case 2: For EdTech and Tutoring Apps
A homework-help, tutoring, or note-taking app converts student photos of equations and handwritten work into structured LaTeX or Markdown. Per-call pricing maps cleanly to per-user query patterns, so free-tier users don't burn a flat-rate Snip plan and bursts during exam season scale linearly instead of hitting a quota cliff.

### Use Case 3: For Research and Document Pipelines
Ingestion pipelines for academic papers, patents, and technical PDFs use the endpoint to extract equations, tables, and references into structured formats. No need to commit to a Convert API tier to evaluate whether the accuracy fits the pipeline — pay only for the pages a backfill actually processes.

### Use Case 4: For Accessibility and Publishing Tools
Tools that re-flow scientific content for screen readers, e-readers, or digital textbooks run pages through the gateway to produce semantic LaTeX and MathML. The endpoint becomes a primitive: one call surfaces the structured content, billed at the rate the product actually generates.


## Research

## Summary
Developers and AI agents searching for STEM-grade OCR face a market split between general-purpose OCR (Google Vision, AWS Textract, Azure Document Intelligence, Tesseract) that handles plain text well but degrades on math, and specialist tools (Mathpix, MyScript, InftyReader) that own the math/handwriting/chemistry niche but ship behind subscription tiers. Mathpix is the de facto leader for math OCR — it powers Snip, integrates with Overleaf, and is the answer most developers reach for when "image to LaTeX" comes up — but its access shape is a Snip subscription, a Convert API plan with monthly page quotas, or an enterprise contract.

The strongest unmet demand comes from three groups: AI agent builders who need to read math-heavy documents as a tool call (without seat licensing or per-key rate limits), small EdTech and research products that want to embed equation OCR without committing to a Convert API tier during the build-out phase, and document pipelines whose volume is bursty and doesn't fit a flat monthly quota. Search intent clusters around "Mathpix API," "image to LaTeX API," "math OCR API," "PDF to LaTeX," and "handwriting equation recognition." The intersection — full Mathpix accuracy with per-call billing and an agent-native auth shape — is what Mathpix via Locus occupies.

### Similar Services
- **Mathpix Snip / Convert API direct** — Subscription and per-quota tiers; same engine, different access shape.
- **MyScript** — Strong handwriting math recognition; SDK-licensed, enterprise-priced.
- **InftyReader** — Long-standing scientific OCR for math and chemistry; desktop-licensed.
- **Google Vision / AWS Textract / Azure Document Intelligence** — Strong general-purpose OCR; weak on displayed math, matrices, and chemistry.
- **Tesseract / open-source OCR** — Free, but requires custom training to come anywhere near Mathpix on STEM inputs.
- **Adobe Acrobat / generic PDF tools** — Extract text but lose equation structure.

### User Reviews & Market Signal
- Mathpix is consistently cited in developer forums and academic communities as the accuracy leader for math and handwriting OCR.
- Recurring developer feedback: Convert API monthly page quotas force an early upgrade decision; teams want a way to evaluate or run intermittently without committing to a plan.
- AI-agent builders specifically mention friction wiring Mathpix into agent workflows because the auth model assumes a long-lived API key tied to a billing entity.
- Education and research teams value the chemistry and table OCR features but find pricing tiers misaligned with bursty per-user or per-paper workloads.

## Your recommendation
The landing page should lead with the **pay-per-call, no-subscription angle** combined with **full Mathpix STEM accuracy and the agent-native MCP+x402 shape.** Here's why:

1. **Pain point alignment:** The biggest complaints in the category are plan-tier guesswork, monthly page quotas that force premature upgrades, and friction integrating math OCR into autonomous agents. Per-call billing on top of Mathpix's full engine removes all three.

2. **Keyword strategy:** Target "Mathpix API" (high commercial intent, branded) and "image to LaTeX API," "math OCR API," "PDF to LaTeX," and "handwriting equation recognition" (specific intent). The "no subscription" angle directly captures search like "Mathpix API without subscription" and "pay-per-call math OCR."

3. **Conversion reasoning:** Agent builders, indie EdTech makers, and research teams are commitment-averse and price-sensitive. Leading with "pay only for the pages you process" plus "full Mathpix accuracy — no Convert API quota" removes the largest barrier to trial. The agent-native angle differentiates from every other Mathpix path because no other route exposes the engine as an MCP/x402 tool.

4. **Trust signals:** Mathpix is the recognized leader for math, handwriting, and chemistry OCR — used by Overleaf, major textbook publishers, and researchers worldwide. The Locus gateway adds the per-call billing layer without changing the underlying accuracy story.
