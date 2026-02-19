---
title: Upload Image from URL
sidebar_label: Upload from URL
sidebar_position: 3
description: Upload an image from a URL
keywords: [graphql, mutation, image, upload, url]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload Image from URL

Upload an image by providing its URL. The server fetches, caches, and moderates the image. Returns a `CachedImage` with the hosted URL and safety score.

## Mutation Structure

```graphql
mutation UploadImageFromUrl($image: UploadImageFromUrlInput!) {
  uploadImageFromUrl(image: $image) {
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

The mutation takes an `image` argument with the `UploadImageFromUrlInput` type:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | `String` | Yes | URL of the image to upload |

```json
{
  "image": {
    "url": "https://example.com/images/logo.png"
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
    "uploadImageFromUrl": {
      "images": [
        {
          "url": "https://cdn.example.com/images/abc123.png",
          "original_url": "https://example.com/images/logo.png",
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

## Interactive Example

export const uploadUrlQueries = [
  {
    id: 'upload-from-url',
    title: 'Upload Image from URL',
    query: `mutation UploadImageFromUrl($image: UploadImageFromUrlInput!) {
  uploadImageFromUrl(image: $image) {
    images {
      url
      original_url
      safe
    }
  }
}`,
    variables: {
      image: {
        url: 'https://avatars.githubusercontent.com/u/1234567'
      }
    }
  }
];

<GraphQLPlaygroundCustom queries={uploadUrlQueries} />

## Use Cases

### Import External Images

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function importExternalImage(imageUrl: string) {
  const mutation = `
    mutation UploadImageFromUrl($image: UploadImageFromUrlInput!) {
      uploadImageFromUrl(image: $image) {
        images {
          url
          safe
        }
      }
    }
  `

  const result = await client.request(mutation, {
    image: { url: imageUrl }
  })

  const cached = result.uploadImageFromUrl.images[0]
  if (!cached.safe) {
    throw new Error('Image failed moderation check')
  }
  return cached.url
}
```

## Related

- [Upload Image](./upload-image) - Upload base64 image
- [Upload JSON to IPFS](./upload-json-to-ipfs) - Upload metadata
- [Pin Person](/docs/graphql-api/mutations/pin-person) - Create Person with image
