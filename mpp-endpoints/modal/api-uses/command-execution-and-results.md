# Modal: Command Execution And Results API Uses

## What This Endpoint Group Does

This endpoint group runs commands inside an existing Modal Sandbox and returns process evidence. Modal's direct `Sandbox.exec` API returns a `ContainerProcess` with stdout, stderr, stdin, returncode, poll, and wait behavior. The MPP wrapper does not publish the exact JSON contract, so the field list is centered on the official Modal docs and marked as docs-derived where wrapper behavior is unknown.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/sandbox/exec` | Execute a command in a sandbox | `sandbox_id`, `args`, `timeout`, `workdir`, `env`, `stdin`, `stdout`, `stderr`, `text`, `bufsize`, `pty` | `process_id`, `stdout`, `stderr`, `returncode`, `status` |

## Field Notes

### Inputs

The core input is `args`: the command and arguments to run. `sandbox_id` binds the command to a provisioned environment. `timeout` prevents runaway commands. `workdir` and `env` make runs reproducible. `stdin` would enable interactive or data-fed commands if the wrapper supports it; direct Modal exposes stdin through a `StreamWriter`. `stdout`, `stderr`, `text`, `bufsize`, and `pty` affect how output is handled.

### Outputs

The valuable outputs are `stdout`, `stderr`, and `returncode`. They let a caller distinguish success, test failure, syntax error, runtime error, timeout, and partial progress. A `process_id` or `status` may be exposed by the wrapper, but no public schema confirms this. Direct Modal's `ContainerProcess.poll()` returns null while running and an exit code after completion.

### Important Constraints Or Gaps

No public wrapper schema confirms whether `/sandbox/exec` is synchronous, asynchronous, streaming, or inline-output only. It also does not publish output truncation limits, stdin encoding, timeout error shape, or how stdout/stderr are represented. Direct Modal docs say PTY mode multiplexes stdout and stderr into stdout, which can matter for parsers.

## Use Cases

### AI Code Interpreter Execution

A person can send generated Python, shell, Node.js, or data-analysis commands into a sandbox and use `stdout`, `stderr`, and `returncode` to decide whether the result is trustworthy. A business can embed this in an AI assistant so the model can test calculations, inspect files, run transformations, or verify assumptions before answering a customer or analyst.

The endpoint fields directly drive the workflow: `args` carries the command, `timeout` limits execution, `workdir` anchors state, and outputs provide the evidence. `stderr` and non-zero `returncode` can trigger automatic repair loops. This is high value because it turns natural-language intent into verified execution rather than untested code generation.

### Repository Test And Lint Runs

A developer can run `pytest`, `npm test`, `ruff`, `eslint`, or build commands in an isolated sandbox after code has been checked out or copied in. A business can use this to triage pull requests, evaluate coding-agent patches, or run pre-screening checks on untrusted submissions without granting access to its main CI system.

The important fields are `sandbox_id`, `args`, `timeout`, `workdir`, `env`, `stdout`, `stderr`, and `returncode`. The returned output can be parsed into pass/fail, failing test names, stack traces, or missing dependency signals. The missing dependency is file transfer or repository setup: this endpoint executes commands but the retrieved MPP docs do not publish how code is uploaded into the sandbox.

### Data Transformation And Validation Jobs

A person can run short scripts over uploaded or preloaded data to validate schemas, compute summaries, or convert formats. A business can use the same endpoint for on-demand ETL checks, customer data validation, spreadsheet normalization, or small feature-engineering tasks before moving work to a durable pipeline.

`stdin` would be useful for passing small data payloads if supported, while `workdir`, `env`, and `args` define the script context. `stdout` can carry JSON summaries or transformed results, `stderr` can carry validation failures, and `returncode` can gate whether the output is accepted. Output-size limits are unknown, so large datasets or artifacts should use a documented file/storage mechanism instead of inline stdout.

### Model And Dependency Smoke Tests

A developer can execute a quick import, CUDA availability check, model load, or inference probe inside a GPU-backed sandbox. A business can run acceptance checks before selecting an image, model version, or GPU type for a larger deployment.

The value comes from pairing provisioning fields from `/sandbox/create` with `/sandbox/exec` outputs. A command such as a CUDA probe, package import, or one-batch inference returns stdout/stderr and an exit code that can decide whether to continue, fall back to another GPU, or rebuild the image. The caveat is cost: GPU-backed sandboxes and repeated exec calls can incur MPP and Modal-backed compute charges.

### Automated Error Repair Loops

An agent can run code, inspect `stderr`, modify the code, and run again until `returncode` is zero or a retry budget is exhausted. A business can use this to make coding agents less speculative: every patch, SQL transformation, or generated script can be tested in the same isolated runtime.

`stderr`, `stdout`, `returncode`, and `timeout` are the control signals. The output tells the agent whether the failure was syntax, dependency, test assertion, timeout, or environment mismatch. Strong governance still requires sandbox creation limits and explicit cleanup, because repeated failing executions can create cost and security exposure.

### Safe Customer-Supplied Script Evaluation

A product can allow customers to submit formulas, transformation scripts, or plugins and evaluate them in an isolated sandbox. For businesses, this supports extensible workflows without running customer code on shared application servers.

`args` and `stdin` or files would carry the script and input data, while `timeout`, `env`, and output streams determine whether the script behaved correctly. `returncode` enables deterministic accept/reject decisions. This is only safe if provisioning also enforces network restrictions, resource caps, and secret isolation; the exec endpoint alone cannot provide those guarantees.

### Operational Runbooks On Ephemeral Infrastructure

A person can run a one-off diagnostic command in a prepared sandbox instead of installing tooling locally. A business can encode safe runbooks as commands that execute in isolated Modal infrastructure, producing stdout/stderr evidence for incident tickets or automation logs.

Useful fields include `args`, `env`, `timeout`, `workdir`, and `returncode`. The endpoint can support automation such as "collect environment report", "validate a dependency chain", or "render a small artifact". It is not a replacement for privileged production operations unless credentials, networking, audit, and policy controls are documented and deliberately configured.
