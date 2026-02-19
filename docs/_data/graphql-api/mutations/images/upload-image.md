---
title: Upload Image
sidebar_label: Upload Image
sidebar_position: 2
description: Upload a base64-encoded image via the API
keywords: [graphql, mutation, image, upload, base64]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload Image

Upload a base64-encoded image. The image is cached and a moderation check is performed. Returns a `CachedImage` with the hosted URL and safety score.

## Mutation Structure

```graphql
mutation UploadImage($image: UploadImageInput!) {
  uploadImage(image: $image) {
    images {
      url
      original_url
      safe
      score
      model
      created_at
    }
  }
}
```

## Variables

The mutation takes an `image` argument with the `UploadImageInput` type:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `String` | Yes | Base64-encoded image data |
| `filename` | `String` | Yes | Filename with extension |
| `contentType` | `String` | Yes | MIME type (e.g. `"image/png"`) |

```json
{
  "image": {
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "filename": "pixel.png",
    "contentType": "image/png"
  }
}
```

## Response Fields

Returns `UploadImageFromUrlOutput` containing an `images` array of `CachedImage` objects:

| Field | Type | Description |
|-------|------|-------------|
| `images` | `[CachedImage!]!` | Array of cached image results |
| `images[].url` | `String!` | Hosted image URL |
| `images[].original_url` | `String!` | Original source URL |
| `images[].safe` | `Boolean!` | Whether the image passed moderation |
| `images[].score` | `jsonb` | Moderation safety score details |
| `images[].model` | `String` | Moderation model used |
| `images[].created_at` | `timestamptz!` | Upload timestamp |

## Expected Response

```json
{
  "data": {
    "uploadImage": {
      "images": [
        {
          "url": "https://cdn.example.com/images/abc123.png",
          "original_url": "https://cdn.example.com/images/abc123.png",
          "safe": true,
          "score": null,
          "model": null,
          "created_at": "2024-01-15T10:30:00Z"
        }
      ]
    }
  }
}
```

## Use Cases

### File Input Upload

Handle file uploads from a form:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function uploadFileInput(file: File) {
  const buffer = await file.arrayBuffer()
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

  const mutation = `
    mutation UploadImage($image: UploadImageInput!) {
      uploadImage(image: $image) {
        images {
          url
          safe
        }
      }
    }
  `

  const result = await client.request(mutation, {
    image: {
      data: base64,
      filename: file.name,
      contentType: file.type
    }
  })

  return result.uploadImage.images[0]
}
```

## Related

- [Upload Image from URL](./upload-image-from-url) - Upload from URL
- [Upload JSON to IPFS](./upload-json-to-ipfs) - Upload metadata
- [Pin Thing](/docs/graphql-api/mutations/pin-thing) - Create Thing with image
