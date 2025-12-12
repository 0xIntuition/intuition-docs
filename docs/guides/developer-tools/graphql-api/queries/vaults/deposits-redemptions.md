---
title: Deposits & Redemptions
sidebar_label: Deposits & Redemptions
sidebar_position: 3
description: Query deposit and redemption transaction history
keywords: [graphql, deposit, redemption, transaction, history]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Deposits & Redemptions

Query transaction history for deposits and redemptions.

## Query Structure

```graphql
query GetTransactionHistory($termId: String!, $curveId: numeric!, $limit: Int!) {
  deposits(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    sender_id
    assets_for_receiver
    shares_for_receiver
    created_at
  }
  redemptions(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    receiver_id
    assets_for_receiver
    shares_from_receiver
    created_at
  }
}
```

## Best Practices

1. **Filter by term and curve** for specific vault
2. **Order by created_at** for chronological history
3. **Use limit** to paginate results
4. **Combine deposits and redemptions** for full history
