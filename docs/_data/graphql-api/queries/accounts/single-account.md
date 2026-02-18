---
title: Single Account
sidebar_label: Single Account
sidebar_position: 1
description: Query a single account by ID
keywords: [graphql, account, query, profile, address]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Single Account Query

Query detailed information about a specific account by address.

## Query Structure

```graphql
query GetAccount($id: String!) {
  account(id: $id) {
    id
    label
    image
    atom_id
    type
    created_at
    positions_aggregate {
      aggregate {
        count
        sum {
          shares
        }
      }
    }
    signals_aggregate {
      aggregate {
        count
      }
    }
    atom {
      id
      label
      image
      type
      value {
        thing {
          name
          description
          url
        }
        person {
          name
          description
          email
        }
        organization {
          name
          description
        }
      }
    }
  }
}
```

## Variables

```json
{
  "id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Account address |
| `label` | String | Display label (ENS or custom) |
| `image` | String | Profile image URL |
| `atom_id` | String | Associated atom ID (if exists) |
| `type` | String | Account type |
| `created_at` | String | First seen timestamp |
| `positions_aggregate` | Object | Position statistics |
| `signals_aggregate` | Object | Signal statistics |
| `atom` | Object | Associated atom details |

## Interactive Example

export const accountQueries = [
  {
    id: 'single-account',
    title: 'Get Account',
    query: `query GetAccount($id: String!) {
  account(id: $id) {
    id
    label
    image
    atom_id
    positions_aggregate {
      aggregate {
        count
      }
    }
    signals_aggregate {
      aggregate {
        count
      }
    }
  }
}`,
    variables: {
      id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
    }
  }
];

<GraphQLPlaygroundCustom queries={accountQueries} />

## Use Cases

### Profile Page

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_ACCOUNT = gql`
  query GetAccount($id: String!) {
    account(id: $id) {
      id
      label
      image
      atom {
        value {
          person {
            name
            description
          }
        }
      }
      positions_aggregate {
        aggregate { count }
      }
      signals_aggregate {
        aggregate { count }
      }
    }
  }
`;

function ProfilePage({ address }) {
  const { data, loading } = useQuery(GET_ACCOUNT, {
    variables: { id: address.toLowerCase() }
  });

  if (loading) return <div>Loading...</div>;

  const account = data?.account;

  return (
    <div>
      <img src={account?.image} alt={account?.label} />
      <h1>{account?.label || truncateAddress(address)}</h1>
      {account?.atom?.value?.person && (
        <p>{account.atom.value.person.description}</p>
      )}
      <div>
        <span>{account?.positions_aggregate.aggregate.count} Positions</span>
        <span>{account?.signals_aggregate.aggregate.count} Signals</span>
      </div>
    </div>
  );
}
```

### Check if Account Exists

```typescript
async function accountExists(address: string): Promise<boolean> {
  const { data } = await client.query({
    query: GET_ACCOUNT,
    variables: { id: address.toLowerCase() }
  });
  return !!data?.account;
}
```

## Best Practices

1. **Lowercase addresses** - Account IDs are lowercase hex addresses
2. **Include aggregates** - Show position and signal counts for context
3. **Handle null atoms** - Not all accounts have associated atoms
4. **Cache responses** - Account data changes infrequently

## Related

- [Following](./following) - Get following relationships
- [Positions from Following](./positions-from-following) - Social position queries
