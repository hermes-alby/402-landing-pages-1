# Perplexity: Vector Embeddings And RAG API Uses

## What This Endpoint Group Does

This group converts text into compact encoded vector representations for semantic retrieval. Standard embeddings are for independent texts, search queries, and standalone sentences. Contextualized embeddings are for ordered chunks from the same document, where each chunk benefits from document-level context.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/perplexity/embed` | Generate embeddings for independent text strings. | `model`, `input`; official provider also supports `dimensions`, `encoding_format` | `data[].embedding`, `data[].index`, `model`, `usage.prompt_tokens`, `usage.total_tokens`, `usage.cost` |
| POST | `/perplexity/context-embed` | Generate document-aware embeddings for chunks. | MPP docs: `model`, `document`, `chunks`; official provider: `model`, nested `input`, plus `dimensions`, `encoding_format` | `data[].index`, `data[].data[].embedding`, `data[].data[].index`, `model`, `usage` |

## Field Notes

### Inputs

For `/perplexity/embed`, `model` and `input` are required. Official model choices are `pplx-embed-v1-0.6b` and `pplx-embed-v1-4b`. Official docs allow `input` as a string or array of strings, with up to 512 texts, 32K tokens per input, 120,000 tokens per request, and no empty strings.

For `/perplexity/context-embed`, MPP docs list `model`, `document`, and `chunks`. Official Perplexity docs instead use `input` as nested arrays, where each inner array contains ordered chunks from one document. Official context model choices are `pplx-embed-context-v1-0.6b` and `pplx-embed-context-v1-4b`.

Official optional fields for both embedding families include `dimensions` for Matryoshka dimensionality reduction and `encoding_format` with `base64_int8` or `base64_binary`. These optional fields are not listed in the inspected MPP docs.

### Outputs

Standard embedding responses return `data[]` objects with `index` and `embedding`. Contextualized responses return `data[]` document groups with `index` and nested `data[]` chunk embeddings. Embeddings are base64 strings, not numeric arrays. Consumers must decode them to signed int8 arrays or packed binary before similarity search. Usage fields report token counts and, in official schemas, cost fields such as `input_cost`, `total_cost`, and `currency`.

### Important Constraints Or Gaps

The contextualized MPP request shape differs from the official provider shape. The likely purpose is a wrapper convenience layer, but this was not verified with a paid call. The MPP OpenAPI has no detailed 200 response schemas. Chunk ordering matters for contextual embeddings; official docs warn that chunks within each document must be sent in source order.

## Use Cases

### Personal Knowledge Search

A person can embed notes, saved articles, bookmarks, or research snippets with `/perplexity/embed`, store decoded vectors in a local vector index, and retrieve related material by embedding a new query. `data[].index` maps each embedding back to the original input text, and `usage.total_tokens` helps understand processing cost.

For businesses, this is the foundation for internal knowledge search over help docs, policies, sales notes, and meeting summaries. The endpoint is valuable because embeddings are reusable: once stored, downstream queries can be answered without reprocessing every document. Sensitive internal content should be reviewed against the provider and MPP wrapper privacy posture before use.

### Document-Aware RAG For Long Reports

An individual working with long PDFs, papers, or manuals can chunk a document and use contextualized embeddings so each chunk is represented with awareness of neighboring chunks. This improves retrieval when a chunk uses pronouns, section-local terms, or references that only make sense in the full document.

A business can apply the same pattern to contracts, policies, analyst reports, technical manuals, or regulatory filings. `chunks` or official nested `input` order matters: preserving source order helps the model encode document context. The result is a better retrieval layer for RAG systems that need to cite the right section rather than just the right document.

### Semantic Deduplication And Clustering

A person can embed a collection of saved snippets or notes and cluster near-duplicates to clean up a personal archive. Base64 embeddings must be decoded before similarity scoring, and smaller `dimensions` may reduce storage if the wrapper supports official optional fields.

Businesses can use embeddings to deduplicate support tickets, group similar feedback, cluster sales calls, or identify repeated incident reports. The output does not directly label clusters; the value comes after vectors are stored and compared. Teams should keep original text IDs alongside `data[].index` because embeddings alone are not human-readable.

### Query Expansion And Hybrid Search

A user can embed natural-language queries and documents, then combine vector similarity with keyword filters or metadata. This helps find semantically related material even when exact words differ.

A business can add this to an existing search system without replacing it: use keyword search for precision and Perplexity embeddings for semantic recall. The fields that matter are model choice, dimensions, encoding format, and the returned embedding strings. The organization needs a vector database or similarity engine; the endpoint only creates vectors.

### Recommendation And Matching Workflows

An individual can match resumes to job descriptions, projects to interests, or reading lists to goals by embedding each text and comparing vectors. The index field maps returned vectors back to the input items.

Companies can use the same pattern for content recommendation, lead-to-case-study matching, support article suggestions, or candidate-to-role triage. Embeddings are useful when the matching criterion is semantic similarity rather than exact fields. The workflow should include human review for high-stakes matching decisions and should not infer protected attributes from text.

### Cost-Optimized Vector Storage

The official embedding APIs support compact INT8 and binary encodings. A person building a small local index can choose lower-dimensional or binary representations, if supported by the wrapper, to reduce storage.

For businesses with large corpora, `dimensions` and `encoding_format` can materially affect index size, retrieval latency, and recall. The 0.6b models are lower-dimensional and lower-cost; 4b models provide larger vectors. Since the MPP docs omit these optional controls, a production workflow should first verify wrapper passthrough behavior through approved testing before relying on them.
