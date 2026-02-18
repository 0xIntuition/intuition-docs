---
title: Upload Image from URL
sidebar_label: Upload Image from URL
sidebar_position: 5
description: Upload an image from a URL to IPFS
keywords: [graphql, mutation, ipfs, image, upload, url]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload Image from URL Mutation

Upload an image from an external URL to IPFS. The API fetches the image and stores it on IPFS.

## Mutation Structure

```graphql
mutation UploadImageFromUrl($url: String!) {
  uploadImageFromUrl(url: $url) {
    url
    cid
  }
}
```

## Variables

```json
{
  "url": "https://example.com/image.png"
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | String | Yes | Public URL of the image to upload |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `url` | String | IPFS URL for the uploaded image |
| `cid` | String | Content Identifier (CID) of the uploaded image |

## Response Example

```json
{
  "data": {
    "uploadImageFromUrl": {
      "url": "ipfs://QmYx8C3kNN1sFSx5b1ZAqFqJbMmQmvWgZX4xYvJn4mQwFy",
      "cid": "QmYx8C3kNN1sFSx5b1ZAqFqJbMmQmvWgZX4xYvJn4mQwFy"
    }
  }
}
```

## Interactive Example

export const uploadUrlQueries = [
  {
    id: 'upload-image-from-url',
    title: 'Upload Image from URL',
    query: `mutation UploadImageFromUrl($url: String!) {
  uploadImageFromUrl(url: $url) {
    url
    cid
  }
}`,
    variables: {
      url: 'https://avatars.githubusercontent.com/u/141845685'
    }
  }
];

<GraphQLPlaygroundCustom queries={uploadUrlQueries} />

## Workflow

1. **Provide image URL** - Pass the public URL of the image
2. **API fetches image** - The server downloads the image
3. **Image stored on IPFS** - The image is uploaded to IPFS
4. **Get IPFS URL** - Use the returned URL in your metadata

## Use Cases

### Migrate External Images to IPFS

```typescript
import { useMutation, gql } from '@apollo/client';

const UPLOAD_IMAGE_FROM_URL = gql`
  mutation UploadImageFromUrl($url: String!) {
    uploadImageFromUrl(url: $url) {
      url
      cid
    }
  }
`;

async function migrateToIpfs(externalUrl: string) {
  const [uploadFromUrl] = useMutation(UPLOAD_IMAGE_FROM_URL);

  const { data } = await uploadFromUrl({
    variables: { url: externalUrl }
  });

  return data.uploadImageFromUrl.url; // Returns ipfs://...
}
```

### Complete Metadata Creation Flow

```typescript
const PIN_THING = gql`
  mutation PinThing($thing: PinThingInput!) {
    pinThing(thing: $thing) {
      uri
    }
  }
`;

async function createAtomWithExternalImage({
  name,
  description,
  imageUrl,
  websiteUrl
}) {
  // 1. Upload external image to IPFS
  const { data: imageData } = await client.mutate({
    mutation: UPLOAD_IMAGE_FROM_URL,
    variables: { url: imageUrl }
  });

  // 2. Pin metadata with IPFS image
  const { data: metadataData } = await client.mutate({
    mutation: PIN_THING,
    variables: {
      thing: {
        name,
        description,
        image: imageData.uploadImageFromUrl.url,
        url: websiteUrl
      }
    }
  });

  return metadataData.pinThing.uri;
}
```

## Best Practices

1. **Use public URLs** - The URL must be publicly accessible
2. **Check URL validity** - Verify the URL points to a valid image
3. **Consider CORS** - Some servers may block requests; prefer direct image URLs
4. **Cache results** - The same URL will produce the same CID if image unchanged
5. **Prefer HTTPS** - Use secure URLs when possible

## Error Handling

```typescript
try {
  const { data } = await uploadFromUrl({
    variables: { url: imageUrl }
  });
  console.log('Uploaded:', data.uploadImageFromUrl.url);
} catch (error) {
  if (error.message.includes('fetch')) {
    console.error('Could not fetch image from URL');
  } else if (error.message.includes('format')) {
    console.error('Invalid image format');
  } else {
    console.error('Upload failed:', error.message);
  }
}
```

## Related

- [Upload Image](./upload-image) - Upload base64 encoded images
- [Upload JSON to IPFS](./upload-json-to-ipfs) - Upload JSON data
- [Pin Thing](./pin-thing) - Pin metadata with image reference
