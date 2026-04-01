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
  }
}
```

## Variables

```json
{
  "id": "0x88D0aF73508452c1a453356b3Fac26525aEc23A2"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Account address (primary key) |
| `label` | `String` | Human-readable name (from atom or ENS) |
| `image` | `String` | Profile image URL |
| `type` | `account_type` | Account type: `Default`, `AtomWallet`, `ProtocolVault` |
| `atom_id` | `String` | Linked atom ID (if any) |
| `atom` | `atoms` | Linked atom details |

## Expected Response

```json
{
  "data": {
    "account": {
      "id": "0x88D0aF73508452c1a453356b3Fac26525aEc23A2",
      "label": "vitalik.eth",
      "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
      "type": "AtomWallet",
      "atom_id": "0x906527aae4af914b1ac01ff9adfdda5dafde3b5e21f84045e0660b0a15c07769",
      "atom": {
        "term_id": "0x906527aae4af914b1ac01ff9adfdda5dafde3b5e21f84045e0660b0a15c07769",
        "data": "ipfs://Qm...",
        "type": "Person"
      }
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
  }
}`,
    variables: {
      id: '0x88D0aF73508452c1a453356b3Fac26525aEc23A2'
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
      id: '0x88D0aF73508452c1a453356b3Fac26525aEc23A2'
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
