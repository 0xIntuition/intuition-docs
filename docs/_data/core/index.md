---
title: Intuition Core
sidebar_label: Intuition Core
description: Follow an event through Core and choose a guide to run a node, configure indexing, or extend atom processing.
kind: concept
reader: ["operator","app"]
packages: []
---

Intuition Core is a backend you run to build and query your own copy of the knowledge graph. Fork the Core repository, check out the documented commit in your fork and build the services from that source. The [release guide](/docs/core/releases) explains how to identify the revision and evaluate an update. [Core repository guide](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/README.md)

## How a chain event reaches an application

When you enable the optional indexing profile, the ingester watches the configured chain and MultiVault contract. It records events in TimescaleDB. Projections read those events and update market data in TimescaleDB and graph records in a separate Postgres database. Workers parse, classify and enrich atoms in that graph. Follow a single atom from its receipt to its indexed record in [Architecture](/docs/core/architecture).

Your application can [query its Core node](/docs/build/query-core) through the [Query API](/docs/reference/core-query-api). The default stack also supports local graph operations without chain ingestion. The [atom services API](/docs/reference/atom-services-api) processes individual requests without storing their results. Explorer is a separate client that you can run to inspect the node. [Core documentation](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/README.md)

## Run and operate a node

- Start with a [local devnet](/docs/core/local-devnet) to follow a local deployment and inspect its records.
- [Run a node](/docs/core/run-a-node) to build the stack and connect it to the chain you intend to index.
- Check [configuration](/docs/core/configuration) for a setting’s owner and default. Use [indexing scope](/docs/core/indexing-scope) to choose the contract and block range.
- Use [troubleshooting](/docs/core/troubleshooting) to distinguish a datastore problem from a stalled projection or processing stage.

## Extend atom processing

Find the service or worker you need to change in [Core packages](/docs/core/packages). Add a [classification plugin](/docs/core/classification-plugin) to recognize a new input type. Add an [enrichment plugin](/docs/core/enrichment-plugin) to attach an artifact. Check the [provider catalog](/docs/core/enrichment-providers) for the inputs, credentials and partial results to expect.
