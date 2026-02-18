---
title: Upload JSON to IPFS
sidebar_label: Upload JSON
sidebar_position: 4
description: Upload JSON metadata to IPFS
keywords: [graphql, mutation, ipfs, json, metadata, upload]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload JSON to IPFS

Upload JSON metadata to IPFS for use in atom creation. This is commonly used to store structured metadata like Thing descriptions, Person profiles, or Organization details.

## Mutation Structure

```graphql
mutation UploadJsonToIpfs($json: JSON!) {
  uploadJsonToIpfs(json: $json) {
    hash
    url
    size
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `json` | `JSON` | Yes | JSON object to upload |

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
| `hash` | `String` | IPFS content hash (CID) |
| `url` | `String` | Full IPFS URL (`ipfs://<hash>`) |
| `size` | `Int` | File size in bytes |

## Expected Response

```json
{
  "data": {
    "uploadJsonToIpfs": {
      "hash": "QmYx8C3kNN1sFSx5bZPyN1sFSx5b8MqKu2r6CTSJ",
      "url": "ipfs://QmYx8C3kNN1sFSx5bZPyN1sFSx5b8MqKu2r6CTSJ",
      "size": 256
    }
  }
}
```

## Interactive Example

export const uploadJsonQueries = [
  {
    id: 'upload-thing-metadata',
    title: 'Upload Thing Metadata',
    query: `mutation UploadJsonToIpfs($json: JSON!) {
  uploadJsonToIpfs(json: $json) {
    hash
    url
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

Upload metadata and create an atom:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function prepareAtomMetadata(thing: {
  name: string
  description: string
  imageUrl: string
  url?: string
}) {
  // Step 1: Upload the image
  const imageResult = await client.request(`
    mutation UploadImageFromUrl($url: String!) {
      uploadImageFromUrl(url: $url) {
        url
      }
    }
  `, { url: thing.imageUrl })

  // Step 2: Upload the metadata JSON
  const metadata = {
    name: thing.name,
    description: thing.description,
    image: imageResult.uploadImageFromUrl.url,
    url: thing.url
  }

  const jsonResult = await client.request(`
    mutation UploadJsonToIpfs($json: JSON!) {
      uploadJsonToIpfs(json: $json) {
        url
      }
    }
  `, { json: metadata })

  // Return the IPFS URL for atom creation
  return jsonResult.uploadJsonToIpfs.url
}
```

### React Metadata Form

```tsx
function MetadataForm({ onSubmit }: { onSubmit: (ipfsUrl: string) => void }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [uploadJson] = useMutation(UPLOAD_JSON_TO_IPFS)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const { data } = await uploadJson({
        variables: { json: form }
      })
      onSubmit(data.uploadJsonToIpfs.url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        placeholder="Image IPFS URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      <input
        placeholder="Website URL"
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
      />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload to IPFS'}
      </button>
    </form>
  )
}
```

### Batch Metadata Upload

```typescript
async function uploadMultipleMetadata(items: any[]) {
  const mutation = `
    mutation UploadJsonToIpfs($json: JSON!) {
      uploadJsonToIpfs(json: $json) {
        hash
        url
      }
    }
  `

  const results = await Promise.all(
    items.map(item => client.request(mutation, { json: item }))
  )

  return results.map(r => ({
    hash: r.uploadJsonToIpfs.hash,
    url: r.uploadJsonToIpfs.url
  }))
}
```

## Size Limits

- Maximum JSON size: **1 MB**
- JSON is stored as UTF-8 encoded text

## Best Practices

1. **Use consistent schemas** - Follow Thing/Person/Organization schemas
2. **Include all required fields** - At minimum, include `name`
3. **Use IPFS URLs for images** - Reference uploaded images by their IPFS URL
4. **Validate before upload** - Ensure JSON is valid and complete

## Error Handling

```typescript
try {
  const result = await uploadJsonToIpfs({ variables: { json } })
} catch (error) {
  if (error.message.includes('Invalid JSON')) {
    console.error('JSON is malformed')
  } else if (error.message.includes('Too large')) {
    console.error('JSON exceeds 1MB limit')
  }
}
```

## Related

- [Upload Image](./upload-image) - Upload images for metadata
- [Upload Image from URL](./upload-image-from-url) - Import external images
- [Pin Thing](/docs/graphql-api/mutations/pin-thing) - Pin Thing metadata
- [Pin Person](/docs/graphql-api/mutations/pin-person) - Pin Person metadata
- [Pin Organization](/docs/graphql-api/mutations/pin-organization) - Pin Organization metadata
