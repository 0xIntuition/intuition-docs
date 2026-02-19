---
title: Get Chart JSON
sidebar_label: Chart JSON
sidebar_position: 2
description: Get chart data as structured JSON
keywords: [graphql, chart, json, data, visualization]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Get Chart JSON

Retrieve chart data in structured JSON format for use with charting libraries.

## Query Structure

```graphql
query GetChartJson($input: GetChartJsonInput!) {
  getChartJson(input: $input) {
    term_id
    curve_id
    graph_type
    interval
    count
    data {
      timestamp
      value
    }
  }
}
```

## Variables

The query takes a single `input` object of type `GetChartJsonInput`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `term_id` | `String` | Yes | Term ID to generate chart for |
| `curve_id` | `String` | Yes | Curve ID (bonding curve) |
| `interval` | `String` | Yes | Time interval (e.g. `"1h"`, `"1d"`, `"1w"`) |
| `start_time` | `String` | Yes | Start of time range (ISO 8601) |
| `end_time` | `String` | Yes | End of time range (ISO 8601) |
| `graph_type` | `String` | No | Type of graph data |

```json
{
  "input": {
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "curve_id": "1",
    "interval": "1d",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z"
  }
}
```

## Response Fields (`ChartDataOutput`)

| Field | Type | Description |
|-------|------|-------------|
| `term_id` | `String!` | Term ID for this chart |
| `curve_id` | `String` | Curve ID used |
| `graph_type` | `String!` | Type of graph |
| `interval` | `String!` | Interval used for aggregation |
| `count` | `Int!` | Number of data points |
| `data` | `[ChartDataPoint!]!` | Array of chart data points |
| `data[].timestamp` | `String!` | ISO 8601 timestamp for this data point |
| `data[].value` | `String!` | Value at this timestamp |

## Interactive Example

export const chartJsonQueries = [
  {
    id: 'chart-json',
    title: 'Chart JSON Data',
    query: `query GetChartJson($input: GetChartJsonInput!) {
  getChartJson(input: $input) {
    term_id
    curve_id
    graph_type
    interval
    count
    data {
      timestamp
      value
    }
  }
}`,
    variables: {
      input: {
        term_id: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
        curve_id: '1',
        interval: '1d',
        start_time: '2024-01-01T00:00:00Z',
        end_time: '2024-01-31T23:59:59Z'
      }
    }
  }
];

<GraphQLPlaygroundCustom queries={chartJsonQueries} />

## Use Cases

### Recharts Integration

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getChartData(termId: string, curveId: string, days: number = 30) {
  const endTime = new Date()
  const startTime = new Date()
  startTime.setDate(startTime.getDate() - days)

  const query = `
    query GetChartJson($input: GetChartJsonInput!) {
      getChartJson(input: $input) {
        count
        data
        interval
      }
    }
  `

  const result = await client.request(query, {
    input: {
      term_id: termId,
      curve_id: curveId,
      interval: '1d',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString()
    }
  })

  return result.getChartJson
}
```

## Related

- [Chart Raw JSON](./chart-raw-json) - Raw JSON format (same input/output types)
- [Chart SVG](./chart-svg) - Pre-rendered SVG charts
