---
title: Image & IPFS Operations
sidebar_label: Overview
sidebar_position: 1
description: Upload images and JSON data to IPFS
keywords: [graphql, mutation, ipfs, image, upload, json]
---

# Image & IPFS Operations

The Intuition GraphQL API provides mutations for uploading images and JSON data to IPFS (InterPlanetary File System). Image uploads return cached image URLs, while JSON uploads return IPFS hashes that can be used in atom creation.

:::important Pinning endpoint and API key
Image and JSON upload mutations use the public gated pinning endpoint, `https://pin.intuition.systems/v1/graphql`, and require an `apikey` request header. Keep the API key server-side.
:::

## Available Operations

| Operation                                       | Description                           |
| ----------------------------------------------- | ------------------------------------- |
| [`uploadImage`](./upload-image)                 | Upload a base64-encoded image to IPFS |
| [`uploadImageFromUrl`](./upload-image-from-url) | Upload an image from a URL to IPFS    |
| [`uploadJsonToIpfs`](./upload-json-to-ipfs)     | Upload JSON metadata to IPFS          |

## Use Cases

### Atom Creation Workflow

When creating atoms with images or metadata:

1. Upload image using `uploadImage` or `uploadImageFromUrl`
2. Upload JSON metadata using `uploadJsonToIpfs`
3. Use the returned image URL and metadata IPFS hash in atom creation

### Profile Images

Upload profile images for accounts:

- Avatar images
- Banner images
- Organization logos

### Metadata Storage

Store structured metadata on IPFS:

- Thing descriptions
- Organization details
- Person profiles

## Quick Start

```typescript
import { GraphQLClient } from 'graphql-request';
import { PIN_API_URL } from '@0xintuition/graphql';

const client = new GraphQLClient(PIN_API_URL, {
  headers: {
    apikey: process.env.INTUITION_PIN_API_KEY!,
  },
});

// Upload an image from URL
const imageResult = await client.request(
  `
  mutation UploadImageFromUrl($image: UploadImageFromUrlInput!) {
    uploadImageFromUrl(image: $image) {
      images {
        url
        safe
      }
    }
  }
`,
  {
    image: { url: 'https://example.com/image.png' },
  },
);

// Upload JSON metadata
const jsonResult = await client.request(
  `
  mutation UploadJsonToIpfs($json: jsonb!) {
    uploadJsonToIpfs(json: $json) {
      hash
      name
      size
    }
  }
`,
  {
    json: {
      name: 'My Atom',
      description: 'Description here',
      image: imageResult.uploadImageFromUrl.images[0].url,
    },
  },
);

console.log('Metadata URI:', `ipfs://${jsonResult.uploadJsonToIpfs.hash}`);
// Use this URI when creating the atom
```

## IPFS Response Format

Uploaded JSON content is accessible via IPFS:

```
ipfs://<hash>
```

The exact response shape depends on the mutation. JSON uploads return the raw hash, which you can convert to an IPFS URI:

```json
{
  "hash": "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy"
}
```

## File Size Limits

| Upload Type    | Maximum Size |
| -------------- | ------------ |
| Image (base64) | 5 MB         |
| Image from URL | 10 MB        |
| JSON           | 1 MB         |

## Supported Image Formats

- JPEG / JPG
- PNG
- GIF
- WebP
- SVG

## Related Documentation

- [Upload Image](./upload-image) - Base64 image upload
- [Upload Image from URL](./upload-image-from-url) - URL-based upload
- [Upload JSON to IPFS](./upload-json-to-ipfs) - JSON metadata upload
- [Pin Mutations](/docs/graphql-api/mutations/pin-thing) - Pin entities to IPFS
