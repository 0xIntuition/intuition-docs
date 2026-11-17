---
title: Read the graph from Core's Query API
sidebar_label: Read the graph from Core's Query API
description: Read atoms, triples, and predicates from a local Core node with a typed client that checks HTTP errors, pagination, and response data.
kind: tutorial
reader: ["app", "operator"]
packages: []
---

**Time:** 15 minutes · **Steps:** 3

## What you'll build

A Node CLI that reads one page of atoms, one page of triples and the predicate catalog from your own Core node. It prints the number of rows returned and the first record from each collection. Those records expose the atom's processing status, the three terms of a directed claim, and the predicate's human-readable label.

## Before you start

Use Node 22.21.0 and [the pinned example dependencies](/docs/build/install). Fork and build Core at `a402f880600f92969dc8fb013ca0f69fc9a02420` using [Query a Core node](/docs/build/query-core). Run the CLI on the host with the API at `http://localhost:3000` and the default `public-read` policy. An empty local database is enough to test the client. To read on-chain terms, enable indexing for your deployment and allow projections to catch up. [Pinned Core setup](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/run-your-own-node.md).

## Steps

### 1. Get the complete client

Run these commands in a new directory. The docs checkout contains the client, its CLI and offline tests. Keep the terminal at the docs repository root for the remaining commands.

```sh
git clone https://github.com/0xIntuition/intuition-docs.git
cd intuition-docs
git switch --detach bb420395aff3432f1f5da08cb76ac75a99945bff
npm ci --prefix examples/v2 --ignore-scripts
```

### 2. Identify the fields your application needs

Atom rows carry the on-chain flag and parse status. Triple rows name the subject, predicate and object in that order. A catalog row supplies a string slug and label plus a description that can be `null`. The two paginated endpoints report the number of rows in this response. The predicate endpoint returns a single `data` array. [Response schemas](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/openapi.yaml).

{/* example:start examples/v2/core-query-api/src/query-client.ts#row-types */}
```ts
type Atom = { id: string; isOnchain: boolean; parseStatus: string };
type Triple = {
  id: string;
  subjectId: string;
  predicateId: string;
  objectId: string;
};
type Predicate = {
  id: string;
  slug: string;
  label: string;
  description: string | null;
};
type Page<T> = {
  data: T[];
  pagination: { limit: number; offset: number; count: number };
};
```
{/* example:end */}

### 3. Request the three collections

`readGraph` uses a shared five-second deadline and requests ten atoms and ten triples at offset zero. Each response passes through an HTTP status check and a bounded JSON reader. The decoders check the fields in the types above, the requested pagination, and the number of rows returned. The client caps each body at 1 MiB and each predicate catalog at 2,048 rows. A schema mismatch or oversized response fails the CLI.

{/* example:start examples/v2/core-query-api/src/query-client.ts#list-queries */}
```ts
export async function readGraph() {
  const options: RequestInit = {
    method: 'GET',
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
  };
  const atoms = page(
    await readJson(
      fetch('http://localhost:3000/api/atoms?limit=10&offset=0', options),
    ),
    atom,
  );
  const triples = page(
    await readJson(
      fetch('http://localhost:3000/api/triples?limit=10&offset=0', options),
    ),
    triple,
  );
  const catalog = record(
    await readJson(fetch('http://localhost:3000/api/predicates', options)),
  );
  const predicates = rows(catalog.data, 2048, predicate);
  return { atoms, triples, predicates };
}
```
{/* example:end */}

Atom and triple IDs can connect rows across requests. These reads happen separately, so concurrent indexing can update the graph between calls. When loading more rows, apply `offset` only to atoms and triples. Core also supports the triple filters `subject_id`, `predicate_id` and `object_id`. [Core API reference](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/api-reference.md).

## Run it

With your node running, execute the CLI from the docs checkout.

```sh
node examples/v2/core-query-api/src/run-query.ts
```

The CLI prints `Atoms on this page`, `Triples on this page` and `Predicates returned`, followed by JSON with sample records. If the graph has no atoms or triples, their counts are zero and their first records are `null`. A seeded predicate catalog can still contain rows. An HTTP 401 indicates that this node requires authorization. A connection error or timeout calls for checking the Core host port, API health and logs.

You can exercise the same decoders offline. These tests supply synthetic HTTP responses for successful, empty, malformed, oversized and unauthorized results, and simulate an expired deadline.

```sh
node --test examples/v2/core-query-api/src/query-client.test.ts
```

## Full source

The [complete Core query project](https://github.com/0xIntuition/intuition-docs/tree/bb420395aff3432f1f5da08cb76ac75a99945bff/examples/v2/core-query-api) includes `query-client.ts`, `run-query.ts` and their response fixtures. The [pinned handler implementation](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/app.ts) shows how Core builds the list envelopes.

## Next steps

[Build a local indexed graph](/docs/build/test-locally) and run the client again. [Triples](/docs/concepts/triples) explains how to interpret the three term IDs in each claim.
