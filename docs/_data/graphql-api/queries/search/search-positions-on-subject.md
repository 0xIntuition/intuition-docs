---
title: Search Positions on Subject
sidebar_label: Search Positions on Subject
sidebar_position: 2
description: Search for positions on a specific subject
keywords: [graphql, search, positions, subject, query]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Search Positions on Subject Query

Search for positions held on a specific subject atom. Useful for finding all positions related to a particular entity.

## Query Structure

```graphql
query SearchPositionsOnSubject(
  $subjectId: String!
  $limit: Int
  $offset: Int
) {
  search_positions_on_subject(
    args: { subject_id: $subjectId }
    order_by: { shares: desc }
    limit: $limit
    offset: $offset
  ) {
    id
    account_id
    vault_id
    shares
    account {
      id
      label
      image
    }
    vault {
      term_id
      current_share_price
      term {
        triple {
          subject { label }
          predicate { label }
          object { label }
        }
      }
    }
  }
}
```

## Variables

```json
{
  "subjectId": "0x1234567890abcdef1234567890abcdef12345678",
  "limit": 50,
  "offset": 0
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subject_id` | String | Yes | Subject atom ID to search positions for |
| `limit` | Int | No | Maximum results |
| `offset` | Int | No | Pagination offset |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Position identifier |
| `account_id` | String | Account holding position |
| `vault_id` | String | Vault identifier |
| `shares` | String | Number of shares |
| `account` | Object | Account details |
| `vault` | Object | Vault and triple details |

## Interactive Example

export const positionsSearchQueries = [
  {
    id: 'search-positions-on-subject',
    title: 'Search Positions on Subject',
    query: `query SearchPositionsOnSubject(
  $subjectId: String!
  $limit: Int
) {
  search_positions_on_subject(
    args: { subject_id: $subjectId }
    order_by: { shares: desc }
    limit: $limit
  ) {
    id
    shares
    account {
      label
    }
    vault {
      term {
        triple {
          predicate { label }
          object { label }
        }
      }
    }
  }
}`,
    variables: {
      subjectId: '0x1234567890abcdef1234567890abcdef12345678',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={positionsSearchQueries} />

## Use Cases

### Entity Reputation Dashboard

```typescript
import { useQuery, gql } from '@apollo/client';

const SEARCH_POSITIONS = gql`
  query SearchPositionsOnSubject($subjectId: String!) {
    search_positions_on_subject(
      args: { subject_id: $subjectId }
      order_by: { shares: desc }
      limit: 100
    ) {
      id
      shares
      account { id label image }
      vault {
        term {
          triple {
            predicate { label }
            object { label }
          }
        }
      }
    }
  }
`;

function EntityReputation({ atomId }) {
  const { data, loading } = useQuery(SEARCH_POSITIONS, {
    variables: { subjectId: atomId }
  });

  if (loading) return <p>Loading...</p>;

  const positions = data?.search_positions_on_subject || [];

  // Group by predicate-object to show claims
  const claims = positions.reduce((acc, pos) => {
    const triple = pos.vault.term.triple;
    const key = `${triple.predicate.label}-${triple.object.label}`;
    if (!acc[key]) {
      acc[key] = {
        predicate: triple.predicate.label,
        object: triple.object.label,
        holders: [],
        totalShares: 0n
      };
    }
    acc[key].holders.push(pos.account);
    acc[key].totalShares += BigInt(pos.shares);
    return acc;
  }, {});

  return (
    <div>
      <h2>Claims about this entity</h2>
      {Object.values(claims).map(claim => (
        <div key={`${claim.predicate}-${claim.object}`}>
          <p>{claim.predicate} → {claim.object}</p>
          <p>{claim.holders.length} supporters</p>
        </div>
      ))}
    </div>
  );
}
```

### Find Top Supporters

```typescript
function getTopSupporters(positions) {
  const byAccount = positions.reduce((acc, pos) => {
    if (!acc[pos.account_id]) {
      acc[pos.account_id] = {
        account: pos.account,
        totalShares: 0n
      };
    }
    acc[pos.account_id].totalShares += BigInt(pos.shares);
    return acc;
  }, {});

  return Object.values(byAccount)
    .sort((a, b) => Number(b.totalShares - a.totalShares))
    .slice(0, 10);
}
```

## Best Practices

1. **Sort by shares** - Show strongest positions first
2. **Group by claim** - Aggregate positions on same predicate-object
3. **Show account context** - Include holder labels and images
4. **Use pagination** - Popular entities may have many positions

## Related

- [Search Term](./search-term) - Full-text search
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Positions by account
