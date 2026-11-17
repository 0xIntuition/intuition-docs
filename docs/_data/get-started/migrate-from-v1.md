---
title: "Migrate from V1"
sidebar_label: "Migrate from V1"
description: "Move an intuition-ts integration to V2 packages while preserving stored identity and separating planning, writes, and Core reads."
kind: how-to
reader: ["app"]
packages: ["@0xintuition/sdk", "@0xintuition/protocol", "@0xintuition/ids", "@0xintuition/predicates", "@0xintuition/primitives", "@0xintuition/cli"]
---

<AppliesTo />

Move an existing integration to the V2 package boundaries without silently changing historical atom bytes, IDs, claims, or positions.

## Before you start

Keep your existing lockfile and a fixture set of stored atom data, atom IDs, and ordered triples. Read [representation profiles](/docs/concepts/representation-profiles), [compatibility](/docs/reference/compatibility), and [installation](/docs/build/install). Add readers for new representations before enabling new writers.

### What changed

V1 covers the `intuition-ts` packages and `intuition-rs` services. V2 covers the packages in the [release manifest](/intuition-release.json) and Intuition Core. The generation label is independent of package semver.

Since the stable release on November 12, 2026, an untagged or `latest` install of the SDK or protocol selects the V2 package. To maintain V1, preserve `@0xintuition/sdk` 3.0.1, `@0xintuition/protocol` 2.0.3, and `@0xintuition/graphql` 3.0.1 in your lockfile. Frozen V1 pages still contain some untagged installs; do not assume every historical install command preserves those versions.

The V2 SDK root no longer exports the entire protocol or ID surface. Atom builders, shared predicates, identity selection, and transaction planning now have focused public packages. Core is a source application you fork and run; it is separate from installing the libraries.

## Steps

### 1. Map your packages

| V1 responsibility | V2 replacement | Migration check |
| --- | --- | --- |
| `@0xintuition/sdk` | `sdk` plus `ids`, `predicates`, and `primitives` | Replace removed root exports and separate local building from writes |
| `@0xintuition/protocol` | `protocol` plus `deployments`, `periphery`, and `curves` | Select the deployed implementation and its public artifacts |
| `@0xintuition/graphql` | No V2 package counterpart | Read the Query API of [a Core node you run](/docs/build/query-core) |
| `intuition-cli` | `@0xintuition/cli` | Use encoders; move client-free plans to SDK envelopes |
| Application-local type and predicate maps | `classifications` and `predicates` | Preserve canonical slugs, serialized predicate data, and IDs |
| Upload helper | Application-owned storage provider | Preserve existing content URIs; upload and protocol registration are separate operations |

Install exact versions for the packages you import directly and commit your lockfile. The [package catalog](/docs/reference/packages) lists public entry points and peers.

### 2. Update imports

A V1 import can combine broad helpers at the SDK root:

<!-- docs-typecheck: v1 -->
```ts
import { calculateAtomId, createAtomFromString } from '@0xintuition/sdk';

export const legacyHelpers = { calculateAtomId, createAtomFromString };
```

For V2, choose each package's public entry point:

{/* example:start examples/v2/first-write/src/migration.ts#imports */}

```ts
import { calculateAtomId } from '@0xintuition/ids';
import { PREDICATE_IDS } from '@0xintuition/predicates';
import { multivaultPrepareDepositTx } from '@0xintuition/sdk/actions';
import { getMultiVaultAddressFromChainId } from '@0xintuition/protocol';

export const migrationImports = {
  calculateAtomId,
  PREDICATE_IDS,
  multivaultPrepareDepositTx,
  getMultiVaultAddressFromChainId,
};
```

{/* example:end */}

The SDK root retains selected ID helpers, but `ids` is the full deterministic-ID package. `sdk/utils` contains formatting utilities. Import low-level protocol APIs from `@0xintuition/protocol`, or use the explicit `@0xintuition/sdk/protocol` escape hatch. Bytecode belongs to `deployments/bytecode` or `protocol/contracts`; curve math belongs to `curves`.

### 3. Replace atom creation

V1 combines creation with a string or uploaded Thing workflow. These functions submit when called:

<!-- docs-typecheck: v1 -->
```ts
import { createAtomFromString, createAtomFromThing } from '@0xintuition/sdk';

type LegacyWriteConfig = Parameters<typeof createAtomFromString>[0];

export function createLegacyText(config: LegacyWriteConfig, text: string) {
  return createAtomFromString(config, text);
}

export function createLegacyThing(
  config: LegacyWriteConfig,
  thing: Parameters<typeof createAtomFromThing>[1],
) {
  return createAtomFromThing(config, thing);
}
```

For new V2 entities, build data first. `buildThing` preserves the descriptive JSON-LD builder pattern; `buildIidAnchor` selects an identity representation. They return a checked `BuildResult`, not a transaction receipt. Neither performs an upload.

The following helper demonstrates the separate write boundary. **Calling it simulates and submits a wallet transaction.** It is a migration reference, not part of the offline quickstart. The caller must choose a compatible deployment and creator, read current creation cost and URI limits, check existence, and supply assets in base units before invocation.

{/* example:start examples/v2/first-write/src/migration.ts#atoms */}

```ts
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { multiVaultCreateAtomsWithUris } from '@0xintuition/protocol';
import type { AtomUriLimits, WriteConfig } from '@0xintuition/protocol';
import { stringToHex, type Address } from 'viem';

// Calling this function simulates and submits a wallet transaction.
export async function createRecording(
  config: WriteConfig,
  creator: Address,
  isrc: string,
  assets: bigint,
  uriLimits: AtomUriLimits,
) {
  const result = buildIidAnchor('music-recording', { isrc });
  if (!result.success) throw new Error(result.errors.join('; '));
  const atom = result.value;
  const transactionHash = await multiVaultCreateAtomsWithUris(config, {
    args: [
      creator,
      [atom.dataHex],
      [assets],
      [atom.contextUris.map((uri) => stringToHex(uri))],
    ],
    value: assets,
    uriLimits,
  });
  return { atom, transactionHash };
}
```

{/* example:end */}

This helper uses no companion URIs, so its URI list is empty. If your application adds them, pass the builder's normalized `contextUris` through the URI-aware operation. Its `value` must equal the assets sum. A submitted hash still needs a successful receipt and event parsing scoped to the expected emitting contract.

An existing V1 string or IPFS URI is not automatically equivalent to a new IID anchor. Preserve the original bytes and ID; creating an anchor is a separate graph decision.

### 4. Replace triple creation

V1 wraps the contract operation and returns its event state:

<!-- docs-typecheck: v1 -->
```ts
import { createTripleStatement } from '@0xintuition/sdk';

export function createLegacyTriple(
  config: Parameters<typeof createTripleStatement>[0],
  input: Parameters<typeof createTripleStatement>[1],
) {
  return createTripleStatement(config, input);
}
```

V2 can calculate the ID locally and submit through the explicit protocol wrapper. The function below submits when invoked; its subject, predicate, and object atoms must already exist on the selected deployment.

{/* example:start examples/v2/first-write/src/migration.ts#triples */}

```ts
import { calculateTripleId } from '@0xintuition/ids';
import {
  multiVaultCreateTriples,
  type WriteConfig as TripleWriteConfig,
} from '@0xintuition/protocol';
import type { Hex } from 'viem';

// The three atoms must already exist on the selected deployment.
export async function createRelationship(
  config: TripleWriteConfig,
  subject: Hex,
  predicate: Hex,
  object: Hex,
  assets: bigint,
) {
  const id = calculateTripleId(subject, predicate, object);
  const transactionHash = await multiVaultCreateTriples(config, {
    args: [[subject], [predicate], [object], [assets]],
    value: assets,
  });
  return { id, transactionHash };
}
```

{/* example:end */}

Preserve subject–predicate–object order. Use the predicate registry's serialized data and ID; a registry key or display label alone is not the predicate atom. Reversing a triple changes its meaning and ID. Handle a reverted receipt or no matching creation event explicitly.

### 5. Move reads

A V1 read uses `getAtomDetails`:

<!-- docs-typecheck: v1 -->
```ts
import { getAtomDetails } from '@0xintuition/sdk';

export function readLegacyAtom(atomId: string) {
  return getAtomDetails(atomId);
}
```

For V2 indexed graph data, [query a Core node you run](/docs/build/query-core). Keep missing records and indexing delay visible to callers. Contract reads through protocol helpers read chain state, which is a separate data source.

The V2 SDK's `@0xintuition/sdk/api` client and its `atoms.getById` still call the hosted V1 GraphQL API. They are not a V2 read path; [The SDK read client](/docs/build/read-with-sdk) documents that boundary. Existing GraphQL queries stay with the supported [V1 API documentation](/docs/v1/graphql-api/overview).

### 6. Preserve identity

Keep the exact stored string when re-deriving a historical atom ID:

{/* example:start examples/v2/first-write/src/migration.ts#preserve */}

```ts
import { calculateAtomId as atomIdFromData } from '@0xintuition/ids';
import { stringToHex as encodeData } from 'viem';

export function preserveAtom(data: string) {
  const dataHex = encodeData(data);
  return { data, dataHex, id: atomIdFromData(dataHex) };
}
```

{/* example:end */}

Compare the result against your stored ID before switching. Do not parse and serialize JSON again just to normalize it: field order, whitespace, schema context strings, and payload changes can alter bytes and IDs. Do not rebuild an existing atom under another profile.

Companion `contextUris` are distinct from JSON-LD `@context` inside atom data. Metadata can be refreshed separately; changing identity-bearing fields creates another representation. Preserve historical claims and positions on their original terms, and model reviewed equivalence with explicit attributed relationships.

### 7. Move agent and CLI plans

Client-free, JSON-serializable envelope builders now live in `@0xintuition/sdk/actions`. For example, the deprecated CLI library name `buildMultiVaultDepositPlan` maps to `multiVaultDepositEnvelope`; `buildFeeProxyCreateAtomsWithUrisPlan` maps to `feeProxyCreateAtomsWithUrisEnvelope`.

The `intuition` executable exposes encoder commands, not a plan command. Envelope builders consume caller-supplied read context; quote and preparation helpers may perform RPC reads, while execution helpers can submit. See [action plans](/docs/build/action-plans) for the reviewed-plan workflow and the [source alias table](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/docs/action-plans.md) for all mappings.

Require human review of signer, chain, destination, receiver, value, and limits before signing or submission. Keep already mined steps recorded if a multi-step execution later fails.

## Check the result

Your integration should compile against the exact V2 packages, preserve every historical fixture's bytes and ID, and explicitly handle `BuildResult` errors, absent records, reverted receipts, and partial enrichment. Check that indexed reads use your Core adapter and that offline previews cannot invoke write helpers.

Treat compilation and fixture checks as their own evidence. They do not prove a deployment supports every ABI operation or that a transaction was submitted successfully.

## Related

### Where did my page go

The following mapping comes from the version switcher's equivalence data. Other V1 pages remain available in the [V1 docs](/docs/v1).

{/* generated:start version-equivalents */}

| V1 page | V2 page |
| --- | --- |
| [Introduction](/docs/v1) | [Intuition developer docs](/docs) |
| [AI Skills](/docs/v1/getting-started/ai-skills) | [Install the agent skills](/docs/agents/skills) |
| [Community & Support](/docs/v1/resources/community-and-support) | [Get help](/docs/community) |
| [Architecture](/docs/v1/getting-started/architecture) | [How the pieces fit](/docs/get-started/how-it-fits) |
| [Using the SDK](/docs/v1/quick-start/using-the-sdk) | [Quickstart: an atom ID and IID offline](/docs/get-started/quickstart) |
| [Primitives](/docs/v1/intuition-concepts/primitives) | [Concept map](/docs/concepts) |
| [Installation & Setup](/docs/v1/intuition-sdk/installation-and-setup) | [Install and pin the packages](/docs/build/install) |
| [Search and Discovery](/docs/v1/intuition-sdk/search-guide) | [The SDK read client](/docs/build/read-with-sdk) |
| [Tutorials](/docs/v1/tutorials/overview) | [What you can build](/docs/examples) |
| [Quick Start](/docs/v1/intuition-sdk/quick-start) | [@0xintuition/sdk](/docs/reference/packages/sdk) |
| [Protocol Package Overview](/docs/v1/protocol/getting-started/overview) | [@0xintuition/protocol](/docs/reference/packages/protocol) |
| [Choose Your Path](/docs/v1/getting-started/choose-your-path) | [Choose your packages](/docs/get-started/choose-packages) |
| [Atom Fundamentals](/docs/v1/intuition-concepts/primitives/Atoms/fundamentals) | [Atoms](/docs/concepts/atoms) |
| [Triple Fundamentals](/docs/v1/intuition-concepts/primitives/Triples/fundamentals) | [Triples, counter-triples and nested triples](/docs/concepts/triples) |
| [Vaults & Shares](/docs/v1/protocol/core-concepts/vaults) | [Vaults, shares and positions](/docs/concepts/vaults) |
| [Bonding Curves](/docs/v1/intuition-concepts/economics/bonding-curves) | [Bonding curves](/docs/concepts/bonding-curves) |
| [Signal Fundamentals](/docs/v1/intuition-concepts/primitives/Signals/fundamentals) | [Signals](/docs/concepts/signals) |
| [Fees and Rewards](/docs/v1/intuition-concepts/economics/fees-and-rewards) | [Fees, epochs and rewards](/docs/concepts/fees-and-rewards) |
| [Overview](/docs/v1/intuition-smart-contracts) | [Contracts](/docs/reference/contracts) |
| [MultiVault.sol](/docs/v1/intuition-smart-contracts/multivault) | [MultiVault](/docs/reference/contracts/multivault) |
| [FeeProxy.sol](/docs/v1/intuition-smart-contracts/fee-proxy) | [FeeProxy](/docs/reference/contracts/fee-proxy) |
| [TrustBonding.sol](/docs/v1/intuition-smart-contracts/trust-bonding) | [TrustBonding](/docs/reference/contracts/trust-bonding) |
| [Configurations & Fees](/docs/v1/intuition-smart-contracts/configuration) | [Configuration and URI limits](/docs/reference/contracts/configuration) |
| [Deployments](/docs/v1/intuition-smart-contracts/deployments) | [Deployments](/docs/reference/contracts/deployments) |
| [Atom Events](/docs/v1/protocol/events/atom-events) | [Events and errors](/docs/reference/contracts/events-and-errors) |
| [Audit Reports](/docs/v1/intuition-smart-contracts/audit-reports) | [Audits](/docs/reference/contracts/audits) |
| [Intuition Network](/docs/v1/intuition-network) | [Networks](/docs/reference/networks) |
| [Intuition Testnet Faucet](/docs/v1/quick-start/testnet-faucet) | [Testnet faucet](/docs/reference/networks/faucet) |
| [Remote Procedure Call (RPC)](/docs/v1/intuition-network/rpc) | [Connect to a network](/docs/build/connect) |
| [Create Atom](/docs/v1/interaction-guide/create-atom) | [Create atoms](/docs/build/create-atoms) |
| [Create Triple](/docs/v1/interaction-guide/create-triple) | [Create triples](/docs/build/create-triples) |
| [Deposit & Return](/docs/v1/interaction-guide/deposit-return) | [Deposit and redeem](/docs/build/deposit-redeem) |
| [Batch Operations](/docs/v1/protocol/examples/batch-operations) | [Batch writes](/docs/build/batch-writes) |
| [Integrate FeeProxy](/docs/v1/interaction-guide/fee-proxy-integration) | [Route writes through the FeeProxy](/docs/build/fee-proxy) |
| [React Integration](/docs/v1/intuition-sdk/integrations/react) | [Use React hooks](/docs/build/react) |
| [Glossary](/docs/v1/resources/glossary) | [Glossary](/docs/reference/glossary) |
| [Overview](/docs/v1/intuition-node/overview) | [Intuition Core](/docs/core) |
| [Run an Intuition Node](/docs/v1/intuition-node/run-an-intuition-node) | [Run your own node](/docs/core/run-a-node) |
| [Local Development Setup](/docs/v1/intuition-node/local-setup) | [Run a local devnet](/docs/core/local-devnet) |
| [Portal (Explorer) Guide](/docs/v1/portal) | [Ecosystem](/docs/community/ecosystem) |
| [Contribution Guidelines](/docs/v1/contribution-guidelines) | [Contribute to the docs](/docs/community/contributing) |

{/* generated:end */}

Sources: [SDK migration](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/docs/migration.md), [protocol API](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/README.md).
