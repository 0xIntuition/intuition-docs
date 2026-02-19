---
title: Single Account Query
sidebar_label: Single Account
sidebar_position: 2
description: Query individual account details by address
keywords: [graphql, account, query, single, address]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Single Account Query

Fetch detailed information about a specific account using its Ethereum address.

## Query Structure

```graphql
query GetAccount($id: String!) {
  account(id: $id) {
    id
    label
    image
    type
    atom_id
    atom {
      term_id
      data
      type
    }
    created_at
    updated_at
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
| `id` | `String` | Account address (primary key) |
| `label` | `String` | Human-readable name (from atom or ENS) |
| `image` | `String` | Profile image URL |
| `type` | `String` | Account type: `Default`, `AtomWallet`, `ProtocolVault` |
| `atom_id` | `String` | Linked atom ID (if any) |
| `atom` | `Atom` | Linked atom details |
| `created_at` | `DateTime` | First interaction timestamp |
| `updated_at` | `DateTime` | Last activity timestamp |

## Expected Response

```json
{
  "data": {
    "account": {
      "id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      "label": "vitalik.eth",
      "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
      "type": "AtomWallet",
      "atom_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
      "atom": {
        "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
        "data": "ipfs://Qm...",
        "type": "Person"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Interactive Example

export const accountQueries = [
  {
    id: 'basic-account',
    title: 'Basic Account Query',
    query: `query GetAccount($id: String!) {
  account(id: $id) {
    id
    label
    image
    type
    created_at
  }
}`,
    variables: {
      id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
    }
  },
  {
    id: 'account-with-atom',
    title: 'Account with Linked Atom',
    query: `query GetAccountWithAtom($id: String!) {
  account(id: $id) {
    id
    label
    image
    type
    atom {
      term_id
      label
      type
      data
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

Display account profile information:

```typescript
async function getAccountProfile(address: string) {
  const query = `
    query GetAccountProfile($id: String!) {
      account(id: $id) {
        id
        label
        image
        type
        atom {
          type
          data
        }
        created_at
      }
    }
  `

  const data = await client.request(query, { id: address })
  return data.account
}
```

### React Profile Component

```tsx
function AccountProfile({ address }: { address: string }) {
  const { data, loading } = useQuery(GET_ACCOUNT, {
    variables: { id: address }
  })

  if (loading) return <Spinner />
  if (!data?.account) return <NotFound />

  const { account } = data

  return (
    <div className="profile">
      {account.image && (
        <img src={resolveIpfs(account.image)} alt={account.label} />
      )}
      <h1>{account.label || truncateAddress(account.id)}</h1>
      <span className="type">{account.type}</span>
      <span className="address">{account.id}</span>
      <time>Member since {formatDate(account.created_at)}</time>
    </div>
  )
}
```

### Check Account Existence

```typescript
async function accountExists(address: string): Promise<boolean> {
  const query = `
    query CheckAccount($id: String!) {
      account(id: $id) {
        id
      }
    }
  `

  const data = await client.request(query, { id: address })
  return data.account !== null
}
```

## Best Practices

1. **Normalize addresses** - Always lowercase addresses before querying
2. **Handle null** - Account may not exist for new addresses
3. **Resolve IPFS** - Convert ipfs:// URLs to gateway URLs for images
4. **Fallback labels** - Use truncated address if label is null

## Related

- [List Accounts](./list-accounts) - Query multiple accounts
- [Following](./following) - Account's social relationships
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Account's positions
