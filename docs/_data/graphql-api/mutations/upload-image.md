---
title: Upload Image
sidebar_label: Upload Image
sidebar_position: 4
description: Upload a base64 encoded image to IPFS
keywords: [graphql, mutation, ipfs, image, upload, base64]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Upload Image Mutation

Upload a base64-encoded image to IPFS for use in atom metadata.

## Mutation Structure

```graphql
mutation UploadImage($image: String!) {
  uploadImage(image: $image) {
    url
    cid
  }
}
```

## Variables

```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | String | Yes | Base64-encoded image data (with or without data URI prefix) |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `url` | String | Full IPFS URL for the uploaded image |
| `cid` | String | Content Identifier (CID) of the uploaded image |

## Response Example

```json
{
  "data": {
    "uploadImage": {
      "url": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
      "cid": "QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy"
    }
  }
}
```

## Workflow

1. **Convert image to base64** - Read image file and encode as base64
2. **Upload via mutation** - Send the base64 string to the API
3. **Get IPFS URL** - Use the returned URL in your atom metadata
4. **Pin metadata** - Include the image URL when pinning metadata

## Use Cases

### File Upload in React

```typescript
import { useMutation, gql } from '@apollo/client';

const UPLOAD_IMAGE = gql`
  mutation UploadImage($image: String!) {
    uploadImage(image: $image) {
      url
      cid
    }
  }
`;

function ImageUploader({ onUpload }) {
  const [uploadImage, { loading }] = useMutation(UPLOAD_IMAGE);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;

      try {
        const { data } = await uploadImage({
          variables: { image: base64 }
        });
        onUpload(data.uploadImage.url);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      disabled={loading}
    />
  );
}
```

### Node.js Upload

```typescript
import fs from 'fs';
import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('https://mainnet.intuition.sh/v1/graphql');

const UPLOAD_IMAGE = gql`
  mutation UploadImage($image: String!) {
    uploadImage(image: $image) {
      url
      cid
    }
  }
`;

async function uploadImageFile(filePath: string) {
  const imageBuffer = fs.readFileSync(filePath);
  const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  const result = await client.request(UPLOAD_IMAGE, {
    image: base64Image
  });

  return result.uploadImage;
}
```

## Best Practices

1. **Compress images** - Reduce file size before uploading to minimize IPFS storage
2. **Use appropriate formats** - PNG for graphics, JPEG for photos
3. **Validate file type** - Check MIME type before upload
4. **Handle errors gracefully** - Network issues and large files may cause failures
5. **Cache CIDs** - Store returned CIDs to avoid re-uploading the same image

## Related

- [Upload Image from URL](./upload-image-from-url) - Upload from external URL
- [Upload JSON to IPFS](./upload-json-to-ipfs) - Upload JSON data
- [Pin Thing](./pin-thing) - Pin metadata with image reference
