---
title: Scope what you index
sidebar_label: Scope what you index
description: Choose what Core ingests, projects, enriches and exposes, and preview a scope before starting indexing.
kind: how-to
reader: ["operator"]
packages: []
---

Choose which chain events Core captures and which graph or market outputs your readers can rely on.

## Before you start

Use the pinned fork and installed dependencies from [Run your own node](/docs/core/run-a-node). You can preview a scope without starting an indexer or contacting a chain. Before deploying it, identify your MultiVault proxy, chain, block range, and the outputs your application actually needs.

## Steps

### 1. Preview a scope

From the Core root, run:

```sh
bun run scope:dry-run docs/indexing-scope.example.json
```

`make scope-dry-run` reads the same file. To try a change, copy it to your own JSON file, edit the copy, and pass its path to the command. Expect `status: "ok"`, a `dryRun` object and a `rindexerManifestPreview` string. The validator redacts RPC user information and token-like query parameters. A validation error prints the reason and exits unsuccessfully. The preview reads a file and prints a plan; it neither starts services nor changes the active manifest. [Bundled example](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/indexing-scope.example.json) · [Preview command](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/scripts/scope-dry-run.ts)

### 2. Choose the events and the outputs they support

The example uses a historical chain window. It includes two events, `AtomCreated` and `TripleCreated`, and selects three projections in its KG bundle:

| Projection | Output from those events |
| --- | --- |
| `event_log` | Event history limited to the captured event types. |
| `account_registry` | Accounts participating in the graph events. |
| `core_entities` | Atom and triple records used to serve the graph. |

The preview requires `Deposited`, `Redeemed` and `SharePriceChanged` for the `market-only` bundle and the `vault_state` projection. Individually, `position_tracking` and `vault_holders_index` need only `Deposited` and `Redeemed`. If you omit a projection, report its output as unavailable. A missing projection cannot establish a zero balance. [Bundle and projection requirements](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/types/src/indexing-scope.ts#L271-L297)

The dry-run schema cannot select the URI event `AtomContextRegistered` or the projection `atom_context:dual`. The live ingester manifest includes the event. To retain on-chain URI evidence, keep it in the manifest and enable the context projection with its KG connection in the running service. [Preview schema](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/types/src/indexing-scope.ts#L3-L39) · [Ingestion manifest](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/rindexer.yaml) · [Context projection startup](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/main.rs#L342-L352)

### 3. Apply each choice where it takes effect

| Layer | Where to apply it |
| --- | --- |
| Source capture | Set `INTUITION_RPC_URL`, `CHAIN_ID`, `MULTIVAULT_CONTRACT_ADDRESS`, `MULTIVAULT_START_BLOCK` and optionally `MULTIVAULT_END_BLOCK` for the ingester. Use your deployment evidence. The source manifest's MultiVault `include_events` lists seven supported event types; its entrypoint substitutes the deployment and range values. For a different event set, review the manifest and matching Rust handler registrations in your fork and rebuild. Stock Compose has no event-list environment switch. Keep one ingester per store and scope. |
| Derived outputs | Set the projection process's comma-separated `ENABLED_PROJECTIONS` or `DISABLED_PROJECTIONS`. A nonempty allowlist takes precedence. Stock Compose forwards the denylist; add an environment mapping to the projections service for a custom allowlist. Verify selected outputs have all required input events before starting the indexing profile. |
| Processing | Set `WORKERS_PROCESSING_SCOPE` to `full`, `music`, `podcasts` or `music-and-podcasts`. Parse and classification still run. The scoped enrichment worker uses the classification to select eligible rows and permitted provider or artifact work. Rows outside the selected scope are marked `skipped` with a reason. Switching presets leaves existing artifacts in storage and does not automatically requeue older rows or backfill missed events. |
| Read filter | Use Query API parameters such as `classification_type` or `q` on an atom list, or filter in your application. This changes which stored, active, public records the caller sees. It does not delete records, change worker scope or rewind ingestion. |

A provider list in the preview describes a processing choice. The shipped worker consumes its supported preset, so editing that JSON alone does not install an arbitrary provider allowlist. [Manifest template](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/rindexer.yaml) · [Handler registrations](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/handlers.rs#L55-L70) · [Projection selection](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/config.rs) · [Worker scope](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/shared/processing-scope.ts) · [Query filters](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/app.ts#L279-L313)

## Check the result

For the bundled file, check that the preview includes the two requested event names, marks the three selected KG outputs available, and leaves the financial outputs unavailable. In your copy, try selecting a market projection while keeping only the two KG events. Expect an error naming the missing inputs. Restore the inputs or narrow the requested outputs before using the configuration.

After deploying your own scope, compare the indexer's per-event progress against a known receipt in your range. Look up that event's exact term ID in the graph, then examine the worker stage and any read filters independently. [Query a Core node](/docs/build/query-core)

## Related

[Run a local devnet](/docs/core/local-devnet) · [Configuration](/docs/core/configuration) · [Troubleshooting](/docs/core/troubleshooting)

{/* cspell:words rindexer */}
