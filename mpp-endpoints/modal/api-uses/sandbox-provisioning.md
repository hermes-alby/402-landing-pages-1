# Modal: Sandbox Provisioning API Uses

## What This Endpoint Group Does

This endpoint group covers creating an isolated Modal Sandbox before any command is run. It is the control point for runtime shape: image, entrypoint args, environment, working directory, maximum lifetime, idle timeout, GPU type, CPU, memory, region, network posture, PTY behavior, tunneled ports, and readiness probes. The MPP wrapper does not publish the exact JSON body or response schema, so fields here are derived from Modal's official `Sandbox.create` reference and Sandbox guide.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/sandbox/create` | Create a sandboxed Modal container for code execution | `args`, `image`, `timeout`, `idle_timeout`, `gpu`, `cpu`, `memory`, `env`, `workdir`, `block_network`, `cidr_allowlist`, `encrypted_ports`, `readiness_probe` | Sandbox identifier, possible `returncode`, possible tunnel metadata |

## Field Notes

### Inputs

The highest-value inputs are the fields that directly govern safety, cost, and fit for the workload. `gpu`, `cpu`, and `memory` decide whether the sandbox can run a model, test suite, or data job efficiently. `timeout` and `idle_timeout` cap how long compute can remain active. `image`, `args`, `env`, and `workdir` define the runtime and startup command. `block_network`, `cidr_allowlist`, `include_oidc_identity_token`, and secrets-related fields matter for security boundaries. `readiness_probe` and tunneled ports matter when a sandbox must start a server before later commands or HTTP/WebSocket access.

### Outputs

The key output is the sandbox identifier. Direct Modal exposes `.object_id` in Python and `sandboxId` in JavaScript examples; the MPP response field name is not published. Creation may also expose `returncode` if an entrypoint exits and tunnel metadata if port tunneling is requested, but this is not confirmed for the wrapper.

### Important Constraints Or Gaps

Modal's direct docs say Sandboxes default to a 5 minute maximum lifetime and can be configured up to 24 hours. CPU and memory default to 0.125 physical CPU cores and 128 MiB, with billing based on the higher of requested or actual usage. GPU choices include T4 through B200/B200+, with counts and availability varying by type. The MPP metadata says `/sandbox/create` has dynamic pricing, and the well-known metadata says it varies by GPU and timeout, but no formula or schema was found.

The wrapper schema for Modal objects such as App, Image, Secret, Volume, Proxy, and Probe is unknown. Use cases that depend on those fields should treat them as requirements to verify before implementation.

## Use Cases

### Disposable Code Interpreter Sessions

A person can create a short-lived sandbox with a small CPU/memory request, a known Python image, a tight `timeout`, and `block_network` enabled to evaluate generated code, solve data problems, or run notebook-like snippets without exposing their local machine. A business can use the same pattern to power an embedded code interpreter for support analysts, data analysts, or internal agents while bounding runtime and avoiding persistent worker pools.

The fields that make this valuable are `image`, `timeout`, `idle_timeout`, `cpu`, `memory`, `workdir`, `env`, and network controls. The returned sandbox identifier becomes the handle for subsequent `/sandbox/exec` calls. The missing dependency is the wrapper's exact body schema and whether it supports network-blocking and image selection.

### Agent Workspace Provisioning

An agent platform can create one sandbox per task, repository, customer ticket, or pull request, using `name` or a future wrapper equivalent to avoid duplicate active sandboxes. `image`, `env`, `workdir`, and startup `args` can prepare a predictable workspace, while `idle_timeout` cleans up sessions that stop receiving commands.

For a business, this supports scalable coding agents or data agents that need isolated task state. The sandbox identifier lets a queue worker route later exec/status/terminate calls to the right environment. The direct Modal docs also mention tags and named sandboxes, but the MPP wrapper does not confirm support for those fields, so production designs should not rely on names or tags until verified.

### GPU Trial Runs Without Modal Account Setup

A developer can request a GPU such as `L40S`, `A100`, `H100`, or `B200` for a one-off model compatibility test, model conversion, small inference run, or CUDA library check. A business can use the same pattern for procurement or benchmarking workflows that need a quick answer before committing to a workspace, subscription, or larger deployment path.

The relevant fields are `gpu`, optional GPU count syntax in direct Modal, `image`, `timeout`, `cpu`, and `memory`. The value is not just access to GPU compute; it is the ability to pay per wrapped request and keep setup friction low. The caveat is cost risk: MPP create pricing is dynamic by GPU and timeout, and Modal's direct GPU docs warn that larger or scarce GPUs can increase wait time and may be more expensive than needed.

### Secure Repository Test Environments

A person can create a sandbox with a language/runtime image and then run repository tests through later exec calls. A business can attach this to CI triage, candidate coding assessments, security review, or pull-request bots that need to run untrusted code outside developer laptops and production CI.

`image`, `workdir`, `env`, `timeout`, `memory`, `cpu`, `block_network`, and `cidr_allowlist` are the key provisioning fields. If the wrapper exposes file access or repository checkout through startup args, it could prepare state before command execution. If it does not, the workflow would need a separate code-transfer mechanism, which is not documented in the MPP metadata.

### Sandboxed Web Service Bootstrapping

Some tasks need a process that stays up: a local API server, Jupyter-like kernel, browser automation server, or preview app. Modal's direct `Sandbox.create` supports entrypoint `args`, ports, tunnel metadata, custom domains, and readiness probes. A person can spin up a temporary app for inspection; a business can provision per-customer preview environments or agent-controlled tools.

The important fields are `args`, `encrypted_ports`, `h2_ports`, `unencrypted_ports`, `custom_domain`, `readiness_probe`, `timeout`, and `idle_timeout`. Readiness probes prevent later automation from racing a server that is still starting. The wrapper gap is large here: tunnel and readiness-probe response shapes were not published, so this is a strong use case only if the MPP wrapper preserves those Modal features.

### Controlled Network Execution

A person may want generated code to run without arbitrary internet access. A business may need the same for compliance, exfiltration control, or safe plugin execution. Provisioning with `block_network` or `cidr_allowlist` can turn a generic sandbox into a more governed execution surface.

The useful data is in the network-related inputs: `block_network`, `cidr_allowlist`, plus the absence or presence of secrets and OIDC identity. This can support decisions such as whether a task is safe to execute automatically or must go through human review. The MPP wrapper has not documented these controls, so this use case should be treated as conditional until tested through non-mutating docs or official wrapper schema.
