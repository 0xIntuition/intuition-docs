---
title: Upload JSON to IPFS
sidebar_label: Upload JSON to IPFS
sidebar_position: 6
description: Upload arbitrary JSON data to IPFS
keywords: [graphql, mutation, ipfs, json, upload, metadata]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload JSON to IPFS Mutation

Upload arbitrary JSON data to IPFS. Useful for custom metadata schemas or complex data structures.

## Mutation Structure

```graphql
mutation UploadJsonToIpfs($json: JSON!) {
  uploadJsonToIpfs(json: $json) {
    url
    cid
  }
}
```

## Variables

```json
{
  "json": {
    "name": "Custom Entity",
    "type": "CustomSchema",
    "attributes": {
      "category": "example",
      "tags": ["demo", "test"],
      "metadata": {
        "version": "1.0",
        "author": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
      }
    }
  }
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `json` | JSON | Yes | Any valid JSON object |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `url` | String | IPFS URL for the uploaded JSON |
| `cid` | String | Content Identifier (CID) of the uploaded JSON |

## Response Example

```json
{
  "data": {
    "uploadJsonToIpfs": {
      "url": "ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
      "cid": "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx"
    }
  }
}
```

## Interactive Example

export const uploadJsonQueries = [
  {
    id: 'upload-json',
    title: 'Upload JSON to IPFS',
    query: `mutation UploadJsonToIpfs($json: JSON!) {
  uploadJsonToIpfs(json: $json) {
    url
    cid
  }
}`,
    variables: {
      json: {
        name: 'Example Entity',
        description: 'An example custom JSON object',
        customField: 'custom value'
      }
    }
  }
];

<GraphQLPlaygroundCustom queries={uploadJsonQueries} />

## Use Cases

### Custom Metadata Schema

Upload metadata that doesn't fit standard Thing/Person/Organization schemas:

```typescript
const UPLOAD_JSON = gql`
  mutation UploadJsonToIpfs($json: JSON!) {
    uploadJsonToIpfs(json: $json) {
      url
      cid
    }
  }
`;

async function uploadCustomMetadata() {
  const customData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Intuition Hackathon 2024',
    startDate: '2024-06-15T09:00:00Z',
    endDate: '2024-06-17T18:00:00Z',
    location: {
      '@type': 'Place',
      name: 'ETH Denver',
      address: 'Denver, CO'
    },
    organizer: {
      '@type': 'Organization',
      name: 'Intuition Systems'
    }
  };

  const { data } = await client.mutate({
    mutation: UPLOAD_JSON,
    variables: { json: customData }
  });

  return data.uploadJsonToIpfs.url;
}
```

### Batch Metadata Upload

```typescript
async function uploadBatchMetadata(items: any[]) {
  const results = await Promise.all(
    items.map(item =>
      client.mutate({
        mutation: UPLOAD_JSON,
        variables: { json: item }
      })
    )
  );

  return results.map(r => r.data.uploadJsonToIpfs);
}
```

### Versioned Configuration

```typescript
const configData = {
  version: '2.0',
  schema: 'CustomProtocol',
  settings: {
    feature1: true,
    feature2: false,
    threshold: 100
  },
  updatedAt: new Date().toISOString()
};

const { data } = await client.mutate({
  mutation: UPLOAD_JSON,
  variables: { json: configData }
});

// Use the CID as a version reference
console.log('Config v2.0 CID:', data.uploadJsonToIpfs.cid);
```

## Schema.org Compatibility

You can upload JSON-LD formatted data for semantic web compatibility:

```typescript
const schemaOrgData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Intuition Protocol',
  applicationCategory: 'DeFi',
  operatingSystem: 'Ethereum',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'ETH'
  }
};

const { data } = await client.mutate({
  mutation: UPLOAD_JSON,
  variables: { json: schemaOrgData }
});
```

## Best Practices

1. **Use consistent schemas** - Define and document your custom schemas
2. **Include version info** - Add version fields for schema evolution
3. **Validate JSON** - Ensure valid JSON before upload
4. **Keep data reasonable** - Large JSON files increase storage costs
5. **Consider privacy** - IPFS data is public and permanent

## Related

- [Upload Image](./upload-image) - Upload base64 images
- [Upload Image from URL](./upload-image-from-url) - Upload from external URL
- [Pin Thing](./pin-thing) - Use standard Thing schema
- [Pin Person](./pin-person) - Use standard Person schema
- [Pin Organization](./pin-organization) - Use standard Organization schema
