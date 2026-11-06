---
title: 'Upgrade SDK v3 and app-local processing helpers'
slug: /build/migration
sidebar_position: 9
---

The October 28 release publishes SDK **4.0.0-alpha.0** and protocol **3.0.0-alpha.0**, plus the semantic, identity, and processing packages in the [catalog](./packages/index.md). These are independent version lines. Keep the existing SDK v3 integration until you have replaced its imports and checked your application's identity fixtures.

## Update public imports

| Existing use                       | Published replacement                                        | Check                                                                            |
| ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Protocol-wide SDK root imports     | `@0xintuition/protocol` or `@0xintuition/sdk/protocol`       | The SDK root no longer re-exports the entire protocol                            |
| ID-wide SDK root imports           | `@0xintuition/ids`                                           | The SDK root retains only selected ID helpers                                    |
| SDK read operations                | `@0xintuition/sdk/api`                                       | Hosted GraphQL contract; not Core REST                                           |
| Quote and preparation helpers      | `@0xintuition/sdk/actions`                                   | Some perform RPC reads; preparation does not imply submission                    |
| CLI `build*Plan` helpers           | SDK `*Envelope` helpers                                      | [Alias migration](./guides/action-envelopes.md); metadata now identifies the SDK |
| Pinata upload helpers              | Application-owned storage provider                           | Upload first, then pass the content URI to an appropriate action                 |
| App-local type/predicate maps      | `classifications`, Creation Profiles, `predicates`           | Preserve canonical slugs, schema types, predicate bytes and IDs                  |
| App-local engine/cache wiring      | `atom-runtime`                                               | Explicit environment, presets, memoization, and request cancellation             |
| Effect pipeline helpers            | `pipeline-runtime` Promise helpers or a local Effect adapter | Promise helpers do not accept Effect `Exit`, `Cause`, or service Layers          |
| React hooks without protocol peers | Install protocol and deployments explicitly                  | Shared metadata/wrappers now come from peer dependencies                         |

The SDK root retains `calculateAtomId`, `calculateTripleId`, `calculateCounterTripleId`, `calculateOAuthAtomId`, and selected ID/configuration types. `sdk/utils` is for SDK formatting utilities; it is not the full ID package. Bytecode belongs to `deployments/bytecode` or `protocol/contracts`, and curve math belongs to `curves`.

## Preserve identity when migrating processing

- Use the [parser's IID result](./packages/atom-parser.md) and reject invalid IID-shaped inputs explicitly.
- Default plain-text classification is `Thing`. Opt into lexical classification only when you intend `DefinedTerm`; do not expect synthetic `term:*` identifiers from all text.
- Use `toClassifiedAtomInput` for the [enrichment handoff](./guides/processing.md); terminal acquisition failures and invalid identities can produce `null`.
- Classifications, engine categories, and provider artifact types remain separate vocabularies. Refreshable metadata should not silently change canonical atom bytes.
- `iid-ladder` defaults to rejecting unregistered provider handles. `createLadder({ providerLocalHandles: 'mint' })` is an application-local compatibility policy for historical strings, not a change to the normative IID registry. Such output does not become a valid P0 anchor automatically.
- `buildIidAnchor` has distinct derived and candidate paths. Preserve the [documented profile behavior](./packages/primitives.md), including the current P1/P2 serialization boundary.

Add readers for new representations before enabling writers. Compare old/new bytes and IDs on your fixture corpus. Preserve historical IDs and their claims/positions; model equivalence with attributed relationships instead of rewriting identity in place.

## Review protocol and event behavior

Direct write wrappers can submit transactions. Use encoders or SDK plans when you need an unsigned result. Protocol event parsers obtain the transaction receipt and reject reverted transactions. Scope parsing to the expected emitting contract, and handle an empty matching-event result rather than assuming every log in a transaction belongs to it.

The published ABIs include URI-aware creation, on-behalf-of creation, and payable multicall, but these require a matching deployed implementation. The router address remains deliberately withheld. Check the [deployment boundary](./compatibility.md) before enabling the functions.

`useCreateAtom` and `useCreateAtomFlow` use ordinary `createAtoms`; use `multiVaultCreateAtomsWithUris` with an explicit transaction flow when you need context registration. Resetting a hook does not cancel a pending transaction.

## Cut over deliberately

1. Install exact versions and commit the lockfile, including direct imports and peers.
2. Compile against emitted npm declarations and compare identity fixtures.
3. Handle null handoffs, missing records, partial enrichment, provider failure, and cancellation.
4. Check the selected API schema and chain/deployment separately from package publication.
5. Keep the previous reader path for historical atoms and label SDK v3 guides for existing consumers.

Core REST documentation retains its [separately pinned baseline](./compatibility.md). This package release does not assert that a Core node, hosted API, or application deployment has upgraded with it.
