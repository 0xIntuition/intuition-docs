---
title: 'Create and query an off-chain graph with Core'
slug: /build/guides/core-rest
sidebar_position: 3
---

Prerequisites: a running Core node and an operator-issued writable API key for its configured auth mode. The examples use a local Query API at port 3000. See the [pinned node setup](https://github.com/0xIntuition/intuition-core/blob/eebba114666ba2373690f2beb7dce565aa16f0b7/docs/run-your-own-node.md) for the service topology and migrations. These calls mutate only the selected node's graph; they do not submit blockchain transactions.

Set `CORE_URL` and `CORE_API_KEY` in the server environment. Never put a writable operator key in a client bundle. This complete Node 22 script creates three terms, connects them, and reads the result:

```js
const base = process.env.CORE_URL ?? 'http://localhost:3000';
const key = process.env.CORE_API_KEY;
if (!key) throw new Error('Set CORE_API_KEY for this node');
async function request(path, body) {
  const response = await fetch(new URL(path, base), {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error(`Core ${response.status}: ${path}`);
  return response.json();
}
const subject = await request('/api/atoms', { input: 'docs-example:alice' });
const predicate = await request('/api/atoms', {
  input: 'docs-example:recommends',
});
const object = await request('/api/atoms', { input: 'docs-example:book' });
const triple = await request('/api/triples', {
  subject_id: subject.data.id,
  predicate_id: predicate.data.id,
  object_id: object.data.id,
});
console.log(await request(`/api/triples/${triple.data.id}`));
console.log(
  await request(`/api/atoms/${subject.data.id}/triples?limit=10&expand=terms`),
);
```

The `docs-example:` strings intentionally define a self-contained demonstration vocabulary. For an interoperable application, replace them with the exact anchor and canonical predicate data produced by the packages. In particular, pass the first-atom recipe's `atom.data` as `input`; do not JSON-encode that string a second time or reformat a serialized envelope.

First creation returns HTTP 201; repeating the same input returns HTTP 200 and the same ID. The response's `created` flag distinguishes creation from an existing record. Authentication, term validation, and database failures must still be handled.

## Read surface

| Request                                        | Use and expected shape                                               |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `GET /api/atoms?limit=25&offset=0&q=example`   | `{ data, pagination }`; substring search, not semantic ranking       |
| `GET /api/atoms/:id`                           | Full atom, processing stages, and graph stats                        |
| `GET /api/atoms/:id/artifacts`                 | Provider artifacts, extracted fields, source URI, errors             |
| `GET /api/atoms/:id/triples?expand=terms`      | Relationships touching any subject/predicate/object position         |
| `GET /api/triples?subject_id=…&predicate_id=…` | Combinable S/P/O filters and limit/offset                            |
| `GET /api/events?entity_id=…`                  | Attributed graph activity, including chain coordinates where present |
| `GET /api/stats/pipeline`                      | Processing-stage counts                                              |
| `GET /api/schema`                              | Local KG metadata, not the hosted GraphQL schema                     |

The list limit defaults to 25 and is capped at 100. Public graph reads filter to active, public rows. A 404 can mean the requested term is absent from the public read model. Offset pagination can shift as records arrive; record your application consistency requirements.

## Processing is asynchronous

Creation does not mean classification or enrichment has completed. Read the atom's stage status and artifacts. Show pending, skipped, and failed outcomes explicitly; use a bounded polling budget in an application. An empty provider plan or unavailable credential can explain a skipped enrichment without invalidating the atom.

## Troubleshooting

| Result                                         | Next check                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| 401 `api_key_required` / `invalid_api_key`     | Correct node, bearer header, key validity                          |
| 403 `api_key_not_writable`                     | Writable credential for an authorized operation                    |
| 400 `invalid_input` / `invalid_term_id`        | Raw input and complete 32-byte term IDs                            |
| 413 `input_too_large`                          | Node's documented input limit; avoid embedding large assets        |
| Atom exists but chain state does not           | An off-chain write does not register a term on-chain               |
| Receipt succeeded but Core has no chain record | Correct network, indexing scope, ingestion and projection progress |

Core's documented modes are `open`, `public-read`, and `gated`. The schema endpoint is separately public in the inspected implementation; do not assume gated mode makes all metadata private. Read the node's exact configuration and API source before offering hosted access.

[Core API reference](https://github.com/0xIntuition/intuition-core/blob/eebba114666ba2373690f2beb7dce565aa16f0b7/docs/api-reference.md).
