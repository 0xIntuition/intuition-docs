---
title: 'Move from SDK v3 and app-local helpers'
slug: /build/migration
sidebar_position: 9
---

The new SDK 4 candidate separates API reads, action planning, deterministic utilities, and low-level contract access. Existing SDK v3 guides describe a different public surface; keep a migration deliberate instead of mixing imports from both generations.

| Existing pattern                            | Candidate direction                                           | Migration check                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| General SDK root import                     | `sdk/api`, `sdk/actions`, `sdk/utils`, `sdk/protocol`         | Resolve the actual exported symbol; root compatibility is broader than the intended long-term surface |
| Pinata helpers in the SDK                   | Application-owned upload provider                             | Upload first, then pass the returned content URI to a supported action                                |
| App-local atom identity serialization       | `primitives/anchor` and IID packages                          | Compare exact bytes and IDs on your existing fixture corpus                                           |
| App-local type/predicate maps               | `classifications`, Creation Profiles, `predicates`            | Preserve canonical slug, schema type, and predicate identity                                          |
| Provider name used as identity              | Category ladder and validated candidate IID                   | Keep alias-only and unregistered-provider fallback behavior                                           |
| All JSON-LD atoms assumed to be IID anchors | Explicit legacy parsing and new anchor creation paths         | Historical data stays readable; do not rewrite identity silently                                      |
| Core REST assumed to match hosted GraphQL   | Explicit adapter for each query contract                      | Check endpoint, input keys, pagination, and response model                                            |
| React creation assumed URI-aware            | Compose `multiVaultCreateAtomsWithUris` with transaction flow | The existing creation hook uses ordinary `createAtoms`                                                |

## Reader-first rollout

Inventory the historical representations your application reads. Add recognition and display support for the new representation before enabling new writers. Compare old and new fixture outputs, record intentional differences, and preserve historical IDs. When two atoms represent the same entity, model the equivalence claim with provenance instead of mutating the old payload or pretending its vault moved.

## Candidate-specific checks

The app's selected alignment branch is evidence of package adoption, not proof that it has shipped. Its public-package imports can guide an adapter, while its auth, routes, and persistence remain product-specific. The Core checkout similarly describes an implementation revision; deployed nodes can have different API and indexing capabilities.

Reconcile contract documentation with the existing [FeeProxy/v1.1.0 documentation PR](https://github.com/0xIntuition/intuition-docs/pull/111). Use the contracts' authoritative deployment evidence before enabling new ABI calls. The candidate router intentionally has no published address while a compatible deployment is pending.

## Cutover checklist

- Pin package versions and record their public exports.
- Compile the new imports in a clean consumer project.
- Compare identity bytes and protocol IDs against known fixtures.
- Test errors, nullable outputs, and provider failure handling.
- Verify target deployment compatibility and exact query schema.
- Keep previous routes and historical guides accessible with version labels.
- Release docs, packages, contracts, and applications as separately evidenced steps.
