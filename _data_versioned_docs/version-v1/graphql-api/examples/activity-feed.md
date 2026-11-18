---
title: Activity Feed
sidebar_label: Activity Feed
sidebar_position: 6
description: Build real-time activity feed
keywords: [graphql, example, activity, feed, events]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: Activity Feed

Build an activity feed showing recent protocol activity.

## Query

export const activityQueries = [
  {
    id: 'recent-activity',
    title: 'Recent Protocol Activity',
    query: `query GetRecentActivity($limit: Int!) {
  deposits(
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    sender_id
    assets_after_fees
    created_at
    vault {
      term {
        atom { label }
      }
    }
  }
  redemptions(
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    receiver_id
    assets
    created_at
  }
}`,
    variables: {
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={activityQueries} />
