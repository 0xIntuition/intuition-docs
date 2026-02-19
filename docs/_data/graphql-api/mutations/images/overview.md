---
title: Image & IPFS Operations
sidebar_label: Overview
sidebar_position: 1
description: Upload images and JSON data to IPFS
keywords: [graphql, mutation, ipfs, image, upload, json]
---

# Image & IPFS Operations

The Intuition GraphQL API provides mutations for uploading images and JSON data to IPFS (InterPlanetary File System). These operations return IPFS hashes that can be used in atom creation.

## Available Operations

| Operation | Description |
|-----------|-------------|
| [`uploadImage`](./upload-image) | Upload a base64-encoded image to IPFS |
| [`uploadImageFromUrl`](./upload-image-from-url) | Upload an image from a URL to IPFS |
| [`uploadJsonToIpfs`](./upload-json-to-ipfs) | Upload JSON metadata to IPFS |

## Use Cases

### Atom Creation Workflow

When creating atoms with images or metadata:

1. Upload image using `uploadImage` or `uploadImageFromUrl`
2. Upload JSON metadata using `uploadJsonToIpfs`
3. Use returned IPFS hashes in atom creation

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
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

// Upload an image from URL
const imageResult = await client.request(`
  mutation UploadImageFromUrl($url: String!) {
    uploadImageFromUrl(url: $url) {
      hash
      url
      size
    }
  }
`, {
  url: 'https://example.com/image.png'
})

// Upload JSON metadata
const jsonResult = await client.request(`
  mutation UploadJsonToIpfs($json: JSON!) {
    uploadJsonToIpfs(json: $json) {
      hash
      url
    }
  }
`, {
  json: {
    name: 'My Atom',
    description: 'Description here',
    image: imageResult.uploadImageFromUrl.url
  }
})

console.log('Metadata URL:', jsonResult.uploadJsonToIpfs.url)
// Use this URL when creating the atom
```

## IPFS URL Format

All uploaded content is accessible via IPFS:

```
ipfs://<hash>
```

The API returns both the raw hash and a gateway URL:

```json
{
  "hash": "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
  "url": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy"
}
```

## File Size Limits

| Upload Type | Maximum Size |
|-------------|--------------|
| Image (base64) | 5 MB |
| Image from URL | 10 MB |
| JSON | 1 MB |

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
