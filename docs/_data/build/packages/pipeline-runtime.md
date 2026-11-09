---
title: '@0xintuition/pipeline-runtime'
sidebar_label: 'Pipeline runtime'
slug: /build/packages/pipeline-runtime
sidebar_position: 14
---

Use dependency-free Promise utilities for bounded concurrency, cancellation, circuit breaking, cache contracts, and provider observation. This package is ESM-only and requires Node 20+. It does not start a pipeline or depend on Effect.

## Install

```sh
npm install @0xintuition/pipeline-runtime@0.1.0-alpha.0
```

## Bound work and keep input order

```ts
import { forEachBounded } from '@0xintuition/pipeline-runtime/concurrency';

const controller = new AbortController();
const outcomes = await forEachBounded(
  ['first', 'second', 'third'],
  async (value, signal) => {
    signal.throwIfAborted();
    return value.toUpperCase();
  },
  { concurrency: 2, signal: controller.signal },
);
console.log(outcomes);
```

The result retains input order. Synchronous callback throws become `defect`; Promise rejections become `failure`. Parent cancellation stops queued work, signals active callbacks, and rejects with the parent's abort reason. Callbacks must honor the signal to stop underlying I/O.

## Select a public module

| Subpath                                                                                                  | Purpose                                                                                                                        |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `/outcome`                                                                                               | `Outcome`, `toOutcome`, lazy `runWithSignal`, and `withTimeout`                                                                |
| `/concurrency`                                                                                           | Ordered `forEachBounded` execution                                                                                             |
| `/circuit-breaker`                                                                                       | `CircuitBreaker`, snapshots, failure thresholds, reset windows, and a single half-open probe                                   |
| `/cache`, `/bounded-text`, `/retry-after`                                                                | Cancellable cache contracts, bounded response bodies, and retry-delay parsing                                                  |
| `/errors`                                                                                                | Shared pipeline error vocabulary                                                                                               |
| `/provider-observer`, `/provider-request-observation`, `/provider-metrics-contract`, `/provider-metrics` | Provider request events, metric labels, and recording helpers                                                                  |
| `/provider-registry`, `/request-slot`                                                                    | Provider definitions and request-slot contracts                                                                                |
| `/letterboxd`, `/letterboxd-page`, `/tmdb`                                                               | Provider-specific host and endpoint policy                                                                                     |
| `/testing/*`                                                                                             | Published golden-fixture, held-slot, virtual-clock, and Prometheus test helpers; use only the explicit exports in the manifest |

`Outcome` distinguishes `success`, `failure`, `defect`, `timeout`, and `interrupted`. Handle each variant according to your retry/presentation policy. Circuit-breaker snapshots and `refusesRequests()` are read-only; cancellation before admission starts no work. Cancellation after admission passes through the configured failure filter.

The package has no `/services` or `/retry` Effect layers. Existing applications using Effect `Exit`, `Cause`, or service Layers must retain a consumer adapter or rewrite those calls to Promise callbacks. See [migration](../migration.md).

## Source and release

[Package source and README](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/pipeline-runtime) · [npm version](https://www.npmjs.com/package/@0xintuition/pipeline-runtime/v/0.1.0-alpha.0). The [release manifest](/intuition-release.json) records all public subpaths and integrity.
