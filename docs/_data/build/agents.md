---
title: 'Agent integration contract'
slug: /build/agents
sidebar_position: 8
---

Start a coding agent with a specific outcome, the release manifest, and the relevant recipe. A package export or an example endpoint must not be inferred from a marketing description.

## Read in this order

1. [Compatibility and source manifest](./compatibility.md).
2. [System boundaries](./architecture.md) and [identity semantics](./concepts.md).
3. [Package map](./packages/index.md), then the selected guidebook.
4. The recipe and its [SDK function signatures](./sdk-reference/api.md), if used.

Machine-readable entrypoints: [release manifest](/intuition-release.json), [documentation index](/llms.txt), and [complete documentation text](/llms-full.txt). The manifest records source versions and public package subpaths, not a registry publication assertion.

## Copyable task brief

```text
Build an offline Intuition recording-anchor preview.
Read /docs/build/compatibility and /docs/build/guides/first-atom.
Use the manifest's exact package versions and public exports.
Input: an ISRC and optional context URIs.
Output: canonical IID, selected profile, data, dataHex, atom ID, and errors.
Do not submit API writes or transactions for this preview.
Verify equivalent ISRC spellings produce the same anchor.
Verify changing only context URIs does not change the P0 atom ID.
Preserve BuildResult failures and nullable fallback identity metadata.
Report the installed versions, checks, and any release prerequisite.
```

For a persistence task, add the target Core URL, credential injection mechanism, allowed inputs, and expected readback. For a transaction task, add chain ID, supported deployment revision, signer, receiver, maximum value, minimum output, and explicit authorization policy.

## Invariants to preserve

- An IID string is not a bytes32 term ID. Derive bytes through the canonical builder.
- Do not reconstruct envelope key order, schema context, salts, or predicate payloads manually.
- URI context and provider artifacts do not silently alter anchor identity.
- `classifications` owns semantic specs; `atom-classification` executes plugins.
- `iid-registry` returns a provider plan; it does not fetch data.
- `createIntuitionApiClient` uses the hosted GraphQL contract, not Core REST.
- Preparing a transaction is distinct from submitting it. `feeProxyExecutePlan` submits.
- An off-chain Core write, a successful receipt, and an indexed record are separate outcomes.
- Main-app internal packages and routers are not public integration APIs.
- A missing package version is a release prerequisite. Do not silently fall back to SDK v3 or fabricate an import.

## Verification contract

For offline code, assert deterministic outputs and structured error handling. For HTTP adapters, use fixtures for success, absent data, auth rejection, processing failures, and timeouts. Typecheck against the exact release dependencies. For approved live qualification, record the environment, chain/deployment, versions, receipt where applicable, and bounded readback.

Never count a prose snippet as executed evidence. Report source inspection, compilation, mocked tests, and live behavior separately. Keep unresolved compatibility questions explicit in the handoff.

## Handoff template

```text
Outcome and supported workflow:
Package versions and manifest source commit:
API contract / network / deployment:
Inputs and canonical identity decisions:
Checks actually performed:
Expected output and failure behavior:
Unverified behavior or release prerequisites:
Next action:
```
