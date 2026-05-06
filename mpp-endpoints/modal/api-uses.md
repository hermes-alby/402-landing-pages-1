# Modal API Uses

## Service Summary

Modal is a serverless compute platform for running Python code, AI/ML workloads, GPU inference, batch jobs, web endpoints, and secure Sandboxes. The MPP service exposes a narrow Modal Sandbox workflow: create a sandbox, execute commands in it, check status, and terminate it. This is most useful when a user or agent needs isolated, paid-per-use compute without setting up a direct Modal account, workspace billing, API credentials, or long-lived deployment.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Sandbox Provisioning | 1 | Create an isolated runtime with chosen image, resource, GPU, lifecycle, network, and readiness settings. | [`api-uses/sandbox-provisioning.md`](api-uses/sandbox-provisioning.md) |
| Command Execution And Results | 1 | Run commands in a sandbox and use stdout, stderr, and exit status as execution evidence. | [`api-uses/command-execution-and-results.md`](api-uses/command-execution-and-results.md) |
| Sandbox Lifecycle Monitoring And Cleanup | 2 | Poll running/completed state and terminate compute to control cost, safety, and cleanup. | [`api-uses/sandbox-lifecycle-monitoring-and-cleanup.md`](api-uses/sandbox-lifecycle-monitoring-and-cleanup.md) |

## Highest-Value Uses

The strongest use case is a safe code-interpreter or coding-agent runtime. `/sandbox/create` provides a disposable environment, `/sandbox/exec` runs generated code or test commands, `/sandbox/status` lets a controller track completion, and `/sandbox/terminate` closes the loop so compute is not left running.

The second strongest use is isolated validation of untrusted code, repositories, or customer scripts. Businesses can run tests, linters, schema checks, transformations, or small model probes away from developer laptops and production systems, then make decisions from stdout, stderr, and return code.

The third strongest use is frictionless GPU or dependency smoke testing. Modal's direct docs expose GPU choices from T4 through B200/B200+ and resource controls for CPU/memory; an MPP wrapper can make one-off trials easier for agents or users who do not want a full direct provider setup.

## Personal Use Opportunities

A person can use Modal MPP as a disposable remote code interpreter for generated code, Python snippets, small data analysis, dependency checks, and GPU compatibility tests. The important fields are `args`, `image`, `gpu`, `cpu`, `memory`, `timeout`, `workdir`, `stdout`, `stderr`, and `returncode`.

The main personal benefit is avoiding local setup and reducing risk from untrusted code. The main caveat is that paid compute can still run until timeout or termination, and the exact wrapper schema for files, stdin, output limits, and network controls is not public.

## Business Use Opportunities

Businesses can embed this API surface into AI coding platforms, customer-support agents, candidate coding assessments, CI triage, data validation tools, model-procurement checks, and sandboxed plugin systems. The value comes from pairing isolated runtime provisioning with machine-readable execution results and explicit cleanup.

The highest-leverage business pattern is a state machine: create sandbox with resource/network policy, execute one or more commands, parse stdout/stderr/returncode, poll or retry when needed, then terminate and record the outcome. That pattern supports automation while preserving evidence for audit, billing, and debugging.

## Endpoint Group Summaries

### Sandbox Provisioning

[`Sandbox Provisioning`](api-uses/sandbox-provisioning.md) covers `/sandbox/create`. It defines the runtime and risk envelope before any command runs: image, entrypoint, environment, timeout, idle timeout, GPU, CPU, memory, region, network controls, ports, and readiness. This group is where callers control cost and safety.

### Command Execution And Results

[`Command Execution And Results`](api-uses/command-execution-and-results.md) covers `/sandbox/exec`. It is the work-producing endpoint: run a command, collect stdout/stderr, and inspect return code. This supports code interpreters, repository tests, data transformations, dependency checks, smoke tests, and automatic repair loops.

### Sandbox Lifecycle Monitoring And Cleanup

[`Sandbox Lifecycle Monitoring And Cleanup`](api-uses/sandbox-lifecycle-monitoring-and-cleanup.md) covers `/sandbox/status` and `/sandbox/terminate`. It is the control layer for budget, safety, retries, and cleanup. Status and return codes drive decisions; termination prevents abandoned compute from continuing until timeout.

## Field And Data Themes

The surface is small but powerful because the fields map to compute control and execution evidence:

- Runtime fields: `args`, `image`, `workdir`, `env`, `stdin`.
- Resource fields: `gpu`, `cpu`, `memory`, `timeout`, `idle_timeout`.
- Safety fields: `block_network`, `cidr_allowlist`, `secrets`, `include_oidc_identity_token`, `pty`.
- Result fields: `stdout`, `stderr`, `returncode`, `status`, `process_id`.
- Lifecycle fields: `sandbox_id`, `running`, `terminated`, `wait`.
