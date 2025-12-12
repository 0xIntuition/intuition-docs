---
title: Social Graph
sidebar_label: Social Graph
sidebar_position: 5
description: Build social feed from followed accounts
keywords: [graphql, example, social, following, feed]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: Social Graph

Build a social activity feed from followed accounts.

## Query

export const socialQueries = [
  {
    id: 'following-feed',
    title: 'Following Activity Feed',
    query: `query GetFollowingFeed($address: String!, $limit: Int!) {
  following_count: following_aggregate(args: { address: $address }) {
    aggregate {
      count
    }
  }
  positions_from_following(
    args: { address: $address }
    limit: $limit
    order_by: { created_at: desc }
  ) {
    id
    shares
    created_at
    account {
      id
      label
      image
    }
    vault {
      term_id
      term {
        atom { label image }
      }
    }
  }
}`,
    variables: {
      address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={socialQueries} />
