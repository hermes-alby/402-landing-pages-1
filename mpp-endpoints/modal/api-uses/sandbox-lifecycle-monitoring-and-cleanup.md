# Modal: Sandbox Lifecycle Monitoring And Cleanup API Uses

## What This Endpoint Group Does

This endpoint group controls what happens after a sandbox exists. `/sandbox/status` checks whether work is still running and exposes completion signals such as exit code. `/sandbox/terminate` ends sandbox execution and can optionally wait for an exit code in direct Modal. Together these endpoints are the budget, safety, and cleanup layer around sandboxed execution.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/sandbox/status` | Check sandbox status | `sandbox_id` | `running`, `status`, `returncode` |
| POST | `/sandbox/terminate` | Terminate sandbox compute | `sandbox_id`, `wait` | `terminated`, `returncode` |

## Field Notes

### Inputs

Both endpoints depend on a sandbox identifier returned by `/sandbox/create`. `terminate` may also accept `wait` based on direct Modal's `terminate(wait=False)` signature, but wrapper support is not confirmed.

### Outputs

The useful outputs are status-like signals and `returncode`. Direct Modal's `Sandbox.poll()` returns null while a sandbox is still running and an exit code when it has finished. Direct Modal's `returncode` property similarly returns an integer if finished or null otherwise. Termination can return an exit code when waiting is requested in direct Modal, and Modal examples show manual termination commonly producing exit code 137.

### Important Constraints Or Gaps

The wrapper does not publish a status enum, idempotency guarantees, or error shapes for missing, expired, detached, already-finished, or already-terminated sandbox IDs. Direct Modal says `terminate` is a no-op if the sandbox has already finished, but the wrapper's HTTP response behavior is unknown.

## Use Cases

### Budget Guardrails For Agent Compute

A person can poll status after starting a long-running sandbox task and terminate it when it exceeds their patience or budget. A business can put this behind an agent runtime so every sandbox gets a deadline, status check cadence, and forced cleanup path.

The useful fields are `sandbox_id`, `running`, `status`, `returncode`, and `wait`. Status can tell the controller whether to keep polling, fetch results, retry, or terminate. This matters because the create endpoint can allocate paid compute and Modal Sandboxes can run until their timeout or idle timeout expires if not explicitly cleaned up.

### Human-In-The-Loop Execution Review

A person can start a sandbox task, check status, and decide whether to let it continue or stop it after seeing partial behavior from logs or prior exec results. A business can route high-risk generated code through a review state where status is checked before approval to continue.

This use case needs status and termination signals more than rich output. `returncode` provides an objective completion signal, while `terminate` gives the reviewer or policy engine an enforcement action. The limitation is observability: the wrapper does not document whether status includes start time, elapsed time, resource use, logs, or failure reason.

### Cleanup After Test Or Analysis Completion

A developer can terminate a sandbox immediately after tests, linting, or data analysis completes. A business can make cleanup part of every automation state machine: create sandbox, execute commands, parse outputs, terminate, and record the final exit code.

`returncode` from status or terminate is useful evidence for the final record. `terminated` or successful termination response can drive resource accounting and prevent orphaned sessions. If the wrapper's terminate call is idempotent, callers could safely retry cleanup; that behavior was not documented and should be verified before relying on it.

### Failure Recovery And Retry Routing

When `status` or `returncode` indicates failure, timeout, termination, or unknown state, an agent can decide whether to retry in the same sandbox, create a new sandbox with different resources, or escalate to a human. A business can use this to separate environment failures from user-code failures and avoid blindly rerunning expensive jobs.

The endpoint fields support routing decisions: null returncode implies still running in direct Modal, non-zero returncode implies failure or termination, and status strings could be richer if the wrapper exposes them. Missing fields such as failure reason, OOM flag, and elapsed time limit the sophistication of retry policy.

### Pool Management For Warm Sandboxes

Some products keep a pool of ready sandboxes to reduce startup latency. Status checks can identify available or stale sandboxes; terminate can drain old or unhealthy ones. A person might use this for a local-like remote coding workspace, while a business might use it to serve many short code-interpreter requests quickly.

The direct Modal docs discuss keeping a list of sandbox object IDs and using `from_id` to reconnect. The MPP wrapper's status and terminate endpoints would provide the external lifecycle controls needed for a pool. The gap is that list, tags, and named sandbox support are not exposed in the four MPP endpoints, so pool state would need to live in the caller's own database.

### Incident Stop Switch For Unsafe Generated Code

If generated code starts consuming too much time, reaches forbidden behavior, or produces suspicious output, the controller can terminate the sandbox. A business can tie this to policy checks such as repeated network errors, secret-access attempts, runaway output, or command timeouts.

The important field is `sandbox_id`; the action is explicit cleanup through `/sandbox/terminate`. `wait` and `returncode` can document the final state. This is valuable only as part of a broader safety setup: provisioning must also cap resources and network access, and exec output must be inspected for warning signals.
