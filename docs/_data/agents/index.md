---
title: "Build with AI agents"
sidebar_label: "Build with AI agents"
description: "Give agents pinned sources, a clear reading order, identity invariants, and a human review boundary for protocol execution."
kind: concept
reader: ["agent"]
packages: ["@0xintuition/cli", "@0xintuition/sdk"]
---

<AppliesTo />

Start an agent with a concrete outcome, the release manifest, and the relevant recipe. Have it produce data for review or an unsigned plan, then verify the result against the pinned public APIs.

## Read in this order

1. [Versions and release status](/docs/get-started/versions), then [compatibility](/docs/reference/compatibility).
2. [How the pieces fit](/docs/get-started/how-it-fits) and the [concept map](/docs/concepts).
3. [Package reference](/docs/reference/packages), selecting only the packages needed for the task.
4. [Offline quickstart](/docs/get-started/quickstart), [action plans](/docs/build/action-plans), or [Core queries](/docs/build/query-core), according to the requested outcome.
5. [SDK signatures](/docs/reference/sdk) for any action used.

[Install the agent skills](/docs/agents/skills) for contract-level context. Machine-readable inputs are the [release manifest](/intuition-release.json), [V2 documentation index](/llms.txt), and [complete V2 text](/llms-full.txt). Keep generations separate; the [V1 index](/docs/v1/llms.txt) describes the older codebases.

## Invariants to preserve

- **Never sign or submit without human review.** Show the chain, destination, signer, receiver, calldata, value, and limits before execution.
- **Persist deterministic IDs and their exact bytes.** An IID is not a bytes32 term ID; do not substitute one for the other or rebuild historical data under a new profile.
- **Pin package versions and public entry points.** Commit the lockfile and report installed versions; publication does not prove deployment compatibility.
- Preserve structured errors, missing records, unknown classifications, and partial provider results.
- Keep companion context and provider observations separate from atom identity. Changing JSON-LD inside the atom changes its bytes.
- Keep proposals separate from accepted graph edges. Fields and relationship suggestions do not automatically create triples.
- Treat a plan, an RPC read, submission, a receipt, and indexed visibility as different operations.

## Copy a task brief

```text
Build an offline recording-anchor preview.
Read /docs/get-started/quickstart, /docs/concepts/representation-profiles, and /docs/reference/packages/primitives.
Use exact versions and public exports from /intuition-release.json.
Input: an ISRC and optional companion context URIs.
Output: IID, profile, exact data, dataHex, atom ID, or structured errors.
Preserve nullable builder fields; narrow success and guard a null IID before requiring a string.
A profile label alone does not establish different bytes or IDs.
Assert equivalent ISRC spellings produce the same P0 bytes and ID.
Assert changing companion context URIs preserves those bytes and ID.
Keep the golden ISRC fixture separate from synthetic music-catalog records.
Do not submit API writes or transactions for this preview.
Report checks actually performed and unverified behavior.
```

For persistence, specify the Core node, API contract, authentication policy, and allowed mutations. For transactions, additionally specify the supported deployment, signer, receiver, maximum value, minimum output, and authorization boundary. A client-free envelope takes read context from the caller; it cannot establish that the supplied state is current.

## Verification and handoff

Compile against exact isolated dependencies. For offline code, assert canonical outputs and failure handling. For adapters, use fixtures for absent data, authentication failures, timeouts, and partial processing. Keep source inspection, compilation, mocked tests, and live results distinct; never describe an unexecuted snippet as a successful transaction.

```text
Outcome:
Every used package → exact manifest version and public entry point; package source revision; installed versions only if checked:
API contract / chain / deployment:
Stored identity and representation decisions:
Checks actually performed:
Expected results and handled failures:
Unverified behavior:
Next action:
```

Source: [SDK action envelopes](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/docs/action-plans.md).
