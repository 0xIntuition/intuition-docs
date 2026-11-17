---
title: "Atom runtime and pipelines"
sidebar_label: "Atom runtime and pipelines"
description: "Compose parsing, classification and enrichment with reusable engines, bounded concurrency, circuit breakers and explicit cleanup."
kind: concept
reader: ["app", "plugin", "operator"]
packages: ["@0xintuition/atom-runtime", "@0xintuition/pipeline-runtime"]
depends_on: ["atom-classification", "enrichment"]
---

<AppliesTo />

An atom runtime supplies configured classification and enrichment engines for a host application. The host can parse inputs, pass the results through those engines, and choose when to cache, cancel, or retry work. Pipeline helpers bound concurrent requests and isolate repeated provider failures. Core adds the workers and durable records a self-hosted node needs.

**Builds on:** [Atom classification](/docs/concepts/atom-classification), [Enrichment](/docs/concepts/enrichment).

**Implemented by:** [@0xintuition/atom-runtime](/docs/reference/packages/atom-runtime), [@0xintuition/pipeline-runtime](/docs/reference/packages/pipeline-runtime).

## How it works

Choose the plugins, provider credentials, cache adapter, and time limits for a workload. Parse the input under your network policy. Use classification and identifier hints to select the next stage when enough evidence is available. The runtime reuses its classification engine and caches enrichment engines by preset and identity capability. A memory cache belongs to the process. [Atom runtime](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/README.md), [engine lifecycle](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/runtime.ts).

Use bounded concurrency when processing independent inputs. `forEachBounded` returns outcomes in input order even when callbacks finish in a different order. A circuit breaker wrapped around a provider call can refuse new work after a failure threshold. After its reset interval, it admits one probe. A successful probe closes the circuit. [Pipeline runtime](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/pipeline-runtime/README.md), [circuit breaker](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/pipeline-runtime/src/circuit-breaker.ts).

## Example

Suppose a catalog queues a recording, an artist, and a release with a concurrency limit of two. The recording and artist can start together. If the artist finishes first, the release can start while the recording is still running. The caller still receives the recording's outcome first in the result array. It can retain the artist's successful outcome even if the recording's callback rejected. [Bounded catalog example](/docs/reference/packages/pipeline-runtime).

If the caller cancels the import, the parent abort signal stops queued work and signals active callbacks. Each callback must pass the signal to its underlying I/O. During shutdown, abort or finish outstanding work, then call `dispose()` on the runtime. Disposal prevents future engine lookups. An engine reference already held by a callback can outlive it. [Runtime example](/docs/reference/packages/atom-runtime).

## Common mistakes

- Creating a new runtime per row. This discards the opportunity to reuse engines and their caches across the batch.
- Assuming a timeout or disposal stopped a provider request that ignored cancellation. Forward the request signal and check the outcome.
- Treating a cached classification as a durable graph record. Core workers claim stages and persist their results separately. [Core architecture](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/architecture.md).

## Next

[Indexing and querying](/docs/concepts/indexing-and-querying) follows chain events and processing results into a Core node's Query API.
