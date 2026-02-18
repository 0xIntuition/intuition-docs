---
title: Upload Image from URL
sidebar_label: Upload from URL
sidebar_position: 3
description: Upload an image from a URL to IPFS
keywords: [graphql, mutation, ipfs, image, upload, url]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload Image from URL

Upload an image to IPFS by providing its URL. The server fetches the image and uploads it to IPFS.

## Mutation Structure

```graphql
mutation UploadImageFromUrl($url: String!) {
  uploadImageFromUrl(url: $url) {
    hash
    url
    size
    mime_type
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `url` | `String` | Yes | URL of the image to upload |

```json
{
  "url": "https://example.com/images/logo.png"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `hash` | `String` | IPFS content hash (CID) |
| `url` | `String` | Full IPFS URL (`ipfs://<hash>`) |
| `size` | `Int` | File size in bytes |
| `mime_type` | `String` | Detected MIME type |

## Expected Response

```json
{
  "data": {
    "uploadImageFromUrl": {
      "hash": "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
      "url": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
      "size": 45678,
      "mime_type": "image/png"
    }
  }
}
```

## Interactive Example

export const uploadUrlQueries = [
  {
    id: 'upload-from-url',
    title: 'Upload Image from URL',
    query: `mutation UploadImageFromUrl($url: String!) {
  uploadImageFromUrl(url: $url) {
    hash
    url
    size
    mime_type
  }
}`,
    variables: {
      url: 'https://avatars.githubusercontent.com/u/1234567'
    }
  }
];

<GraphQLPlaygroundCustom queries={uploadUrlQueries} />

## Use Cases

### Import External Images

Import images from external sources for use in atoms:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function importExternalImage(imageUrl: string) {
  const mutation = `
    mutation UploadImageFromUrl($url: String!) {
      uploadImageFromUrl(url: $url) {
        hash
        url
      }
    }
  `

  const result = await client.request(mutation, { url: imageUrl })
  return result.uploadImageFromUrl.url
}

// Usage
const ipfsUrl = await importExternalImage('https://example.com/logo.png')
console.log('IPFS URL:', ipfsUrl)
// ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy
```

### Batch Import

Import multiple images in parallel:

```typescript
async function batchImportImages(urls: string[]) {
  const mutation = `
    mutation UploadImageFromUrl($url: String!) {
      uploadImageFromUrl(url: $url) {
        hash
        url
      }
    }
  `

  const results = await Promise.all(
    urls.map(url => client.request(mutation, { url }))
  )

  return results.map(r => r.uploadImageFromUrl.url)
}
```

### Social Profile Import

Import social media profile images:

```typescript
async function importSocialProfile(username: string, platform: string) {
  let imageUrl: string

  switch (platform) {
    case 'github':
      imageUrl = `https://github.com/${username}.png`
      break
    case 'twitter':
      // Note: Twitter requires API access for profile images
      imageUrl = `https://unavatar.io/twitter/${username}`
      break
    default:
      throw new Error('Unsupported platform')
  }

  const result = await client.request(UPLOAD_IMAGE_FROM_URL, {
    url: imageUrl
  })

  return result.uploadImageFromUrl
}
```

### React URL Import Component

```tsx
function UrlImageImporter({ onImport }: { onImport: (url: string) => void }) {
  const [imageUrl, setImageUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [uploadFromUrl] = useMutation(UPLOAD_IMAGE_FROM_URL)

  const handleImport = async () => {
    if (!imageUrl) return

    setImporting(true)
    try {
      const { data } = await uploadFromUrl({
        variables: { url: imageUrl }
      })
      onImport(data.uploadImageFromUrl.url)
      setImageUrl('')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="url-importer">
      <input
        type="url"
        placeholder="https://example.com/image.png"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        disabled={importing}
      />
      <button onClick={handleImport} disabled={importing || !imageUrl}>
        {importing ? 'Importing...' : 'Import'}
      </button>
    </div>
  )
}
```

## Supported URL Protocols

- `https://` (recommended)
- `http://` (supported but not recommended)

## Size Limits

- Maximum file size: **10 MB**
- The server will reject URLs that return files larger than this limit

## Error Handling

Common errors and how to handle them:

```typescript
try {
  const result = await uploadImageFromUrl({ variables: { url } })
} catch (error) {
  if (error.message.includes('File too large')) {
    console.error('Image exceeds 10MB limit')
  } else if (error.message.includes('Invalid URL')) {
    console.error('URL is not accessible')
  } else if (error.message.includes('Invalid image')) {
    console.error('URL does not point to a valid image')
  } else if (error.message.includes('Timeout')) {
    console.error('Server took too long to respond')
  }
}
```

## Best Practices

1. **Verify URL accessibility** - Ensure the URL is publicly accessible
2. **Use HTTPS** - Prefer secure URLs
3. **Check file size** - Verify image is under 10MB before uploading
4. **Handle timeouts** - Large images may take time to fetch

## Related

- [Upload Image](./upload-image) - Upload base64 image
- [Upload JSON to IPFS](./upload-json-to-ipfs) - Upload metadata
- [Pin Person](/docs/graphql-api/mutations/pin-person) - Create Person with image
