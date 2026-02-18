---
title: Image Upload Mutations
sidebar_label: Image Upload
sidebar_position: 6
description: Upload and process images for use in atoms
keywords: [graphql, mutation, image, upload, ipfs, classification]
---

# Image Upload Mutations

Upload and process images for use in atom creation. These mutations handle image validation, classification, and storage.

## uploadImageFromUrl

Upload an image from a URL. The image is fetched, validated, classified, and stored.

```graphql
mutation UploadImageFromUrl($image: UploadImageFromUrlInput!) {
  uploadImageFromUrl(image: $image) {
    url
    classification
    width
    height
    content_type
  }
}
```

### Variables

```json
{
  "image": {
    "url": "https://example.com/image.png"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `url` | String | URL to access the processed image |
| `classification` | String | Image classification result |
| `width` | Int | Image width in pixels |
| `height` | Int | Image height in pixels |
| `content_type` | String | MIME type (e.g., "image/png") |

## uploadImage

Upload an image from base64-encoded data.

```graphql
mutation UploadImage($image: UploadImageInput!) {
  uploadImage(image: $image) {
    url
    classification
    width
    height
    content_type
  }
}
```

### Variables

```json
{
  "image": {
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "filename": "image.png",
    "contentType": "image/png"
  }
}
```

### Input Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | String | Yes | Base64-encoded image data |
| `filename` | String | Yes | Original filename |
| `contentType` | String | Yes | MIME type |

## uploadJsonToIpfs

Upload JSON data directly to IPFS.

```graphql
mutation UploadJsonToIpfs($json: jsonb!) {
  uploadJsonToIpfs(json: $json) {
    name
    hash
    size
  }
}
```

### Variables

```json
{
  "json": {
    "@context": "https://schema.org",
    "@type": "Thing",
    "name": "My Custom Object",
    "description": "A custom JSON object stored on IPFS",
    "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Name of the uploaded file |
| `hash` | String | IPFS content hash (CID) |
| `size` | Int | Size in bytes |

## Use Cases

### Upload Profile Image

```typescript
import { useUploadImageFromUrlMutation } from '@0xintuition/graphql'

function ProfileImageUploader({ onUpload }: Props) {
  const [uploadImage, { loading }] = useUploadImageFromUrlMutation()
  const [url, setUrl] = useState('')

  const handleUpload = async () => {
    try {
      const result = await uploadImage({
        variables: {
          image: { url }
        }
      })

      const imageData = result.data?.uploadImageFromUrl
      onUpload(imageData?.url)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <div>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter image URL"
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  )
}
```

### Upload Base64 Image

```typescript
async function uploadBase64Image(file: File) {
  // Convert file to base64
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      // Remove data URL prefix
      resolve(base64String.split(',')[1])
    }
    reader.readAsDataURL(file)
  })

  const mutation = `
    mutation UploadImage($image: UploadImageInput!) {
      uploadImage(image: $image) {
        url
        classification
        width
        height
      }
    }
  `

  return client.request(mutation, {
    image: {
      data: base64,
      filename: file.name,
      contentType: file.type
    }
  })
}
```

### Create Atom with Custom JSON

```typescript
async function createCustomAtom(metadata: object) {
  // First upload JSON to IPFS
  const uploadMutation = `
    mutation UploadJsonToIpfs($json: jsonb!) {
      uploadJsonToIpfs(json: $json) {
        hash
      }
    }
  `

  const { uploadJsonToIpfs } = await client.request(uploadMutation, {
    json: metadata
  })

  const ipfsUri = `ipfs://${uploadJsonToIpfs.hash}`

  // Use the IPFS URI to create an atom via SDK
  // const atomId = await sdk.createAtom(ipfsUri)
  return ipfsUri
}
```

## Supported Image Formats

| Format | MIME Type | Extension |
|--------|-----------|-----------|
| PNG | image/png | .png |
| JPEG | image/jpeg | .jpg, .jpeg |
| GIF | image/gif | .gif |
| WebP | image/webp | .webp |
| SVG | image/svg+xml | .svg |

## Image Classification

Uploaded images are automatically classified. The classification helps with content moderation and display optimization.

## Best Practices

1. **Validate images client-side** before upload
2. **Use appropriate formats** (PNG for graphics, JPEG for photos)
3. **Optimize image size** before upload
4. **Handle upload errors** gracefully
5. **Store returned URLs** for atom creation

## Related Mutations

- [Pin Thing](/docs/graphql-api/mutations/pin-thing) - Pin structured metadata
- [Pin Person](/docs/graphql-api/mutations/pin-person) - Pin person metadata
- [Pin Organization](/docs/graphql-api/mutations/pin-organization) - Pin organization metadata
