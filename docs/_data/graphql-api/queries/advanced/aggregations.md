---
title: Aggregations
sidebar_label: Aggregations
sidebar_position: 1
description: Statistical aggregations with count, sum, avg, stddev
keywords: [graphql, aggregate, count, sum, average, statistics]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Aggregations

Compute statistical aggregations without fetching all nodes.

## Query Structure

```graphql
query GetPositionStatistics($accountId: String!) {
  positions_aggregate(
    where: { account_id: { _eq: $accountId } }
  ) {
    aggregate {
      count
      sum { shares }
      avg { shares }
      min { shares }
      max { shares }
      stddev { shares }
      variance { shares }
    }
  }
}
```

## Available Functions

- **count**: Total number of rows
- **sum**: Sum of values
- **avg**: Average value
- **min**: Minimum value
- **max**: Maximum value
- **stddev**: Standard deviation
- **variance**: Variance
- **stddev_pop**: Population standard deviation
- **stddev_samp**: Sample standard deviation
- **var_pop**: Population variance
- **var_samp**: Sample variance

## Best Practices

1. **Use aggregates** instead of fetching all nodes
2. **Combine with filters** for targeted statistics
3. **Include in paginated queries** for total counts
