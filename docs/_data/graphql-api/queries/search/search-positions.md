---
title: Search Positions
sidebar_label: Search Positions
sidebar_position: 4
description: Search positions on a specific subject
keywords: [graphql, search, positions, subject, stakes]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Search Positions on Subject

Search for positions (stakes) related to a specific subject atom or term.

## Query Structure

```graphql
query SearchPositionsOnSubject(
  $subject_id: String!
  $search: String
  $limit: Int
) {
  search_positions_on_subject(
    args: { subject_id: $subject_id, search: $search }
    limit: $limit
    order_by: { shares: desc }
  ) {
    id
    account_id
    account {
      label
      image
    }
    vault_id
    vault {
      triple {
        predicate { label }
        object { label }
      }
    }
    shares
    created_at
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `subject_id` | `String` | Yes | Subject atom/term ID |
| `search` | `String` | No | Optional text filter |
| `limit` | `Int` | No | Maximum results |

```json
{
  "subject_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
  "limit": 20
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Position identifier |
| `account_id` | `String` | Account holding position |
| `account` | `Account` | Account details |
| `vault_id` | `String` | Vault ID |
| `vault` | `Vault` | Vault with triple info |
| `shares` | `String` | Shares held |
| `created_at` | `DateTime` | Position creation time |

## Use Cases

### Find Who Believes Something

See all positions on claims about a subject:

```typescript
async function getPositionsOnSubject(subjectId: string) {
  const query = `
    query GetPositionsOnSubject($subject_id: String!) {
      search_positions_on_subject(
        args: { subject_id: $subject_id }
        order_by: { shares: desc }
        limit: 50
      ) {
        account {
          id
          label
          image
        }
        vault {
          triple {
            predicate { label }
            object { label }
          }
        }
        shares
      }
    }
  `

  const data = await client.request(query, { subject_id: subjectId })

  // Group by predicate-object combination
  const claims = data.search_positions_on_subject.reduce((acc, pos) => {
    const claim = `${pos.vault.triple.predicate.label} ${pos.vault.triple.object.label}`

    if (!acc[claim]) {
      acc[claim] = { claim, supporters: [], totalShares: BigInt(0) }
    }

    acc[claim].supporters.push(pos.account)
    acc[claim].totalShares += BigInt(pos.shares)

    return acc
  }, {})

  return Object.values(claims).sort((a, b) =>
    Number(b.totalShares - a.totalShares)
  )
}
```

### Entity Profile Page

Show all claims about an entity:

```tsx
function EntityClaims({ subjectId }: { subjectId: string }) {
  const { data, loading } = useQuery(SEARCH_POSITIONS_ON_SUBJECT, {
    variables: { subject_id: subjectId, limit: 100 }
  })

  if (loading) return <Spinner />

  const grouped = groupByPredicate(data.search_positions_on_subject)

  return (
    <div className="entity-claims">
      {Object.entries(grouped).map(([predicate, claims]) => (
        <div key={predicate}>
          <h3>{predicate}</h3>
          {claims.map(claim => (
            <ClaimCard
              key={claim.id}
              object={claim.object}
              supporters={claim.supporters}
              totalStake={claim.totalShares}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
```

## Best Practices

1. **Order by shares** - Show most-supported positions first
2. **Group results** - Aggregate positions by claim
3. **Show supporter count** - Indicate social proof
4. **Link to profiles** - Make supporters clickable

## Related

- [Search Term](./search-term) - Search atoms by text
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Account position queries
