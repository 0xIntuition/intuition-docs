---
title: Error Handling
sidebar_label: Error Handling
sidebar_position: 10
description: Handle GraphQL errors gracefully
keywords: [graphql, error, handling, validation, network]
---

# Error Handling

Handle GraphQL errors gracefully in your application.

## Error Structure

```json
{
  "data": null,
  "errors": [
    {
      "message": "Field 'nonexistent_field' not found in type 'atoms'",
      "extensions": {
        "path": "$.selectionSet.atoms.selectionSet.nonexistent_field",
        "code": "validation-failed"
      }
    }
  ]
}
```

## Error Types

- **validation-failed**: Query syntax or schema validation error
- **constraint-violation**: Database constraint violated
- **unexpected**: Internal server error

## Best Practice

```typescript
import { GraphQLClient, ClientError } from 'graphql-request'

try {
  const data = await client.request(query, variables)
  console.log('Success:', data)
} catch (error) {
  if (error instanceof ClientError) {
    console.error('GraphQL errors:', error.response.errors)
    console.error('Status:', error.response.status)
  } else {
    console.error('Network error:', error)
  }
}
```

## Tips

1. **Check errors array**: GraphQL can return partial data with errors
2. **Log error details**: Include query and variables for debugging
3. **Show user-friendly messages**: Don't expose internal errors
4. **Implement retry logic**: For network failures
