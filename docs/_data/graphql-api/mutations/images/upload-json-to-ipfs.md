---
title: Upload JSON to IPFS
sidebar_label: Upload JSON
sidebar_position: 4
description: Upload JSON metadata to IPFS
keywords: [graphql, mutation, ipfs, json, metadata, upload]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload JSON to IPFS

Upload JSON metadata to IPFS for use in atom creation. Returns the IPFS hash, name, and size.

## Mutation Structure

```graphql
mutation UploadJsonToIpfs($json: jsonb!) {
  uploadJsonToIpfs(json: $json) {
    hash
    name
    size
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `json` | `jsonb` | Yes | JSON object to upload |

```json
{
  "json": {
    "name": "Ethereum",
    "description": "A decentralized blockchain platform",
    "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
    "url": "https://ethereum.org",
    "type": "Thing"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `hash` | `String!` | IPFS content hash (CID) |
| `name` | `String!` | Filename on IPFS |
| `size` | `String!` | File size |

## Expected Response

```json
{
  "data": {
    "uploadJsonToIpfs": {
      "hash": "QmYx8C3kNN1sFSx5bZPyN1sFSx5b8MqKu2r6CTSJ",
      "name": "metadata.json",
      "size": "256"
    }
  }
}
```

## Interactive Example

export const uploadJsonQueries = [
  {
    id: 'upload-thing-metadata',
    title: 'Upload Thing Metadata',
    query: `mutation UploadJsonToIpfs($json: jsonb!) {
  uploadJsonToIpfs(json: $json) {
    hash
    name
    size
  }
}`,
    variables: {
      json: {
        name: 'Ethereum',
        description: 'A decentralized blockchain platform',
        image: 'ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy',
        url: 'https://ethereum.org'
      }
    }
  }
];

<GraphQLPlaygroundCustom queries={uploadJsonQueries} />

## Common Metadata Schemas

### Thing Schema

```json
{
  "name": "Ethereum",
  "description": "A decentralized blockchain platform that enables smart contracts",
  "image": "ipfs://Qm...",
  "url": "https://ethereum.org"
}
```

### Person Schema

```json
{
  "name": "Vitalik Buterin",
  "description": "Co-founder of Ethereum",
  "image": "ipfs://Qm...",
  "email": "vitalik@ethereum.org",
  "identifier": "vitalik.eth",
  "url": "https://vitalik.ca"
}
```

### Organization Schema

```json
{
  "name": "Ethereum Foundation",
  "description": "Non-profit supporting Ethereum development",
  "image": "ipfs://Qm...",
  "url": "https://ethereum.foundation",
  "email": "info@ethereum.org"
}
```

## Use Cases

### Complete Atom Creation Workflow

Upload metadata and use the IPFS hash for atom creation:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function prepareAtomMetadata(thing: {
  name: string
  description: string
  image: string
  url?: string
}) {
  const mutation = `
    mutation UploadJsonToIpfs($json: jsonb!) {
      uploadJsonToIpfs(json: $json) {
        hash
        name
        size
      }
    }
  `

  const result = await client.request(mutation, { json: thing })
  return result.uploadJsonToIpfs.hash
}
```

## Related

- [Upload Image](./upload-image) - Upload images
- [Upload Image from URL](./upload-image-from-url) - Import external images
- [Pin Thing](/docs/graphql-api/mutations/pin-thing) - Pin Thing metadata
- [Pin Person](/docs/graphql-api/mutations/pin-person) - Pin Person metadata
- [Pin Organization](/docs/graphql-api/mutations/pin-organization) - Pin Organization metadata
