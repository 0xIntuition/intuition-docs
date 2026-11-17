---
title: '@0xintuition/pipeline-runtime'
sidebar_label: 'Pipeline runtime'
description: 'Bound Promise work, share cache contracts, handle cancellation, and observe provider requests.'
kind: reference
reader: ["app", "plugin"]
packages: ["@0xintuition/pipeline-runtime"]
---

<AppliesTo />

## What it's for

Promise utilities for bounded concurrency, cancellation, circuit breaking, caching, and provider observation. It supplies shared execution contracts; it does not store a graph or start a processing service.

## When to use it

Use it when a host needs ordered concurrent work or a consistent outcome vocabulary across providers. Use [atom runtime](/docs/reference/packages/atom-runtime) to compose classification and enrichment engines. Effect services and retry layers belong to your application; these functions accept Promise callbacks.

## Install

```sh
npm install @0xintuition/pipeline-runtime@0.1.0
```

Use ESM on Node 20 or newer. The documentation examples run on Node 22.21.0.

## Entry points

<details>
<summary>All public modules</summary>

| Subpath | Purpose |
| --- | --- |
| `.` | Shared errors, provider contracts, test helpers, and TMDB endpoint builder |
| `./bounded-text` | Read streaming response text within a byte limit |
| `./cache` | Cancellable cache contract and memory TTL adapter |
| `./errors` | Shared pipeline error vocabulary |
| `./provider-observer` | Provider observation events and contracts |
| `./provider-metrics-contract` | Metric labels, normalization, and series contract |
| `./retry-after` | Parse and bound retry delays |
| `./letterboxd` | Letterboxd host policy and circuit state |
| `./letterboxd-page` | Parse Letterboxd page identity |
| `./tmdb` | TMDB endpoint policy |
| `./testing/prometheus-exposition` | Validate Prometheus exposition; optional Node tool invocation |
| `./outcome` | Outcome union, cancellation, and timeout helpers |
| `./circuit-breaker` | Circuit breaker, snapshots, and admission errors |
| `./concurrency` | Ordered bounded Promise execution |
| `./provider-metrics-contract.expected` | Expected provider metric series counts |
| `./provider-registry` | Provider definitions and operation contracts |
| `./provider-request-observation` | Observe and record provider requests |
| `./request-slot` | Provider request admission contracts |
| `./testing/provider-golden` | Provider golden-fixture helpers |
| `./testing/held-request-slot` | Controlled request-slot test helpers |
| `./testing/virtual-clock` | Deterministic clock for tests |
| `./provider-metrics` | Alias of the provider metrics contract |

</details>

## Depends on and works with

Runtime package dependencies: none. Peer dependencies: none.

Classification, enrichment, and atom runtime consume these contracts. A memory cache is process-local; an adapter is not a provisioned database. Provider-specific host policies do not replace your application's complete egress policy.

## Example

This fixed input needs no network or credentials. The result keeps input order even when callbacks finish in a different order.

{/* example:start examples/v2/music-catalog/src/package-examples/pipeline.ts#bounded-work */}
```ts
import { forEachBounded } from '@0xintuition/pipeline-runtime/concurrency';

const controller = new AbortController();
export const outcomes = await forEachBounded(
  ['recording', 'artist', 'release'],
  async (label, signal) => {
    signal.throwIfAborted();
    return label.toUpperCase();
  },
  { concurrency: 2, signal: controller.signal },
);

for (const outcome of outcomes) {
  if (outcome.kind === 'success') console.log(outcome.value);
  else console.log(outcome.kind);
}
```
{/* example:end */}

Successful outcomes carry `value`. The full outcome union also includes `failure`, `defect`, `timeout`, and `interrupted`. In `forEachBounded`, a synchronous callback throw is a defect and a returned Promise rejection is a failure. Parent cancellation rejects the batch with its abort reason, prevents queued work, and signals active callbacks; callbacks must honor that signal to stop I/O.

`CircuitBreaker.execute` admits one probe after its reset window. Its failure filter determines whether an admitted failure or cancellation counts toward opening the circuit; cancellation before admission starts no work. Inspect `snapshot()` without changing state.

## Related concepts

[How the pieces fit](/docs/get-started/how-it-fits) places execution helpers beneath the processing stage. [Classify and enrich atoms](/docs/build/classify-enrich) shows the data passed between stages.

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/pipeline-runtime/README.md), [public exports](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/pipeline-runtime/package.json), and [concurrency implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/pipeline-runtime/src/concurrency.ts).
