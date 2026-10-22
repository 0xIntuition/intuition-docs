---
title: 'Use the SDK hosted GraphQL read client'
slug: /build/guides/sdk-reads
sidebar_position: 6
---

`createIntuitionApiClient` is a small read client for the established hosted GraphQL contract. It is not a REST client for a Core node and does not implement general search, graph traversal, uploads, or writes.

```ts
import {
  createIntuitionApiClient,
  getIntuitionApiUrl,
} from '@0xintuition/sdk/api';
const api = createIntuitionApiClient({
  baseUrl: getIntuitionApiUrl('testnet'),
});
const atom = await api.atoms.getByLabel({ label: 'example' });
if (atom) console.log(atom.termId, atom.label, atom.type);
```

Always select the environment explicitly. Omitting `baseUrl` defaults to mainnet in this candidate. The built-in local URL is the hosted-schema development endpoint on port 8080, not Core's Query API on port 3000.

| Method             | Input                | Output                              |
| ------------------ | -------------------- | ----------------------------------- |
| `atoms.getById`    | `{ termId: string }` | `IntuitionApiAtom` or `null`        |
| `atoms.getByLabel` | `{ label: string }`  | First exact label match or `null`   |
| `atoms.getByData`  | `{ data: string }`   | First exact payload match or `null` |
| `triples.getById`  | `{ termId: string }` | `IntuitionApiTriple` or `null`      |

Labels are not unique identities. Prefer a known term ID or exact canonical data for deduplication. Atom results normalize `term_id` to `termId` and absent presentation fields to `null`. Triple results include subject, predicate, and object term references.

The client accepts an injected `fetch`, extra headers, bearer auth, or API-key auth with a configurable header name. Keep server credentials on the server. HTTP failures, GraphQL errors, and missing response data throw; an absent row returns `null`. Handle those cases separately.

For lists, arbitrary filtering, pagination, and relationships beyond these four methods, use the API's own documented query surface. See [Core REST](./core-rest.md) for your node or the existing hosted GraphQL section for that schema.

[Complete API types and functions](../sdk-reference/api.md).
