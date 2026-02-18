---
title: Upload Image
sidebar_label: Upload Image
sidebar_position: 2
description: Upload a base64-encoded image to IPFS
keywords: [graphql, mutation, ipfs, image, upload, base64]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload Image

Upload a base64-encoded image to IPFS. This is useful when you have image data in memory or from a file input.

## Mutation Structure

```graphql
mutation UploadImage($input: UploadImageInput!) {
  uploadImage(input: $input) {
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
| `input.data` | `String` | Yes | Base64-encoded image data |
| `input.filename` | `String` | No | Original filename (for metadata) |
| `input.mime_type` | `String` | No | MIME type (auto-detected if not provided) |

```json
{
  "input": {
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "filename": "pixel.png",
    "mime_type": "image/png"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `hash` | `String` | IPFS content hash (CID) |
| `url` | `String` | Full IPFS URL (`ipfs://<hash>`) |
| `size` | `Int` | File size in bytes |
| `mime_type` | `String` | Detected or provided MIME type |

## Expected Response

```json
{
  "data": {
    "uploadImage": {
      "hash": "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
      "url": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
      "size": 68,
      "mime_type": "image/png"
    }
  }
}
```

## Use Cases

### File Input Upload

Handle file uploads from a form:

```typescript
async function uploadFileInput(file: File) {
  // Convert file to base64
  const buffer = await file.arrayBuffer()
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

  const mutation = `
    mutation UploadImage($input: UploadImageInput!) {
      uploadImage(input: $input) {
        hash
        url
        size
        mime_type
      }
    }
  `

  const result = await client.request(mutation, {
    input: {
      data: base64,
      filename: file.name,
      mime_type: file.type
    }
  })

  return result.uploadImage
}
```

### React File Upload Component

```tsx
function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [uploadImage] = useMutation(UPLOAD_IMAGE)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      // Read file as base64
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]

        const { data } = await uploadImage({
          variables: {
            input: {
              data: base64,
              filename: file.name,
              mime_type: file.type
            }
          }
        })

        onUpload(data.uploadImage.url)
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <span>Uploading...</span>}
    </div>
  )
}
```

### Canvas to IPFS

Upload a canvas element as an image:

```typescript
async function uploadCanvas(canvas: HTMLCanvasElement) {
  const dataUrl = canvas.toDataURL('image/png')
  const base64 = dataUrl.split(',')[1]

  const result = await client.request(UPLOAD_IMAGE, {
    input: {
      data: base64,
      mime_type: 'image/png'
    }
  })

  return result.uploadImage.url
}
```

## Size Limits

- Maximum file size: **5 MB**
- Larger files should use `uploadImageFromUrl`

## Supported Formats

| Format | MIME Type |
|--------|-----------|
| JPEG | `image/jpeg` |
| PNG | `image/png` |
| GIF | `image/gif` |
| WebP | `image/webp` |
| SVG | `image/svg+xml` |

## Error Handling

```typescript
try {
  const result = await uploadImage({
    variables: { input: { data: base64 }}
  })
} catch (error) {
  if (error.message.includes('File too large')) {
    console.error('Image exceeds 5MB limit')
  } else if (error.message.includes('Invalid image')) {
    console.error('Unsupported image format')
  }
}
```

## Related

- [Upload Image from URL](./upload-image-from-url) - Upload from URL
- [Upload JSON to IPFS](./upload-json-to-ipfs) - Upload metadata
- [Pin Thing](/docs/graphql-api/mutations/pin-thing) - Create Thing with image
